import store from "@/state-store/store";
import { apiServer1 } from "./api-server-1";
export const userManagementApi = apiServer1
  .enhanceEndpoints({})
  .injectEndpoints({
    endpoints: (build) => ({
      getUserListData: build.query({
        query: (payload) => ({
          url: "api/user-management/user/get-user-list-data",
          method: "POST",
          data: payload,
          // headers: {
          //   Accept: "application/json",
          //   "Content-Type": "application/json; charset=UTF-8",
          // },
          prepareHeaders: async (headers: any, api: any) => {
            headers.set("Content-Type", "application/json; charset=UTF-8");
            headers.set("Accept", "application/json");
            return headers;
          },
        }),
      }),
    }),
  });

export const {} = userManagementApi;
