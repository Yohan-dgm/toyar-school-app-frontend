import { setToken } from "@/state-store/slices/app-slice";
import { apiServer1 } from "./api-server-1";

// const getCookie = (cookieName: string): string | undefined => {
//   const cookieArray = document.cookie.split(";");

//   for (const cookie of cookieArray) {
//     let cookieString = cookie;

//     while (cookieString.charAt(0) == " ") {
//       cookieString = cookieString.substring(1, cookieString.length);
//     }
//     if (cookieString.indexOf(cookieName + "=") == 0) {
//       return cookieString.substring(cookieName.length + 1, cookieString.length);
//     }
//   }

//   return undefined;
// };

// const apiServer1WithTags = apiServer1.enhanceEndpoints({
//   addTagTypes: ["Foo"],
// });
// export const authApi = apiServer1WithTags.injectEndpoints

export const authApi = apiServer1
  .enhanceEndpoints({ addTagTypes: ["SomeTag"] })
  .injectEndpoints({
    endpoints: (build) => ({
      initCsrf: build.mutation<string, void>({
        query() {
          return {
            url: "sanctum/csrf-cookie",
            credentials: "include",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          };
        },
        // transformResponse: (apiResponse, meta, arg): string => {
        //   let cookie = getCookie("XSRF-TOKEN");
        //   if (typeof cookie != "undefined") return decodeURIComponent(cookie);

        //   return "";
        // },
      }),
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
        transformResponse: (apiResponse: any) => {
          console.log("Login response:", apiResponse);

          // Extract user data and role information
          if (apiResponse?.data) {
            return {
              token: apiResponse.data.token,
              user: apiResponse.data.user,
              user_role:
                apiResponse.data.user?.role || apiResponse.data.user?.user_role,
              permissions: apiResponse.data.permissions,
              ...apiResponse.data,
            };
          }

          return apiResponse;
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log("Processed login data:", data);

            // Store the token in Redux
            if (data.token) {
              dispatch(setToken(data.token));
            }
          } catch (error) {
            console.error("Login error:", error);
          }
        },
      }),

      // Verify PIN endpoint (if needed separately)
      verifyPin: build.mutation<
        any,
        { username_or_email: string; pin: string }
      >({
        query(data) {
          return {
            url: "api/user-management/user/verify-pin",
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
      }),
      login: build.mutation({
        query: (credentials) => ({
          url: "login",
          method: "POST",
          body: credentials,
        }),
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            console.log("started");
            const { data } = await queryFulfilled;
            console.log(data);
            // dispatch(setToken(data.accessToken)); // Store the token in Redux
          } catch (error) {
            console.error("Login error:", error);
          }
        },
      }),
    }),
  });

export const { useLoginMutation, useLoginUserMutation, useVerifyPinMutation } =
  authApi;
