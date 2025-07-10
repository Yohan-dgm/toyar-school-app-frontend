# Activity Feed API Integration System

This document explains the complete API integration system for the School Life Activity Feed section.

## 📁 File Structure

```
src/
├── api/
│   └── activity-feed-api.ts          # Main API endpoints
├── state-store/slices/school-life/
│   ├── school-posts-slice.ts         # School posts state management
│   ├── class-posts-slice.ts          # Class posts state management
│   └── student-posts-slice.ts        # Student posts state management
└── components/activity-feed/tabs/
    ├── SchoolTabWithAPI.js           # School tab with API integration
    ├── ClassTabWithAPI.js            # Class tab with API integration
    └── StudentTabWithAPI.js          # Student tab with API integration
```

## 🔧 API Endpoints

### 1. School Posts
- **Endpoint**: `POST /api/activity-feed/school/posts`
- **Purpose**: Fetch all school-wide posts
- **Usage**: Shows posts visible to all users

### 2. Class Posts
- **Endpoint**: `POST /api/activity-feed/class/posts`
- **Purpose**: Fetch posts for a specific class
- **Usage**: Shows posts for selected student's class
- **Dummy ID**: Currently uses class_id = 5

### 3. Student Posts
- **Endpoint**: `POST /api/activity-feed/student/posts`
- **Purpose**: Fetch posts related to a specific student
- **Usage**: Shows posts about individual student achievements, reports, etc.
- **Dummy ID**: Currently uses student_id = 123

### 4. Like Post
- **Endpoint**: `POST /api/activity-feed/post/like`
- **Purpose**: Like or unlike a post
- **Actions**: 'like' or 'unlike'

## 🗄️ Database Tables Required

### 1. activity_feed_posts
```sql
CREATE TABLE activity_feed_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('announcement', 'event', 'news', 'achievement'),
    category VARCHAR(100),
    title VARCHAR(255),
    content TEXT,
    author_id BIGINT,
    school_id BIGINT,
    class_id BIGINT NULL,
    student_id BIGINT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```

### 2. activity_feed_media
```sql
CREATE TABLE activity_feed_media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT,
    type ENUM('image', 'video', 'pdf'),
    url VARCHAR(500),
    thumbnail_url VARCHAR(500) NULL,
    filename VARCHAR(255),
    size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES activity_feed_posts(id) ON DELETE CASCADE
);
```

### 3. activity_feed_hashtags
```sql
CREATE TABLE activity_feed_hashtags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT,
    hashtag VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES activity_feed_posts(id) ON DELETE CASCADE
);
```

### 4. activity_feed_likes
```sql
CREATE TABLE activity_feed_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES activity_feed_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, user_id)
);
```

## 🚀 How to Use

### 1. Import the API hooks in your component:
```javascript
import { 
  useLazyGetSchoolPostsQuery, 
  useLikePostMutation 
} from "../../../api/activity-feed-api";
```

### 2. Import slice actions:
```javascript
import {
  setLoading,
  setPosts,
  toggleLike,
} from "../../../state-store/slices/school-life/school-posts-slice";
```

### 3. Use in component:
```javascript
const [getSchoolPosts] = useLazyGetSchoolPostsQuery();
const [likePost] = useLikePostMutation();

// Fetch posts
const response = await getSchoolPosts({
  page: 1,
  limit: 10,
  filters: { search: "example" }
}).unwrap();

// Handle like
await likePost({ post_id: 1, action: "like" });
```

## 🔄 State Management

Each section has its own Redux slice:
- `schoolPosts`: Global school posts
- `classPosts`: Class-specific posts (with currentClassId)
- `studentPosts`: Student-specific posts (with currentStudentId)

## 📱 Features Implemented

✅ **Pagination**: Infinite scroll with load more
✅ **Refresh**: Pull-to-refresh functionality
✅ **Filtering**: Search, date range, category, hashtags
✅ **Like System**: Optimistic updates with error handling
✅ **Media Support**: Images, videos, PDFs
✅ **Error Handling**: Graceful fallbacks and retry options
✅ **Loading States**: Skeletons and indicators
✅ **Offline Support**: Redux persistence

## 🔧 Development Setup

1. **Update Store**: The slices are already added to the store
2. **Replace Components**: Use the new `*WithAPI.js` components
3. **Configure Backend**: Implement the Laravel endpoints
4. **Update IDs**: Replace dummy IDs with real student/class data

## 🎯 Next Steps

1. **Backend Implementation**: Create Laravel controllers and routes
2. **Authentication**: Add proper user authentication to API calls
3. **Real IDs**: Replace dummy class_id and student_id with actual data
4. **Comments**: Implement comment functionality (tables already designed)
5. **Push Notifications**: Add real-time updates for new posts
6. **Media Upload**: Add functionality to create posts with media

## 🐛 Development Notes

- Currently uses dummy IDs for class (5) and student (123)
- API calls will fail gracefully with development alerts
- Fallback to dummy data when backend is not available
- All components include proper error boundaries and loading states

## 📞 Support

For questions about this implementation, refer to:
- API documentation in `activity-feed-api.ts`
- Slice documentation in each slice file
- Component examples in `*WithAPI.js` files
