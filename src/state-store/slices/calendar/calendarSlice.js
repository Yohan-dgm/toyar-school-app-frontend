import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get API base URL from environment
const getApiBaseUrl = () => {
  return (
    process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 || "http://192.168.1.14:9999"
  );
};

// ===== BACKEND API DOCUMENTATION FOR CALENDAR ENDPOINTS =====

/**
 * 📋 BACKEND DEVELOPMENT GUIDE - CALENDAR API ENDPOINTS
 *
 * This file contains 5 calendar-related API endpoints that need to be implemented in Laravel backend.
 * Each endpoint should return events in a consistent JSON structure for proper frontend integration.
 *
 * 🔐 AUTHENTICATION: All endpoints require Bearer token authentication
 * 📝 REQUEST METHOD: All endpoints use POST method with JSON body
 * 🎯 RESPONSE FORMAT: All endpoints should return arrays of event objects
 *
 * ==================================================================================
 *
 * 📅 1. GENERAL EVENTS ENDPOINT
 * URL: POST /api/calendar-management/event/get-event-list-data
 * Purpose: Fetch general school events visible to all users
 *
 * REQUEST BODY:
 * {
 *   "logInUserId": 43  // Current user's ID for filtering private events
 * }
 *
 * EXPECTED RESPONSE STRUCTURE:
 * [
 *   {
 *     "id": 1,
 *     "title": "School Sports Day",
 *     "description": "Annual sports competition for all grades",
 *     "start_date": "2025-02-15",           // Format: YYYY-MM-DD
 *     "end_date": "2025-02-15",             // Format: YYYY-MM-DD (can be same as start_date)
 *     "start_time": "09:00:00",             // Format: HH:MM:SS (optional)
 *     "end_time": "16:00:00",               // Format: HH:MM:SS (optional)
 *     "event_category": "Sports",           // Category for filtering/grouping
 *     "visibility_type": "Public",          // "Public", "Private", "Parent & Guardian"
 *     "created_by_user_id": 5,              // User who created the event
 *     "school_id": 1,                       // School identifier
 *     "location": "Main Playground",        // Event location (optional)
 *     "created_at": "2025-01-15T10:30:00Z", // ISO timestamp
 *     "updated_at": "2025-01-15T10:30:00Z"  // ISO timestamp
 *   }
 * ]
 *
 * VISIBILITY RULES:
 * - "Public": Show to everyone
 * - "Private": Show only to creator (created_by_user_id === logInUserId)
 * - "Parent & Guardian": Show only to parents/guardians
 *
 * ==================================================================================
 *
 * 📚 2. SPECIAL CLASSES ENDPOINT
 * URL: POST /api/calendar-management/special-class/get-event-list-data
 * Purpose: Fetch special class schedules (extra classes, makeup classes, etc.)
 *
 * REQUEST BODY:
 * {
 *   "logInUserId": 43
 * }
 *
 * EXPECTED RESPONSE STRUCTURE:
 * [
 *   {
 *     "id": 2,
 *     "title": "Extra Math Class - Grade 5",
 *     "description": "Additional mathematics practice session",
 *     "start_date": "2025-02-20",
 *     "end_date": "2025-02-20",
 *     "start_time": "14:00:00",
 *     "end_time": "15:30:00",
 *     "event_category": "Academic",
 *     "visibility_type": "Public",
 *     "grade_level_id": 5,                  // Associated grade level
 *     "class_id": 5,                        // Associated class
 *     "subject": "Mathematics",             // Subject name
 *     "teacher_id": 12,                     // Teacher conducting the class
 *     "classroom": "Room 205",              // Classroom location
 *     "created_at": "2025-01-16T09:00:00Z",
 *     "updated_at": "2025-01-16T09:00:00Z"
 *   }
 * ]
 *
 * ==================================================================================
 *
 * 📝 3. EXAM SCHEDULES ENDPOINT
 * URL: POST /api/calendar-management/exam-schedules/get-event-list-data
 * Purpose: Fetch examination schedules and test dates
 *
 * REQUEST BODY:
 * {
 *   "logInUserId": 43
 * }
 *
 * EXPECTED RESPONSE STRUCTURE:
 * [
 *   {
 *     "id": 3,
 *     "title": "Mid-Term Mathematics Exam",
 *     "description": "Grade 5 mathematics mid-term examination",
 *     "start_date": "2025-03-10",
 *     "end_date": "2025-03-10",
 *     "start_time": "09:00:00",
 *     "end_time": "11:00:00",
 *     "event_category": "Exam",
 *     "visibility_type": "Public",
 *     "exam_type": "Mid-Term",              // "Mid-Term", "Final", "Quiz", "Assignment"
 *     "subject": "Mathematics",
 *     "grade_level_id": 5,
 *     "class_id": 5,
 *     "duration_minutes": 120,              // Exam duration
 *     "total_marks": 100,                   // Maximum marks
 *     "exam_hall": "Main Hall A",           // Examination venue
 *     "invigilator_id": 8,                  // Teacher supervising
 *     "created_at": "2025-01-20T11:00:00Z",
 *     "updated_at": "2025-01-20T11:00:00Z"
 *   }
 * ]
 *
 * ==================================================================================
 *
 * 👨‍🏫 4. EDUCATOR FEEDBACK ENDPOINT
 * URL: POST /api/calendar-management/educator-feedback/get-evoluation-process-list-data
 * Purpose: Fetch scheduled educator feedback sessions and evaluation meetings
 *
 * REQUEST BODY:
 * {
 *   "logInUserId": 43
 * }
 *
 * EXPECTED RESPONSE STRUCTURE:
 * [
 *   {
 *     "id": 4,
 *     "title": "Parent-Teacher Conference - Sayul",
 *     "description": "Quarterly progress discussion for student Sayul",
 *     "start_date": "2025-02-25",
 *     "end_date": "2025-02-25",
 *     "start_time": "15:00:00",
 *     "end_time": "15:30:00",
 *     "event_category": "Meeting",
 *     "visibility_type": "Parent & Guardian",
 *     "student_id": 1,                      // Student being discussed
 *     "teacher_id": 10,                     // Teacher providing feedback
 *     "parent_id": 43,                      // Parent/guardian attending
 *     "meeting_type": "Progress Review",    // "Progress Review", "Behavioral", "Academic"
 *     "meeting_room": "Conference Room B",  // Meeting location
 *     "agenda": "Discuss academic progress and areas for improvement",
 *     "status": "Scheduled",                // "Scheduled", "Completed", "Cancelled"
 *     "created_at": "2025-01-18T14:00:00Z",
 *     "updated_at": "2025-01-18T14:00:00Z"
 *   }
 * ]
 *
 * ==================================================================================
 *
 * 👪 5. PARENT MEETINGS ENDPOINT
 * URL: POST /api/calendar-management/parent-meeting/get-event-list-data
 * Purpose: Fetch parent meeting schedules and school community events
 *
 * REQUEST BODY:
 * {
 *   "logInUserId": 43
 * }
 *
 * EXPECTED RESPONSE STRUCTURE:
 * [
 *   {
 *     "id": 5,
 *     "title": "Monthly Parent Committee Meeting",
 *     "description": "Discussion on school policies and upcoming events",
 *     "start_date": "2025-03-05",
 *     "end_date": "2025-03-05",
 *     "start_time": "18:00:00",
 *     "end_time": "20:00:00",
 *     "event_category": "Meeting",
 *     "visibility_type": "Parent & Guardian",
 *     "meeting_type": "Committee",          // "Committee", "General", "Emergency", "Social"
 *     "organizer_id": 2,                    // Staff member organizing
 *     "venue": "School Auditorium",         // Meeting venue
 *     "agenda": "Budget review, upcoming events planning, policy updates",
 *     "max_attendees": 50,                  // Maximum capacity (optional)
 *     "rsvp_required": true,                // Whether RSVP is needed
 *     "rsvp_deadline": "2025-03-03",        // RSVP deadline date
 *     "contact_person": "Mrs. Silva",       // Contact for inquiries
 *     "contact_phone": "+94771234567",      // Contact phone
 *     "created_at": "2025-01-22T16:00:00Z",
 *     "updated_at": "2025-01-22T16:00:00Z"
 *   }
 * ]
 *
 * ==================================================================================
 *
 * 🔧 BACKEND IMPLEMENTATION NOTES:
 *
 * 1. AUTHENTICATION:
 *    - All endpoints require Bearer token in Authorization header
 *    - Validate token and extract user information
 *
 * 2. FILTERING:
 *    - Filter events based on visibility_type and user permissions
 *    - Private events: show only to creator
 *    - Parent & Guardian events: show only to parents/guardians
 *    - Public events: show to everyone
 *
 * 3. DATE HANDLING:
 *    - Store dates in YYYY-MM-DD format
 *    - Store times in HH:MM:SS format (24-hour)
 *    - Use UTC timestamps for created_at/updated_at
 *
 * 4. ERROR HANDLING:
 *    - Return 200 with empty array [] if no events found
 *    - Return 401 for invalid/expired tokens
 *    - Return 500 for server errors
 *
 * 5. PERFORMANCE:
 *    - Consider pagination for large datasets
 *    - Add database indexes on date fields and user_id
 *    - Cache frequently accessed data
 *
 * 6. VALIDATION:
 *    - Validate logInUserId exists and is numeric
 *    - Validate date formats and ranges
 *    - Sanitize input data to prevent SQL injection
 *
 * 7. DATABASE SCHEMA SUGGESTIONS:
 *    - events table: id, title, description, start_date, end_date, start_time, end_time,
 *                   event_category, visibility_type, created_by_user_id, school_id, location
 *    - special_classes table: extends events with grade_level_id, class_id, subject, teacher_id, classroom
 *    - exam_schedules table: extends events with exam_type, subject, grade_level_id, class_id,
 *                           duration_minutes, total_marks, exam_hall, invigilator_id
 *    - educator_feedback table: extends events with student_id, teacher_id, parent_id,
 *                               meeting_type, meeting_room, agenda, status
 *    - parent_meetings table: extends events with meeting_type, organizer_id, venue, agenda,
 *                            max_attendees, rsvp_required, rsvp_deadline, contact_person, contact_phone
 *
 * 8. SAMPLE LARAVEL CONTROLLER STRUCTURE:
 *    ```php
 *    public function getEventListData(Request $request) {
 *        $logInUserId = $request->input('logInUserId');
 *
 *        $events = Event::where(function($query) use ($logInUserId) {
 *            $query->where('visibility_type', 'Public')
 *                  ->orWhere(function($subQuery) use ($logInUserId) {
 *                      $subQuery->where('visibility_type', 'Private')
 *                               ->where('created_by_user_id', $logInUserId);
 *                  })
 *                  ->orWhere('visibility_type', 'Parent & Guardian');
 *        })->orderBy('start_date', 'asc')->get();
 *
 *        return response()->json($events);
 *    }
 *    ```
 *
 * ==================================================================================
 */

