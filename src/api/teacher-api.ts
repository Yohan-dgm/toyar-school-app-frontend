import { apiServer1 } from "./api-server-1";

/**
 * TEACHER API
 *
 * This file defines all API endpoints for the teacher management system.
 * All endpoints use the same authentication and error handling as other APIs.
 */

// ===== EXPECTED BACKEND DATA STRUCTURES =====

/**
 * TEACHER LIST DATA API
 * Endpoint: POST /api/educator-management/educator/get-educator-list-data
 * Request: {
 *   "page_size": 10,
 *   "page": 1,
 *   "search_phrase": "",
 *   "search_filter_list": []
 * }
 *
 * Expected Response:
 * {
 *   "status": "successful",
 *   "message": "",
 *   "data": {
 *     "data": [
 *       {
 *         "id": 79,
 *         "employee_id": 111,
 *         "educator_grade_id": 1,
 *         "employee": {
 *           "id": 111,
 *           "full_name": "ASCD CV DFC XCV",
 *           "employee_type_id": 2,
 *           "nic_number": "1452012365420",
 *           "epf_number": null,
 *           "remaining_annual_leaves": "14.0",
 *           "remaining_medical_leaves": "7.0",
 *           "remaining_maternity_leaves": "0.0",
 *           "created_by": 42,
 *           "updated_by": null,
 *           "created_at": "2025-06-03T10:31:23.000000Z",
 *           "updated_at": "2025-06-03T10:31:23.000000Z",
 *           "user_id": null,
 *           "person_title_id": 1,
 *           "calling_name": "ASDCF VFV A",
 *           "gender": "Male",
 *           "date_of_birth": "2024-04-09",
 *           "marital_status": "Married",
 *           "phone": "43353454",
 *           "email": "yhjjd@hg.dg",
 *           "address": "<p>THB CM BVNHD NMJMX C</p>",
 *           "employee_id_type": null,
 *           "passport_number": null,
 *           "designation_id": 10,
 *           "blood_group": "B negative (B-)",
 *           "special_health_conditions": "<p>SF CVB VFFF F</p>",
 *           "joined_date": "2024-06-01",
 *           "employee_number": "NY24/6",
 *           "employee_number_digits": 6,
 *           "employee_number_prefix": "NY",
 *           "employee_number_current_year": "24",
 *           "full_name_with_title": "Mr.ASCD CV DFC XCV",
 *           "employee_type": {
 *             "id": 2,
 *             "name": "Temporary Employee"
 *           },
 *           "person_title": {
 *             "id": 1,
 *             "name": "Mr."
 *           },
 *           "designation": {
 *             "id": 10,
 *             "name": "Basket Ball Coach"
 *           },
 *           "employee_attachment_list": []
 *         },
 *         "educator_grade": {
 *           "id": 1,
 *           "name": "Teacher - Grade I"
 *         },
 *         "subject_list": [
 *           {
 *             "name": "Computing",
 *             "subject_code": "G6-CO",
 *             "is_elective_subject": false,
 *             "program_id": 6,
 *             "subject_type_id": 1,
 *             "stream_id": 1,
 *             "created_by": null,
 *             "updated_by": null,
 *             "created_at": null,
 *             "updated_at": null,
 *             "id": 127,
 *             "educator_id": 79,
 *             "subject_id": 72,
 *             "pivot": {
 *               "educator_id": 79,
 *               "subject_id": 72
 *             },
 *             "program": {
 *               "id": 6,
 *               "name": "Grade 6 - Main Program"
 *             }
 *           }
 *         ]
 *       }
 *     ],
 *     "total": 31,
 *     "educator_count": 31
 *   },
 *   "metadata": {
 *     "is_system_update_pending": true
 *   }
 * }
 */

