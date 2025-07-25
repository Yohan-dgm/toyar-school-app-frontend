inside .env file we define backend server url
=============================================
EXPO_PUBLIC_BASE_URL_API_SERVER_1=http://192.168.1.12:9999


inside api-server-1.ts file we define base api settings
=======================================================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiServer1 = createApi({
  reducerPath: "apiServer1",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
    prepareHeaders: (headers, api: any) => {
      const token = api.getState().app.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("credentials", "include");

      return headers;
    },
  }),
  endpoints: () => ({}),
});


inside module api file auth-api.ts we define all GET, POST endpoints
====================================================================
export const authApi = apiServer1
  .enhanceEndpoints({ addTagTypes: ["SomeTag"] })
  .injectEndpoints({
    endpoints: (build) => ({
      loginUser: build.mutation<any, any>({
        query(data: any) {
          return {
            url: "api/user-management/user/sign-in",
            method: "POST",
            body: data,
            credentials: "include",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          };
        },
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log(data);
            dispatch(setToken(data.data.token)); // Store the token in Redux
          } catch (error) {
            console.error("Login error:", error);
          }
        },
      }),
  }),
});

inside your app screen
======================
import { authApi } from "@/api/auth-api";
const [loginUserTrigger, loginUserState] =
    authApi.endpoints.loginUser.useMutation();
	
<Button
  title="sign in"
  onPress={() => {
	console.log("sign in");
	loginUserTrigger({
	  pin: "t_school_app_tenant_2",
	  username_or_email: "mithun",
	  password: "malith@14",
	})
	  .unwrap()
	  .then((fulfilled) => {
		console.log(fulfilled)
		dispatch(setIsAuthenticated(true));
	  })
	  .catch((rejected) => {
		console.error(rejected);
		setIsAuthenticated(false);
	  });
  }}
/>