import { NextApiRequest, NextApiResponse } from "next";
import { SelectItem, getFilteredPairsResponse } from "@/utils/types";
import { client } from "@/utils/clickhouse";
import { categoryTokens, tableName } from "@/utils/constants";
import { getTimeframeFilter } from "@/utils/helpers";
import { Redis } from "ioredis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getFilteredPairsResponse>,
) {
  const redis = new Redis(process.env.REDIS_URL!);

  try {
    const { isOrderflow, entityFilter, input, timeframe } = req.query;

    let isOf = false;
    if (isOrderflow === "true") {
      isOf = true;
    }
    const table = isOf ? tableName.orderflow : tableName.liquidity;

    let filter = "";

    if (input) {
      filter = `WHERE lower(${isOf ? "trade_pair" : "token_pair"}) LIKE '%${input}%' `;
    }

    if (entityFilter) {
      if (filter.length > 0) {
        filter += `AND ${entityFilter}`;
      } else {
        filter = `WHERE ${entityFilter}`;
      }
    }

    if (timeframe && !Array.isArray(timeframe) && timeframe !== "All") {
      if (filter.length > 0) {
        filter += `AND ${await getTimeframeFilter(timeframe, table)}`;
      } else {
        filter = `WHERE ${await getTimeframeFilter(timeframe, table)}`;
      }
    } else if (timeframe !== "All") {
      if (filter.length > 0) {
        filter += `AND ${await getTimeframeFilter("7d", table)}`;
      } else {
        filter = `WHERE ${await getTimeframeFilter("7d", table)}`;
      }
    }

    if (filter.length > 0) {
      filter += `AND trade_usd != 0`;
    } else {
      filter = `WHERE trade_usd != 0`;
    }

    const baseQuery = `
      SELECT 
        ${isOf ? "trade_pair" : "token_pair"},
        SUM(trade_usd) as total_trade_usd
      FROM 
        ${table}
      ${filter}
      GROUP BY 
        ${isOf ? "trade_pair" : "token_pair"}
      ORDER BY 
        total_trade_usd DESC
      LIMIT 131`.replace(/\s+/g, " ");

    const pairCache: string | null = await redis.get("sql:" + baseQuery);

    const parsedPairs: string[] = [];

    if (pairCache !== null) {
      parsedPairs.push(...JSON.parse(pairCache));
    } else {
      const pairsRawData = await client.query({
        query: baseQuery,
        format: "JSONCompactEachRow",
      });

      const pairsJson: string[][] = await pairsRawData.json();
      const parsedPairsJson = pairsJson
        .map((item) => {
          return item[0];
        })
        .filter((item) => item !== "");
      await redis.set("sql:" + baseQuery, JSON.stringify(parsedPairsJson));
      parsedPairs.push(...parsedPairsJson);
    }

    let ethbtcPairs: SelectItem[] = [];
    let stableswapPairs: SelectItem[] = [];
    let longtailPairs: SelectItem[] = [];
    let ethbtcArray: string[] = [];
    let stableswapArray: string[] = [];

    for (const pair of parsedPairs) {
      if (categoryTokens["eth/btc"].includes(pair)) {
        ethbtcPairs.push({
          value: pair,
          label: pair,
        });
        ethbtcArray.push(pair);
      } else if (categoryTokens["stableswaps"].includes(pair)) {
        stableswapPairs.push({
          value: pair,
          label: pair,
        });
        stableswapArray.push(pair);
      } else if (
        !categoryTokens["eth/btc"].includes(pair) &&
        !categoryTokens["stableswaps"].includes(pair) &&
        longtailPairs.length < 100
      ) {
        longtailPairs.push({
          value: pair,
          label: pair,
        });
      }
    }

    for (const pair of categoryTokens["eth/btc"]) {
      if (!ethbtcArray.includes(pair)) {
        ethbtcPairs.push({
          value: pair,
          label: pair,
        });
      }
    }

    for (const pair of categoryTokens["stableswaps"]) {
      if (!stableswapArray.includes(pair)) {
        stableswapPairs.push({
          value: pair,
          label: pair,
        });
      }
    }

    return res.status(200).send({
      pairs: { ethbtcPairs, stableswapPairs, longtailPairs },
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
