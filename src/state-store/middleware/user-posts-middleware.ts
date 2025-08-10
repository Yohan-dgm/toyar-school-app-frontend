import { Middleware } from "@reduxjs/toolkit";
import {
  setUserWithPostsUpdate,
  logoutWithPostsCleanup,
  setUser,
  logout,
} from "../slices/app-slice";
import {
  setCurrentUserId as setSchoolPostsUserId,
  clearData as clearSchoolPostsData,
} from "../slices/school-life/school-posts-slice";
import {
  setCurrentUserId as setClassPostsUserId,
  clearData as clearClassPostsData,
} from "../slices/school-life/class-posts-slice";
import {
  setCurrentUserId as setStudentPostsUserId,
  clearData as clearStudentPostsData,
} from "../slices/school-life/student-posts-slice";

/**
 * Middleware to handle user-specific post state management
 *
 * This middleware intercepts user login/logout actions and ensures that:
 * 1. When a user logs in, all post slices are updated with the current user ID
 * 2. When a user logs out, all post slices are cleared of user-specific data
 *
 * This prevents like states from persisting across different user sessions
 */
export const userPostsMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Handle user login with posts update
    if (setUserWithPostsUpdate.match(action)) {
      const userData = action.payload;
      const userId = userData?.id || userData?.user_id || null;

      // First set the user data in app slice
      store.dispatch(setUser(userData));

      // Then update all post slices with the current user ID
      if (userId) {
        store.dispatch(setSchoolPostsUserId(userId));
        store.dispatch(setClassPostsUserId(userId));
        store.dispatch(setStudentPostsUserId(userId));
      }

      return next(action);
    }

    // Handle logout with posts cleanup
    if (logoutWithPostsCleanup.match(action)) {
      // First clear all post slices data
      store.dispatch(clearSchoolPostsData());
      store.dispatch(clearClassPostsData());
      store.dispatch(clearStudentPostsData());

      // Then perform the logout
      store.dispatch(logout());

      return next(action);
    }

    return next(action);
  };
