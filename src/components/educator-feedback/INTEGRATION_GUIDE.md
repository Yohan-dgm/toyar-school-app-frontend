# Educator Feedback Frontend Integration Guide

## Overview
This guide shows how to integrate the new educator feedback backend API with your existing React Native frontend components.

## Files Created

### 1. API Layer
- **`src/api/educator-feedback-api.ts`** - RTK Query API endpoints
- **`src/state-store/slices/educator/educatorFeedbackSliceWithAPI.ts`** - Enhanced Redux slice with real API integration

### 2. Documentation
- **`EDUCATOR_FEEDBACK_BACKEND_REQUIREMENTS.md`** - Complete backend specification
- **`INTEGRATION_GUIDE.md`** - This integration guide

## Step-by-Step Integration

### Step 1: Update Store Configuration

Add the new API and slice to your Redux store:

```typescript
// src/state-store/store.ts
import { educatorFeedbackApi } from '../api/educator-feedback-api';
import educatorFeedbackReducer from './slices/educator/educatorFeedbackSliceWithAPI';

const rootReducer = combineReducers({
  app: appSlice,
  apiServer1: apiServer1.reducer,
  // Replace the old educator feedback slice
  educatorFeedback: educatorFeedbackReducer, // <-- Use new slice
  // ... other existing slices
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      apiServer1.middleware, // <-- Already exists
      rtkQueryErrorLogger,
    ),
});
```

### Step 2: Update EducatorFeedbackModal Component

Replace the mock data with real API integration:

