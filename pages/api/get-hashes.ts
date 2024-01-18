import { NextApiRequest, NextApiResponse } from "next";
import { getHashesResponse } from "@/utils/types";
import { client } from "@/utils/clickhouse";
import { tableName } from "@/utils/constants";
import { getTimeframeFilter } from "@/utils/helpers";
import { Redis } from "ioredis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getHashesResponse>,
) {
  const redis = new Redis(process.env.REDIS_URL!);

  try {
    const { isOrderflow, timeframe } = req.query;

    let isOf = false;
    if (isOrderflow === "true") {
      isOf = true;
    }
    const table = isOf ? tableName.orderflow : tableName.liquidity;

    const baseQuery = `
      SELECT 
        hash
      FROM
        ${table}
      WHERE trade_usd != 0
      ${
        timeframe && !Array.isArray(timeframe) && timeframe !== "All"
          ? "AND " + (await getTimeframeFilter(timeframe, table))
          : timeframe !== "All"
            ? "AND " + (await getTimeframeFilter("7d", table))
            : ""
      }
      LIMIT 100`.replace(/\s+/g, " ");

    const hashCache: string | null = await redis.get("sql:" + baseQuery);

    const hashes: { label: string; value: string }[] = [];

    if (hashCache !== null) {
      hashes.push(...JSON.parse(hashCache));
    } else {
      const hashRawData = await client.query({
        query: baseQuery,
        format: "JSONCompactEachRow",
      });

      const hashJson: string[][] = await hashRawData.json();
      const parsedHashes = hashJson
        .flat(1)
        .filter((item) => item !== "")
        .map((hash: string) => ({
          value: hash,
          label: hash,
        }));
      await redis.set("sql:" + baseQuery, JSON.stringify(parsedHashes));
      hashes.push(...parsedHashes);
    }

    return res.status(200).send({
      hashes,
    });
  } catch (error) {
    let message = "Unknown Error Occurred";
    if (error instanceof Error) message = error.message;
    console.log(message);
    return res.status(400).send({ error: message });
  } finally {
    redis.disconnect();
  }
}
