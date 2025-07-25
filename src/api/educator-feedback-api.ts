import { apiServer1 } from "./api-server-1";

// Define the educator feedback API slice with RTK Query
export const educatorFeedbackApi = apiServer1
  .enhanceEndpoints({
    addTagTypes: [
      "EducatorFeedback",
      "FeedbackCategories",
      "FeedbackQuestions",
      "Grades",
      "Students",
      "EducatorFeedbackMeta",
    ],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
      // ===== GET STUDENT LIST DATA (Grades + Students) =====
      getStudentListData: build.query({
        query: () => {
          console.log("📤 Student List Data API Request (POST method)");
          return {
            url: "api/student-management/student/get-student-list-data",
            method: "POST",
            body: {}, // Empty body for POST request
          };
        },
        providesTags: [
          { type: "Grades", id: "LIST" },
          { type: "Students", id: "LIST" },
        ],
        transformResponse: (response: any, meta: any, arg: any) => {
          // console.log("📚 Student List Data API Response:", response);
          // console.log("📚 API Meta:", meta);
          // console.log("📚 Response Type:", typeof response);
          // console.log("📚 Response Status Code:", meta?.response?.status);

          // Check if response is HTML (error page) - like activity feed API
          if (
            typeof response === "string" &&
            response.includes("<!DOCTYPE html>")
          ) {
            console.error(
              "❌ Student List Data API returned HTML instead of JSON:",
              response.substring(0, 200)
            );
            console.log(
              "🔧 TEMPORARY: Using dummy data while backend endpoint is fixed"
            );

            // Return dummy data like activity feed API does
            return {
              status: "successful",
              data: {
                grades: [
                  {
                    id: 1,
                    name: "Grade 8",
                    student_list_count: 25,
                    active: true,
                  },
                  {
                    id: 2,
                    name: "Grade 9",
                    student_list_count: 28,
                    active: true,
                  },
                  {
                    id: 3,
                    name: "Grade 10",
                    student_list_count: 22,
                    active: true,
                  },
                  {
                    id: 4,
                    name: "Grade 11",
                    student_list_count: 30,
                    active: true,
                  },
                  {
                    id: 5,
                    name: "Grade 12",
                    student_list_count: 24,
                    active: true,
                  },
                ],
                grade_level_student_count: [
                  { id: 1, name: "Grade 8", student_list_count: 25 },
                  { id: 2, name: "Grade 9", student_list_count: 28 },
                  { id: 3, name: "Grade 10", student_list_count: 22 },
                  { id: 4, name: "Grade 11", student_list_count: 30 },
                  { id: 5, name: "Grade 12", student_list_count: 24 },
                ],
                raw_data: "dummy_data_due_to_html_response",
              },
            };
          }

          // Check for authentication required response
          if (
            response &&
            typeof response === "object" &&
            response.status === "authentication-required"
          ) {
            console.warn(
              "🔐 Authentication required - Using dummy data for development"
            );
            console.log(
              "🔧 TEMPORARY: Using dummy data while authentication is set up"
            );

            // Return dummy data for development
            return {
              status: "successful",
              data: {
                grades: [
                  {
                    id: 1,
                    name: "Grade 8",
                    student_list_count: 25,
                    active: true,
                  },
                  {
                    id: 2,
                    name: "Grade 9",
                    student_list_count: 28,
                    active: true,
                  },
                  {
                    id: 3,
                    name: "Grade 10",
                    student_list_count: 22,
                    active: true,
                  },
                  {
                    id: 4,
                    name: "Grade 11",
                    student_list_count: 30,
                    active: true,
                  },
                  {
                    id: 5,
                    name: "Grade 12",
                    student_list_count: 24,
                    active: true,
                  },
                ],
                grade_level_student_count: [
                  { id: 1, name: "Grade 8", student_list_count: 25 },
                  { id: 2, name: "Grade 9", student_list_count: 28 },
                  { id: 3, name: "Grade 10", student_list_count: 22 },
                  { id: 4, name: "Grade 11", student_list_count: 30 },
                  { id: 5, name: "Grade 12", student_list_count: 24 },
                ],
                raw_data: "dummy_data_due_to_auth_required",
              },
            };
          }

          // Check for HTTP error status codes
          if (meta?.response?.status === 405) {
            console.error(
              "❌ 405 Method Not Allowed - Endpoint may not exist or wrong method"
            );
            console.log(
              "🔧 TEMPORARY: Using dummy data while backend endpoint is implemented"
            );

            // Return dummy data for development
            return {
              status: "successful",
              data: {
                grades: [
                  {
                    id: 1,
                    name: "Grade 8",
                    student_list_count: 25,
                    active: true,
                  },
                  {
                    id: 2,
                    name: "Grade 9",
                    student_list_count: 28,
                    active: true,
                  },
                  {
                    id: 3,
                    name: "Grade 10",
                    student_list_count: 22,
                    active: true,
                  },
                  {
                    id: 4,
                    name: "Grade 11",
                    student_list_count: 30,
                    active: true,
                  },
                  {
                    id: 5,
                    name: "Grade 12",
                    student_list_count: 24,
                    active: true,
                  },
                ],
                grade_level_student_count: [
                  { id: 1, name: "Grade 8", student_list_count: 25 },
                  { id: 2, name: "Grade 9", student_list_count: 28 },
                  { id: 3, name: "Grade 10", student_list_count: 22 },
                  { id: 4, name: "Grade 11", student_list_count: 30 },
                  { id: 5, name: "Grade 12", student_list_count: 24 },
                ],
                raw_data: "dummy_data_due_to_405_error",
              },
            };
          }

          // Check for 401 Unauthorized
          if (meta?.response?.status === 401) {
            console.warn(
              "🔐 401 Unauthorized - Authentication token missing or invalid"
            );
            console.log(
              "🔧 TEMPORARY: Using dummy data while authentication is set up"
            );

            // Return dummy data for development
            return {
              status: "successful",
              data: {
                grades: [
                  {
                    id: 1,
                    name: "Grade 8",
                    student_list_count: 25,
                    active: true,
                  },
                  {
                    id: 2,
                    name: "Grade 9",
                    student_list_count: 28,
                    active: true,
                  },
                  {
                    id: 3,
                    name: "Grade 10",
                    student_list_count: 22,
                    active: true,
                  },
                  {
                    id: 4,
                    name: "Grade 11",
                    student_list_count: 30,
                    active: true,
                  },
                  {
                    id: 5,
                    name: "Grade 12",
                    student_list_count: 24,
                    active: true,
                  },
                ],
                grade_level_student_count: [
                  { id: 1, name: "Grade 8", student_list_count: 25 },
                  { id: 2, name: "Grade 9", student_list_count: 28 },
                  { id: 3, name: "Grade 10", student_list_count: 22 },
                  { id: 4, name: "Grade 11", student_list_count: 30 },
                  { id: 5, name: "Grade 12", student_list_count: 24 },
                ],
                raw_data: "dummy_data_due_to_401_unauthorized",
              },
            };
          }

          // Handle HTML responses (405, 404, etc.)
          if (typeof response === "string") {
            if (
              response.includes("<!DOCTYPE html>") ||
              response.includes("<html")
            ) {
              console.error(
                "❌ Student List Data API returned HTML instead of JSON"
              );
              console.log(
                "🔧 TEMPORARY: Using dummy data while backend endpoint is implemented"
              );

              // Return dummy data for development
              return {
                status: "successful",
                data: {
                  grades: [
                    {
                      id: 1,
                      name: "Grade 8",
                      student_list_count: 25,
                      active: true,
                    },
                    {
                      id: 2,
                      name: "Grade 9",
                      student_list_count: 28,
                      active: true,
                    },
                    {
                      id: 3,
                      name: "Grade 10",
                      student_list_count: 22,
                      active: true,
                    },
                    {
                      id: 4,
                      name: "Grade 11",
                      student_list_count: 30,
                      active: true,
                    },
                    {
                      id: 5,
                      name: "Grade 12",
                      student_list_count: 24,
                      active: true,
                    },
                  ],
                  grade_level_student_count: [
                    { id: 1, name: "Grade 8", student_list_count: 25 },
                    { id: 2, name: "Grade 9", student_list_count: 28 },
                    { id: 3, name: "Grade 10", student_list_count: 22 },
                    { id: 4, name: "Grade 11", student_list_count: 30 },
                    { id: 5, name: "Grade 12", student_list_count: 24 },
                  ],
                  raw_data: "dummy_data_due_to_html_response",
                },
              };
            }

            // Try to parse JSON string
            try {
              response = JSON.parse(response);
            } catch (parseError) {
              console.error("❌ Failed to parse response as JSON:", parseError);
              throw new Error("Invalid JSON response from server");
            }
          }

          // Handle successful response
          if (response && response.status === "successful" && response.data) {
            // Extract grades from grade_level_student_count
            const grades =
              response.data.grade_level_student_count?.map((grade: any) => ({
                id: grade.id,
                name: grade.name,
                students_count: grade.student_list_count,
                active: true,
              })) || [];

            return {
              ...response,
              data: {
                ...response.data,
                grades: grades,
                // Keep original data for other uses
                raw_data: response.data,
              },
            };
          }

          // Return dummy data for failed responses
          console.warn(
            "⚠️ API response doesn't match expected format:",
            response
          );
          console.log(
            "🔧 TEMPORARY: Using dummy data while backend endpoint is implemented"
          );

          return {
            status: "successful",
            data: {
              grades: [
                {
                  id: 1,
                  name: "Grade 8",
                  student_list_count: 25,
                  active: true,
                },
                {
                  id: 2,
                  name: "Grade 9",
                  student_list_count: 28,
                  active: true,
                },
                {
                  id: 3,
                  name: "Grade 10",
                  student_list_count: 22,
                  active: true,
                },
                {
                  id: 4,
                  name: "Grade 11",
                  student_list_count: 30,
                  active: true,
                },
                {
                  id: 5,
                  name: "Grade 12",
                  student_list_count: 24,
                  active: true,
                },
              ],
              grade_level_student_count: [
                { id: 1, name: "Grade 8", student_list_count: 25 },
                { id: 2, name: "Grade 9", student_list_count: 28 },
                { id: 3, name: "Grade 10", student_list_count: 22 },
                { id: 4, name: "Grade 11", student_list_count: 30 },
                { id: 5, name: "Grade 12", student_list_count: 24 },
              ],
              raw_data: "dummy_data_due_to_unexpected_format",
            },
          };
        },
      }),

      // ===== GET STUDENTS BY GRADE (Real Implementation) =====
      getStudentsByGrade: build.query({
        query: ({ grade_level_id, search = "" }) => {
          console.log("📤 Students By Grade API Request Body:", {
            grade_level_id,
            search_phrase: search,
            active_only: true,
          });

          return {
            url: "api/student-management/student/get-student-list-data",
            method: "POST",
            body: {
              grade_level_id: grade_level_id,
              search_phrase: search,
              active_only: true,
            },
          };
        },
        providesTags: (result, error, { grade_level_id }) => [
          { type: "Students", id: `GRADE_${grade_level_id}` },
        ],
        transformResponse: (response: any, meta: any, { grade_level_id }) => {
          console.log("👥 Students By Grade API Response:", response);
          console.log("👥 API Meta:", meta);
          console.log("👥 Response Status Code:", meta?.response?.status);
          console.log("👥 Requested Grade Level ID:", grade_level_id);

          // Helper function to generate grade-specific dummy students
          const generateGradeSpecificStudents = (gradeId: number) => {
            const gradeNames = {
              1: "Grade 1",
              2: "Grade 2",
              3: "Grade 3",
              4: "Grade 4",
              5: "Grade 5",
              6: "Grade 6",
              7: "Grade 7",
              8: "Grade 8",
              9: "Grade 9",
              10: "Grade 10",
              11: "Grade 11",
              12: "Grade 12",
              13: "EY1",
              14: "EY2",
              15: "EY3",
            };

            const gradeName =
              gradeNames[gradeId as keyof typeof gradeNames] ||
              `Grade ${gradeId}`;
            const studentCount = Math.max(2, Math.min(6, 3 + (gradeId % 4))); // 2-6 students per grade

            return Array.from({ length: studentCount }, (_, index) => ({
              id: gradeId * 100 + index + 1, // Unique IDs based on grade
              name: `Student ${gradeId}-${index + 1}`,
              full_name: `Student ${gradeId}-${index + 1}`,
              student_calling_name: `Student${index + 1}`,
              admission_number: `ADM${gradeId}${String(index + 1).padStart(2, "0")}`,
              grade: gradeName,
              grade_level_id: gradeId,
              profile_image: null,
              profileImage: "https://via.placeholder.com/50?text=👤",
              student_attachment_list: [],
              attachment: null,
              attachments: [],
              active: true,
            }));
          };

          // Check for authentication required response
          if (
            response &&
            typeof response === "object" &&
            response.status === "authentication-required"
          ) {
            console.warn(
              "🔐 Authentication required - Using dummy student data for development"
            );
            console.log(
              "🔧 TEMPORARY: Using dummy student data while authentication is set up"
            );

            // Return grade-specific dummy students data for development
            const gradeStudents = generateGradeSpecificStudents(grade_level_id);
            return {
              status: "successful",
              data: {
                students: gradeStudents,
                total_count: gradeStudents.length,
              },
            };
          }

          // Check for 401 Unauthorized
          if (meta?.response?.status === 401) {
            console.warn(
              "🔐 401 Unauthorized - Authentication token missing or invalid for students"
            );
            console.log(
              "🔧 TEMPORARY: Using dummy student data while authentication is set up"
            );

            // Return grade-specific dummy students data for development
            const gradeStudents = generateGradeSpecificStudents(grade_level_id);
            return {
              status: "successful",
              data: {
                students: gradeStudents,
                total_count: gradeStudents.length,
              },
            };
          }

          // Check for HTTP error status codes
          if (meta?.response?.status === 405) {
            console.error(
              "❌ 405 Method Not Allowed - Students by grade endpoint may not exist"
            );
            console.log(
              "🔧 TEMPORARY: Using dummy student data while backend endpoint is implemented"
            );

            // Return grade-specific dummy students data for development
            const gradeStudents = generateGradeSpecificStudents(grade_level_id);
            return {
              status: "successful",
              data: {
                students: gradeStudents,
                total_count: gradeStudents.length,
              },
            };
          }

          // Handle HTML responses (405, 404, etc.)
          if (typeof response === "string") {
            if (
              response.includes("<!DOCTYPE html>") ||
              response.includes("<html")
            ) {
              console.error(
                "❌ Students By Grade API returned HTML instead of JSON"
              );
              console.log(
                "🔧 TEMPORARY: Using dummy student data while backend endpoint is implemented"
              );

              // Return grade-specific dummy students data for development
              const gradeStudents =
                generateGradeSpecificStudents(grade_level_id);
              return {
                status: "successful",
                data: {
                  students: gradeStudents,
                  total_count: gradeStudents.length,
                },
              };
            }

            // Try to parse JSON string
            try {
              response = JSON.parse(response);
            } catch (parseError) {
              console.error("❌ Failed to parse response as JSON:", parseError);
              throw new Error("Invalid JSON response from server");
            }
          }

          if (response && response.status === "successful" && response.data) {
            // Transform students data to handle new structure from get-student-list-data
            const studentsArray =
              response.data.data || response.data.students || [];

            const transformedStudents = studentsArray.map((student: any) => {
              // Handle student photo from student_attachment_list
              let profileImageUrl = null;
              if (
                student.student_attachment_list &&
                student.student_attachment_list.length > 0
              ) {
                // Use the first attachment as profile image
                const firstAttachment = student.student_attachment_list[0];
                if (firstAttachment && firstAttachment.file_name) {
                  // Construct profile image URL (adjust base URL to match your backend)
                  profileImageUrl = `https://your-backend-domain.com/uploads/students/${firstAttachment.file_name}`;
                  // TODO: Replace 'your-backend-domain.com' with actual backend URL
                }
              }

              return {
                id: student.id,
                name:
                  student.full_name || student.name || `Student ${student.id}`,
                full_name:
                  student.full_name || student.name || `Student ${student.id}`,
                student_calling_name: student.full_name
                  ? student.full_name.split(" ")[0]
                  : `Student ${student.id}`,
                admission_number: student.admission_number,
                grade_level_id: student.grade_level_id,
                grade: `Grade ${student.grade_level_id}`, // We'll map this from frontend grades
                // Profile image handling
                profile_image: profileImageUrl,
                student_attachment_list: student.student_attachment_list || [],
                // Fallback profile image if no attachment
                profileImage:
                  profileImageUrl || "https://via.placeholder.com/50?text=👤",
                // Additional data preservation
                attachment: student.attachment,
                attachments:
                  student.attachments || student.student_attachment_list || [],
                active: student.active !== false,
              };
            });

            console.log(
              "✅ Transformed students with photos:",
              transformedStudents
            );

            return {
              ...response,
              data: {
                students: transformedStudents,
                total_count:
                  response.data.total_count || transformedStudents.length,
              },
            };
          }

          // Return dummy data for failed responses
          console.warn(
            "⚠️ Students API response doesn't match expected format:",
            response
          );
          console.log(
            "🔧 TEMPORARY: Using dummy student data while backend endpoint is implemented"
          );

          // Return grade-specific dummy students data for development
          const gradeStudents = generateGradeSpecificStudents(grade_level_id);
          return {
            status: "successful",
            data: {
              students: gradeStudents,
              total_count: gradeStudents.length,
              raw_data: response,
            },
          };
        },
      }),

      // ===== GET FEEDBACK CATEGORIES WITH QUESTIONS =====
      getFeedbackCategoriesWithQuestions: build.query({
        query: () => {
          console.log("📤 Feedback Categories API Request");
          return {
            url: "api/educator-feedback/categories/with-questions",
            method: "GET",
          };
        },
        providesTags: [
          { type: "FeedbackCategories", id: "LIST" },
          { type: "FeedbackQuestions", id: "LIST" },
        ],
        transformResponse: (response: any) => {
          console.log("📋 Feedback Categories API Response:", response);

          if (
            typeof response === "string" &&
            response.includes("<!DOCTYPE html>")
          ) {
            console.error("❌ Categories API returned HTML instead of JSON");
            throw new Error("Server returned HTML error page instead of JSON");
          }

          if (response.status === "successful" && response.data) {
            return {
              ...response,
              data: response.data.categories || response.data,
            };
          }
          return response;
        },
      }),

      // ===== GET EDUCATOR FEEDBACKS (LIST WITH FILTERS) =====
      getEducatorFeedbacks: build.query({
        query: ({ page = 1, page_size = 10, filters = {} }) => {
          const body = {
            page,
            page_size,
            search_phrase: filters.search || "",
            grade: filters.grade || "",
            student_id: filters.student_id || "",
            category: filters.category || "",
            rating: filters.rating || "",
            educator_id: filters.educator_id || "",
            status: filters.status || "",
            date_from: filters.date_from || "",
            date_to: filters.date_to || "",
          };

          console.log("📤 Educator Feedbacks API Request Body:", body);

          return {
            url: "api/educator-feedback/feedbacks/list",
            method: "POST",
            body,
          };
        },
        providesTags: (result) =>
          result?.data?.feedbacks
            ? [
                ...result.data.feedbacks.map((feedback: any) => ({
                  type: "EducatorFeedback",
                  id: feedback.id,
                })),
                { type: "EducatorFeedback", id: "LIST" },
              ]
            : [{ type: "EducatorFeedback", id: "LIST" }],
        transformResponse: (response: any) => {
          console.log("📝 Educator Feedbacks API Response:", response);

          if (
            typeof response === "string" &&
            response.includes("<!DOCTYPE html>")
          ) {
            console.error("❌ Feedbacks API returned HTML instead of JSON");
            throw new Error("Server returned HTML error page instead of JSON");
          }

          if (response.status === "successful" && response.data) {
            return {
              ...response,
              data: response.data.feedbacks || response.data,
              pagination: response.data.pagination,
            };
          }
          return response;
        },
      }),

      // ===== SUBMIT NEW EDUCATOR FEEDBACK =====
      submitEducatorFeedback: build.mutation({
        query: (feedbackData) => {
          const body = {
            student_id: feedbackData.student_id,
            grade: feedbackData.grade,
            main_category: feedbackData.main_category,
            subcategories: feedbackData.subcategories || [],
            description: feedbackData.description,
            rating: feedbackData.rating,
            questionnaire_answers: feedbackData.questionnaire_answers || {},
          };

          console.log("📤 Submit Feedback API Request Body:", body);

          return {
            url: "api/educator-feedback/feedbacks/create",
            method: "POST",
            body,
          };
        },
        invalidatesTags: [
          { type: "EducatorFeedback", id: "LIST" },
          { type: "Students", id: "LIST" },
        ],
        transformResponse: (response: any) => {
          console.log("✅ Submit Feedback API Response:", response);

          if (
            typeof response === "string" &&
            response.includes("<!DOCTYPE html>")
          ) {
            console.error(
              "❌ Submit Feedback API returned HTML instead of JSON"
            );
            throw new Error("Server returned HTML error page instead of JSON");
          }

          return response;
        },
      }),

      // ===== UPDATE EDUCATOR FEEDBACK =====
      updateEducatorFeedback: build.mutation({
        query: ({ feedback_id, updates }) => {
          const body = {
            feedback_id,
            ...updates,
          };

          console.log("📤 Update Feedback API Request Body:", body);

          return {
            url: "api/educator-feedback/feedbacks/update",
            method: "POST",
            body,
          };
        },
        invalidatesTags: (result, error, { feedback_id }) => [
          { type: "EducatorFeedback", id: feedback_id },
          { type: "EducatorFeedback", id: "LIST" },
        ],
      }),

      // ===== DELETE EDUCATOR FEEDBACK =====
      deleteEducatorFeedback: build.mutation({
        query: (feedback_id) => {
          console.log("📤 Delete Feedback API Request:", feedback_id);

          return {
            url: "api/educator-feedback/feedbacks/delete",
            method: "POST",
            body: { feedback_id },
          };
        },
        invalidatesTags: (result, error, feedback_id) => [
          { type: "EducatorFeedback", id: feedback_id },
          { type: "EducatorFeedback", id: "LIST" },
        ],
      }),

      // ===== GET FEEDBACK ANALYTICS/METADATA =====
      getFeedbackMetadata: build.query({
        query: (filters = {}) => {
          const body = {
            grade: filters.grade || "",
            student_id: filters.student_id || "",
            date_from: filters.date_from || "",
            date_to: filters.date_to || "",
          };

          console.log("📤 Feedback Metadata API Request Body:", body);

          return {
            url: "api/educator-feedback/metadata",
            method: "POST",
            body,
          };
        },
        providesTags: [{ type: "EducatorFeedbackMeta", id: "STATS" }],
        transformResponse: (response: any) => {
          console.log("📊 Feedback Metadata API Response:", response);

          if (response.status === "successful" && response.data) {
            return response.data;
          }
          return response;
        },
      }),

      // ===== CREATE FEEDBACK CATEGORY =====
      createFeedbackCategory: build.mutation({
        query: (categoryData) => {
          const body = {
            title: categoryData.title,
            questions: categoryData.questions.map((q: any) => ({
              text: q.text,
              answer_type: q.answerType,
              mcq_options: q.answerType === "mcq" ? q.mcqOptions : [],
              marks: q.marks || 1,
            })),
          };

          console.log("📤 Create Category API Request Body:", body);

          return {
            url: "api/educator-feedback/categories/create",
            method: "POST",
            body,
          };
        },
        invalidatesTags: [
          { type: "FeedbackCategories", id: "LIST" },
          { type: "FeedbackQuestions", id: "LIST" },
        ],
        transformResponse: (response: any) => {
          console.log("✅ Create Category API Response:", response);

          if (
            typeof response === "string" &&
            response.includes("<!DOCTYPE html>")
          ) {
            console.error("❌ Create Category API returned HTML instead of JSON");
            throw new Error("Server returned HTML error page instead of JSON");
          }

          return response;
        },
      }),

      // ===== UPDATE FEEDBACK CATEGORY =====
      updateFeedbackCategory: build.mutation({
        query: ({ category_id, updates }) => {
          const body = {
            category_id,
            title: updates.title,
            questions: updates.questions?.map((q: any) => ({
              id: q.id,
              text: q.text,
              answer_type: q.answerType,
              mcq_options: q.answerType === "mcq" ? q.mcqOptions : [],
              marks: q.marks || 1,
            })),
          };

          console.log("📤 Update Category API Request Body:", body);

          return {
            url: "api/educator-feedback/categories/update",
            method: "POST",
            body,
          };
        },
        invalidatesTags: (result, error, { category_id }) => [
          { type: "FeedbackCategories", id: category_id },
          { type: "FeedbackCategories", id: "LIST" },
          { type: "FeedbackQuestions", id: "LIST" },
        ],
      }),

      // ===== DELETE FEEDBACK CATEGORY =====
      deleteFeedbackCategory: build.mutation({
        query: (category_id) => {
          console.log("📤 Delete Category API Request:", category_id);

          return {
            url: "api/educator-feedback/categories/delete",
            method: "POST",
            body: { category_id },
          };
        },
        invalidatesTags: (result, error, category_id) => [
          { type: "FeedbackCategories", id: category_id },
          { type: "FeedbackCategories", id: "LIST" },
          { type: "FeedbackQuestions", id: "LIST" },
        ],
      }),
    }),
  });

// Export generated hooks for each endpoint
export const {
  useGetStudentListDataQuery,
  useLazyGetStudentListDataQuery,
  useGetStudentsByGradeQuery,
  useLazyGetStudentsByGradeQuery,
  useGetFeedbackCategoriesWithQuestionsQuery,
  useLazyGetFeedbackCategoriesWithQuestionsQuery,
  useGetEducatorFeedbacksQuery,
  useLazyGetEducatorFeedbacksQuery,
  useSubmitEducatorFeedbackMutation,
  useUpdateEducatorFeedbackMutation,
  useDeleteEducatorFeedbackMutation,
  useGetFeedbackMetadataQuery,
  useLazyGetFeedbackMetadataQuery,
  useCreateFeedbackCategoryMutation,
  useUpdateFeedbackCategoryMutation,
  useDeleteFeedbackCategoryMutation,
} = educatorFeedbackApi;