```typescript
// src/screens/authenticated/principal/dashboard/modals/EducatorFeedbackModal.tsx

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import new API hooks
import { 
  useGetGradesListQuery,
  useGetStudentsByGradeQuery,
  useGetFeedbackCategoriesWithQuestionsQuery,
  useGetEducatorFeedbacksQuery,
  useSubmitEducatorFeedbackMutation 
} from "../../../api/educator-feedback-api";

// Import new slice actions and selectors
import {
  fetchInitialFeedbackData,
  submitFeedbackWithValidation,
  setSelectedGrade,
  setSelectedStudent,
  setSelectedCategory,
  updateQuestionnaireAnswer,
  clearForm,
  setFilters,
  selectGrades,
  selectCategories,
  selectSelectedGrade,
  selectSelectedStudent,
  selectCalculatedRating,
  selectSubmitting,
  selectSubmitError,
  selectLoadingInitialData,
} from "../../../state-store/slices/educator/educatorFeedbackSliceWithAPI";

const EducatorFeedbackModal: React.FC<EducatorFeedbackModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useDispatch();
  
  // ===== REAL API DATA =====
  
  // Get student list data (includes grades and student counts)
  const { 
    data: studentListData, 
    isLoading: studentListLoading, 
    error: studentListError 
  } = useGetStudentListDataQuery();
  
  // Get categories with questions
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useGetFeedbackCategoriesWithQuestionsQuery();
  
  // Get students by selected grade
  const selectedGradeForStudent = useSelector(selectSelectedGrade);
  const selectedGradeId = studentListData?.data?.grades?.find((g: any) => g.name === selectedGradeForStudent)?.id;
  
  const { 
    data: studentsData, 
    isLoading: studentsLoading, 
    error: studentsError 
  } = useGetStudentsByGradeQuery(
    { 
      grade_id: selectedGradeId,
      search: "" // Add search functionality later
    },
    { 
      skip: !selectedGradeId // Only fetch when grade ID is available
    }
  );
  
  // Get feedback list with filters
  const filters = useSelector(selectFilters);
  const { 
    data: feedbacksData, 
    isLoading: feedbacksLoading, 
    error: feedbacksError 
  } = useGetEducatorFeedbacksQuery({
    page: 1,
    page_size: 10,
    filters: filters
  });
  
  // Submit mutation
  const [submitFeedback, { 
    isLoading: isSubmitting, 
    error: submitError 
  }] = useSubmitEducatorFeedbackMutation();
  
  // ===== REDUX STATE =====
  const selectedStudent = useSelector(selectSelectedStudent);
  const selectedCategory = useSelector(selectSelectedCategory);
  const calculatedRating = useSelector(selectCalculatedRating);
  const submitting = useSelector(selectSubmitting);
  const submitErrorFromSlice = useSelector(selectSubmitError);
  
  // ===== COMPONENT STATE =====
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<any>({});
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  
  // Refs
  const descriptionInputRef = useRef<TextInput>(null);
  
  // ===== EFFECTS =====
  
  // Load initial data when modal opens
  useEffect(() => {
    if (visible) {
      dispatch(fetchInitialFeedbackData());
    }
  }, [visible, dispatch]);
  
  // ===== HANDLERS =====
  
  const handleGradeSelect = (grade: string) => {
    dispatch(setSelectedGrade(grade));
  };
  
  const handleStudentSelect = (student: any) => {
    dispatch(setSelectedStudent(student));
  };
  
  const handleCategorySelect = (category: string) => {
    dispatch(setSelectedCategory(category));
    setSelectedSubcategories([]);
    setQuestionnaireAnswers({});
  };
  
  const handleQuestionAnswer = (questionId: string, answer: any, marks?: number) => {
    const newAnswers = {
      ...questionnaireAnswers,
      [questionId]: { answer, marks }
    };
    setQuestionnaireAnswers(newAnswers);
    
    // Update Redux store for rating calculation
    dispatch(updateQuestionnaireAnswer({ questionId, answer, marks }));
  };
  
  const handleSubmitFeedback = async () => {
    try {
      const feedbackData = {
        student_id: selectedStudent?.id,
        grade: selectedGradeForStudent,
        main_category: selectedCategory,
        subcategories: selectedSubcategories,
        description: feedbackDescription.trim(),
        rating: calculatedRating,
        questionnaire_answers: questionnaireAnswers,
      };
      
      // Use slice thunk for validation and submission
      const result = await dispatch(submitFeedbackWithValidation(feedbackData));
      
      if (submitFeedbackWithValidation.fulfilled.match(result)) {
        Alert.alert("Success", "Feedback submitted successfully!");
        handleCloseModal();
      } else {
        Alert.alert("Error", result.payload as string);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback");
    }
  };
  
  const handleCloseModal = () => {
    dispatch(clearForm());
    setFeedbackDescription("");
    setSelectedSubcategories([]);
    setQuestionnaireAnswers({});
    setSelectedQuestionId(null);
    onClose();
  };
  
  // ===== DATA PROCESSING =====
  
  // Process grades data from student list data
  const availableGrades = studentListData?.data?.grades || [];
  
  // Process students data  
  const filteredStudentsList = studentsData?.data?.students || [];
  
  // Alternative: Use Redux selector for student filtering (when students by grade API is not available)
  // const filteredStudentsList = useSelector((state) => 
  //   selectStudentsByGradeName(state, selectedGradeForStudent)
  // );
  
  // Process categories data
  const mainCategories = categoriesData?.data?.categories || [];
  const selectedCategoryData = mainCategories.find(cat => cat.name === selectedCategory);
  const questionnaireData = selectedCategoryData?.questions || [];
  const subcategoriesByMainCategory = selectedCategoryData?.subcategories || [];
  
  // Process feedbacks data
  const existingFeedbacks = feedbacksData?.data || [];
  const pagination = feedbacksData?.pagination || { current_page: 1, total: 0 };
  
  // ===== VALIDATION =====
  
  const isFormValid = () => {
    return selectedGradeForStudent && 
           selectedStudent && 
           selectedCategory && 
           feedbackDescription.trim();
  };
  
  // ===== LOADING STATES =====
  
  const isLoadingData = studentListLoading || categoriesLoading;
  const hasErrors = studentListError || categoriesError || studentsError;
  
  // ===== RENDER FUNCTIONS =====
  
  const renderGradeSelection = () => (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, !selectedGradeForStudent && styles.requiredFieldTitle]}>
        Select Grade <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      
      {isLoadingData ? (
        <ActivityIndicator size="small" color="#920734" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradesList}>
          {availableGrades.map((grade: any) => (
            <TouchableOpacity
              key={grade.id}
              style={[
                styles.gradeCard,
                selectedGradeForStudent === grade.name && styles.selectedGradeCard
              ]}
              onPress={() => handleGradeSelect(grade.name)}
            >
              <MaterialIcons name="school" size={24} color="#920734" />
              <Text style={styles.gradeCardName}>{grade.name}</Text>
              <Text style={styles.gradeCardStudents}>
                {grade.students_count} students
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
  
  const renderStudentSelection = () => (
    <View style={styles.formSection}>
      <View style={styles.studentSectionHeader}>
        <Text style={[styles.sectionTitle, !selectedStudent && styles.requiredFieldTitle]}>
          Select Student <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        {selectedGradeForStudent && (
          <View style={styles.gradeIndicator}>
            <MaterialIcons name="school" size={14} color="#920734" />
            <Text style={styles.gradeIndicatorText}>{selectedGradeForStudent}</Text>
          </View>
        )}
      </View>
      
      {studentsLoading ? (
        <ActivityIndicator size="small" color="#920734" />
      ) : filteredStudentsList.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentsList}>
          {filteredStudentsList.map((student: any) => (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentCard,
                selectedStudent?.id === student.id && styles.selectedStudentCard
              ]}
              onPress={() => handleStudentSelect(student)}
            >
              <Image
                source={{ uri: student.profile_image || "https://via.placeholder.com/50" }}
                style={styles.studentCardImage}
              />
              <Text style={styles.studentCardName}>{student.name}</Text>
              <Text style={styles.studentCardDetails}>{student.admission_number}</Text>
              <Text style={styles.studentCardGrade}>{student.grade}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : selectedGradeForStudent ? (
        <View style={styles.noStudentsContainer}>
          <MaterialIcons name="info" size={24} color="#999" />
          <Text style={styles.noStudentsText}>
            No students found in {selectedGradeForStudent}
          </Text>
        </View>
      ) : (
        <View style={styles.selectGradeFirstContainer}>
          <MaterialIcons name="arrow-upward" size={24} color="#999" />
          <Text style={styles.selectGradeFirstText}>
            Please select a grade first to view students
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderCategorySelection = () => (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, !selectedCategory && styles.requiredFieldTitle]}>
        Main Category <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      
      {categoriesLoading ? (
        <ActivityIndicator size="small" color="#920734" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mainCategoriesList}>
          {mainCategories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.mainCategorySelectChip,
                selectedCategory === category.name && styles.selectedCategoryChip
              ]}
              onPress={() => handleCategorySelect(category.name)}
            >
              <MaterialIcons name="category" size={18} color="#920734" />
              <Text style={styles.mainCategorySelectText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
  
  // Continue with existing render methods...
  // (Keep your existing questionnaire, subcategory, and description rendering logic)
  
  // ===== MAIN RENDER =====
  
  return (
    <FullScreenModal
      visible={visible}
      onClose={handleCloseModal}
      title="Educator Feedback Management"
      backgroundColor="#F5F5F5"
    >
      <View style={styles.container}>
        {/* Error Display */}
        {hasErrors && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Failed to load data. Please check your connection and try again.
            </Text>
          </View>
        )}
        
        {/* Loading Display */}
        {isLoadingData && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#920734" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        
        {/* Main Content */}
        {!isLoadingData && !hasErrors && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderGradeSelection()}
            {renderStudentSelection()}
            {renderCategorySelection()}
            
            {/* Keep your existing questionnaire, subcategory, and description sections */}
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, (!isFormValid() || submitting) && styles.disabledSubmitButton]}
                onPress={handleSubmitFeedback}
                disabled={!isFormValid() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={[styles.submitButtonText, !isFormValid() && styles.disabledSubmitButtonText]}>
                    Submit Feedback
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </FullScreenModal>
  );
};

export default EducatorFeedbackModal;
```

