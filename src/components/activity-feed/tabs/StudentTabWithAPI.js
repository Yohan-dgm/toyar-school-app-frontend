import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomSkeleton from "../../ui/CustomSkeleton";
import { theme } from "../../../styles/theme";
import MediaViewer from "../../media/MediaViewer";
import Constants from "expo-constants";

// Import API hooks and slice actions
import {
  useLazyGetStudentPostsQuery,
  useLikePostMutation,
} from "../../../api/activity-feed-api";
import {
  setCurrentStudentId,
  setLoading,
  setRefreshing,
  setPosts,
  setError,
  setFilters,
  clearFilters,
  toggleLike,
} from "../../../state-store/slices/school-life/student-posts-slice";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Get API base URL from environment
const API_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL_API_SERVER_1 ||
  process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 ||
  "http://192.168.1.9:9999";

// Helper function to transform media data from backend API
const transformMediaData = (mediaArray) => {
  if (!mediaArray || !Array.isArray(mediaArray)) return [];

  return mediaArray
    .map((mediaItem) => {
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

      switch (mediaItem.type) {
        case "image":
          return {
            type: "image",
            uri: `${baseUrl}/get-student-attachment-data?student_attachment_id=${mediaItem.id}`,
            id: mediaItem.id,
            filename: mediaItem.filename || "image.jpg",
            size: mediaItem.size || 0,
          };

        case "video":
          return {
            type: "video",
            uri: `${baseUrl}/get-student-attachment-data?student_attachment_id=${mediaItem.id}`,
            thumbnail: mediaItem.thumbnail_url
              ? `${baseUrl}/get-student-attachment-data?student_attachment_id=${mediaItem.thumbnail_id || mediaItem.id}`
              : `${baseUrl}/get-student-attachment-data?student_attachment_id=${mediaItem.id}&type=thumbnail`,
            id: mediaItem.id,
            filename: mediaItem.filename || "video.mp4",
            size: mediaItem.size || 0,
          };

        case "pdf":
          return {
            type: "pdf",
            uri: `${baseUrl}/get-student-attachment-data?student_attachment_id=${mediaItem.id}`,
            fileName: mediaItem.filename || "document.pdf",
            fileSize: mediaItem.size
              ? `${(mediaItem.size / 1024 / 1024).toFixed(1)} MB`
              : "Unknown size",
            id: mediaItem.id,
          };

        default:
          console.warn("Unknown media type:", mediaItem.type);
          return null;
      }
    })
    .filter(Boolean); // Remove null values
};

// Dummy student ID for development - replace with actual selected student ID from parent
const DUMMY_STUDENT_ID = 123;