// ===== ASYNC THUNKS FOR EACH CALENDAR API ENDPOINT =====

/**
 * Fetch General Events
 *
 * API RESPONSE STRUCTURE:
 * {
 *   "status": "successful",
 *   "message": "",
 *   "data": {
 *     "data": [array of events],
 *     "total": 24,
 *     "event_count": 24
 *   }
 * }
 *
 * FILTERING LOGIC:
 * - Private events: Show only if created_by_user_id === current user ID
 * - Public events: Show to everyone
 * - Parent & Guardian events: Show to parents/guardians
 * - All Student & Educator: Show to all users
 *
 * DATA NORMALIZATION:
 * - Maps backend event structure to frontend calendar format
 * - Handles HTML descriptions by stripping tags for display
 * - Converts time formats and ensures proper date handling
 * - Adds source identifier for debugging
 */
export const fetchGeneralEvents = createAsyncThunk(
  "calendar/fetchGeneralEvents",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { user, token } = state.app;
      const userId = user?.id || user?.user_id;

      console.log("📅 Fetching General Events...", {
        userId,
        hasToken: !!token,
        apiUrl: `${getApiBaseUrl()}/api/calendar-management/event/get-event-list-data`,
      });

      // Send POST request with logInUserId in body as per backend requirement
      const response = await axios.post(
        `${getApiBaseUrl()}/api/calendar-management/event/get-event-list-data`,
        {
          logInUserId: userId, // Backend expects this parameter
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📅 General Events API Response:", {
        status: response.data.status,
        totalEvents: response.data.data?.total || 0,
        eventCount: response.data.data?.event_count || 0,
      });

      // Extract events from nested data structure: response.data.data.data
      const events = response.data?.data?.data || [];

      if (!Array.isArray(events)) {
        console.warn("📅 Expected events array, got:", typeof events);
        return [];
      }

      // Apply visibility filtering based on user permissions
      const filteredEvents = events.filter((event) => {
        const visibility = event.visibility_type?.toLowerCase();

        // Private events: only show to creator
        if (visibility === "private") {
          return event.created_by_user_id === userId;
        }

        // Public events: show to everyone
        if (visibility === "public") {
          return true;
        }

        // Parent & Guardian events: show to parents (user_category = 1)
        if (visibility === "parent & guardian") {
          return state.app.user?.user_category === 1; // Parent category
        }

        // All Student & Educator: show to all users
        if (visibility === "all student & educator") {
          return true;
        }

        // Default: show event if visibility type is unknown
        return true;
      });

      console.log(
        `📅 Filtered ${filteredEvents.length} general events from ${events.length} total events`
      );

      // Normalize events to match frontend calendar structure
      const normalizedEvents = filteredEvents.map((event) => {
        // Strip HTML tags from description for clean display
        const cleanDescription = event.description
          ? event.description.replace(/<[^>]*>/g, "").trim()
          : null;

        return {
          id: event.id,
          title: event.title,
          description: cleanDescription,
          start_date: event.start_date,
          end_date: event.end_date,
          start_time: event.start_time,
          end_time: event.end_time,
          event_category: event.event_category,
          visibility_type: event.visibility_type,
          created_by_user_id: event.created_by_user_id,
          school_id: event.school_id,
          location: event.location,
          created_at: event.created_at,
          updated_at: event.updated_at,
          // Frontend-specific fields
          source: "general_events",
          type: "event",
          // For calendar display
          dateString: event.start_date,
          isMultiDay: event.start_date !== event.end_date,
          // Original data for reference
          originalData: event,
        };
      });

      console.log("📅 Normalized events sample:", normalizedEvents.slice(0, 2));

      return normalizedEvents;
    } catch (error) {
      console.log("📅 General events endpoint error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      return []; // Return empty array for graceful error handling
    }
  }
);