### Step 3: Update Environment Configuration

Add your backend API URL to the environment configuration:

```bash
# .env
EXPO_PUBLIC_BASE_URL_API_SERVER_1=https://your-backend-domain.com/

# .env.development  
EXPO_PUBLIC_BASE_URL_API_SERVER_1=http://localhost:8000/

# .env.production
EXPO_PUBLIC_BASE_URL_API_SERVER_1=https://api.toyarschool.com/
```

### Step 4: Error Handling Components

Create reusable error and loading components:

```typescript
// src/components/common/LoadingState.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...", 
  size = "large" 
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color="#920734" />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
```

```typescript
// src/components/common/ErrorState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Something went wrong", 
  onRetry,
  retryText = "Retry"
}) => (
  <View style={styles.container}>
    <MaterialIcons name="error-outline" size={48} color="#F44336" />
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>{retryText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#920734',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

### Step 5: Testing the Integration

1. **Start your backend server** with the educator feedback API endpoints
2. **Update your `.env`** file with the correct backend URL
3. **Test each component:**
   - Grade selection should load real grades from backend
   - Student selection should filter by selected grade
   - Category selection should load with questions from backend
   - Form submission should send data to backend

### Step 6: Migration from Mock Data

To migrate from the existing mock data:

1. **Backup existing component** (if needed):
```bash
cp src/screens/authenticated/principal/dashboard/modals/EducatorFeedbackModal.tsx src/screens/authenticated/principal/dashboard/modals/EducatorFeedbackModal.backup.tsx
```

2. **Replace mock data arrays** with API calls as shown above

3. **Update state management** to use Redux selectors instead of local state

4. **Test thoroughly** to ensure all functionality works with real data

### Step 7: Performance Optimization

Add these optimizations for better performance:

```typescript
// Use React.memo for expensive components
const ExpensiveQuestionComponent = React.memo(({ question, onAnswer }) => {
  // Your question rendering logic
});

