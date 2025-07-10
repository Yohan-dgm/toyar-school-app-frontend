import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
// Video and Audio functionality now handled by MediaViewer component
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomSkeleton from "../../ui/CustomSkeleton";
import { theme } from "../../../styles/theme";
import MediaViewer from "../../media/MediaViewer";

const ClassTab = ({ userCategory, isConnected, filters }) => {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  // Modal states
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  // Comprehensive mock data for class-specific posts with all media types
  const generateClassPosts = () => {
    // Default fallback assets
    const defaultImage = require("../../../assets/images/sample-profile.png");
    const defaultVideo = require("../../../assets/images/mov_bbb.mov");
    const defaultPdf = require("../../../assets/images/dummy.pdf");

    // Available assets with fallbacks
    const availableImages = [
      require("../../../assets/images/sample-profile.png"),
      defaultImage,
    ];

    const availableVideos = [
      require("../../../assets/images/mov_bbb.mov"),
      require("../../../assets/images/mov_bbb.mov"),
      require("../../../assets/images/mov_bbb.mov"),
      defaultVideo,
    ];

    const availablePdfs = [
      require("../../../assets/images/dummy.pdf"),
      defaultPdf,
    ];

    const baseData = [
      {
        id: 201,
        type: "assignment",
        category: "academic",
        author: "Mrs. Sarah Wilson",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "📚 Mathematics Assignment: Complete exercises 1-15 from Chapter 7. Focus on quadratic equations and graphing. Due date: Friday, 3:00 PM. #Mathematics #Assignment #Quadratic",
        timestamp: "2 hours ago",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        comments: 8,
        isLiked: false,
        media: {
          type: "pdf",
          uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          fileName: "Math_Assignment_Ch7.pdf",
          fileSize: "2.1 MB",
        },
        className: "Grade 10 - Mathematics",
        hashtags: ["Mathematics", "Assignment", "Quadratic"],
      },
      {
        id: 202,
        type: "homework",
        category: "academic",
        author: "Mr. David Chen",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🔬 Science Lab Report: Document your photosynthesis experiment results. Include hypothesis, methodology, observations, and conclusions. Submit both written report and photos of your setup. #Science #LabReport #Photosynthesis",
        timestamp: "4 hours ago",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 18,
        comments: 12,
        isLiked: true,
        media: {
          type: "multiple_images",
          images: [
            availableImages[0] || defaultImage,
            availableImages[1] || defaultImage,
            availableImages[2] || defaultImage,
          ],
        },
        className: "Grade 10 - Biology",
        hashtags: ["Science", "LabReport", "Photosynthesis"],
      },
      {
        id: 203,
        type: "announcement",
        category: "announcement",
        author: "Ms. Emily Rodriguez",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "📖 English Literature: We'll be analyzing Shakespeare's \"Romeo and Juliet\" this week. Watch this video introduction to understand the historical context and themes. #English #Shakespeare #Literature",
        timestamp: "6 hours ago",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 32,
        comments: 15,
        isLiked: false,
        media: {
          type: "video",
          uri: availableVideos[0] || defaultVideo,
          thumbnail: availableImages[0] || defaultImage,
        },
        className: "Grade 10 - English Literature",
        hashtags: ["English", "Shakespeare", "Literature"],
      },
      {
        id: 204,
        type: "project",
        category: "academic",
        author: "Mr. James Thompson",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🎨 Art Project Showcase: Here are some amazing examples from last year's 'Nature and Environment' theme. Use these as inspiration for your upcoming submissions! #ArtProject #Nature #Creativity",
        timestamp: "8 hours ago",
        date: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 45,
        comments: 23,
        isLiked: true,
        media: {
          type: "image",
          uri: availableImages[1] || defaultImage,
        },
        className: "Grade 10 - Visual Arts",
        hashtags: ["ArtProject", "Nature", "Creativity"],
      },
      {
        id: 205,
        type: "quiz",
        category: "academic",
        author: "Mrs. Lisa Martinez",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "📝 History Quiz Preparation: Study guide for tomorrow's World War II quiz. Review the timeline, key battles, and important figures. Good luck everyone! #History #Quiz #WorldWar2",
        timestamp: "10 hours ago",
        date: new Date(Date.now() - 10 * 60 * 60 * 1000),
        likes: 28,
        comments: 14,
        isLiked: false,
        media: {
          type: "pdf",
          uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          fileName: "WWII_Study_Guide.pdf",
          fileSize: "1.8 MB",
        },
        className: "Grade 10 - World History",
        hashtags: ["History", "Quiz", "WorldWar2"],
      },
      {
        id: 206,
        type: "discussion",
        category: "academic",
        author: "Dr. Michael Brown",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🧪 Chemistry Lab Results: Great work on the acid-base titration experiment! Here's a video explaining the chemical reactions we observed. #Chemistry #Lab #Titration",
        timestamp: "12 hours ago",
        date: new Date(Date.now() - 12 * 60 * 60 * 1000),
        likes: 35,
        comments: 18,
        isLiked: true,
        media: {
          type: "video",
          uri: availableVideos[0] || defaultVideo,
          thumbnail: availableImages[2] || defaultImage,
        },
        className: "Grade 11 - Chemistry",
        hashtags: ["Chemistry", "Lab", "Titration"],
      },
      {
        id: 207,
        type: "assignment",
        category: "academic",
        author: "Mrs. Jennifer Lee",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "📊 Statistics Project: Analyze the provided dataset and create visualizations. Submit your findings in a comprehensive report with charts and graphs. #Statistics #DataAnalysis #Project",
        timestamp: "1 day ago",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        likes: 22,
        comments: 11,
        isLiked: false,
        media: {
          type: "multiple_images",
          images: [
            availableImages[0] || defaultImage,
            availableImages[1] || defaultImage,
          ],
        },
        className: "Grade 11 - Statistics",
        hashtags: ["Statistics", "DataAnalysis", "Project"],
      },
      {
        id: 208,
        type: "announcement",
        category: "announcement",
        author: "Mr. Robert Garcia",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🏃‍♂️ Physical Education: Tomorrow we'll be practicing basketball fundamentals. Please bring appropriate sports attire and water bottles. #PhysicalEducation #Basketball #Sports",
        timestamp: "1 day ago",
        date: new Date(Date.now() - 26 * 60 * 60 * 1000),
        likes: 41,
        comments: 25,
        isLiked: true,
        media: {
          type: "image",
          uri: availableImages[0] || defaultImage,
        },
        className: "Grade 10 - Physical Education",
        hashtags: ["PhysicalEducation", "Basketball", "Sports"],
      },
    ];

    // Generate additional posts to reach 50 total
    const additionalPosts = [];
    for (let i = 209; i <= 250; i++) {
      const subjects = [
        "Mathematics",
        "Science",
        "English",
        "History",
        "Art",
        "Music",
        "Geography",
        "Physics",
        "Chemistry",
        "Biology",
        "Literature",
        "Drama",
      ];
      const teachers = [
        "Mrs. Anderson",
        "Mr. Johnson",
        "Dr. Smith",
        "Ms. Williams",
        "Prof. Davis",
        "Mrs. Miller",
        "Mr. Wilson",
        "Dr. Moore",
      ];
      const mediaTypes = ["image", "video", "pdf", "multiple_images", null];
      const categories = ["academic", "announcement", "project", "assignment"];

      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];
      const randomTeacher =
        teachers[Math.floor(Math.random() * teachers.length)];
      const randomMedia =
        mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      let media = null;
      if (randomMedia === "image") {
        media = {
          type: "image",
          uri:
            availableImages[
              Math.floor(Math.random() * availableImages.length)
            ] || defaultImage,
        };
      } else if (randomMedia === "video") {
        media = {
          type: "video",
          uri:
            availableVideos[
              Math.floor(Math.random() * availableVideos.length)
            ] || defaultVideo,
          thumbnail:
            availableImages[
              Math.floor(Math.random() * availableImages.length)
            ] || defaultImage,
        };
      } else if (randomMedia === "pdf") {
        media = {
          type: "pdf",
          uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          fileName: `${randomSubject}_Material.pdf`,
          fileSize: "1.5 MB",
        };
      } else if (randomMedia === "multiple_images") {
        media = {
          type: "multiple_images",
          images: [
            availableImages[0] || defaultImage,
            availableImages[1] || defaultImage,
            availableImages[2] || defaultImage,
          ],
        };
      }

      additionalPosts.push({
        id: i,
        type: randomCategory,
        category: randomCategory,
        author: randomTeacher,
        authorImage: require("../../../assets/images/sample-profile.png"),
        content: `📚 ${randomSubject} class update: Important information for all students. Please check the attached materials and prepare for upcoming activities. #${randomSubject} #Class #Update`,
        timestamp: `${Math.floor(Math.random() * 48) + 1} hours ago`,
        date: new Date(
          Date.now() - (Math.floor(Math.random() * 48) + 1) * 60 * 60 * 1000
        ),
        likes: Math.floor(Math.random() * 50) + 5,
        comments: Math.floor(Math.random() * 20) + 1,
        isLiked: Math.random() > 0.5,
        media,
        className: `Grade ${Math.floor(Math.random() * 3) + 9} - ${randomSubject}`,
        hashtags: [randomSubject, "Class", "Update"],
      });
    }

    return [...baseData, ...additionalPosts];
  };

  const [mockPosts] = useState(generateClassPosts());

  useEffect(() => {
    loadPosts();
  }, []);

  // Filter posts based on current filters
  useEffect(() => {
    applyFilters();
  }, [displayedPosts, filters]);

  const applyFilters = () => {
    let filtered = [...displayedPosts];

    // Search term filter
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower) ||
          post.className.toLowerCase().includes(searchLower) ||
          post.hashtags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters?.category && filters.category !== "all") {
      filtered = filtered.filter((post) => post.category === filters.category);
    }

    // Date range filter
    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      filtered = filtered.filter((post) => {
        const postDate = post.date;
        const startDate = filters.dateRange.start;
        const endDate = filters.dateRange.end;

        if (startDate && endDate) {
          return postDate >= startDate && postDate <= endDate;
        } else if (startDate) {
          return postDate >= startDate;
        } else if (endDate) {
          return postDate <= endDate;
        }
        return true;
      });
    }

    // Hashtag filter
    if (filters?.hashtags && filters.hashtags.length > 0) {
      filtered = filtered.filter((post) =>
        filters.hashtags.some((filterTag) =>
          post.hashtags.some((postTag) =>
            postTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    setFilteredPosts(filtered);
  };

  const loadPosts = async (isRefresh = false) => {
    if (!isConnected) {
      Alert.alert("No Internet", "Please check your connection");
      return;
    }

    try {
      setLoading(!isRefresh);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isRefresh) {
        // Reset to first 10 posts
        setDisplayedPosts(mockPosts.slice(0, 10));
        setPage(1);
        setHasMore(mockPosts.length > 10);
      } else {
        // Initial load - show first 10 posts
        setDisplayedPosts(mockPosts.slice(0, 10));
        setHasMore(mockPosts.length > 10);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const currentLength = displayedPosts.length;
      const nextBatch = mockPosts.slice(currentLength, currentLength + 10);

      if (nextBatch.length > 0) {
        setDisplayedPosts((prev) => [...prev, ...nextBatch]);
        setHasMore(currentLength + nextBatch.length < mockPosts.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts(true);
  };

  const handleEndReached = () => {
    if (!loading && !loadingMore && hasMore) {
      loadMorePosts();
    }
  };

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Media handling functions
  const handleImagePress = (media, index = 0) => {
    setSelectedMedia(media);
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const handleVideoPress = async (media) => {
    setSelectedMedia(media);
    setVideoModalVisible(true);
  };

  const handlePdfPress = (media) => {
    setSelectedMedia(media);
    setPdfModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedMedia(null);
    setSelectedImageIndex(0);
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedMedia(null);
  };

  const closePdfModal = () => {
    setPdfModalVisible(false);
    setSelectedMedia(null);
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case "assignment":
        return "assignment";
      case "homework":
        return "book";
      case "announcement":
        return "announcement";
      default:
        return "info";
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case "assignment":
        return "#FF6B6B";
      case "homework":
        return "#4ECDC4";
      case "announcement":
        return "#45B7D1";
      default:
        return theme.colors.primary;
    }
  };

  const renderPost = (post) => (
    <View style={styles.postCard}>
      {/* Post Type Badge */}
      <View
        style={[
          styles.typeBadge,
          { backgroundColor: getPostTypeColor(post.type) },
        ]}
      >
        <Icon name={getPostTypeIcon(post.type)} size={16} color="#FFFFFF" />
        <Text style={styles.typeText}>{post.type.toUpperCase()}</Text>
      </View>

      {/* Class Name */}
      <Text style={styles.className}>{post.className}</Text>

      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={post.authorImage} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Media */}
      {post.media && (
        <View style={styles.mediaContainer}>
          <MediaViewer
            media={post.media}
            showControls={true}
            autoPlay={false}
            onPress={(media, type) => {
              console.log(`📱 ClassTab Media pressed: ${type}`, media);
            }}
          />
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Icon
            name={
              likedPosts[post.id] || post.isLiked
                ? "favorite"
                : "favorite-border"
            }
            size={20}
            color={likedPosts[post.id] || post.isLiked ? "#3b5998" : "#65676B"}
          />
          <Text
            style={[
              styles.actionText,
              (likedPosts[post.id] || post.isLiked) && styles.actionTextActive,
            ]}
          >
            {post.likes +
              (likedPosts[post.id] && !post.isLiked
                ? 1
                : !likedPosts[post.id] && post.isLiked
                  ? -1
                  : 0)}
          </Text>
        </TouchableOpacity>

        {/* Comment option hidden for now */}
        {/*
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="comment" size={20} color="#65676B" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        */}
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <CustomSkeleton
      containerStyle={styles.skeletonContainer}
      layout={[
        { key: "badge", width: 100, height: 25, marginBottom: 10 },
        { key: "class", width: "60%", height: 20, marginBottom: 10 },
        { key: "header", width: "100%", height: 60, marginBottom: 10 },
        { key: "content", width: "100%", height: 80, marginBottom: 10 },
        { key: "actions", width: "50%", height: 30 },
      ]}
    />
  );

  if (loading && displayedPosts.length === 0) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.postCard}>
            {renderSkeleton()}
          </View>
        ))}
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Class Feed</Text>
      <Text style={styles.headerSubtitle}>
        Latest class announcements and assignments
      </Text>
      {filteredPosts.length !== displayedPosts.length && (
        <Text style={styles.filterInfo}>
          Showing {filteredPosts.length} of {displayedPosts.length} posts
        </Text>
      )}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.noResultsContainer}>
      <Icon name="search-off" size={48} color="#8E8E93" />
      <Text style={styles.noResultsTitle}>No posts found</Text>
      <Text style={styles.noResultsText}>
        Try adjusting your filters or search terms
      </Text>
    </View>
  );

  const renderFooter = () => (
    <>
      {/* Loading Icon for Auto-Load */}
      {(loading || loadingMore) && displayedPosts.length > 0 && (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingMoreText}>Loading more posts...</Text>
        </View>
      )}

      {/* End of posts indicator */}
      {!hasMore && displayedPosts.length > 0 && (
        <View style={styles.endOfPostsContainer}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.endOfPostsText}>You've reached the end!</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => `class-tab-post-${item.id}`}
        renderItem={({ item }) => renderPost(item)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          displayedPosts.length > 0 ? renderEmptyComponent : null
        }
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeImageModal}
            >
              <Icon name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            {selectedMedia?.type === "multiple_images" ? (
              <FlatList
                data={selectedMedia.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={selectedImageIndex}
                getItemLayout={(data, index) => ({
                  length: 300,
                  offset: 300 * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.modalImage} />
                )}
                keyExtractor={(item, index) => `modal-image-${index}`}
              />
            ) : (
              <Image source={selectedMedia?.uri} style={styles.modalImage} />
            )}
          </View>
        </View>
      </Modal>

      {/* Video Modal */}
      <Modal
        visible={videoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVideoModal}
            >
              <Icon name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            {selectedMedia && (
              <Video
                source={{ uri: selectedMedia.uri }}
                style={styles.modalVideo}
                useNativeControls
                resizeMode="contain"
                shouldPlay={false}
                isMuted={false}
                volume={1.0}
                onLoad={() => {
                  console.log("Video loaded");
                }}
                onError={(error) => {
                  console.log("Video error:", error);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* PDF Modal */}
      <Modal
        visible={pdfModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePdfModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePdfModal}
            >
              <Icon name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            {selectedMedia && (
              <WebView
                source={{
                  uri: `https://docs.google.com/viewer?url=${encodeURIComponent(
                    selectedMedia.uri
                  )}&embedded=true&toolbar=0&navpanes=0&scrollbar=0`,
                }}
                style={styles.modalPdf}
                injectedJavaScript={`
                  const style = document.createElement('style');
                  style.innerHTML = \`
                    .ndfHFb-c4YZDc-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe, .ndfHFb-c4YZDc-to915-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe-LgbsSe,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-LgbsSe, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe-Wrql6b,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-Wrql6b, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b-Wrql6b,
                    .ndfHFb-c4YZDc-Wrql6b-Wrql6b, .ndfHFb-c4YZDc-to915-Wrql6b-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe-LgbsSe-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe-LgbsSe-LgbsSe,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-LgbsSe-LgbsSe, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe-LgbsSe-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b-LgbsSe-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b-LgbsSe-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe-Wrql6b-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe-Wrql6b-LgbsSe,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-Wrql6b-LgbsSe, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe-Wrql6b-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b-Wrql6b-LgbsSe, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b-Wrql6b-LgbsSe,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe-LgbsSe-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe-LgbsSe-Wrql6b,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-LgbsSe-Wrql6b, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe-LgbsSe-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b-LgbsSe-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b-LgbsSe-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-LgbsSe-Wrql6b-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-LgbsSe-Wrql6b-Wrql6b,
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-Wrql6b-Wrql6b, .ndfHFb-c4YZDc-to915-Wrql6b-LgbsSe-Wrql6b-Wrql6b,
                    .ndfHFb-c4YZDc-LgbsSe-Wrql6b-Wrql6b-Wrql6b, .ndfHFb-c4YZDc-to915-LgbsSe-Wrql6b-Wrql6b-Wrql6b,
                    .ndfHFb-c4YZDc-Wrql6b-Wrql6b-Wrql6b, .ndfHFb-c4YZDc-to915-Wrql6b-Wrql6b-Wrql6b {
                      display: none !important;
                    }
                  \`;
                  document.head.appendChild(style);
                  true;
                `}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  filterInfo: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    fontStyle: "italic",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  className: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
  },
  postContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },

  // Media Styles
  mediaContainer: {
    marginBottom: theme.spacing.sm,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  multipleImageContainer: {
    marginRight: 8,
    position: "relative",
  },
  multipleImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  videoWrapper: {
    position: "relative",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
  },
  pdfWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  pdfIcon: {
    marginRight: theme.spacing.sm,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfFileName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  pdfFileSize: {
    fontSize: 12,
    color: "#8E8E93",
  },

  // Action Styles
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.lg,
  },
  actionText: {
    fontSize: 14,
    color: "#65676B",
    fontWeight: "500",
    marginLeft: 4,
  },
  actionTextActive: {
    color: "#3b5998",
  },

  // Loading and Empty States
  skeletonContainer: {
    padding: theme.spacing.md,
  },
  loadingMoreContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingMoreText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
  },
  endOfPostsContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  endOfPostsText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    marginLeft: 8,
  },
  noResultsContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  noResultsText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: 300,
    height: "100%",
    resizeMode: "contain",
  },
  modalVideo: {
    width: "100%",
    height: "100%",
  },
  modalPdf: {
    flex: 1,
    width: "100%",
  },
});

export default ClassTab;