/**
 * Fetch Special Classes
 * Endpoint: GET /api/calendar-management/special-class/get-special-class-list-data
 *
 * BACKEND DOCUMENTATION:
 * This endpoint fetches special class schedules (extra classes, makeup classes, etc.)
 *
 * EXPECTED RESPONSE STRUCTURE:
 * {
 *   "status": "successful",
 *   "message": "",
 *   "data": {
 *     "data": [
 *       {
 *         "id": 1,
 *         "class_name": "Extra Math Class - Grade 5",
 *         "title": "Mathematics Review Session",
 *         "description": "Additional mathematics practice session",
 *         "special_class_date": "2025-02-20",        // Acts as both start and end date
 *         "start_time": "14:00:00",
 *         "end_time": "15:30:00",
 *         "program": "Academic Support",
 *         "subject": "Mathematics",
 *         "instructor_id": 12,
 *         "location": "Room 205",
 *         "max_students": 25,
 *         "enrolled_students": 18,
 *         "visibility_type": "Public",
 *         "is_active": true,
 *         "created_at": "2025-01-15T10:30:00Z",
 *         "updated_at": "2025-01-15T10:30:00Z"
 *       }
 *     ]
 *   }
 * }
 */
export const fetchSpecialClasses = createAsyncThunk(
  "calendar/fetchSpecialClasses",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { token, user } = state.app;

      console.log("📅 Fetching Special Classes...", {
        apiUrl: `${getApiBaseUrl()}/api/calendar-management/special-class/get-special-class-list-data`,
        userId: user?.id,
      });

      const response = await axios.post(
        `${getApiBaseUrl()}/api/calendar-management/special-class/get-special-class-list-data`,
        {
          logInUserId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📅 Special Classes API Response:", {
        status: response.data.status,
        totalClasses: response.data.data?.data?.length || 0,
      });

      // Extract special classes from nested data structure: response.data.data.data
      const specialClasses = response.data?.data?.data || [];

      if (!Array.isArray(specialClasses)) {
        console.warn(
          "📅 Expected special classes array, got:",
          typeof specialClasses
        );
        return [];
      }

      // Normalize special class data to match frontend calendar structure
      const normalizedClasses = specialClasses.map((classItem) => {
        // Strip HTML tags from description for clean display
        const cleanDescription = classItem.description
          ? classItem.description.replace(/<[^>]*>/g, "").trim()
          : null;

        return {
          id: classItem.id,
          title: classItem.title || classItem.class_name || "Special Class",
          description: cleanDescription,
          start_date: classItem.start_date || classItem.class_date,
          end_date: classItem.end_date || classItem.class_date, // Same as start_date for single-day classes
          start_time: classItem.start_time,
          end_time: classItem.end_time,
          instructor: classItem.instructor,
          subject: classItem.subject,
          instructor_id: classItem.instructor_id,
          location: classItem.location,
          max_students: classItem.max_students,
          enrolled_students: classItem.enrolled_students,
          visibility_type: classItem.visibility_type || "Public",
          is_active: classItem.is_active,
          created_at: classItem.created_at,
          updated_at: classItem.updated_at,
          created_by_user_id: classItem.created_by_user_id,
          // Frontend-specific fields
          source: "special_classes",
          type: "class",
          // For calendar display
          dateString: classItem.start_date || classItem.class_date,
          isMultiDay: false, // Special classes are typically single-day events
          // Original data for reference
          originalData: classItem,
        };
      });

      console.log(
        `📅 Normalized special classes sample:`,
        normalizedClasses.slice(0, 2)
      );
      console.log(`📅 Loaded ${normalizedClasses.length} special classes`);

      return normalizedClasses;
    } catch (error) {
      console.log("📅 Special classes endpoint not available:", error.message);
      return []; // Return empty array instead of rejecting
    }
  }
);

