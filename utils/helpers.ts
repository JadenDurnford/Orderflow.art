import { Dispatch, SetStateAction } from "react";
import { SelectItem } from "./types";
import { SingleValue } from "react-select";
import moment from "moment-timezone";
import { NextRouter } from "next/router";
import { parse, stringify } from "querystring";
import { client } from "./clickhouse";

export const getTimeframeFilter = async (timeframe: string, table: string) => {
  const data = await client.query({
    query: `SELECT MAX(block_time) FROM ${table}`,
    format: "JSONCompactEachRow",
  });

  const dataJson: string[][] = await data.json();

  const now = Math.floor(new Date(dataJson[0][0] + " UTC").getTime() / 1000);

  let startTime = now - 60 * 24 * 60;

  switch (timeframe) {
    case "7d": {
      startTime = now - 60 * 24 * 60 * 7;
      break;
    }

    case "30d": {
      startTime = now - 60 * 24 * 60 * 30;
      break;
    }
  }

  return `(block_time > toDateTime64(${startTime}, 3))`;
};

export function changeQueryParam(
  isOrderflow: boolean,
  timeframe: SingleValue<SelectItem>,
  txHash: SelectItem[],
  pairs: SelectItem[],
  mempoolEnabled: boolean,
  setMempoolEnabled: Dispatch<SetStateAction<boolean>>,
  entities: {
    frontend: SelectItem[];
    metaAggregator: SelectItem[];
    solver: SelectItem[];
    mempool: SelectItem[];
    ofa: SelectItem[];
    builder: SelectItem[];
  },
  setQueryParam: Dispatch<SetStateAction<string>>,
  router: NextRouter,
  setDeeplink: Dispatch<SetStateAction<string>>,
  startTime: string,
  endTime: string,
) {
  const urlParams = new URLSearchParams({
    isOrderflow: isOrderflow.toString(),
  });

  for (const [column, values] of Object.entries(entities)) {
    for (const entity of values) {
      urlParams.append(column, entity.value);
    }
  }

  if (timeframe && timeframe?.value !== "7d") {
    urlParams.append("timeframe", timeframe.value);
  }

  if (txHash) {
    for (const hash of txHash) {
      urlParams.append("txHash", hash.value);
    }
  }

  for (const pair of pairs) {
    urlParams.append("pairs", pair.value);
  }

  if (!mempoolEnabled && isOrderflow) {
    urlParams.append("columns", "mempool");
  } else if (!mempoolEnabled) {
    setMempoolEnabled(true);
  }

  if (startTime) {
    urlParams.append("startTime", startTime);
  }

  if (endTime) {
    urlParams.append("endTime", endTime);
  }

  const queryString = `${urlParams.toString()}`;
  setQueryParam("?" + queryString);
  router.query = parse(queryString);
  setDeeplink(stringify(router.query));
  router.push(router, undefined, { shallow: true });
}

export const getDateString = (dateString: string) => {
  const date = moment.utc(dateString);

  return date.local().format("YYYY-MM-DD HH:mm:ss [UTC]Z");
};

export const queryArray = (value: string | string[] | undefined) => {
  return value ? (!Array.isArray(value) ? [value] : value) : [];
};
