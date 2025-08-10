import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  useLazyGetSchoolPostsQuery,
  useLikePostMutation,
} from "../../../api/activity-feed-api";
import {
  setLoading,
  setRefreshing,
  setPosts,
  setAllPosts as setAllPostsAction,
  setError,
  setFilters,
  clearFilters,
  toggleLike,
  revertLike,
  getUserLikeState,
} from "../../../state-store/slices/school-life/school-posts-slice";

// Import filter transformation utility
import { transformFiltersForAPI } from "../FilterBar";

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

      // Construct media URL using the backend URL structure
      const mediaUrl = `${baseUrl}${mediaItem.url}`;
      const thumbnailUrl = mediaItem.thumbnail_url
        ? `${baseUrl}${mediaItem.thumbnail_url}`
        : null;

      switch (mediaItem.type) {
        case "image":
          return {
            type: "image",
            uri: mediaUrl,
            id: mediaItem.id,
            filename: mediaItem.filename || "image.jpg",
            size: mediaItem.size || 0,
          };

        case "video":
          return {
            type: "video",
            uri: mediaUrl,
            thumbnail: thumbnailUrl || mediaUrl, // Use thumbnail or fallback to video URL
            id: mediaItem.id,
            filename: mediaItem.filename || "video.mp4",
            size: mediaItem.size || 0,
          };

        case "pdf":
          return {
            type: "pdf",
            uri: mediaUrl,
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

const ClassTabWithAPI = ({ filters, userCategory, isConnected }) => {
  const dispatch = useDispatch();

  // Debug filters being passed to component
  useEffect(() => {
    console.log("🎯 ClassTabWithAPI - Filters received:", filters);
  }, [filters]);

  // Redux state with safe defaults
  const schoolPostsState = useSelector((state) => state.schoolPosts || {});
  const {
    posts = [],
    loading = false,
    refreshing = false,
    error = null,
    likedPosts = {},
  } = schoolPostsState;

  // Get selected student from global state
  const { selectedStudent } = useSelector((state) => state.app);

  // API hooks - using school posts API since we're filtering from all posts
  const [getSchoolPosts] = useLazyGetSchoolPostsQuery();
  const [likePost] = useLikePostMutation();

  // Local state for frontend filtering
  const [allPostsLocal, setAllPostsLocal] = useState([]);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // Load all posts initially (without filters)
  const loadAllPosts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      console.log("🔄 Loading all posts for class filtering... [CLASS TAB]");

      // Load all posts without any filters
      const response = await getSchoolPosts({
        page: 1,
        limit: 100, // Load more posts initially
        filters: {
          search: "",
          category: "",
          date_from: "",
          date_to: "",
          hashtags: [],
        },
      }).unwrap();

      if (response.status === "successful") {
        // console.log("🎓 All Posts Loaded for Class Tab:", response.data);

        // Fix: response.data is the posts array directly, not response.data.posts
        const allPostsData = Array.isArray(response.data)
          ? response.data
          : response.data.posts || [];
        console.log(
          "✅ Successfully extracted",
          allPostsData.length,
          "posts for class filtering",
        );

        // Debug: Show all posts and their class_id values
        console.log("🎓 Class Tab - All posts loaded from backend:");
        allPostsData.forEach((post, index) => {
          console.log(`🎓 Post ${post.id}:`, {
            title: post.title,
            class_id: post.class_id,
            student_id: post.student_id,
            school_id: post.school_id,
          });
        });

        // Store all posts in local state for frontend filtering
        setAllPostsLocal(allPostsData);
        setHasLoadedInitialData(true);

        // Store all posts in Redux for filter options (unfiltered)
        dispatch(setAllPostsAction(allPostsData));

        dispatch(setError(null));
      } else {
        dispatch(setError(response.message || "Failed to load posts"));
      }
    } catch (error) {
      console.error("Error in loadAllPosts (Class Tab):", error);
      dispatch(setError(error.message || "An unexpected error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, getSchoolPosts, setAllPostsLocal, setHasLoadedInitialData]);

  // Frontend filtering function for CLASS TAB
  const filterPostsLocally = useCallback(
    (postsToFilter, currentFilters) => {
      if (!postsToFilter || postsToFilter.length === 0) return [];

      console.log("🔍 Class Tab - Frontend filtering with:", currentFilters);
      console.log("🎓 Selected student:", selectedStudent);
      console.log("🎓 Selected student grade level class info:", {
        student_calling_name: selectedStudent?.student_calling_name,
        grade: selectedStudent?.grade,
        class_id: selectedStudent?.class_id,
        campus: selectedStudent?.campus,
      });

      return postsToFilter.filter((post) => {
        // CLASS TAB SPECIFIC FILTERING:
        // Show ALL posts where class_id matches the selected student's class_id
        // No additional filtering - just match the class_id

        // Check if we have a selected student with class_id
        if (
          !selectedStudent ||
          selectedStudent.class_id === null ||
          selectedStudent.class_id === undefined
        ) {
          console.log(
            `🎓 Filtering out post ${post.id}: no selected student or student has no class_id`,
          );
          return false;
        }

        // Check if post has class_id that matches selected student's class_id
        const postClassId = post.class_id;
        const studentClassId = selectedStudent.class_id;

        console.log(`🎓 Post ${post.id} class_id comparison:`, {
          post_class_id: postClassId,
          student_class_id: studentClassId,
          student_grade: selectedStudent?.grade,
          student_campus: selectedStudent?.campus,
          match: postClassId === studentClassId,
        });

        // Show post if class_id matches (including null class_id posts if student has null class_id)
        if (postClassId !== studentClassId) {
          console.log(
            `🎓 Filtering out post ${post.id}: class_id mismatch. Post class_id=${postClassId}, Student class_id=${studentClassId}`,
          );
          return false;
        }

        console.log(
          `🎓 Including class post ${post.id}: matches student's class_id (${studentClassId})`,
        );

        // CLASS TAB: Show ALL posts for this class - no additional filtering
        console.log(
          `🎓 ✅ Including ALL class posts for class_id ${studentClassId}`,
        );
        return true;
      });
    },
    [selectedStudent],
  );

  // Clear any existing filters when component mounts
  useEffect(() => {
    console.log(
      "🧹 Clearing any existing filters on component mount (Class Tab)",
    );
    dispatch(clearFilters());
  }, [dispatch]);

  // Load all posts initially (only once)
  useEffect(() => {
    if (!hasLoadedInitialData) {
      loadAllPosts();
    }
  }, [hasLoadedInitialData, loadAllPosts]);

  // Debug allPostsLocal changes
  useEffect(() => {
    console.log(
      "🔄 allPostsLocal changed (Class Tab):",
      allPostsLocal?.length || 0,
    );
  }, [allPostsLocal]);

  // Refresh data when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      console.log(
        `🎓 Class Tab - Selected student changed to: ${selectedStudent.student_calling_name} (ID: ${selectedStudent.student_id})`,
      );
      console.log(
        `🎓 Class Tab - Student class info: grade="${selectedStudent.grade}", class_id=${selectedStudent.class_id}`,
      );

      // Reload posts to ensure we have fresh data for the new student
      if (hasLoadedInitialData) {
        console.log("🔄 Class Tab - Reloading posts for new student selection");
        loadAllPosts();
      }
    }
  }, [
    selectedStudent?.student_id,
    selectedStudent?.class_id,
    hasLoadedInitialData,
    loadAllPosts,
  ]);

  // Frontend filtering - filter allPostsLocal based on current filters
  const filteredPosts = useMemo(() => {
    console.log("🚀 useMemo filteredPosts is executing! (Class Tab)");
    if (!allPostsLocal || allPostsLocal.length === 0) {
      console.log(
        "❌ No allPostsLocal available (Class Tab):",
        allPostsLocal?.length || 0,
      );
      return [];
    }

    // Check if filters are effectively empty (no real filtering needed)
    const hasActiveFilters =
      filters &&
      ((filters.searchTerm && filters.searchTerm.trim() !== "") ||
        (filters.category &&
          filters.category !== "all" &&
          filters.category !== "") ||
        (filters.hashtags && filters.hashtags.length > 0) ||
        (filters.dateRange &&
          (filters.dateRange.start || filters.dateRange.end)));

    console.log("🔍 Filtering Debug (Class Tab):", {
      allPostsCount: allPostsLocal.length,
      filters,
      hasActiveFilters,
      selectedStudent: selectedStudent?.student_calling_name,
    });

    // Always apply class-specific filtering (even without user filters)
    const filtered = filterPostsLocally(allPostsLocal, filters || {});
    console.log(
      "🔍 Class filtering applied - filtered posts:",
      filtered.length,
    );
    return filtered;
  }, [allPostsLocal, filters, filterPostsLocally]);

  // Update Redux state when filtered posts change
  useEffect(() => {
    if (hasLoadedInitialData && filteredPosts) {
      console.log(
        `🔍 Class filtering complete: ${filteredPosts.length} posts match criteria`,
      );
      dispatch(
        setPosts({
          posts: filteredPosts,
          pagination: {
            current_page: 1,
            total: filteredPosts.length,
            has_more: false,
          },
        }),
      );
    }
  }, [filteredPosts, hasLoadedInitialData, dispatch]);

  // Handle refresh - reload all posts
  const handleRefresh = useCallback(() => {
    setHasLoadedInitialData(false); // This will trigger loadAllPosts again
    setAllPostsLocal([]); // Clear current posts
  }, []);

  // Handle load more - not needed since we load all posts initially
  const handleLoadMore = useCallback(() => {
    // No pagination needed since we load all posts initially
    console.log(
      "📄 Load more not needed - all posts loaded initially (Class Tab)",
    );
  }, []);

  // Handle like/unlike
  const handleLike = useCallback(
    async (post) => {
      const isCurrentlyLiked =
        getUserLikeState(schoolPostsState, post.id) || post.is_liked_by_user;
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
        }),
      );

      try {
        const response = await likePost({
          post_id: post.id,
          action,
        }).unwrap();

        if (response.status === "successful") {
          // Update with actual server response
          dispatch(
            toggleLike({
              postId: post.id,
              isLiked: response.data.is_liked_by_user,
              likesCount: response.data.likes_count,
            }),
          );
        }
      } catch (error) {
        console.error("Error liking post:", error);
        // Revert optimistic update on error using dedicated revertLike action
        dispatch(
          revertLike({
            postId: post.id,
            isLiked: isCurrentlyLiked,
            likesCount: post.likes_count,
          }),
        );

        if (__DEV__) {
          Alert.alert(
            "API Error",
            "Like functionality requires backend implementation. Please check the backend API endpoints.",
          );
        }
      }
    },
    [likedPosts, dispatch, likePost],
  );

  // Render post item (same as SchoolTab but with class-specific styling)
  const renderPost = ({ item: post }) => {
    // Use user-specific like state helper function
    const isLiked =
      getUserLikeState(schoolPostsState, post.id) || post.is_liked_by_user;

    return (
      <View style={styles.postContainer}>
        {/* Class indicator */}
        <View style={styles.classIndicator}>
          <Text style={styles.classText}>Class Post</Text>
        </View>

        {/* Post Header */}
        <View style={styles.postHeader}>
          {/* <Image
            source={
              post.author_image
                ? { uri: post.author_image }
                : require("../../../assets/images/sample-profile.png")
            }
            style={styles.authorImage}
          /> */}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.title}</Text>
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
        </View>
      </View>
    );
  };

  // Render loading footer - not needed since we load all posts initially
  const renderFooter = () => {
    // No loading footer needed since we load all posts initially
    return null;
  };

  // Show loading skeleton on initial load
  if (loading && (!posts || posts.length === 0)) {
    return (
      <View style={styles.container}>
        <CustomSkeleton />
      </View>
    );
  }

  // Show error state
  if (error && (!posts || posts.length === 0)) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadAllPosts()}
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedStudent
                ? `No class posts found for ${selectedStudent.student_calling_name}'s class (${selectedStudent.grade})\n\nClass posts are specific to your child's grade/class and are different from school-wide posts.`
                : "No class posts available"}
            </Text>
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
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
  classIndicator: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  classText: {
    fontSize: 12,
    color: "#2e7d32",
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
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
});

export default ClassTabWithAPI;
