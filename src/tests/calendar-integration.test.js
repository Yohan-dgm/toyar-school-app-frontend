/**
 * Calendar Integration Test
 * 
 * This test verifies that the calendar Redux slice and component integration
 * works correctly with the 5 backend API endpoints.
 */

import { configureStore } from '@reduxjs/toolkit';
import calendarSlice, {
  fetchAllCalendarData,
  fetchGeneralEvents,
  fetchSpecialClasses,
  fetchExamSchedules,
  fetchEducatorFeedback,
  fetchParentMeetings,
  selectAllEvents,
  selectCalendarLoading,
  selectCalendarError,
} from '../state-store/slices/calendar/calendarSlice';

// Mock axios for testing
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios;

// Mock app slice state
const mockAppState = {
  app: {
    user: { id: 123, user_id: 123 },
    token: 'mock-bearer-token',
  },
};

// Create test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      calendar: calendarSlice,
      app: (state = mockAppState.app) => state,
    },
  });
};

describe('Calendar Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('Calendar Slice', () => {
    test('should have correct initial state', () => {
      const state = store.getState();
      expect(state.calendar.events).toEqual([]);
      expect(state.calendar.loading).toBe(false);
      expect(state.calendar.error).toBe(null);
    });

    test('should handle loading state correctly', () => {
      store.dispatch(fetchAllCalendarData.pending());
      const state = store.getState();
      expect(state.calendar.loading).toBe(true);
      expect(state.calendar.error).toBe(null);
    });
  });

  describe('API Integration', () => {
    test('should fetch general events successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              title: 'Test Event',
              date: '2025-07-15',
              time: '09:00 AM',
              visibility_type: 'public',
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await store.dispatch(fetchGeneralEvents());
      expect(result.type).toBe('calendar/fetchGeneralEvents/fulfilled');
      expect(result.payload).toHaveLength(1);
      expect(result.payload[0].source).toBe('general_events');
    });

    test('should filter private events correctly', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              title: 'Public Event',
              visibility_type: 'public',
            },
            {
              id: 2,
              title: 'Private Event - Mine',
              visibility_type: 'private',
              created_by: 123, // Same as mock user ID
            },
            {
              id: 3,
              title: 'Private Event - Others',
              visibility_type: 'private',
              created_by: 456, // Different user ID
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await store.dispatch(fetchGeneralEvents());
      expect(result.payload).toHaveLength(2); // Should exclude the other user's private event
      expect(result.payload.find(e => e.title === 'Private Event - Others')).toBeUndefined();
    });

    test('should handle API errors gracefully', async () => {
      const mockError = {
        response: {
          data: { message: 'API Error' },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      const result = await store.dispatch(fetchGeneralEvents());
      expect(result.type).toBe('calendar/fetchGeneralEvents/rejected');
      expect(result.payload).toBe('API Error');
    });
  });

  describe('Data Normalization', () => {
    test('should normalize events from all sources', async () => {
      // Mock responses for all 5 endpoints
      const mockResponses = [
        { data: { data: [{ id: 1, title: 'General Event', date: '2025-07-15' }] } },
        { data: { data: [{ id: 2, class_name: 'Special Class', date: '2025-07-16' }] } },
        { data: { data: [{ id: 3, exam_name: 'Math Exam', date: '2025-07-17' }] } },
        { data: { data: [{ id: 4, feedback_title: 'Feedback', date: '2025-07-18' }] } },
        { data: { data: [{ id: 5, meeting_title: 'Parent Meeting', date: '2025-07-19' }] } },
      ];

      mockedAxios.get
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1])
        .mockResolvedValueOnce(mockResponses[2])
        .mockResolvedValueOnce(mockResponses[3])
        .mockResolvedValueOnce(mockResponses[4]);

      const result = await store.dispatch(fetchAllCalendarData());
      expect(result.type).toBe('calendar/fetchAllCalendarData/fulfilled');
      
      const { events } = result.payload;
      expect(events).toHaveLength(5);
      
      // Check that all events have normalized structure
      events.forEach(event => {
        expect(event).toHaveProperty('source');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('title');
      });
      
      // Check specific source types
      expect(events.find(e => e.source === 'general_events')).toBeDefined();
      expect(events.find(e => e.source === 'special_classes')).toBeDefined();
      expect(events.find(e => e.source === 'exam_schedules')).toBeDefined();
      expect(events.find(e => e.source === 'educator_feedback')).toBeDefined();
      expect(events.find(e => e.source === 'parent_meetings')).toBeDefined();
    });
  });

  describe('Selectors', () => {
    test('should select all events correctly', () => {
      const mockEvents = [
        { id: 1, title: 'Event 1', date: '2025-07-15' },
        { id: 2, title: 'Event 2', date: '2025-07-16' },
      ];

      store.dispatch({
        type: 'calendar/fetchAllCalendarData/fulfilled',
        payload: { events: mockEvents, errors: null },
      });

      const state = store.getState();
      const events = selectAllEvents(state);
      expect(events).toEqual(mockEvents);
    });

    test('should select loading state correctly', () => {
      store.dispatch(fetchAllCalendarData.pending());
      const state = store.getState();
      expect(selectCalendarLoading(state)).toBe(true);
    });

    test('should select error state correctly', () => {
      store.dispatch(fetchAllCalendarData.rejected({ payload: 'Test error' }));
      const state = store.getState();
      expect(selectCalendarError(state)).toBe('Test error');
    });
  });
});

console.log('📅 Calendar Integration Test Suite Created');
console.log('Run with: yarn test src/tests/calendar-integration.test.js');
