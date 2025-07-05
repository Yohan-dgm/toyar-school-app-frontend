import store from "@/state-store/store";
import { apiServer1 } from "./api-server-1";
export const usersApi = apiServer1.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    // Fetch user profile with token in Authorization header
    getUserListData: build.mutation({
      query: (credentials) => ({
        url: "api/user-management/user/get-user-list-data",
        method: "POST",
        data: { page_size: 10, page: 1 },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${store.getState().app.token}`,
          // Authorization: `Bearer 80|BWGB1sEcXvq6AUP3thwife3NGw96S984vRtW346U6f37aa7a`,
          "Content-Type": "application/json; charset=UTF-8",
          credentials: "include",
        },
        // prepareHeaders: (headers: any, api: any) => {
        //   const token = api.getState().auth.token;
        //   console.log(token);
        //   // If the token exists, set it in the Authorization header
        //   if (token) {
        //     headers.set("Authorization", `Bearer ${token}`);
        //   }
        //   // headers.set("credentials", "include");
        //   // headers.set("X-Requested-With", "XMLHttpRequest");
        //   // headers.set("Content-Type", "application/json; charset=UTF-8");
        //   headers.set("Accept", "application/json");
        //   console.log(headers);
        //   return headers;
        // },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("started");
          const { data } = await queryFulfilled;
          console.log(data);
          // dispatch(setToken(data.accessToken)); // Store the token in Redux
        } catch (error) {
          console.log(store.getState().app.token);
          console.error("Login error:", error);
        }
      },
    }),
    getUserListData2: build.query<any, any>({
      query(data: any) {
        return {
          url: "api/user-management/user/get-user-list-data",
          method: "POST",
          body: { page_size: 10, page: 1 },
          prepareHeaders: (headers: any, api: any) => {
            const token = api.getState().auth.token;
            console.log(token);
            // If the token exists, set it in the Authorization header
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set("credentials", "include");
            headers.set("X-Requested-With", "XMLHttpRequest");
            headers.set("Content-Type", "application/json; charset=UTF-8");
            headers.set("Accept", "application/json");
            return headers;
          },
        };
      },
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
      //     // console.log(JSON.parse(data));
      //   } catch (error) {
      //     // console.error("Login error:", error);
      //   }
      // },
    }),
  }),
});

export const {} = usersApi;
