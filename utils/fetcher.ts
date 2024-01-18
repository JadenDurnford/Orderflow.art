import axios from "axios";

export default async function fetcher(uri: any, queryParam: any) {
  const server =
    process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://orderflow.art";
  const response = await axios.get(server + uri + queryParam);
  return response.data;
}