/**
 * Fetch Exam Schedules
 * Endpoint: GET /api/calendar-management/exam-schedules/get-event-list-data
 */
export const fetchExamSchedules = createAsyncThunk(
  "calendar/fetchExamSchedules",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { token } = state.app;

      console.log("📅 Fetching Exam Schedules...");

      const response = await axios.get(
        `${getApiBaseUrl()}/api/calendar-management/exam-schedules/get-event-list-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📅 Exam Schedules API Response:", response.data);

      const exams = response.data?.data || response.data || [];

      return exams.map((exam) => ({
        ...exam,
        source: "exam_schedules",
        type: "exam",
        title: exam.title || exam.exam_name || exam.name,
      }));
    } catch (error) {
      console.log("📅 Exam schedules endpoint not available:", error.message);
      return []; // Return empty array instead of rejecting
    }
  }
);

/**
 * Fetch Educator Feedback
 * Endpoint: GET /api/calendar-management/educator-feedback/get-evoluation-process-list-data
 */
export const fetchEducatorFeedback = createAsyncThunk(
  "calendar/fetchEducatorFeedback",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { token } = state.app;

      console.log("📅 Fetching Educator Feedback...");

      const response = await axios.get(
        `${getApiBaseUrl()}/api/calendar-management/educator-feedback/get-evoluation-process-list-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📅 Educator Feedback API Response:", response.data);

      const feedback = response.data?.data || response.data || [];

      return feedback.map((item) => ({
        ...item,
        source: "educator_feedback",
        type: "feedback",
        title: item.title || item.feedback_title || item.name,
      }));
    } catch (error) {
      console.log(
        "📅 Educator feedback endpoint not available:",
        error.message
      );
      return []; // Return empty array instead of rejecting
    }
  }
);

