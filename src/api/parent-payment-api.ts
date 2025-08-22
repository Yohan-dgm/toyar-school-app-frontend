import { apiServer1 } from "./api-server-1";
import { StudentBillsResponse, GetStudentBillsRequest } from "../types/payment";

export const parentPaymentApi = apiServer1.injectEndpoints({
  endpoints: (builder) => ({
    getStudentBillsData: builder.query<
      StudentBillsResponse,
      GetStudentBillsRequest
    >({
      query: (params) => ({
        url: "/api/account-management/student-bills-data/list",
        method: "POST",
        body: params,
      }),
      providesTags: ["Payment"],
      transformResponse: (response: StudentBillsResponse) => {
        console.log("🏦 Payment API - Student bills data received:", {
          status: response.status,
          studentCount: Object.keys(response.data.student_bills_data).length,
          message: response.message,
        });
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error(
          "❌ Payment API - Error fetching student bills:",
          response,
        );
        return {
          status: response.status || "FETCH_ERROR",
          data: response.data || {
            message: "Failed to fetch student bills data",
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetStudentBillsDataQuery, useLazyGetStudentBillsDataQuery } =
  parentPaymentApi;
