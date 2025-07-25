import { Middleware } from "@reduxjs/toolkit";
import { setSelectedStudent } from "../slices/app-slice";
import { setCurrentStudentId } from "../slices/school-life/student-posts-slice";
import { setCurrentClassId } from "../slices/school-life/class-posts-slice";

/**
 * Middleware to handle student selection changes and refresh activity feed tabs
 * 
 * This middleware intercepts student selection actions and ensures that:
 * 1. When a student is selected, the student posts slice is updated with the new student ID
 * 2. When a student is selected, the class posts slice is updated with the new class ID
 * 3. This triggers automatic refresh of the Class and Student tabs in the activity feed
 * 
 * This ensures that all activity feed tabs stay synchronized with the currently selected student
 */
export const studentSelectionMiddleware: Middleware = (store) => (next) => (action) => {
  // Handle student selection changes
  if (setSelectedStudent.match(action)) {
    const selectedStudent = action.payload;
    
    console.log(
      `🎓 Student Selection Middleware - Processing student selection: ${selectedStudent?.student_calling_name} (ID: ${selectedStudent?.student_id})`
    );
    
    // First, let the original action proceed to update the app state
    const result = next(action);
    
    // Then update the activity feed slices to trigger refresh
    if (selectedStudent) {
      // Update student posts slice with the new student ID
      if (selectedStudent.student_id) {
        console.log(
          `🎓 Student Selection Middleware - Updating student posts slice with student ID: ${selectedStudent.student_id}`
        );
        store.dispatch(setCurrentStudentId(selectedStudent.student_id));
      }
      
      // Update class posts slice with the new class ID (if available)
      if (selectedStudent.class_id) {
        console.log(
          `🎓 Student Selection Middleware - Updating class posts slice with class ID: ${selectedStudent.class_id}`
        );
        store.dispatch(setCurrentClassId(selectedStudent.class_id));
      } else {
        console.log(
          `🎓 Student Selection Middleware - No class_id available for selected student, clearing class posts`
        );
        // Clear class posts if no class_id is available
        store.dispatch(setCurrentClassId(null));
      }
    } else {
      console.log(
        `🎓 Student Selection Middleware - No student selected, clearing activity feed slices`
      );
      // Clear both slices if no student is selected
      store.dispatch(setCurrentStudentId(null));
      store.dispatch(setCurrentClassId(null));
    }
    
    return result;
  }
  
  return next(action);
};
