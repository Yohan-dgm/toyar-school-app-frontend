import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
// Header and BottomNavigation now handled by parent layout
import { useAuth } from "../../../context/AuthContext";
import { getUserListData } from "../../../api/userApi";
// Header and BottomNavigation now handled by layout
import { theme } from "../../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
// Navigation now handled by layout

const ParentHomeScreen = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [feedLikes, setFeedLikes] = useState({});

  // Mock meeting data
  const meetings = [
    {
      id: 1,
      title: "Weekly Meeting",
      subtitle: "Murad Hossain's Meeting Room",
      date: "May 20, 2025",
      time: "8:30-9:00 AM",
      duration: "Starts in 3 hours",
      color: "#7C4DFF",
      status: "Ongoing",
    },
    {
      id: 2,
      title: "Project Reporting",
      subtitle: "Murad Hossain's Meeting Room",
      date: "May 20, 2025",
      time: "8:30-9:00 AM",
      duration: "",
      color: "#FFB74D",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Marketing Team Discussion",
      subtitle: "Murad Hossain's Meeting Room",
      date: "May 20, 2025",
      time: "8:30-9:00 AM",
      duration: "",
      color: "#81C784",
      status: "Upcoming",
    },
    {
      id: 4,
      title: "UI UX Design Discussion",
      subtitle: "Murad Hossain's Meeting Room",
      date: "May 20, 2025",
      time: "8:30-9:00 AM",
      duration: "",
      color: "#424242",
      status: "Ended",
      participants: [
        require("../../../assets/images/sample-profile.png"),
        require("../../../assets/images/sample-profile.png"),
      ],
      meetingId: "812 8184 7645",
    },
  ];

  // Mock school feed data
  const schoolFeed = [
    {
      id: 1,
      type: "announcement",
      author: "Principal Office",
      authorImage: require("../../../assets/images/nexis-logo.png"),
      time: "2 hours ago",
      title: "Important School Announcement",
      content:
        "Annual Sports Day will be held on December 15th, 2025. All students are required to participate. Please submit your event preferences by December 1st.",
      image: null,
      likes: 45,
      comments: 12,
      isLiked: false,
    },
    {
      id: 2,
      type: "class",
      author: "Ms. Sarah Perera",
      authorImage: require("../../../assets/images/sample-profile.png"),
      time: "4 hours ago",
      title: "Mathematics Class Update",
      content:
        "Great work on today's algebra test! The average score was 85%. Keep up the excellent work. Next week we'll be covering quadratic equations.",
      image: null,
      likes: 23,
      comments: 8,
      isLiked: true,
    },
    {
      id: 3,
      type: "sport",
      author: "Coach Mike Wilson",
      authorImage: require("../../../assets/images/sample-profile.png"),
      time: "6 hours ago",
      title: "Football Team Victory! 🏆",
      content:
        "Congratulations to our school football team for winning the inter-school championship! Final score: 3-1. Special mention to our captain John for his outstanding performance.",
      image: require("../../../assets/images/sample-profile.png"),
      likes: 89,
      comments: 25,
      isLiked: true,
    },
    {
      id: 4,
      type: "event",
      author: "Art Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      time: "1 day ago",
      title: "Art Exhibition Opening",
      content:
        "Join us for the opening of our annual student art exhibition this Friday at 3 PM in the main hall. Featuring amazing artwork from grades 6-12.",
      image: null,
      likes: 34,
      comments: 15,
      isLiked: false,
    },
  ];

  // Mock student timeline data
  const studentTimeline = [
    {
      grade: "Grade 12",
      year: "2025",
      profileImage: require("../../../assets/images/sample-profile.png"),
      badges: ["Prefect", "Sports Captain", "Honor Roll"],
      achievements: ["Mathematics Olympiad Winner", "School Football Captain"],
      gpa: "3.8",
    },
    {
      grade: "Grade 11",
      year: "2024",
      profileImage: require("../../../assets/images/sample-profile.png"),
      badges: ["Honor Roll", "Debate Team"],
      achievements: ["Science Fair 1st Place", "Best Debater Award"],
      gpa: "3.7",
    },
    {
      grade: "Grade 10",
      year: "2023",
      profileImage: require("../../../assets/images/sample-profile.png"),
      badges: ["Class Monitor", "Art Club"],
      achievements: ["Perfect Attendance", "Art Competition Winner"],
      gpa: "3.6",
    },
    {
      grade: "Grade 9",
      year: "2022",
      profileImage: require("../../../assets/images/sample-profile.png"),
      badges: ["Library Helper"],
      achievements: ["Reading Challenge Winner"],
      gpa: "3.5",
    },
  ];

  const tabs = ["Ongoing", "Upcoming", "Ended", "Cancelled"];

  const filteredMeetings = meetings.filter(
    (meeting) => meeting.status === activeTab
  );

  // Handle like functionality
  const handleLike = (postId) => {
    setFeedLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Get post type icon
  const getPostTypeIcon = (type) => {
    switch (type) {
      case "announcement":
        return "campaign";
      case "class":
        return "school";
      case "sport":
        return "sports-soccer";
      case "event":
        return "event";
      default:
        return "info";
    }
  };

  // Get post type color
  const getPostTypeColor = (type) => {
    switch (type) {
      case "announcement":
        return "#FF6B6B";
      case "class":
        return "#4ECDC4";
      case "sport":
        return "#45B7D1";
      case "event":
        return "#96CEB4";
      default:
        return "#95A5A6";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserListData(user?.id, user?.token);
      setData(result);
      console.log("Parent data loaded:", result);
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const fetchData = async () => {
      const result = await getUserListData(user?.id, user?.token);
      setData(result);
      setRefreshing(false);
    };
    if (user) {
      fetchData();
    } else {
      setRefreshing(false);
    }
  }, [user]);

  // Tab press handling now done by layout

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>
            Hi, {user?.full_name || "Murad Hossain"}
          </Text>
          <Text style={styles.subGreetingText}>Start your meeting now!</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meeting Cards */}
        <View style={styles.meetingsContainer}>
          {filteredMeetings.map((meeting) => (
            <View
              key={meeting.id}
              style={[styles.meetingCard, { backgroundColor: meeting.color }]}
            >
              <View style={styles.meetingHeader}>
                <View style={styles.meetingDateContainer}>
                  <Text style={styles.meetingDate}>{meeting.date}</Text>
                  <Text style={styles.meetingTime}>{meeting.time}</Text>
                </View>
                <TouchableOpacity style={styles.settingsButton}>
                  <MaterialIcons name="settings" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.meetingTitle}>{meeting.title}</Text>
              <Text style={styles.meetingSubtitle}>{meeting.subtitle}</Text>

              {meeting.duration && (
                <Text style={styles.meetingDuration}>{meeting.duration}</Text>
              )}

              {meeting.participants && (
                <View style={styles.meetingFooter}>
                  <View style={styles.participantsContainer}>
                    {meeting.participants.map((participant, index) => (
                      <Image
                        key={index}
                        source={participant}
                        style={[
                          styles.participantImage,
                          { marginLeft: index > 0 ? -8 : 0 },
                        ]}
                      />
                    ))}
                    <View style={styles.moreParticipants}>
                      <Text style={styles.moreParticipantsText}>+2</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Now</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color="#000000"
                    />
                  </TouchableOpacity>
                </View>
              )}

              {meeting.meetingId && (
                <View style={styles.meetingIdContainer}>
                  <Text style={styles.meetingStartedText}>Meeting Started</Text>
                  <Text style={styles.meetingIdText}>
                    Meeting ID: {meeting.meetingId}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* School Feed Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>School Feed</Text>
          <View style={styles.feedContainer}>
            {schoolFeed.map((post) => (
              <View key={post.id} style={styles.feedCard}>
                {/* Post Header */}
                <View style={styles.feedHeader}>
                  <View style={styles.feedAuthorContainer}>
                    <View
                      style={[
                        styles.feedTypeIcon,
                        { backgroundColor: getPostTypeColor(post.type) },
                      ]}
                    >
                      <MaterialIcons
                        name={getPostTypeIcon(post.type)}
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    <Image
                      source={post.authorImage}
                      style={styles.feedAuthorImage}
                    />
                    <View style={styles.feedAuthorInfo}>
                      <Text style={styles.feedAuthorName}>{post.author}</Text>
                      <Text style={styles.feedTime}>{post.time}</Text>
                    </View>
                  </View>
                </View>

                {/* Post Content */}
                <View style={styles.feedContent}>
                  <Text style={styles.feedTitle}>{post.title}</Text>
                  <Text style={styles.feedText}>{post.content}</Text>
                  {post.image && (
                    <Image source={post.image} style={styles.feedImage} />
                  )}
                </View>

                {/* Post Actions */}
                <View style={styles.feedActions}>
                  <TouchableOpacity
                    style={styles.feedActionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <MaterialIcons
                      name={
                        feedLikes[post.id] || post.isLiked
                          ? "thumb-up"
                          : "thumb-up-off-alt"
                      }
                      size={20}
                      color={
                        feedLikes[post.id] || post.isLiked
                          ? "#4267B2"
                          : "#65676B"
                      }
                    />
                    <Text
                      style={[
                        styles.feedActionText,
                        (feedLikes[post.id] || post.isLiked) &&
                          styles.feedActionTextActive,
                      ]}
                    >
                      {post.likes +
                        (feedLikes[post.id] && !post.isLiked
                          ? 1
                          : !feedLikes[post.id] && post.isLiked
                            ? -1
                            : 0)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.feedActionButton}>
                    <MaterialIcons name="comment" size={20} color="#65676B" />
                    <Text style={styles.feedActionText}>{post.comments}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Student Timeline Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Student Timeline</Text>
          <View style={styles.timelineContainer}>
            {studentTimeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineYear}>
                    <Text style={styles.timelineYearText}>{item.year}</Text>
                  </View>
                  {index < studentTimeline.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.timelineCard}>
                    <View style={styles.timelineHeader}>
                      <Image
                        source={item.profileImage}
                        style={styles.timelineProfileImage}
                      />
                      <View style={styles.timelineInfo}>
                        <Text style={styles.timelineGrade}>{item.grade}</Text>
                        <Text style={styles.timelineGPA}>GPA: {item.gpa}</Text>
                      </View>
                    </View>

                    {/* Badges */}
                    <View style={styles.badgesContainer}>
                      {item.badges.map((badge, badgeIndex) => (
                        <View key={badgeIndex} style={styles.badge}>
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Achievements */}
                    <View style={styles.achievementsContainer}>
                      <Text style={styles.achievementsTitle}>
                        Achievements:
                      </Text>
                      {item.achievements.map((achievement, achIndex) => (
                        <Text key={achIndex} style={styles.achievementText}>
                          • {achievement}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100, // Space for bottom navigation
  },
  greetingSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  greetingText: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: "#000000",
    marginBottom: 4,
  },
  subGreetingText: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: "#666666",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  activeTabButton: {
    backgroundColor: "#000000",
  },
  tabText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  meetingsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: 16,
  },
  meetingCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  meetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  meetingDateContainer: {
    flex: 1,
  },
  meetingDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  meetingTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  settingsButton: {
    padding: 4,
  },
  meetingTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  meetingSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  meetingDuration: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  meetingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  moreParticipants: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -8,
  },
  moreParticipantsText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#FFFFFF",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  joinButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#000000",
  },
  meetingIdContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meetingStartedText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#FFFFFF",
  },
  meetingIdText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  // School Feed Styles
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: "#000000",
    marginBottom: 20,
  },
  feedContainer: {
    gap: 16,
  },
  feedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedHeader: {
    marginBottom: 12,
  },
  feedAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  feedAuthorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  feedAuthorInfo: {
    flex: 1,
  },
  feedAuthorName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: "#000000",
  },
  feedTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#65676B",
    marginTop: 2,
  },
  feedContent: {
    marginBottom: 16,
  },
  feedTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
    marginBottom: 8,
  },
  feedText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  feedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  feedActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
    gap: 24,
  },
  feedActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feedActionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#65676B",
  },
  feedActionTextActive: {
    color: "#4267B2",
  },
  // Student Timeline Styles
  timelineContainer: {
    paddingLeft: 20,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 20,
  },
  timelineYear: {
    backgroundColor: "#7C4DFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  timelineYearText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  timelineLine: {
    width: 2,
    height: 60,
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timelineProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineGrade: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  timelineGPA: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#1976D2",
  },
  achievementsContainer: {
    marginTop: 8,
  },
  achievementsTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: "#000000",
    marginBottom: 6,
  },
  achievementText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 2,
  },
});

export default ParentHomeScreen;
