# Educator Feedback Backend API Structure

## Overview
This document outlines the complete backend API structure for the educator feedback system, including request/response formats, data models, and integration guidelines.

## Base Configuration
- **Base URL**: `EXPO_PUBLIC_BASE_URL_API_SERVER_1` environment variable
- **Authentication**: Bearer token in headers
- **Content-Type**: `application/json`
- **Method**: Primarily POST for data operations, GET for simple queries

## API Endpoints

### 1. Student Management APIs

#### Get Student List Data
**Endpoint**: `POST /api/student-management/student/get-student-list-data`

**Request Body (Grades List)**:
```json
{}
```

**Response Format**:
```json
{
  "status": "successful",
  "data": {
    "grades": [
      {
        "id": 1,
        "name": "Grade 8",
        "student_list_count": 25,
        "active": true
      }
    ],
    "grade_level_student_count": [
      {
        "id": 1,
        "name": "Grade 8", 
        "student_list_count": 25
      }
    ]
  }
}
```

#### Get Students by Grade
**Endpoint**: `POST /api/student-management/student/get-student-list-data`

**Request Body**:
```json
{
  "grade_level_id": 1,
  "search_phrase": "",
  "active_only": true
}
```

**Response Format**:
```json
{
  "status": "successful",
  "data": {
    "data": [
      {
        "id": 123,
        "full_name": "John Doe",
        "admission_number": "ADM001",
        "grade_level_id": 1,
        "student_attachment_list": [
          {
            "id": 1,
            "file_name": "profile_123.jpg",
            "file_type": "image",
            "upload_date": "2024-01-01"
          }
        ],
        "active": true
      }
    ],
    "total_count": 25
  }
}
```

### 2. Feedback Category APIs

#### Get Categories with Questions
**Endpoint**: `GET /api/educator-feedback/categories/with-questions`

**Response Format**:
```json
{
  "status": "successful",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Academic Performance",
        "description": "Academic related feedback",
        "active": true,
        "questions": [
          {
            "id": 1,
            "text": "How is the student's homework completion?",
            "answer_type": "mcq",
            "mcq_options": ["Excellent", "Good", "Needs Improvement"],
            "marks": 5,
            "required": true
          },
          {
            "id": 2,
            "text": "Additional comments",
            "answer_type": "text",
            "marks": 0,
            "required": false
          }
        ],
        "subcategories": [
          {
            "id": 1,
            "name": "Homework",
            "category_id": 1
          },
          {
            "id": 2,
            "name": "Class Participation",
            "category_id": 1
          }
        ]
      }
    ]
  }
}
```

#### Create New Category
**Endpoint**: `POST /api/educator-feedback/categories/create`

**Request Body**:
```json
{
  "title": "Behavioral Assessment",
  "questions": [
    {
      "text": "How is the student's behavior in class?",
      "answer_type": "mcq",
      "mcq_options": ["Excellent", "Good", "Needs Improvement"],
      "marks": 3
    },
    {
      "text": "Additional behavioral notes",
      "answer_type": "text", 
      "marks": 0
    }
  ]
}
```

**Response Format**:
```json
{
  "status": "successful",
  "data": {
    "category": {
      "id": 5,
      "name": "Behavioral Assessment",
      "questions": [...],
      "created_at": "2024-01-01T10:00:00Z"
    }
  },
  "message": "Category created successfully"
}
```

### 3. Feedback Management APIs

#### Submit New Feedback
**Endpoint**: `POST /api/educator-feedback/feedbacks/create`

**Request Body**:
```json
{
  "student_id": 123,
  "grade": "Grade 8",
  "main_category": "Academic Performance", 
  "subcategories": ["Homework", "Class Participation"],
  "description": "Student shows improvement in mathematics but needs help with reading comprehension.",
  "rating": 4.2,
  "questionnaire_answers": {
    "1": {
      "answer": "Good",
      "marks": 3
    },
    "2": {
      "answer": "Student is making progress but needs additional support",
      "marks": 0
    }
  }
}
```

**Response Format**:
```json
{
  "status": "successful", 
  "data": {
    "feedback": {
      "id": 456,
      "student_id": 123,
      "educator_id": 789,
      "main_category": "Academic Performance",
      "subcategories": ["Homework", "Class Participation"],
      "description": "Student shows improvement...",
      "rating": 4.2,
      "questionnaire_answers": {...},
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  },
  "message": "Feedback submitted successfully"
}
```

#### Get Feedback List
**Endpoint**: `POST /api/educator-feedback/feedbacks/list`

**Request Body**:
```json
{
  "page": 1,
  "page_size": 10,
  "search_phrase": "",
  "grade": "Grade 8",
  "student_id": 123,
  "category": "Academic Performance",
  "rating": "",
  "educator_id": 789,
  "status": "active",
  "date_from": "2024-01-01",
  "date_to": "2024-12-31"
}
```

