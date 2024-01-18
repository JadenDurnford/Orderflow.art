import { NextApiRequest, NextApiResponse } from "next";
import { tableName } from "@/utils/constants";
import { getDataRangeResponse } from "@/utils/types";
import { client } from "@/utils/clickhouse";
import { Redis } from "ioredis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getDataRangeResponse>,
) {
  const redis = new Redis(process.env.REDIS_URL!);

  try {
    const { isOrderflow } = req.query;
    let isOf = false;
    if (isOrderflow === "true") {
      isOf = true;
    }

    const table = isOf ? tableName.orderflow : tableName.liquidity;

    const rangeQuery = `
    SELECT 
      MIN(block_time) AS startTime, 
      MAX(block_time) AS endTime, 
      MIN(block_number) AS startBlock, 
      MAX(block_number) AS endBlock 
    FROM ${table}`.replace(/\s+/g, " ");

    const rangeCache: string | null = await redis.get("sql:" + rangeQuery);

    let range: {
      startTime: string;
      endTime: string;
      startBlock: string;
      endBlock: string;
    }[] = [];

    if (rangeCache !== null) {
      range.push(...JSON.parse(rangeCache));
    } else {
      const rangeData = await client.query({
        query: rangeQuery,
        format: "JSONEachRow",
      });

      const rangeDataJson: {
        startTime: string;
        endTime: string;
        startBlock: string;
        endBlock: string;
      }[] = await rangeData.json();
      await redis.set("sql:" + rangeQuery, JSON.stringify(rangeDataJson));
      range.push(...rangeDataJson);
    }

    return res.status(200).send({
      data: {
        range: range[0],
      },
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
