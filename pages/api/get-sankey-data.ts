import { NextApiRequest, NextApiResponse } from "next";
import { entityColumns, sankeyFrontendColors, tableName } from "@/utils/constants";
import { getSankeyDataResponse } from "@/utils/types";
import { client } from "@/utils/clickhouse";
import { getExpirationTimestamp, getTimeframeFilter, queryArray } from "@/utils/helpers";
import { Redis } from "ioredis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getSankeyDataResponse>,
) {
  const redis = new Redis(process.env.REDIS_URL!);

  try {
    const {
      isOrderflow,
      frontend,
      metaAggregator,
      solver,
      mempool,
      ofa,
      builder,
      pairs,
      columns,
      timeframe,
      txHash,
      startTime,
      endTime,
    } = req.query;
    const entitiesArray = [
      queryArray(frontend),
      queryArray(metaAggregator),
      queryArray(solver),
      queryArray(mempool),
      queryArray(ofa),
      queryArray(builder),
    ];
    const pairsArray = queryArray(pairs);
    const columnsArray = queryArray(columns);

    let isOf = false;
    if (isOrderflow === "true") {
      isOf = true;
    }

    const table = isOf ? tableName.orderflow : tableName.liquidity;

    let entColumns = isOf ? entityColumns.orderflow : entityColumns.liquidity;

    const entities: Record<string, string[]> = {};

    for (let i = 0; i < entColumns.length; i++) {
      entities[entColumns[i]] = entitiesArray[i];
    }

    // Filter out removed columns
    if (columnsArray.length > 0) {
      entColumns = entColumns.filter(function (col) {
        return !columnsArray.includes(col);
      });
    }

    let filter = "";
    let entityFilter = "";
    let pairFilter = "";
    let timeframeFilter = "";
    let startTimeFilter = "";
    let endTimeFilter = "";

    if (txHash) {
      if (Array.isArray(txHash)) {
        filter = `AND hash IN ('${txHash.join("','")}')`;
      } else {
        filter = `AND hash = '${txHash}'`;
      }
    } else {
      // Create filter string for entities
      if (Object.values(entities).flat(1).length > 0) {
        const filterStrings: string[] = [];

        for (const [entityType, ents] of Object.entries(entities)) {
          if (ents.length > 0) {
            let entityTypeFilter = "(";
            for (let i = 0; i < ents.length; i++) {
              entityTypeFilter += `${entityType} = '${ents[i]}'`;

              if (i !== ents.length - 1) {
                entityTypeFilter += " OR ";
              }
            }
            entityTypeFilter += ")";

            filterStrings.push(entityTypeFilter);
          }
        }

        if (filterStrings.length) {
          entityFilter = "(";

          for (let i = 0; i < filterStrings.length; i++) {
            if (i !== 0) {
              entityFilter += ` AND `;
            }
            entityFilter += filterStrings[i];
          }
          entityFilter += ")";
        }
      }

      if (pairsArray.length > 0) {
        pairFilter = `(${isOf ? "trade_pair" : "token_pair"} IN ('${pairsArray.join("','")}'))`;
      }

      if (!timeframe) {
        timeframeFilter = await getTimeframeFilter("7d", table);
      } else if (timeframe && !Array.isArray(timeframe) && timeframe !== "All") {
        timeframeFilter = await getTimeframeFilter(timeframe, table);
      }

      if (startTime) {
        startTimeFilter = `(block_time > toDateTime64(${startTime}, 3))`;
      }

      if (endTime) {
        endTimeFilter = `(block_time < toDateTime64(${endTime}, 3))`;
      }

      if (entityFilter) {
        filter += ` AND ${entityFilter}`;
      }

      if (pairFilter) {
        filter += ` AND ${pairFilter}`;
      }

      if (timeframeFilter) {
        filter += ` AND ${timeframeFilter}`;
      }

      if (startTimeFilter) {
        filter += ` AND ${startTimeFilter}`;
      }

      if (endTimeFilter) {
        filter += ` AND ${endTimeFilter}`;
      }
    }

    let baseQueries: string[][] = [];
    let labelQueries: Record<string, string> = {};

    for (let source = 0; source < entColumns.length; source++) {
      const labelQueryString = `
      SELECT 
        DISTINCT ${entColumns[source]}
      FROM ${table} 
      WHERE ${entColumns[source]} != ''
      AND 
          trade_usd != 0 
      ${filter}`.replace(/\s+/g, " ");

      labelQueries[entColumns[source]] = labelQueryString;
      for (let target = source + 1; target < entColumns.length; target++) {
        let extraFilter = "";
        if (target > source + 1) {
          for (let i = source + 1; i < target; i++) {
            extraFilter += ` AND ${entColumns[i]} = ''`;
          }
        }

        let queryString = "";

        if (isOf) {
          queryString = `
            SELECT 
              ${entColumns[source]} as source, 
              ${entColumns[target]} as target, 
              SUM(trade_usd) as value
            FROM 
              ${table} 
            WHERE 
              ${entColumns[source]} != '' 
            AND 
              ${entColumns[target]} != '' 
            AND 
              trade_usd != 0 
            ${extraFilter}
            ${filter} 
            GROUP BY 
              source, 
              target
            `;
        } else {
          if (source < 2) {
            queryString = `
            SELECT 
              ${entColumns[source]} as source, 
              ${entColumns[target]} as target, 
              SUM(trade_usd) as value
            FROM (
              SELECT 
                DISTINCT ON (hash)
                ${entColumns[source]}, 
                ${entColumns[target]}, 
                trade_usd
              FROM 
                ${table} 
              WHERE 
                ${entColumns[source]} != '' 
              AND 
                ${entColumns[target]} != '' 
              AND 
                trade_usd != 0 
              ${extraFilter}
              ${filter}
            )
            GROUP BY 
              source, 
              target
            `;
          } else {
            queryString = `
            SELECT
              ${entColumns[source]} as source,
              ${entColumns[target]} as target,
              SUM(amount_usd) as value
            FROM (
              SELECT
                ${entColumns[source]},
                ${entColumns[target]},
                amount_usd
              FROM
                ${table}
              WHERE
                ${entColumns[source]} != ''
              AND
                ${entColumns[target]} != ''
              AND
                amount_usd != 0
              ${extraFilter}
              ${filter}
            )
            GROUP BY
              source,
              target
            `;
          }
        }

        baseQueries.push([
          entColumns[source],
          entColumns[target],
          queryString.replace(/\s+/g, " "),
        ]);
      }
    }

    const labels: Record<string, string[]> = {};
    const labelsArray: string[] = [];
    const expirationTimestamp = getExpirationTimestamp();

    const sendLabels = async (column: string, query: string) => {
      try {
        const labelsCache: string | null = await redis.get("sql:" + query);

        if (labelsCache !== null) {
          labels[column] = JSON.parse(labelsCache);
          labelsArray.push(...JSON.parse(labelsCache));
        } else {
          const findLabels = await client.query({
            query: query,
            format: "JSONCompactEachRow",
          });

          const json: string[][] = await findLabels.json();
          const parsedJson = json.flat(1);

          await redis.set("sql:" + query, JSON.stringify(parsedJson), "EXAT", expirationTimestamp);

          labels[column] = parsedJson;
          labelsArray.push(...parsedJson);
        }
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          sendLabels(column, query);
        }, 100);
      }
    };

    const getLabels = async () => {
      const requests: Promise<void>[] = [];

      for (const [column, query] of Object.entries(labelQueries)) {
        requests.push(sendLabels(column, query));
      }

      await Promise.allSettled(requests);
      return;
    };

    await getLabels();

    // Label indicies
    const indicies: Record<string, Record<string, number>> = {};
    let index = 0;
    for (const [column, values] of Object.entries(labels)) {
      indicies[column] = {};
      for (const value of values) {
        indicies[column][value] = index;
        index++;
      }
    }

    let source: number[] = [],
      target: number[] = [],
      value: number[] = [];

    const sendData = async (sourceColumn: string, targetColumn: string, query: string) => {
      try {
        let dataArray: Record<string, any>[] = [];
        const dataCache: string | null = await redis.get("sql:" + query);

        if (dataCache !== null) {
          dataArray = JSON.parse(dataCache);
        } else {
          const data = await client.query({
            query: query,
            format: "JSONEachRow",
          });
          const dataJson: Record<string, any>[] = await data.json();

          await redis.set("sql:" + query, JSON.stringify(dataJson), "EXAT", expirationTimestamp);

          dataArray = dataJson;
        }

        for (const record of dataArray) {
          source.push(indicies[sourceColumn][record.source]);
          target.push(indicies[targetColumn][record.target]);
          value.push(record.value);
        }
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          sendData(sourceColumn, targetColumn, query);
        }, 100);
      }
    };

    const getRequests = async () => {
      const requests: Promise<void>[] = [];

      for (const [sourceColumn, targetColumn, query] of baseQueries) {
        requests.push(sendData(sourceColumn, targetColumn, query));
      }

      await Promise.allSettled(requests);
      return;
    };

    await getRequests();

    const colors = [];

    const randomHexColor = () => {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };

    for (const label of labelsArray) {
      colors.push(sankeyFrontendColors[label] ? sankeyFrontendColors[label] : randomHexColor());
    }

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

      await redis.set(
        "sql:" + rangeQuery,
        JSON.stringify(rangeDataJson),
        "EXAT",
        expirationTimestamp,
      );

      range.push(...rangeDataJson);
    }

    return res.status(200).send({
      data: {
        entityFilter,
        links: { source, target, value },
        labels: labelsArray,
        colors,
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