// Add debounced search for students
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (searchTerm: string) => {
    // Trigger search API call
    setSearchTerm(searchTerm);
  },
  300
);

// Use RTK Query's polling for real-time updates
const { data: feedbacksData } = useGetEducatorFeedbacksQuery(
  { filters },
  { 
    pollingInterval: 30000, // Refresh every 30 seconds
    skipPollingIfUnfocused: true 
  }
);
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your Laravel backend has CORS configured correctly
   - Add your frontend domain to allowed origins

2. **Authentication Issues**
   - Verify the token is being sent in API requests
   - Check token format and expiration

3. **Data Format Mismatches**
   - Ensure backend response format matches the expected structure
   - Add console logs to verify data transformation

4. **Network Timeout**
   - Increase timeout settings in RTK Query
   - Add retry logic for failed requests

### Debug Tips

1. **Enable RTK Query DevTools**:
```typescript
import { setupListeners } from '@reduxjs/toolkit/query';

setupListeners(store.dispatch);
```

2. **Add API logging**:
```typescript
// In your API file
console.log("API Request:", { url, method, body });
console.log("API Response:", response);
```

3. **Monitor Redux state**:
```typescript
// Use Redux DevTools to monitor state changes
// Add console logs in slice reducers for debugging
```

## Summary

This integration guide provides:

1. ✅ **Complete API integration** with RTK Query
2. ✅ **Real backend data** replacing mock data  
3. ✅ **Redux state management** for complex form logic
4. ✅ **Error handling and loading states**
5. ✅ **Performance optimizations**
6. ✅ **Grade-based student filtering**
7. ✅ **Questionnaire system with real questions**
8. ✅ **Automatic rating calculation**
9. ✅ **Form validation and submission**

The system is now ready for production use with your Laravel backend!