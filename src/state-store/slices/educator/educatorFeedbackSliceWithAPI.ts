import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  educatorFeedbackApi,
  useGetStudentListDataQuery,
  useGetStudentsByGradeQuery,
  useGetFeedbackCategoriesWithQuestionsQuery,
  useGetEducatorFeedbacksQuery,
  useSubmitEducatorFeedbackMutation,
} from "@/api/educator-feedback-api";

// ===== ASYNC THUNKS FOR COMPLEX OPERATIONS =====

// Fetch initial data (grades, categories) for form setup
export const fetchInitialFeedbackData = createAsyncThunk(
  "educatorFeedback/fetchInitialData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Trigger API calls for initial data
      const studentListPromise = dispatch(educatorFeedbackApi.endpoints.getStudentListData.initiate());
      const categoriesPromise = dispatch(educatorFeedbackApi.endpoints.getFeedbackCategoriesWithQuestions.initiate());

      const [studentListResult, categoriesResult] = await Promise.all([
        studentListPromise,
        categoriesPromise,
      ]);

      // Cleanup RTK Query cache subscriptions
      studentListPromise.unsubscribe();
      categoriesPromise.unsubscribe();

      if (studentListResult.error) {
        throw new Error(studentListResult.error.data?.message || "Failed to fetch student data");
      }

      if (categoriesResult.error) {
        throw new Error(categoriesResult.error.data?.message || "Failed to fetch categories");
      }

      return {
        grades: studentListResult.data?.data?.grades || [],
        categories: categoriesResult.data?.data || [],
        rawStudentData: studentListResult.data?.data || {}
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch initial data");
    }
  }
);

// Submit feedback with questionnaire validation
export const submitFeedbackWithValidation = createAsyncThunk(
  "educatorFeedback/submitWithValidation",
  async (feedbackData: any, { dispatch, rejectWithValue }) => {
    try {
      // Validate required fields
      const missingFields = [];
      
      if (!feedbackData.grade) missingFields.push("Grade");
      if (!feedbackData.student_id) missingFields.push("Student");
      if (!feedbackData.main_category) missingFields.push("Main Category");
      if (!feedbackData.description?.trim()) missingFields.push("Description");

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Calculate rating from questionnaire answers if not provided
      if (!feedbackData.rating && feedbackData.questionnaire_answers) {
        const answers = Object.values(feedbackData.questionnaire_answers);
        const validAnswers = answers.filter((answer: any) => 
          answer.marks !== undefined && answer.marks > 0
        );
        
        if (validAnswers.length > 0) {
          const totalMarks = validAnswers.reduce((sum: number, answer: any) => 
            sum + answer.marks, 0
          );
          feedbackData.rating = Math.round((totalMarks / validAnswers.length) * 10) / 10;
        }
      }

      // Submit via API
      const result = await dispatch(
        educatorFeedbackApi.endpoints.submitEducatorFeedback.initiate(feedbackData)
      );

      if (result.error) {
        throw new Error(result.error.data?.message || "Failed to submit feedback");
      }

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit feedback");
    }
  }
);

// ===== SLICE DEFINITION =====

interface EducatorFeedbackState {
  // Form Data
  grades: Array<{
    id: number;
    name: string;
    students_count: number;
    active: boolean;
  }>;
  categories: Array<{
    id: string;
    name: string;
    subcategories: string[];
    questions: Array<{
      id: string;
      question: string;
      answer_type: 'scale' | 'predefined' | 'custom';
      options?: Array<{ text: string; marks: number }>;
    }>;
  }>;
  students: Array<{
    id: string;
    name: string;
    admission_number: string;
    grade: string;
    profile_image?: string;
  }>;
  rawStudentData: any; // Store the complete response from the API
  
  // Form State
  selectedGrade: string;
  selectedStudent: any;
  selectedCategory: string;
  selectedSubcategories: string[];
  questionnaireAnswers: { [key: string]: any };
  calculatedRating: number;
  
