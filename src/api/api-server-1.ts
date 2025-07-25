import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiServer1 = createApi({
  reducerPath: "apiServer1",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
    prepareHeaders: (headers, api: any) => {
      const token = api.getState().app.token;
      console.log("🔐 API Server 1 - Token check:", {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 10)}...` : "No token",
      });

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("🔐 API Server 1 - Authorization header set");
      } else {
        console.warn("🔐 API Server 1 - No token found, request may fail");
      }
      headers.set("credentials", "include");

      return headers;
    },
    // prepareHeaders: async (headers) => {
    //   // const user = await AsyncStorageService.getStoredData();
    //   // const hasUser = !!user && !!user!.userToken;

    //   // if (hasUser) {
    //   //   headers.set("Authorization", `Token ${user.userToken}`);
    //   // }

    //   // headers.set("Content-Type", "application/json");

    //   // return headers;
    // },
  }),
  endpoints: () => ({}),
});
