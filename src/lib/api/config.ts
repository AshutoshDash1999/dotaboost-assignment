import { createApiClient } from "react-query-ease";

export const dotaApi = createApiClient({
  baseURL: "https://api.opendota.com/api",
});
