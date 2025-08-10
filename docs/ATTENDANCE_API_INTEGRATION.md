# Student Attendance API Integration Guide

## Overview

This document provides comprehensive information about the frontend-backend integration for the student attendance management system. The frontend sends attendance data to the backend via the API endpoint `api/attendance-management/student-attendance/create-student-attendance`.

## API Endpoint Information

### Endpoint

```
POST /api/attendance-management/student-attendance/create-student-attendance
```

### Base URL

```
{EXPO_PUBLIC_BASE_URL_API_SERVER_1}/api/attendance-management/student-attendance/create-student-attendance
```

## Request Structure

### Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

### Request Body Schema

```json
{
  "attendance_data": [
    {
      "student_id": number,
      "grade_level_class_id": number,
      "date": "YYYY-MM-DD",
      "attendance_type_id": number,
      // "in_time": "HH:MM",     // Optional: Required for late attendance (attendance_type_id = 3)
      // "out_time": "HH:MM",    // Optional: Required for late attendance (attendance_type_id = 3)
      "notes": "string",      // Optional: Additional notes
      "reason": "string"      // Optional: Reason for absence/late
    }
  ]
}
```

### Attendance Type IDs

| ID  | Status  | Description                     | Required Fields                   |
| --- | ------- | ------------------------------- | --------------------------------- |
| 1   | Present | Student is present in class     | Basic fields only                 |
| 2   | Absent  | Student is not present in class | Basic fields + reason (optional)  |
| 3   | Late    | Student arrived late to class   | Basic fields + in_time + out_time |

### Field Descriptions

| Field                | Type   | Required | Description                                          |
| -------------------- | ------ | -------- | ---------------------------------------------------- |
| student_id           | number | Yes      | Unique identifier for the student                    |
| grade_level_class_id | number | Yes      | Unique identifier for the grade level class          |
| date                 | string | Yes      | Attendance date in YYYY-MM-DD format                 |
| attendance_type_id   | number | Yes      | Attendance status (1=present, 2=absent, 3=late)      |
| in_time              | string | No\*     | Arrival time in HH:MM format (\*Required for late)   |
| out_time             | string | No\*     | Departure time in HH:MM format (\*Required for late) |
| notes                | string | No       | Additional notes or comments                         |
| reason               | string | No       | Reason for absence or late arrival                   |

## Sample Requests

### 1. Basic Attendance (Present/Absent)

```json
{
  "attendance_data": [
    {
      "student_id": 1001,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 1,
      "notes": "Regular attendance"
    },
    {
      "student_id": 1002,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 2,
      "reason": "illness",
      "notes": "Student reported sick"
    }
  ]
}
```

### 2. Late Attendance with Times

```json
{
  "attendance_data": [
    {
      "student_id": 1003,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 3,
      "in_time": "08:15",
      "out_time": "13:00",
      "reason": "transport",
      "notes": "Bus was delayed due to traffic"
    }
  ]
}
```

### 3. Bulk Attendance Submission

```json
{
  "attendance_data": [
    {
      "student_id": 1001,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 1
    },
    {
      "student_id": 1002,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 1
    },
    {
      "student_id": 1003,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 2,
      "reason": "family"
    },
    {
      "student_id": 1004,
      "grade_level_class_id": 5,
      "date": "2025-01-15",
      "attendance_type_id": 3,
      "in_time": "08:30",
      "out_time": "13:00",
      "reason": "appointment"
    }
  ]
}
```

## Expected Response Structure

### Success Response (200 OK)

```json
{
  "status": "successful",
  "message": "Attendance records processed successfully",
  "data": {
    "created_count": 25,
    "updated_count": 3,
    "failed_count": 0,
    "attendance_records": [
      {
        "id": 23901,
        "date": "2025-01-15",
        "student_id": 1001,
        "attendance_type_id": 1,
        "grade_level_class_id": 5,
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      }
    ]
  },
  "metadata": {
    "is_system_update_pending": false
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "status": "error",
  "message": "Validation failed",
  "data": {
    "created_count": 0,
    "updated_count": 0,
    "failed_count": 5,
    "errors": [
      {
        "student_id": 1001,
        "error": "Missing required field: grade_level_class_id"
      },
      {
        "student_id": 1002,
        "error": "Invalid attendance_type_id: must be 1, 2, or 3"
      }
    ]
  },
  "metadata": {
    "is_system_update_pending": false
  }
}
```

## Business Rules & Validations

### Frontend Validations

