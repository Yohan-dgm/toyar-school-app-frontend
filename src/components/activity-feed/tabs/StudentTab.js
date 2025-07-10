import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
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

const StudentTab = ({ userCategory, isConnected, filters }) => {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  // Modal states
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  // Comprehensive mock data for student-specific posts with all media types
  const generateStudentPosts = () => {
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
        id: 301,
        type: "achievement",
        category: "achievement",
        author: "Emma Thompson",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🏆 Outstanding Achievement: Emma received the 'Excellence in Science' award for her innovative project on renewable energy. Her presentation impressed both teachers and students! #Achievement #Science #Innovation",
        timestamp: "3 hours ago",
        date: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 45,
        comments: 18,
        isLiked: true,
        media: {
          type: "multiple_images",
          images: [
            availableImages[0] || defaultImage,
            availableImages[1] || defaultImage,
            availableImages[2] || defaultImage,
          ],
        },
        studentName: "Emma Thompson",
        grade: "Grade 11",
        subject: "Science",
        hashtags: ["Achievement", "Science", "Innovation"],
      },
      {
        id: 302,
        type: "progress",
        category: "academic",
        author: "Marcus Chen",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "📈 Monthly Progress Update: Marcus has shown remarkable improvement in Mathematics, moving from B+ to A- this semester. His dedication to extra study sessions is paying off! #Progress #Mathematics #Improvement",
        timestamp: "1 day ago",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        likes: 32,
        comments: 14,
        isLiked: false,
        media: {
          type: "video",
          uri: availableVideos[0] || defaultVideo,
          thumbnail: availableImages[0] || defaultImage,
        },
        studentName: "Marcus Chen",
        grade: "Grade 10",
        subject: "Mathematics",
        hashtags: ["Progress", "Mathematics", "Improvement"],
      },
      {
        id: 303,
        type: "project",
        category: "academic",
        author: "Sophia Rodriguez",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🎨 Creative Project Showcase: Sophia's history presentation on Ancient Civilizations included interactive models and multimedia elements. Excellent research and presentation skills! #History #Project #Creativity",
        timestamp: "2 days ago",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 28,
        comments: 11,
        isLiked: true,
        media: {
          type: "pdf",
          uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          fileName: "Ancient_Civilizations_Project.pdf",
          fileSize: "2.4 MB",
        },
        studentName: "Sophia Rodriguez",
        grade: "Grade 9",
        subject: "History",
        hashtags: ["History", "Project", "Creativity"],
      },
      {
        id: 304,
        type: "sports",
        category: "sports",
        author: "James Wilson",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "⚽ Championship Victory: James led the school soccer team to victory in the regional championship! His leadership and teamwork were instrumental in this success. #Soccer #Championship #Leadership",
        timestamp: "3 days ago",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        likes: 67,
        comments: 23,
        isLiked: true,
        media: {
          type: "image",
          uri: availableImages[1] || defaultImage,
        },
        studentName: "James Wilson",
        grade: "Grade 11",
        activity: "Soccer Championship",
        hashtags: ["Soccer", "Championship", "Leadership"],
      },
      {
        id: 305,
        type: "behavior",
        category: "achievement",
        author: "Lily Anderson",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🌟 Outstanding Citizenship: Lily organized a school-wide recycling initiative and led environmental awareness workshops. Her commitment to sustainability is inspiring! #Environment #Leadership #Sustainability",
        timestamp: "4 days ago",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        likes: 41,
        comments: 16,
        isLiked: false,
        media: {
          type: "multiple_images",
          images: [
            availableImages[2] || defaultImage,
            availableImages[0] || defaultImage,
          ],
        },
        studentName: "Lily Anderson",
        grade: "Grade 10",
        activity: "Environmental Initiative",
        hashtags: ["Environment", "Leadership", "Sustainability"],
      },
      {
        id: 306,
        type: "arts",
        category: "event",
        author: "David Kim",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🎭 Drama Performance: David delivered an outstanding performance as Hamlet in the school's Shakespeare festival. His dramatic interpretation received a standing ovation! #Drama #Shakespeare #Performance",
        timestamp: "5 days ago",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        likes: 54,
        comments: 19,
        isLiked: true,
        media: {
          type: "video",
          uri: availableVideos[0] || defaultVideo,
          thumbnail: availableImages[1] || defaultImage,
        },
        studentName: "David Kim",
        grade: "Grade 12",
        activity: "Drama Performance",
        hashtags: ["Drama", "Shakespeare", "Performance"],
      },
      {
        id: 307,
        type: "community",
        category: "achievement",
        author: "Isabella Martinez",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "🤝 Community Service Excellence: Isabella volunteered 50+ hours at the local food bank and organized donation drives. Her compassion and dedication make a real difference! #CommunityService #Volunteer #Compassion",
        timestamp: "6 days ago",
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        likes: 38,
        comments: 12,
        isLiked: false,
        media: {
          type: "pdf",
          uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          fileName: "Community_Service_Report.pdf",
          fileSize: "1.8 MB",
        },
        studentName: "Isabella Martinez",
        grade: "Grade 11",
        activity: "Community Service",
        hashtags: ["CommunityService", "Volunteer", "Compassion"],
      },
      {
        id: 308,
        type: "technology",
        category: "academic",
        author: "Ryan Thompson",
        authorImage: require("../../../assets/images/sample-profile.png"),
        content:
          "💻 Coding Competition Winner: Ryan won first place in the regional programming contest with his innovative mobile app design. Future tech leader in the making! #Programming #Technology #Innovation",
        timestamp: "1 week ago",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 72,
        comments: 28,
        isLiked: true,
        media: {
          type: "image",
          uri: availableImages[2] || defaultImage,
        },
        studentName: "Ryan Thompson",
        grade: "Grade 12",
        subject: "Computer Science",
        hashtags: ["Programming", "Technology", "Innovation"],
      },
    ];

    // Generate additional posts to reach 50 total
    const additionalPosts = [];
    const studentNames = [
      "Emma Thompson",
      "Marcus Chen",
      "Sophia Rodriguez",
      "James Wilson",
      "Lily Anderson",
      "David Kim",
      "Isabella Martinez",
      "Ryan Thompson",
      "Olivia Brown",
      "Ethan Davis",
      "Ava Johnson",
      "Noah Garcia",
      "Mia Wilson",
      "Liam Miller",
      "Charlotte Jones",
    ];
    const grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
    const subjects = [
      "Mathematics",
      "Science",
      "English",
      "History",
      "Art",
      "Music",
      "Physical Education",
      "Computer Science",
    ];
    const activities = [
      "Science Fair",
      "Art Exhibition",
      "Music Concert",
      "Sports Tournament",
      "Drama Performance",
      "Debate Competition",
    ];
    const postTypes = [
      "achievement",
      "progress",
      "project",
      "sports",
      "behavior",
      "arts",
      "community",
      "technology",
    ];
    const categories = ["achievement", "academic", "sports", "event"];

    for (let i = 309; i <= 350; i++) {
      const randomStudent =
        studentNames[Math.floor(Math.random() * studentNames.length)];
      const randomGrade = grades[Math.floor(Math.random() * grades.length)];
      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];
      const randomType =
        postTypes[Math.floor(Math.random() * postTypes.length)];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30) + 1;
      const randomLikes = Math.floor(Math.random() * 80) + 5;
      const randomComments = Math.floor(Math.random() * 25) + 1;

      // Random media type
      const mediaTypes = ["image", "multiple_images", "video", "pdf", null];
      const randomMediaType =
        mediaTypes[Math.floor(Math.random() * mediaTypes.length)];

      let media = null;
      if (randomMediaType === "image") {
        media = {
          type: "image",
          uri:
            availableImages[
              Math.floor(Math.random() * availableImages.length)
            ] || defaultImage,
        };
      } else if (randomMediaType === "multiple_images") {
        media = {
          type: "multiple_images",
          images: [
            availableImages[0] || defaultImage,
            availableImages[1] || defaultImage,
          ],
        };
      } else if (randomMediaType === "video") {
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
      } else if (randomMediaType === "pdf") {
        media = {
          type: "pdf",
          uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          fileName: `${randomSubject}_Report.pdf`,
          fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        };
      }

      const hashtags = [randomType, randomSubject, randomActivity].filter(
        Boolean
      );

      additionalPosts.push({
        id: i,
        type: randomType,
        category: randomCategory,
        author: randomStudent,
        authorImage: require("../../../assets/images/sample-profile.png"),
        content: `Student update: ${randomStudent} has been making great progress in ${randomSubject}. Recent ${randomActivity} participation shows excellent ${randomType} development. #${hashtags.join(" #")}`,
        timestamp: `${randomDaysAgo} ${randomDaysAgo === 1 ? "day" : "days"} ago`,
        date: new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000),
        likes: randomLikes,
        comments: randomComments,
        isLiked: Math.random() > 0.7,
        media,
        studentName: randomStudent,
        grade: randomGrade,
        subject: randomSubject,
        activity: randomActivity,
        hashtags,
      });
    }

    return [...baseData, ...additionalPosts];
  };

  // Initialize posts
  useEffect(() => {
    loadPosts();
  }, []);

  // Filter posts based on current filters
  useEffect(() => {
    applyFilters();
  }, [displayedPosts, filters]);

  // Auto-loading pagination
  useEffect(() => {
    if (posts.length === 0) {
      const allPosts = generateStudentPosts();
      setPosts(allPosts);
      setDisplayedPosts(allPosts.slice(0, 10));
      setHasMore(allPosts.length > 10);
      setLoading(false);
    }
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const allPosts = generateStudentPosts();
      setPosts(allPosts);
      setDisplayedPosts(allPosts.slice(0, 10));
      setHasMore(allPosts.length > 10);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const currentLength = displayedPosts.length;
      const nextPosts = posts.slice(currentLength, currentLength + 10);

      if (nextPosts.length > 0) {
        setDisplayedPosts((prev) => [...prev, ...nextPosts]);
        setHasMore(currentLength + nextPosts.length < posts.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore && filteredPosts.length >= 10) {
      loadMorePosts();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...displayedPosts];

    // Search term filter
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower) ||
          post.studentName.toLowerCase().includes(searchLower) ||
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

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case "achievement":
        return "emoji-events";
      case "progress":
        return "trending-up";
      case "project":
        return "assignment";
      case "sports":
        return "sports-soccer";
      case "behavior":
        return "star";
      case "arts":
        return "palette";
      case "community":
        return "volunteer-activism";
      case "technology":
        return "computer";
      default:
        return "person";
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case "achievement":
        return "#FFD700";
      case "progress":
        return "#4CAF50";
      case "project":
        return "#2196F3";
      case "sports":
        return "#FF5722";
      case "behavior":
        return "#9C27B0";
      case "arts":
        return "#E91E63";
      case "community":
        return "#00BCD4";
      case "technology":
        return "#607D8B";
      default:
        return theme.colors.primary;
    }
  };

  const renderPost = (post) => (
    <View style={styles.postCard}>
      {/* Student Info Header */}
      <View style={styles.studentHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{post.studentName}</Text>
          <Text style={styles.studentGrade}>{post.grade}</Text>
        </View>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getPostTypeColor(post.type) },
          ]}
        >
          <Icon name={getPostTypeIcon(post.type)} size={16} color="#FFFFFF" />
          <Text style={styles.typeText}>{post.type.toUpperCase()}</Text>
        </View>
      </View>

      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={post.authorImage} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
          {post.subject && (
            <Text style={styles.subjectText}>Subject: {post.subject}</Text>
          )}
          {post.activity && (
            <Text style={styles.activityText}>Activity: {post.activity}</Text>
          )}
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
              console.log(`📱 StudentTab Media pressed: ${type}`, media);
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
        { key: "studentHeader", width: "100%", height: 50, marginBottom: 10 },
        { key: "header", width: "100%", height: 60, marginBottom: 10 },
        { key: "content", width: "100%", height: 80, marginBottom: 10 },
        { key: "actions", width: "70%", height: 30 },
      ]}
    />
  );

  if (loading && posts.length === 0) {
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
      <Text style={styles.headerTitle}>Student Feed</Text>
      <Text style={styles.headerSubtitle}>
        Your child's achievements and progress
      </Text>
      {filteredPosts.length !== posts.length && (
        <Text style={styles.filterInfo}>
          Showing {filteredPosts.length} of {posts.length} posts
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
      {loadingMore && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading more posts...</Text>
        </View>
      )}

      {!hasMore && filteredPosts.length > 0 && (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>You've reached the end!</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => `student-tab-post-${item.id}`}
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
              style={styles.modalCloseButton}
              onPress={closeImageModal}
            >
              <Icon name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            {selectedMedia && selectedMedia.type === "image" && (
              <Image source={selectedMedia.uri} style={styles.modalImage} />
            )}
            {selectedMedia && selectedMedia.type === "multiple_images" && (
              <FlatList
                data={selectedMedia.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `image-${index}`}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.modalImage} />
                )}
                initialScrollIndex={selectedImageIndex}
                getItemLayout={(data, index) => ({
                  length: 300,
                  offset: 300 * index,
                  index,
                })}
              />
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
              style={styles.modalCloseButton}
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
              style={styles.modalCloseButton}
              onPress={closePdfModal}
            >
              <Icon name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            {selectedMedia && (
              <WebView
                source={{
                  uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    selectedMedia.uri
                  )}`,
                }}
                style={styles.modalPdf}
                injectedJavaScript={`
                  const style = document.createElement('style');
                  style.innerHTML = \`
                    .ndfHFb-c4YZDc-Wrql6b { display: none !important; }
                    .ndfHFb-c4YZDc-to915-LgbsSe { display: none !important; }
                    .ndfHFb-c4YZDc-LgbsSe { display: none !important; }
                    .ndfHFb-c4YZDc-to915-LgbsSe-OWXEXe-IT5dJd { display: none !important; }
                    .ndfHFb-c4YZDc-to915-LgbsSe-OWXEXe-di8rgd-V67aGc { display: none !important; }
                    .ndfHFb-c4YZDc-to915-LgbsSe-OWXEXe-di8rgd { display: none !important; }
                    .ndfHFb-c4YZDc-to915-LgbsSe-OWXEXe { display: none !important; }
                    .ndfHFb-c4YZDc-to915 { display: none !important; }
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-OWXEXe-IT5dJd { display: none !important; }
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe-OWXEXe { display: none !important; }
                    .ndfHFb-c4YZDc-Wrql6b-LgbsSe { display: none !important; }
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
  postCard: {
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  studentGrade: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 4,
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
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  subjectText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  gpaText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  activityText: {
    fontSize: 12,
    color: "#9C27B0",
    fontWeight: "500",
  },
  postContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    resizeMode: "cover",
  },
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
  skeletonContainer: {
    padding: theme.spacing.md,
  },
  loadingMore: {
    padding: theme.spacing.lg,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 8,
  },
  endMessage: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  endMessageText: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  filterInfo: {
    fontSize: 12,
    color: "#3b5998",
    fontWeight: "500",
    marginTop: 4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  // Media Styles
  mediaContainer: {
    marginBottom: theme.spacing.sm,
  },
  multipleImageContainer: {
    marginRight: 8,
    position: "relative",
  },
  multipleImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
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
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  pdfIcon: {
    marginRight: 12,
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
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: -50,
    right: 0,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  modalVideo: {
    width: "100%",
    height: "100%",
  },
  modalPdf: {
    width: "100%",
    height: "100%",
  },
});

export default StudentTab;