  // List Data
  feedbacks: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  
  // Filters
  filters: {
    search: string;
    grade: string;
    category: string;
    rating: string;
    educator: string;
    status: string;
    dateFrom: string;
    dateTo: string;
  };
  
  // Loading States
  loading: boolean;
  submitting: boolean;
  loadingInitialData: boolean;
  
  // Error States
  error: string | null;
  submitError: string | null;
  initialDataError: string | null;
}

const initialState: EducatorFeedbackState = {
  // Form Data
  grades: [],
  categories: [],
  students: [],
  rawStudentData: {},
  
  // Form State
  selectedGrade: "",
  selectedStudent: null,
  selectedCategory: "",
  selectedSubcategories: [],
  questionnaireAnswers: {},
  calculatedRating: 0,
  
  // List Data
  feedbacks: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
  },
  
  // Filters
  filters: {
    search: "",
    grade: "All",
    category: "All",
    rating: "All",
    educator: "All",
    status: "All",
    dateFrom: "",
    dateTo: "",
  },
  
  // Loading States
  loading: false,
  submitting: false,
  loadingInitialData: false,
  
  // Error States
  error: null,
  submitError: null,
  initialDataError: null,
};

const educatorFeedbackSlice = createSlice({
  name: "educatorFeedback",
  initialState,
  reducers: {
    // Form Actions
    setSelectedGrade: (state, action) => {
      state.selectedGrade = action.payload;
      state.selectedStudent = null; // Clear student when grade changes
    },
    
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategories = []; // Clear subcategories when main category changes
      state.questionnaireAnswers = {}; // Clear questionnaire answers
      state.calculatedRating = 0;
    },
    
    setSelectedSubcategories: (state, action) => {
      state.selectedSubcategories = action.payload;
    },
    
    updateQuestionnaireAnswer: (state, action) => {
      const { questionId, answer, marks } = action.payload;
      state.questionnaireAnswers[questionId] = { answer, marks };
      
      // Recalculate rating
      const answers = Object.values(state.questionnaireAnswers);
      const validAnswers = answers.filter((answer: any) => 
        answer.marks !== undefined && answer.marks > 0
      );
      
      if (validAnswers.length > 0) {
        const totalMarks = validAnswers.reduce((sum: number, answer: any) => 
          sum + answer.marks, 0
        );
        state.calculatedRating = Math.round((totalMarks / validAnswers.length) * 10) / 10;
      } else {
        state.calculatedRating = 0;
      }
    },
    
    clearForm: (state) => {
      state.selectedGrade = "";
      state.selectedStudent = null;
      state.selectedCategory = "";
      state.selectedSubcategories = [];
      state.questionnaireAnswers = {};
      state.calculatedRating = 0;
    },
    
    // List Actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    
    // Error Actions
    clearErrors: (state) => {
      state.error = null;
      state.submitError = null;
      state.initialDataError = null;
    },
    
    clearSubmitError: (state) => {
      state.submitError = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Initial Data
      .addCase(fetchInitialFeedbackData.pending, (state) => {
        state.loadingInitialData = true;
        state.initialDataError = null;
      })
      .addCase(fetchInitialFeedbackData.fulfilled, (state, action) => {
        state.loadingInitialData = false;
        state.grades = action.payload.grades;
        state.categories = action.payload.categories;
        state.rawStudentData = action.payload.rawStudentData;
      })
      .addCase(fetchInitialFeedbackData.rejected, (state, action) => {
        state.loadingInitialData = false;
        state.initialDataError = action.payload as string;
      })
      
      // Submit Feedback with Validation
      .addCase(submitFeedbackWithValidation.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitFeedbackWithValidation.fulfilled, (state, action) => {
        state.submitting = false;
        // Clear form on successful submission
        state.selectedGrade = "";
        state.selectedStudent = null;
        state.selectedCategory = "";
        state.selectedSubcategories = [];
        state.questionnaireAnswers = {};
        state.calculatedRating = 0;
      })
      .addCase(submitFeedbackWithValidation.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });
  },
});

