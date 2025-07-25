# API Integration Changes Summary

## Overview
Updated the educator feedback system to use the existing `/api/student-management/student/get-student-list-data` API instead of creating separate grade and student endpoints.

## Changes Made

### 1. **API Layer Updates** (`src/api/educator-feedback-api.ts`)

#### Replaced:
- ❌ `getGradesList: build.query` - Separate grades endpoint
- ❌ `getStudentsByGrade: build.query` - Separate students endpoint  

#### With:
- ✅ `getStudentListData: build.query` - Single unified endpoint
- ✅ `getStudentsByGrade: build.query` - Updated to use new endpoint structure

#### Key Changes:
```typescript
// OLD: Two separate API calls
getGradesList: build.query({
  url: "api/educator-feedback/grades/list",
  method: "GET",
})

getStudentsByGrade: build.query({
  url: "api/educator-feedback/students/by-grade", 
  method: "POST",
  body: { grade, search_phrase: search, active_only: true }
})

// NEW: Single API call + derived endpoint
getStudentListData: build.query({
  url: "api/student-management/student/get-student-list-data",
  method: "GET",
  transformResponse: (response) => {
    // Extract grades from grade_level_student_count
    const grades = response.data.grade_level_student_count?.map((grade) => ({
      id: grade.id,
      name: grade.name,
      students_count: grade.student_list_count,
      active: true
    })) || [];
    
    return { ...response, data: { ...response.data, grades } };
  }
})

getStudentsByGrade: build.query({
  url: "api/student-management/student/get-students-by-grade",
  method: "POST", 
  body: { grade_level_id, search_phrase, active_only }
})
```

### 2. **Redux Slice Updates** (`src/state-store/slices/educator/educatorFeedbackSliceWithAPI.ts`)

#### Updated Interface:
```typescript
interface EducatorFeedbackState {
  grades: Array<{
    id: number;        // Changed from string to number
    name: string;
    students_count: number;
    active: boolean;   // Added active field
  }>;
  rawStudentData: any; // Added to store complete API response
  // ... rest unchanged
}
```

#### Updated Initial Data Fetching:
```typescript
// OLD: Separate API calls
const gradesPromise = dispatch(educatorFeedbackApi.endpoints.getGradesList.initiate());
const categoriesPromise = dispatch(educatorFeedbackApi.endpoints.getFeedbackCategoriesWithQuestions.initiate());

// NEW: Unified student data + categories
const studentListPromise = dispatch(educatorFeedbackApi.endpoints.getStudentListData.initiate());
const categoriesPromise = dispatch(educatorFeedbackApi.endpoints.getFeedbackCategoriesWithQuestions.initiate());
```

#### Added New Selectors:
```typescript
// Get students by grade ID from raw data
export const selectStudentsByGrade = (state: any, gradeId: number) => {
  const { rawStudentData } = state.educatorFeedback;
  const selectedGrade = rawStudentData.grade_level_student_count?.find((g: any) => g.id === gradeId);
  
  if (!selectedGrade) return [];
  
  // Generate mock students until backend provides real student details
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

// Helper to get students by grade name
export const selectStudentsByGradeName = (state: any, gradeName: string) => {
  const { rawStudentData } = state.educatorFeedback;
  const selectedGrade = rawStudentData.grade_level_student_count?.find((g: any) => g.name === gradeName);
  
  if (!selectedGrade) return [];
  
  return selectStudentsByGrade(state, selectedGrade.id);
};
```

### 3. **Hook Updates**

#### Replaced:
```typescript
// OLD
import { 
  useGetGradesListQuery,
  useGetStudentsByGradeQuery,
  // ...
} from "../../api/educator-feedback-api";

// NEW  
import { 
  useGetStudentListDataQuery,
  useGetStudentsByGradeQuery, // Updated implementation
  // ...
} from "../../api/educator-feedback-api";
```

#### Updated Usage:
```typescript
// OLD: Two separate queries
const { data: gradesData } = useGetGradesListQuery();
const { data: studentsData } = useGetStudentsByGradeQuery({ 
  grade: selectedGradeForStudent 
});

// NEW: One primary query + derived query
const { data: studentListData } = useGetStudentListDataQuery();
const selectedGradeId = studentListData?.data?.grades?.find((g: any) => 
  g.name === selectedGradeForStudent
)?.id;

const { data: studentsData } = useGetStudentsByGradeQuery({ 
  grade_id: selectedGradeId 
}, { 
  skip: !selectedGradeId 
});
```

### 4. **Backend Requirements Updated**

#### API Endpoints Required:
1. ✅ **Existing:** `GET /api/student-management/student/get-student-list-data`
2. ✅ **New:** `POST /api/student-management/student/get-students-by-grade` 
3. ✅ **Keep:** `GET /api/educator-feedback/categories/with-questions`
4. ✅ **Keep:** All other feedback management endpoints

#### Expected Response Format:
```json
{
  "status": "successful",
  "data": {
    "grade_level_student_count": [
      {
        "id": 1,
        "name": "Grade 1", 
        "student_list_count": 23
      }
    ],
    // ... other data as provided in sample
  }
}
```

## Benefits of This Approach

### ✅ **Advantages:**
1. **Reuses Existing API:** Leverages `/api/student-management/student/get-student-list-data`
2. **Reduces API Calls:** Single call gets grades + student counts
3. **Consistent Data:** Uses same data source as other parts of the app
4. **Backend Simplicity:** No need for new grade list endpoint

### ⚠️ **Temporary Limitations:**
1. **Mock Student Data:** Until backend provides student details by grade
2. **Additional API Call:** Still needs student details by grade endpoint

## Implementation Status

### ✅ **Completed:**
- [x] Updated API layer to use existing endpoint
- [x] Modified Redux slice for new data structure  
- [x] Added selectors for student filtering
- [x] Updated interface types
- [x] Documented backend requirements

### 🔄 **Pending:**
- [ ] Backend implementation of `/api/student-management/student/get-students-by-grade`
- [ ] Replace mock student data with real API response
- [ ] Frontend integration testing with real data

## Migration Guide

### For Frontend:
1. Update import statements to use new hooks
2. Replace `useGetGradesListQuery()` with `useGetStudentListDataQuery()`
3. Update grade selection logic to use `grade.id` (number) instead of string
4. Use Redux selectors for student filtering when API is not available

### For Backend:
1. Ensure `/api/student-management/student/get-student-list-data` returns the expected format
2. Implement `/api/student-management/student/get-students-by-grade` endpoint
3. Return student details with profile images and complete information

## Testing Checklist

- [ ] Grade selection loads from student list data
- [ ] Student count displays correctly for each grade  
- [ ] Student filtering works by grade ID
- [ ] Mock students generate correctly until real API is ready
- [ ] Form validation includes grade selection
- [ ] Feedback submission includes grade information

This integration maintains the existing functionality while optimizing API usage and preparing for backend implementation.