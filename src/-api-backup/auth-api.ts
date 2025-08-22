import { setToken, setUser } from "@/state-store/slices/app-slice";
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
          console.log(
            "🔥 Auth API - Raw response received:",
            JSON.stringify(apiResponse, null, 2),
          );

          // Return the response as-is, but log it for debugging
          // The login component will handle the data extraction
          return apiResponse;
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            console.log("🚀 Auth API - onQueryStarted called");
            const { data } = await queryFulfilled;
            console.log(
              "✅ Auth API - Query fulfilled with data:",
              JSON.stringify(data, null, 2),
            );

            // Store the token from the API response
            if (data?.data?.token) {
              dispatch(setToken(data.data.token));
              console.log("🔑 Auth API - Token stored:", data.data.token);
            }

            // Store user data from the API response
            if (data?.data) {
              const userData = {
                id: data.data.id,
                full_name: data.data.full_name,
                username: data.data.username,
                email: data.data.email,
                user_type_list: data.data.user_type_list,
                user_category: data.data.user_category, // Add user_category field
              };
              dispatch(setUser(userData));
              console.log(
                "👤 Auth API - User data stored:",
                JSON.stringify(userData, null, 2),
              );
            }
          } catch (error) {
            // Silently handle auth errors - let the component show toast notifications
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
            // Silently handle auth errors - let the component show toast notifications
          }
        },
      }),
    }),
  });

export const { useLoginMutation, useLoginUserMutation, useVerifyPinMutation } =
  authApi;