// Export actions
export const {
  setSelectedGrade,
  setSelectedStudent,
  setSelectedCategory,
  setSelectedSubcategories,
  updateQuestionnaireAnswer,
  clearForm,
  setFilters,
  clearFilters,
  setPage,
  clearErrors,
  clearSubmitError,
} = educatorFeedbackSlice.actions;

// Export reducer
export default educatorFeedbackSlice.reducer;

// ===== SELECTORS =====

// Form Selectors
export const selectGrades = (state: any) => state.educatorFeedback.grades;
export const selectCategories = (state: any) => state.educatorFeedback.categories;
export const selectStudents = (state: any) => state.educatorFeedback.students;
export const selectSelectedGrade = (state: any) => state.educatorFeedback.selectedGrade;
export const selectSelectedStudent = (state: any) => state.educatorFeedback.selectedStudent;
export const selectSelectedCategory = (state: any) => state.educatorFeedback.selectedCategory;
export const selectSelectedSubcategories = (state: any) => state.educatorFeedback.selectedSubcategories;
export const selectQuestionnaireAnswers = (state: any) => state.educatorFeedback.questionnaireAnswers;
export const selectCalculatedRating = (state: any) => state.educatorFeedback.calculatedRating;

// List Selectors
export const selectFeedbacks = (state: any) => state.educatorFeedback.feedbacks;
export const selectPagination = (state: any) => state.educatorFeedback.pagination;
export const selectFilters = (state: any) => state.educatorFeedback.filters;

// Loading Selectors
export const selectLoading = (state: any) => state.educatorFeedback.loading;
export const selectSubmitting = (state: any) => state.educatorFeedback.submitting;
export const selectLoadingInitialData = (state: any) => state.educatorFeedback.loadingInitialData;

// Error Selectors
export const selectError = (state: any) => state.educatorFeedback.error;
export const selectSubmitError = (state: any) => state.educatorFeedback.submitError;
export const selectInitialDataError = (state: any) => state.educatorFeedback.initialDataError;

// Computed Selectors
export const selectFormIsValid = (state: any) => {
  const { selectedGrade, selectedStudent, selectedCategory } = state.educatorFeedback;
  return !!(selectedGrade && selectedStudent && selectedCategory);
};

export const selectCategoryQuestions = (state: any) => {
  const { categories, selectedCategory } = state.educatorFeedback;
  const category = categories.find((cat: any) => cat.name === selectedCategory);
  return category?.questions || [];
};

export const selectSubcategoriesForSelectedCategory = (state: any) => {
  const { categories, selectedCategory } = state.educatorFeedback;
  const category = categories.find((cat: any) => cat.name === selectedCategory);
  return category?.subcategories || [];
};

// Get students by grade from raw data (mock implementation until backend provides actual student data)
export const selectStudentsByGrade = (state: any, gradeId: number) => {
  const { rawStudentData } = state.educatorFeedback;
  
  // Since the current API doesn't return student details, we'll create mock students based on the grade
  const selectedGrade = rawStudentData.grade_level_student_count?.find((g: any) => g.id === gradeId);
  
  if (!selectedGrade) return [];
  
  // Generate mock student data until backend provides real student details
  const students = [];
  for (let i = 1; i <= selectedGrade.student_list_count; i++) {
    students.push({
      id: `${gradeId}_student_${i}`,
      name: `Student ${i}`,
      admission_number: `ADM${String(gradeId).padStart(2, '0')}${String(i).padStart(3, '0')}`,
      grade: selectedGrade.name,
      profile_image: `https://via.placeholder.com/50?text=S${i}`,
    });
  }
  
  return students;
};

// Get students by grade name (helper)
export const selectStudentsByGradeName = (state: any, gradeName: string) => {
  const { rawStudentData } = state.educatorFeedback;
  const selectedGrade = rawStudentData.grade_level_student_count?.find((g: any) => g.name === gradeName);
  
  if (!selectedGrade) return [];
  
  return selectStudentsByGrade(state, selectedGrade.id);
};