export const teacherApi = apiServer1.injectEndpoints({
  endpoints: (build) => ({
    getAllTeachersWithPagination: build.query({
      query: ({
        page = 1,
        page_size = 10,
        search_phrase = "",
        search_filter_list = [],
      }) => {
        const requestBody = {
          page_size,
          page,
          search_phrase,
          search_filter_list,
        };

        console.log("📤 All Teachers Paginated Request Body:", requestBody);

        return {
          url: "api/educator-management/educator/get-educator-list-data",
          method: "POST",
          body: requestBody,
          credentials: "include",
        };
      },
      providesTags: (
        result,
        error,
        { page, page_size, search_phrase, search_filter_list },
      ) => [
        { type: "Teachers", id: `ALL_PAGE_${page}` },
        { type: "Teachers", id: "ALL" },
      ],
      transformResponse: (
        response: any,
        meta: any,
        { page, page_size, search_phrase, search_filter_list },
      ) => {
        console.log("👩‍🏫 All Teachers Paginated Response:", {
          response,
          responseType: typeof response,
          responseStatus: response?.status,
          responseData: response?.data,
          page,
          totalCountFromAPI:
            response?.data?.total || response?.data?.educator_count,
          teachersCountFromAPI: response?.data?.data?.length,
        });

        // Handle HTML error responses
        if (
          typeof response === "string" &&
          response.includes("<!DOCTYPE html>")
        ) {
          console.error("❌ All Teachers API returned HTML instead of JSON");
          throw new Error(
            "Server Configuration Error: Teacher API returned HTML. Please contact technical support.",
          );
        }

        // Handle authentication errors
        if (
          response?.status === "authentication-required" ||
          meta?.response?.status === 401
        ) {
          console.error("❌ Authentication required for all teachers");
          throw new Error("Authentication required. Please login again.");
        }

        // Handle successful response
        if (response?.status === "successful" && response?.data) {
          console.log("✅ Processing all teachers API response");

          // Extract teachers array and metadata
          const teachersArray = response.data.data || [];
          const totalCount =
            response.data.total ||
            response.data.educator_count ||
            teachersArray.length;

          // Transform teachers data for easier consumption
          const transformedTeachers = teachersArray.map((teacher: any) => {
            // Process profile image
            let profileImageUrl = null;
            if (teacher.employee?.employee_attachment_list?.length > 0) {
              const firstAttachment =
                teacher.employee.employee_attachment_list[0];
              if (firstAttachment?.file_name) {
                profileImageUrl = `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}uploads/employees/${firstAttachment.file_name}`;
              }
            }

            // Process subjects
            const subjects =
              teacher.subject_list?.map((subject: any) => ({
                name: subject.name,
                code: subject.subject_code,
                program: subject.program?.name,
                isElective: subject.is_elective_subject,
              })) || [];

            return {
              id: teacher.id,
              employee_id: teacher.employee_id,
              educator_grade_id: teacher.educator_grade_id,

              // Employee information
              full_name: teacher.employee?.full_name || "Unknown Name",
              full_name_with_title:
                teacher.employee?.full_name_with_title ||
                teacher.employee?.full_name ||
                "Unknown Name",
              calling_name:
                teacher.employee?.calling_name ||
                teacher.employee?.full_name?.split(" ")[0] ||
                "Unknown",
              employee_number: teacher.employee?.employee_number || "N/A",
              email: teacher.employee?.email || "No email",
              phone: teacher.employee?.phone || "No phone",
              gender: teacher.employee?.gender || "Not specified",
              joined_date: teacher.employee?.joined_date || null,

              // Professional information
              designation:
                teacher.employee?.designation?.name || "Not specified",
              designation_id: teacher.employee?.designation_id,
              educator_grade: teacher.educator_grade?.name || "Not specified",
              employee_type:
                teacher.employee?.employee_type?.name || "Not specified",

              // Profile image
              profile_image_url: profileImageUrl,

              // Subjects taught
              subjects: subjects,
              subject_names: subjects.map((s: any) => s.name),

              // Additional data for filtering
              person_title: teacher.employee?.person_title?.name || "",

              // Raw data for detailed view
              raw_employee: teacher.employee,
              raw_educator_grade: teacher.educator_grade,
              raw_subject_list: teacher.subject_list,
            };
          });

          console.log(
            `📚 Found ${transformedTeachers.length} teachers in response (total: ${totalCount})`,
          );

          return {
            data: {
              teachers: transformedTeachers,
              data: transformedTeachers, // Alternative access path
              total_count: totalCount,
              educator_count: totalCount,
              page_size: page_size,
              current_page: page,
              total_pages: Math.ceil(totalCount / page_size),
              has_next_page: page < Math.ceil(totalCount / page_size),
              has_previous_page: page > 1,
            },
            metadata: response.metadata,
          };
        }

        // Handle error responses
        console.error("❌ Unexpected teacher API response:", response);
        throw new Error(
          response?.message || "Failed to load teachers. Please try again.",
        );
      },
    }),
  }),
});

export const { useGetAllTeachersWithPaginationQuery } = teacherApi;