const StudentTabWithAPI = ({ userCategory, isConnected, filters }) => {
  const dispatch = useDispatch();

  // Redux state
  const {
    posts,
    loading,
    refreshing,
    pagination,
    error,
    likedPosts,
    currentStudentId,
    filters: storeFilters,
  } = useSelector((state) => state.studentPosts);

  // API hooks
  const [getStudentPosts, { isLoading: apiLoading }] =
    useLazyGetStudentPostsQuery();
  const [likePost] = useLikePostMutation();

  // Local state
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Set dummy student ID on component mount
  useEffect(() => {
    if (!currentStudentId) {
      dispatch(setCurrentStudentId(DUMMY_STUDENT_ID));
    }
  }, [currentStudentId, dispatch]);

  // Fetch posts function
  const fetchPosts = useCallback(
    async (pageNum = 1, isRefresh = false, currentFilters = {}) => {
      if (!currentStudentId) return;

      try {
        if (isRefresh) {
          dispatch(setRefreshing(true));
          setPage(1);
        } else if (pageNum === 1) {
          dispatch(setLoading(true));
        } else {
          setIsLoadingMore(true);
        }

        const response = await getStudentPosts({
          student_id: currentStudentId,
          page: pageNum,
          limit: 10,
          filters: {
            ...storeFilters,
            ...currentFilters,
          },
        }).unwrap();

        if (response.success) {
          dispatch(
            setPosts({
              posts: response.data,
              pagination: response.pagination,
              append: pageNum > 1 && !isRefresh,
            })
          );

          if (pageNum > 1) {
            setPage(pageNum);
          }
        } else {
          dispatch(
            setError(response.message || "Failed to fetch student posts")
          );
        }
      } catch (error) {
        console.error("Error fetching student posts:", error);
        dispatch(setError(error.message || "Network error occurred"));

        // Show fallback message for development
        if (__DEV__) {
          Alert.alert(
            "API Not Available",
            `Using dummy student ID: ${currentStudentId}. Please implement the backend API endpoints.`,
            [{ text: "OK" }]
          );
        }
      } finally {
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
        setIsLoadingMore(false);
      }
    },
    [getStudentPosts, dispatch, storeFilters, currentStudentId]
  );

  // Initial load when student ID is set
  useEffect(() => {
    if (currentStudentId) {
      fetchPosts(1, false);
    }
  }, [currentStudentId]);

  // Handle filter changes
  useEffect(() => {
    if (filters && currentStudentId) {
      dispatch(setFilters(filters));
      fetchPosts(1, false, filters);
    }
  }, [filters, dispatch, fetchPosts, currentStudentId]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (pagination?.has_more && !isLoadingMore && !loading && !refreshing) {
      const nextPage = page + 1;
      fetchPosts(nextPage, false);
    }
  }, [pagination, isLoadingMore, loading, refreshing, page, fetchPosts]);

  // Handle like/unlike
  const handleLike = useCallback(
    async (post) => {
      const isCurrentlyLiked = likedPosts[post.id] || post.is_liked_by_user;
      const action = isCurrentlyLiked ? "unlike" : "like";
      const newLikesCount = isCurrentlyLiked
        ? post.likes_count - 1
        : post.likes_count + 1;

      // Optimistic update
      dispatch(
        toggleLike({
          postId: post.id,
          isLiked: !isCurrentlyLiked,
          likesCount: newLikesCount,
        })
      );

      try {
        const response = await likePost({
          post_id: post.id,
          action,
        }).unwrap();

        if (response.success) {
          // Update with actual server response
          dispatch(
            toggleLike({
              postId: post.id,
              isLiked: response.data.is_liked_by_user,
              likesCount: response.data.likes_count,
            })
          );
        }
      } catch (error) {
        console.error("Error liking post:", error);
        // Revert optimistic update on error
        dispatch(
          toggleLike({
            postId: post.id,
            isLiked: isCurrentlyLiked,
            likesCount: post.likes_count,
          })
        );

        if (__DEV__) {
          Alert.alert(
            "API Error",
            "Like functionality requires backend implementation"
          );
        }
      }
    },
    [likedPosts, dispatch, likePost]
  );

  // Render post item (same as others but with student-specific styling)
  const renderPost = ({ item: post }) => {
    const isLiked =
      likedPosts[post.id] !== undefined
        ? likedPosts[post.id]
        : post.is_liked_by_user;

    return (
      <View style={styles.postContainer}>
        {/* Student indicator */}
        <View style={styles.studentIndicator}>
          <Text style={styles.studentText}>Student ID: {currentStudentId}</Text>
        </View>

        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image
            source={
              post.author_image
                ? { uri: post.author_image }
                : require("../../../assets/images/sample-profile.png")
            }
            style={styles.authorImage}
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author_name}</Text>
            <Text style={styles.timestamp}>
              {new Date(post.created_at).toLocaleDateString()} • {post.category}
            </Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <MediaViewer
            media={transformMediaData(post.media)}
            style={styles.mediaContainer}
          />
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <View style={styles.hashtagContainer}>
            {post.hashtags.map((hashtag, index) => (
              <Text key={index} style={styles.hashtag}>
                #{hashtag}
              </Text>
            ))}
          </View>
        )}

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.likedButton]}
            onPress={() => handleLike(post)}
          >
            <Icon
              name={isLiked ? "thumb-up" : "thumb-up-off-alt"}
              size={20}
              color={isLiked ? "#3b5998" : "#666"}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {post.likes_count}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="comment" size={20} color="#666" />
            <Text style={styles.actionText}>{post.comments_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render loading footer
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  // Show loading skeleton on initial load
  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <CustomSkeleton />
      </View>
    );
  }

  // Show error state
  if (error && posts.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchPosts(1, false)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    paddingVertical: 10,
  },
  postContainer: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentIndicator: {
    backgroundColor: "#fff3e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  studentText: {
    fontSize: 12,
    color: "#f57c00",
    fontWeight: "600",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  mediaContainer: {
    marginVertical: 10,
  },
  hashtagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  hashtag: {
    color: "#3b5998",
    fontSize: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  likedButton: {
    backgroundColor: "#e3f2fd",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  likedText: {
    color: "#3b5998",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StudentTabWithAPI;
