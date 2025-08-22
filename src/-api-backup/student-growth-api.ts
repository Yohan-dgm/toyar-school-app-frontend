import { apiServer1 } from "./api-server-1";
import type {
  StudentGrowthApiResponse,
  StudentRatingsRequest,
} from "../types/student-growth";

/**
 * STUDENT GROWTH API
 *
 * API endpoints for student intelligence ratings and growth analytics
 * Connects to the educator feedback management dashboard endpoints
 */

export const studentGrowthApi = apiServer1.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Student Intelligence Ratings
     *
     * Endpoint: POST /api/educator-feedback-management/dashboard/student-ratings
     *
     * Request Parameters:
     * - student_id (required): ID of the student
     * - year (optional): Year filter (e.g., 2025)
     * - month (optional): Month filter (1-12)
     * - For 'all' filter: only student_id is sent
     *
     * Response: Student info, summary, and category ratings
     */
    getStudentRatings: builder.query<
      StudentGrowthApiResponse,
      StudentRatingsRequest
    >({
      query: ({ student_id, year, month }) => {
        const body: any = { student_id };

        // Add year or month parameter based on filter type
        if (year !== undefined) {
          body.year = year;
        } else if (month !== undefined) {
          body.month = month;
        }
        // For 'all' filter, only student_id is sent

        console.log("📊 Student Growth API Request:", {
          endpoint:
            "/api/educator-feedback-management/dashboard/student-ratings",
          student_id,
          year: year || "not set",
          month: month || "not set",
          filter_type: year ? "year" : month ? "month" : "all",
          body,
        });

        return {
          url: "/api/educator-feedback-management/dashboard/student-ratings",
          method: "POST",
          body,
        };
      },
      providesTags: (result, error, { student_id, year, month }) => {
        const filterKey = year
          ? `year-${year}`
          : month
            ? `month-${month}`
            : "all";
        return [
          { type: "StudentGrowth" as const, id: `${student_id}-${filterKey}` },
          { type: "StudentGrowth" as const, id: student_id },
          "StudentGrowth",
        ];
      },
      transformResponse: (response: StudentGrowthApiResponse) => {
        console.log("📊 Student Growth API Response:", {
          success: response.success,
          studentName: response.data?.student_info?.student_calling_name,
          overallAverage: response.data?.summary?.average_overall,
          categoriesCount: response.data?.categories?.length,
          filteredPeriod: response.data?.summary?.filtered_period,
        });

        return response;
      },
      transformErrorResponse: (response: {
        status: string | number;
        data: any;
      }) => {
        console.error("❌ Student Growth API Error:", {
          status: response.status,
          error: response.data,
        });

        return {
          status: response.status,
          message: response.data?.message || "Failed to fetch student ratings",
          data: response.data,
        };
      },
    }),
  }),
  overrideExisting: false,
});

// Add the tag type to the main API
// Note: This should also be added to the tagTypes array in api-server-1.ts
export const { useGetStudentRatingsQuery } = studentGrowthApi;

// Export for manual cache invalidation
export const invalidateStudentGrowthCache = (studentId: number) => {
  return studentGrowthApi.util.invalidateTags([
    { type: "StudentGrowth", id: studentId },
    "StudentGrowth",
  ]);
};