/**
 * Fetch Parent Meetings
 * Endpoint: GET /api/calendar-management/parent-meeting/get-event-list-data
 */
export const fetchParentMeetings = createAsyncThunk(
  "calendar/fetchParentMeetings",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { token } = state.app;

      console.log("📅 Fetching Parent Meetings...");

      const response = await axios.get(
        `${getApiBaseUrl()}/api/calendar-management/parent-meeting/get-event-list-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📅 Parent Meetings API Response:", response.data);

      const meetings = response.data?.data || response.data || [];

      return meetings.map((meeting) => ({
        ...meeting,
        source: "parent_meetings",
        type: "meeting",
        title: meeting.title || meeting.meeting_title || meeting.name,
      }));
    } catch (error) {
      console.log("📅 Parent meetings endpoint not available:", error.message);
      return []; // Return empty array instead of rejecting
    }
  }
);

/**
 * Fetch Holidays
 *
 * API RESPONSE STRUCTURE:
 * {
 *   "status": "successful",
 *   "data": {
 *     "data": [
 *       {
 *         "id": 3,
 *         "title": "Holiday 3",
 *         "date": "2025-04-30",
 *         "description": null,
 *         "created_by_user_id": 42,
 *         "holiday_type": "School",
 *         "is_recurring": false,
 *         "start_date": "2025-04-30",
 *         "end_date": "2025-04-30",
 *         "created_at": "2025-01-16T10:00:00Z",
 *         "updated_at": "2025-01-16T10:00:00Z"
 *       }
 *     ],
 *     "total": 1,
 *     "holiday_count": 1
 *   }
 * }
 *
 * HOLIDAY NORMALIZATION:
 * - Maps holiday data to calendar event format
 * - Sets type as "holiday" for proper styling
 * - Uses start_date as primary date field
 * - Handles multi-day holidays with start_date and end_date
 * - Sets visibility as "Public" since holidays are for everyone
 */
export const fetchHolidays = createAsyncThunk(
  "calendar/fetchHolidays",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { user, token } = state.app;
      const userId = user?.id || user?.user_id;

      console.log("📅 Fetching Holidays...", {
        userId,
        hasToken: !!token,
        apiUrl: `${getApiBaseUrl()}/api/calendar-management/holiday/get-holiday-list-data`,
      });

      // Send POST request with logInUserId in body as per backend requirement
      const response = await axios.post(
        `${getApiBaseUrl()}/api/calendar-management/holiday/get-holiday-list-data`,
        {
          logInUserId: userId, // Backend expects this parameter
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📅 Holidays API Response:", {
        status: response.data.status,
        totalHolidays: response.data.data?.total || 0,
        holidayCount: response.data.data?.holiday_count || 0,
      });

      // Extract holidays from nested data structure: response.data.data.data
      const holidays = response.data?.data?.data || [];

      if (!Array.isArray(holidays)) {
        console.warn("📅 Expected holidays array, got:", typeof holidays);
        return [];
      }

      // Normalize holidays to match calendar event structure
      const normalizedHolidays = holidays.map((holiday) => {
        // Clean description by removing HTML tags if present
        const cleanDescription = holiday.description
          ? holiday.description.replace(/<[^>]*>/g, "").trim()
          : "";

        return {
          id: holiday.id,
          title: holiday.title || holiday.holiday_name,
          description: cleanDescription,
          start_date: holiday.start_date || holiday.date,
          end_date: holiday.end_date || holiday.date,
          start_time: null, // Holidays are typically all-day events
          end_time: null,
          holiday_type: holiday.holiday_type,
          is_recurring: holiday.is_recurring,
          visibility_type: "Public", // Holidays are public for everyone
          created_by_user_id: holiday.created_by_user_id,
          created_at: holiday.created_at,
          updated_at: holiday.updated_at,
          // Frontend-specific fields
          source: "holidays",
          type: "holiday",
          // For calendar display
          dateString: holiday.start_date || holiday.date,
          isMultiDay:
            (holiday.start_date || holiday.date) !==
            (holiday.end_date || holiday.date),
          // Original data for reference
          originalData: holiday,
        };
      });

      console.log(
        "📅 Normalized holidays sample:",
        normalizedHolidays.slice(0, 2)
      );

      return normalizedHolidays;
    } catch (error) {
      console.log("📅 Holidays endpoint error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      return []; // Return empty array for graceful error handling
    }
  }
);

/**
 * Fetch All Calendar Data
 * This thunk fetches data from all 6 endpoints and merges them
 */
export const fetchAllCalendarData = createAsyncThunk(
  "calendar/fetchAllCalendarData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("📅 Fetching all calendar data from 6 endpoints...");

      // Dispatch all API calls concurrently
      const results = await Promise.allSettled([
        dispatch(fetchGeneralEvents()).unwrap(),
        dispatch(fetchSpecialClasses()).unwrap(),
        dispatch(fetchExamSchedules()).unwrap(),
        dispatch(fetchEducatorFeedback()).unwrap(),
        dispatch(fetchParentMeetings()).unwrap(),
        dispatch(fetchHolidays()).unwrap(),
      ]);

      // Process results and collect successful data
      const allEvents = [];
      const errors = [];

      results.forEach((result, index) => {
        const sources = [
          "general_events",
          "special_classes",
          "exam_schedules",
          "educator_feedback",
          "parent_meetings",
          "holidays",
        ];

        if (result.status === "fulfilled") {
          allEvents.push(...result.value);
          console.log(
            `📅 Successfully fetched ${result.value.length} items from ${sources[index]}`
          );
        } else {
          console.error(`📅 Failed to fetch ${sources[index]}:`, result.reason);
          errors.push({ source: sources[index], error: result.reason });
        }
      });

      console.log(`📅 Total merged events: ${allEvents.length}`);

      return {
        events: allEvents,
        errors: errors.length > 0 ? errors : null,
      };
    } catch (error) {
      console.error("📅 Error in fetchAllCalendarData:", error);
      return rejectWithValue(error.message || "Failed to fetch calendar data");
    }
  }
);

// ===== HELPER FUNCTIONS =====

/**
 * Normalize event data to match the dummy JSON structure
 * This ensures all events have consistent fields regardless of source
 */
const normalizeEventData = (event) => {
  // Generate a unique ID if not present
  const id =
    event.id ||
    event.event_id ||
    `${event.source}_${Date.now()}_${Math.random()}`;

  // Normalize date format (ensure YYYY-MM-DD format)
  let date = event.date || event.start_date || event.event_date;
  if (date && !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Try to parse and format the date
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate.toISOString().split("T")[0];
    }
  }

  // Normalize time format
  const time = event.time || event.start_time || event.event_time || "All day";

  // Normalize other fields
  return {
    id,
    title: event.title || event.name || event.event_title || "Untitled Event",
    date: date || new Date().toISOString().split("T")[0],
    time,
    type: event.type || "event",
    subject: event.subject || event.category || "General",
    teacher:
      event.teacher || event.instructor || event.created_by_name || "Staff",
    location: event.location || event.venue || "TBD",
    description: event.description || event.details || "",
    grade: event.grade || event.class || "All Grades",
    duration: event.duration || "1 hour",
    materials: event.materials || [],
    source: event.source,
    // Keep original data for reference
    originalData: event,
  };
};

// ===== CALENDAR SLICE DEFINITION =====

// Calendar state structure
const initialState = {
  events: [],
  generalEvents: [],
  specialClasses: [],
  examSchedules: [],
  educatorFeedback: [],
  parentMeetings: [],
  holidays: [],
  loading: false,
  loadingGeneralEvents: false,
  loadingSpecialClasses: false,
  loadingExamSchedules: false,
  loadingEducatorFeedback: false,
  loadingParentMeetings: false,
  loadingHolidays: false,
  error: null,
  errors: null,
  lastFetched: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // Clear all calendar data
    clearCalendarData: (state) => {
      state.events = [];
      state.generalEvents = [];
      state.specialClasses = [];
      state.examSchedules = [];
      state.educatorFeedback = [];
      state.parentMeetings = [];
      state.holidays = [];
      state.error = null;
      state.errors = null;
      state.lastFetched = null;
      console.log("📅 Calendar data cleared");
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.errors = null;
    },

    // Set loading state manually if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ===== FETCH ALL CALENDAR DATA =====
    builder
      .addCase(fetchAllCalendarData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errors = null;
        console.log("📅 Starting to fetch all calendar data...");
      })
      .addCase(fetchAllCalendarData.fulfilled, (state, action) => {
        state.loading = false;
        const { events, errors } = action.payload;

        // Normalize all events to match dummy JSON structure
        state.events = events.map(normalizeEventData);
        state.errors = errors;
        state.lastFetched = new Date().toISOString();

        console.log(
          `📅 Successfully loaded ${state.events.length} normalized events`
        );
        if (errors && errors.length > 0) {
          console.warn("📅 Some API endpoints failed:", errors);
        }
      })
      .addCase(fetchAllCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch calendar data";
        console.error("📅 Failed to fetch calendar data:", state.error);
      })

      // ===== INDIVIDUAL THUNK HANDLERS =====

      // General Events
      .addCase(fetchGeneralEvents.pending, (state) => {
        state.loadingGeneralEvents = true;
      })
      .addCase(fetchGeneralEvents.fulfilled, (state, action) => {
        state.loadingGeneralEvents = false;
        state.generalEvents = action.payload;
        console.log(`📅 Loaded ${action.payload.length} general events`);
      })
      .addCase(fetchGeneralEvents.rejected, (state, action) => {
        state.loadingGeneralEvents = false;
        console.error("📅 Failed to fetch general events:", action.payload);
      })

      // Special Classes
      .addCase(fetchSpecialClasses.pending, (state) => {
        state.loadingSpecialClasses = true;
      })
      .addCase(fetchSpecialClasses.fulfilled, (state, action) => {
        state.loadingSpecialClasses = false;
        state.specialClasses = action.payload;
        console.log(`📅 Loaded ${action.payload.length} special classes`);
      })
      .addCase(fetchSpecialClasses.rejected, (state, action) => {
        state.loadingSpecialClasses = false;
        console.error("📅 Failed to fetch special classes:", action.payload);
      })

      // Exam Schedules
      .addCase(fetchExamSchedules.pending, (state) => {
        state.loadingExamSchedules = true;
      })
      .addCase(fetchExamSchedules.fulfilled, (state, action) => {
        state.loadingExamSchedules = false;
        state.examSchedules = action.payload;
        console.log(`📅 Loaded ${action.payload.length} exam schedules`);
      })
      .addCase(fetchExamSchedules.rejected, (state, action) => {
        state.loadingExamSchedules = false;
        console.error("📅 Failed to fetch exam schedules:", action.payload);
      })

      // Educator Feedback
      .addCase(fetchEducatorFeedback.pending, (state) => {
        state.loadingEducatorFeedback = true;
      })
      .addCase(fetchEducatorFeedback.fulfilled, (state, action) => {
        state.loadingEducatorFeedback = false;
        state.educatorFeedback = action.payload;
        console.log(
          `📅 Loaded ${action.payload.length} educator feedback items`
        );
      })
      .addCase(fetchEducatorFeedback.rejected, (state, action) => {
        state.loadingEducatorFeedback = false;
        console.error("📅 Failed to fetch educator feedback:", action.payload);
      })

      // Parent Meetings
      .addCase(fetchParentMeetings.pending, (state) => {
        state.loadingParentMeetings = true;
      })
      .addCase(fetchParentMeetings.fulfilled, (state, action) => {
        state.loadingParentMeetings = false;
        state.parentMeetings = action.payload;
        console.log(`📅 Loaded ${action.payload.length} parent meetings`);
      })
      .addCase(fetchParentMeetings.rejected, (state, action) => {
        state.loadingParentMeetings = false;
        console.error("📅 Failed to fetch parent meetings:", action.payload);
      })

      // Holidays
      .addCase(fetchHolidays.pending, (state) => {
        state.loadingHolidays = true;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loadingHolidays = false;
        state.holidays = action.payload;
        console.log(`📅 Loaded ${action.payload.length} holidays`);
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loadingHolidays = false;
        console.error("📅 Failed to fetch holidays:", action.payload);
      });
  },
});

// ===== EXPORT ACTIONS AND REDUCER =====

export const { clearCalendarData, clearErrors, setLoading } =
  calendarSlice.actions;

export default calendarSlice.reducer;

// ===== SELECTORS =====

// Get all events (normalized and merged)
export const selectAllEvents = (state) => state.calendar.events;

// Get events by date
export const selectEventsByDate = (state, date) =>
  state.calendar.events.filter((event) => event.date === date);

// Get events by month
export const selectEventsByMonth = (state, month, year) =>
  state.calendar.events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });

// Get events by type
export const selectEventsByType = (state, type) =>
  state.calendar.events.filter((event) => event.type === type);

// Get loading state
export const selectCalendarLoading = (state) => state.calendar.loading;

// Get error state
export const selectCalendarError = (state) => state.calendar.error;

// Get all errors (including individual endpoint errors)
export const selectCalendarErrors = (state) => state.calendar.errors;

// Get last fetched timestamp
export const selectLastFetched = (state) => state.calendar.lastFetched;

// Get individual source data (for debugging)
export const selectGeneralEvents = (state) => state.calendar.generalEvents;
export const selectSpecialClasses = (state) => state.calendar.specialClasses;
export const selectExamSchedules = (state) => state.calendar.examSchedules;
export const selectEducatorFeedback = (state) =>
  state.calendar.educatorFeedback;
export const selectParentMeetings = (state) => state.calendar.parentMeetings;
export const selectHolidays = (state) => state.calendar.holidays;

// Get individual loading states
export const selectIndividualLoadingStates = (state) => ({
  generalEvents: state.calendar.loadingGeneralEvents,
  specialClasses: state.calendar.loadingSpecialClasses,
  examSchedules: state.calendar.loadingExamSchedules,
  educatorFeedback: state.calendar.loadingEducatorFeedback,
  parentMeetings: state.calendar.loadingParentMeetings,
  holidays: state.calendar.loadingHolidays,
});