1. **Required Fields**: All basic fields must be present
2. **Date Format**: Date must be in YYYY-MM-DD format
3. **Time Format**: Times must be in HH:MM format (24-hour)
4. **Late Attendance**: in_time and out_time are required when attendance_type_id = 3
5. **Time Logic**: in_time should be before out_time
6. **Reasonable Times**: Times should be within school hours (07:00-18:00)

### Backend Validations (Expected)

1. **Student Existence**: Verify student_id exists in the system
2. **Grade Class Existence**: Verify grade_level_class_id exists
3. **Date Validity**: Ensure date is not in the future (beyond current date)
4. **Duplicate Prevention**: Handle duplicate attendance records for same student/date
5. **Time Validation**: Validate time formats and logical consistency
6. **Authorization**: Ensure user has permission to mark attendance for the specified class

### Reason Codes (Optional Frontend Enhancement)

```typescript
const ABSENCE_REASONS = [
  { id: "illness", label: "Illness/Medical" },
  { id: "family", label: "Family Emergency" },
  { id: "vacation", label: "Family Vacation" },
  { id: "appointment", label: "Medical Appointment" },
  { id: "transport", label: "Transportation Issues" },
  { id: "weather", label: "Weather Conditions" },
  { id: "personal", label: "Personal Reasons" },
  { id: "other", label: "Other" },
];
```

## Error Handling

### Common Error Scenarios

1. **Network Errors**: Connection timeouts, server unavailable
2. **Validation Errors**: Invalid data format or missing required fields
3. **Authentication Errors**: Invalid or expired JWT token
4. **Authorization Errors**: User lacks permission for the operation
5. **Business Logic Errors**: Duplicate records, invalid student/class combinations

### Frontend Error Handling Strategy

```typescript
try {
  const response = await createStudentAttendance(attendanceData).unwrap();
  // Handle success
} catch (error: any) {
  const errorMessage =
    error?.data?.message ||
    error?.message ||
    "Failed to save attendance. Please try again.";
  Alert.alert("Error", errorMessage);
}
```

## Performance Considerations

### Batch Size Recommendations

- **Optimal batch size**: 50-100 students per request
- **Maximum batch size**: 200 students per request
- **For large classes**: Consider splitting into multiple requests

### Timeout Configuration

- **Request timeout**: 30 seconds
- **Retry logic**: Implement exponential backoff for failed requests

## Security Considerations

### Data Privacy

- Ensure all attendance data is transmitted over HTTPS
- Implement proper authentication and authorization
- Log access patterns for audit purposes

### Input Sanitization

- Sanitize all text inputs (notes, reason)
- Validate all numeric inputs for reasonable ranges
- Prevent SQL injection through parameterized queries

## Testing Guidelines

### Unit Tests

- Test data transformation functions
- Test validation logic
- Test error handling scenarios

### Integration Tests

- Test API endpoint with various data combinations
- Test error response handling
- Test network failure scenarios

### Sample Test Data

```json
{
  "attendance_data": [
    {
      "student_id": 999999,
      "grade_level_class_id": 1,
      "date": "2025-01-15",
      "attendance_type_id": 1
    }
  ]
}
```

## Database Schema Requirements

### Recommended Tables

```sql
-- Student Attendance Table
CREATE TABLE student_attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    grade_level_class_id BIGINT NOT NULL,
    date DATE NOT NULL,
    attendance_type_id TINYINT NOT NULL,
    in_time TIME NULL,
    out_time TIME NULL,
    notes TEXT NULL,
    reason VARCHAR(100) NULL,
    created_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_student_date (student_id, date),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (grade_level_class_id) REFERENCES grade_level_classes(id),
    FOREIGN KEY (attendance_type_id) REFERENCES attendance_types(id)
);

-- Attendance Types Table
CREATE TABLE attendance_types (
    id TINYINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

INSERT INTO attendance_types VALUES
(1, 'Present', 'Student is present in class'),
(2, 'Absent', 'Student is not present in class'),
(3, 'Late', 'Student arrived late to class');
```

## Monitoring & Logging

### Recommended Logs

- API request/response times
- Validation failures
- Error rates by endpoint
- User activity patterns

### Metrics to Track

- Average response time
- Success rate percentage
- Peak usage times
- Most common error types

---

## Contact Information

**Frontend Team**: [Your Contact Information]  
**Backend Team**: [Backend Contact Information]  
**Last Updated**: January 2025  
**Version**: 1.0

---

_This document should be updated whenever the API structure or business rules change._