**Response Format**:
```json
{
  "status": "successful",
  "data": {
    "feedbacks": [
      {
        "id": 456,
        "student": {
          "id": 123,
          "name": "John Doe",
          "admission_number": "ADM001",
          "grade": "Grade 8",
          "profile_image": "profile_123.jpg"
        },
        "educator": {
          "id": 789,
          "name": "Jane Smith",
          "subject": "Mathematics"
        },
        "main_category": "Academic Performance",
        "subcategories": ["Homework", "Class Participation"],
        "description": "Student shows improvement...",
        "rating": 4.2,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 50,
      "page_size": 10,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

#### Update Feedback
**Endpoint**: `POST /api/educator-feedback/feedbacks/update`

**Request Body**:
```json
{
  "feedback_id": 456,
  "description": "Updated description",
  "rating": 4.5,
  "subcategories": ["Homework", "Class Participation", "Tests"]
}
```

#### Delete Feedback  
**Endpoint**: `POST /api/educator-feedback/feedbacks/delete`

**Request Body**:
```json
{
  "feedback_id": 456
}
```

### 4. Analytics APIs

#### Get Feedback Metadata
**Endpoint**: `POST /api/educator-feedback/metadata`

**Request Body**:
```json
{
  "grade": "Grade 8",
  "student_id": 123,
  "date_from": "2024-01-01",
  "date_to": "2024-12-31"
}
```

**Response Format**:
```json
{
  "status": "successful",
  "data": {
    "total_feedbacks": 150,
    "average_rating": 4.2,
    "category_distribution": {
      "Academic Performance": 60,
      "Behavioral Assessment": 45,
      "Social Skills": 30,
      "Physical Development": 15
    },
    "monthly_trends": [
      {
        "month": "2024-01",
        "count": 25,
        "average_rating": 4.1
      }
    ]
  }
}
```

## Data Models

### Student Model
```typescript
interface Student {
  id: number;
  full_name: string;
  student_calling_name?: string;
  admission_number: string;
  grade_level_id: number;
  grade: string;
  profile_image?: string;
  student_attachment_list: StudentAttachment[];
  active: boolean;
}

interface StudentAttachment {
  id: number;
  file_name: string;
  file_type: string;
  upload_date: string;
}
```

### Grade Model
```typescript
interface Grade {
  id: number;
  name: string;
  student_list_count: number;
  active: boolean;
}
```

### Category Model
```typescript
interface FeedbackCategory {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  questions: Question[];
  subcategories: Subcategory[];
}

interface Question {
  id: number;
  text: string;
  answer_type: 'mcq' | 'text' | 'number' | 'boolean';
  mcq_options?: string[];
  marks: number;
  required: boolean;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}
```

### Feedback Model
```typescript
interface EducatorFeedback {
  id: number;
  student_id: number;
  educator_id: number;
  student: StudentInfo;
  educator: EducatorInfo;
  main_category: string;
  subcategories: string[];
  description: string;
  rating: number;
  questionnaire_answers: Record<string, QuestionAnswer>;
  created_at: string;
  updated_at: string;
}

interface QuestionAnswer {
  answer: string | number | boolean;
  marks: number;
}

interface StudentInfo {
  id: number;
  name: string;
  admission_number: string;
  grade: string;
  profile_image?: string;
}

interface EducatorInfo {
  id: number;
  name: string;
  subject?: string;
}
```

## Error Handling

### Common Error Responses
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "student_id": ["Student ID is required"],
    "description": ["Description must be at least 10 characters"]
  }
}
```

### Authentication Error
```json
{
  "status": "authentication-required", 
  "message": "Valid authentication token required"
}
```

### Not Found Error
```json
{
  "status": "error",
  "message": "Student not found",
  "error_code": "STUDENT_NOT_FOUND"
}
```

## Integration Notes

### Frontend Considerations
1. **Caching**: Use RTK Query's built-in caching for grades and categories
2. **Optimistic Updates**: Implement for feedback submission
3. **Error Boundaries**: Handle API failures gracefully
4. **Loading States**: Show appropriate loading indicators
5. **Retry Logic**: Implement for network failures

### Performance Optimization
1. **Pagination**: Always use pagination for large datasets
2. **Search Debouncing**: Implement for student search
3. **Image Optimization**: Handle profile images efficiently
4. **Data Normalization**: Normalize nested data structures

### Security
1. **Input Validation**: Validate all input data
2. **File Upload**: Secure handling of profile images
3. **Rate Limiting**: Respect API rate limits
4. **Data Sanitization**: Sanitize text inputs

## Testing Endpoints

### Development URLs
- Local: `http://localhost:8000/`
- Staging: `https://staging-api.toyarschool.com/`
- Production: `https://api.toyarschool.com/`

### Sample Test Requests
Use tools like Postman or curl to test endpoints:

```bash
# Test grade list
curl -X POST \
  http://localhost:8000/api/student-management/student/get-student-list-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Test feedback submission  
curl -X POST \
  http://localhost:8000/api/educator-feedback/feedbacks/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 123,
    "grade": "Grade 8",
    "main_category": "Academic Performance",
    "description": "Test feedback",
    "rating": 4.0
  }'
```

## Conclusion

This API structure provides a comprehensive foundation for the educator feedback system. All endpoints follow RESTful principles with consistent request/response formats. The frontend should handle all error cases gracefully and provide excellent user experience through proper loading states and error messages.