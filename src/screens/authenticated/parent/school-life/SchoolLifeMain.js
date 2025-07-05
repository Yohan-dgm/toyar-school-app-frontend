import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { useAuth } from "../../../../context/AuthContext";
// Header and BottomNavigation now handled by parent layout

const SchoolLifeMain = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("school");
  const [refreshing, setRefreshing] = useState(false);
  const [feedLikes, setFeedLikes] = useState({});
  const [activeTab, setActiveTab] = useState("Upcoming");

  // Tab press handling now done by layout

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLikePress = (postId) => {
    setFeedLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
  };

  const handleAnnouncementPress = (announcement) => {
    console.log("Navigate to announcement detail:", announcement.title);
  };

  const handleEventPress = (event) => {
    console.log("Navigate to event detail:", event.title);
  };

  const announcements = [
    {
      id: 1,
      title: "School Sports Day 2024",
      content:
        "Join us for our annual sports day celebration with various competitions and activities.",
      date: "2024-03-15",
      category: "sports",
      priority: "high",
      image: require("../../../../assets/annoucement/sports.png"),
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      content:
        "Monthly parent-teacher meeting to discuss student progress and upcoming activities.",
      date: "2024-03-20",
      category: "classroom",
      priority: "medium",
    },
    {
      id: 3,
      title: "Science Fair Registration",
      content:
        "Register your child for the upcoming science fair. Deadline: March 25th.",
      date: "2024-03-25",
      category: "classroom",
      priority: "high",
    },
    {
      id: 4,
      title: "School Holiday Notice",
      content: "School will be closed on March 30th for public holiday.",
      date: "2024-03-30",
      category: "student",
      priority: "low",
    },
  ];

  const categories = [
    { id: "school", title: "School", icon: "school" },
    { id: "classroom", title: "Academic", icon: "apps" },
    { id: "student", title: "Student", icon: "man" },
    { id: "sports", title: "Sports", icon: "sports-soccer" },
  ];

  const filteredAnnouncements =
    activeCategory === "school"
      ? announcements
      : announcements.filter((item) => item.category === activeCategory);

  // Meeting data for Tab Navigation
  const meetings = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      subtitle: "Grade 10 - Mathematics",
      date: "May 20, 2025",
      time: "2:30-3:00 PM",
      duration: "Starts in 2 hours",
      color: "#7C4DFF",
      status: "Ongoing",
    },
    {
      id: 2,
      title: "Academic Progress Review",
      subtitle: "Grade 10 - All Subjects",
      date: "May 22, 2025",
      time: "10:00-10:30 AM",
      duration: "",
      color: "#FFB74D",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "School Event Planning",
      subtitle: "Annual Sports Day Discussion",
      date: "May 25, 2025",
      time: "4:00-4:30 PM",
      duration: "",
      color: "#81C784",
      status: "Upcoming",
    },
    {
      id: 4,
      title: "Student Counseling Session",
      subtitle: "Career Guidance Meeting",
      date: "May 18, 2025",
      time: "1:00-1:30 PM",
      duration: "",
      color: "#424242",
      status: "Ended",
      participants: [
        require("../../../../assets/images/sample-profile.png"),
        require("../../../../assets/images/sample-profile.png"),
      ],
      meetingId: "812 8184 7645",
    },
  ];

  const tabs = ["Upcoming", "Ongoing", "Ended"];

  const filteredMeetings = meetings.filter(
    (meeting) => meeting.status === activeTab
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#FF5722";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return theme.colors.text;
    }
  };

  // School Feed Data (Facebook-like posts)
  const schoolFeed = [
    {
      id: 1,
      type: "announcement",
      author: "Principal Johnson",
      authorImage: require("../../../../assets/images/sample-profile.png"),
      content:
        "🎉 Congratulations to our Grade 10 students for their outstanding performance in the Science Fair! Special recognition goes to Team Alpha for their innovative project on renewable energy.",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      isLiked: false,
    },
    {
      id: 2,
      type: "class",
      author: "Mrs. Sarah Wilson",
      authorImage: require("../../../../assets/images/sample-profile.png"),
      content:
        "📚 Reminder: Mathematics test for Grade 9 students is scheduled for tomorrow at 10:00 AM. Please bring your calculators and review chapters 5-7.",
      timestamp: "4 hours ago",
      likes: 12,
      comments: 3,
      isLiked: true,
    },
    {
      id: 3,
      type: "sports",
      author: "Coach Martinez",
      authorImage: require("../../../../assets/images/sample-profile.png"),
      content:
        "⚽ Great victory for our school football team! We won 3-1 against Riverside High. Next match is on Friday. Come support our team!",
      timestamp: "1 day ago",
      likes: 45,
      comments: 15,
      isLiked: false,
    },
    {
      id: 4,
      type: "event",
      author: "Student Council",
      authorImage: require("../../../../assets/images/sample-profile.png"),
      content:
        "🎭 Annual Drama Club performance 'Romeo and Juliet' this Saturday at 7 PM in the school auditorium. Tickets available at the main office.",
      timestamp: "2 days ago",
      likes: 18,
      comments: 6,
      isLiked: true,
    },
  ];

  // Student Timeline Data
  const studentTimeline = [
    {
      year: "2024",
      grade: "Grade 10",
      gpa: "3.8",
      profileImage: require("../../../../assets/images/sample-profile.png"),
      badges: ["Honor Roll", "Science Fair Winner", "Perfect Attendance"],
      achievements: [
        "First place in Regional Science Fair",
        "Student of the Month - March",
        "Mathematics Olympiad Participant",
      ],
    },
    {
      year: "2023",
      grade: "Grade 9",
      gpa: "3.6",
      profileImage: require("../../../../assets/images/sample-profile.png"),
      badges: ["Sports Captain", "Debate Team", "Community Service"],
      achievements: [
        "Football Team Captain",
        "Inter-school Debate Competition - 2nd place",
        "100+ hours community service",
      ],
    },
    {
      year: "2022",
      grade: "Grade 8",
      gpa: "3.4",
      profileImage: require("../../../../assets/images/sample-profile.png"),
      badges: ["Art Club", "Library Helper", "Good Conduct"],
      achievements: [
        "Art Exhibition Participant",
        "Library Volunteer of the Year",
        "Perfect Behavior Record",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Activity Feed</Text>
          <Text style={styles.subGreetingText}>Welcome to School Life</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.activeCategoryTab,
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <MaterialIcons
                  name={category.icon}
                  size={20}
                  color={
                    activeCategory === category.id
                      ? "#FFFFFF"
                      : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category.id && styles.activeCategoryText,
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Announcements List */}
        <View style={styles.announcementsContainer}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          {filteredAnnouncements.map((announcement) => (
            <TouchableOpacity
              key={announcement.id}
              style={styles.announcementCard}
              onPress={() => handleAnnouncementPress(announcement)}
            >
              <View style={styles.announcementHeader}>
                <View style={styles.announcementTitleContainer}>
                  <Text style={styles.announcementTitle}>
                    {announcement.title}
                  </Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      {
                        backgroundColor: getPriorityColor(
                          announcement.priority
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {announcement.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.announcementDate}>{announcement.date}</Text>
              </View>

              <Text style={styles.announcementContent} numberOfLines={2}>
                {announcement.content}
              </Text>

              {announcement.image && (
                <Image
                  source={announcement.image}
                  style={styles.announcementImage}
                />
              )}

              <View style={styles.announcementFooter}>
                <Text style={styles.categoryBadge}>
                  #{announcement.category}
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
            </TouchableOpacity>
          ))}
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Navigate to School Events")}
            >
              <MaterialIcons
                name="event"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>School Events</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Navigate to Student Directory")}
            >
              <MaterialIcons
                name="people"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Student Directory</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Navigate to School Gallery")}
            >
              <MaterialIcons
                name="photo-library"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Photo Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Navigate to School News")}
            >
              <MaterialIcons
                name="article"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>School News</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* School Feed Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>School Feed</Text>
          <View style={styles.feedContainer}>
            {schoolFeed.map((post) => (
              <View key={post.id} style={styles.feedCard}>
                <View style={styles.feedHeader}>
                  <Image
                    source={post.authorImage}
                    style={styles.feedAuthorImage}
                  />
                  <View style={styles.feedAuthorInfo}>
                    <Text style={styles.feedAuthorName}>{post.author}</Text>
                    <Text style={styles.feedTimestamp}>{post.timestamp}</Text>
                  </View>
                </View>

                <Text style={styles.feedContent}>{post.content}</Text>

                <View style={styles.feedActions}>
                  <TouchableOpacity
                    style={styles.feedActionButton}
                    onPress={() => handleLikePress(post.id)}
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

                  {/* <TouchableOpacity style={styles.feedActionButton}>
                    <MaterialIcons name="comment" size={20} color="#65676B" />
                    <Text style={styles.feedActionText}>{post.comments}</Text>
                  </TouchableOpacity> */}
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
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 120,
  },
  // Greeting Section Styles
  greetingSection: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  welcomeSection: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  welcomeTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  welcomeSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  categoryContainer: {
    marginBottom: theme.spacing.lg,
  },
  categoryScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeCategoryTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  announcementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  announcementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    marginBottom: theme.spacing.sm,
  },
  announcementTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  announcementTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
    color: "#FFFFFF",
  },
  announcementDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
  },
  announcementContent: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  announcementImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    resizeMode: "cover",
  },
  announcementFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },

  // Section Container
  sectionContainer: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  // School Feed Styles
  feedContainer: {
    gap: theme.spacing.md,
  },
  feedCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  feedAuthorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  feedAuthorInfo: {
    flex: 1,
  },
  feedAuthorName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  feedTimestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  feedContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  feedActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  feedActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  feedActionText: {
    fontSize: 14,
    color: "#65676B",
    fontWeight: "500",
  },
  feedActionTextActive: {
    color: "#4267B2",
  },

  // Student Timeline Styles
  timelineContainer: {
    paddingLeft: theme.spacing.sm,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: theme.spacing.lg,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  timelineYear: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: theme.spacing.xs,
  },
  timelineYearText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  timelineLine: {
    width: 2,
    height: 60,
    backgroundColor: "#E0E0E0",
  },
  timelineContent: {
    flex: 1,
  },
  timelineCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  timelineProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.sm,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineGrade: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  timelineGPA: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },
  achievementsContainer: {
    marginTop: theme.spacing.xs,
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  achievementText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },

  // Tab Navigation Styles (matching ParentHomeScreen.js)
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    justifyContent: "space-between",
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

  // Meeting Cards Styles
  meetingsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  meetingCard: {
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  meetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  meetingDateContainer: {
    flex: 1,
  },
  meetingDate: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  meetingTime: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  settingsButton: {
    padding: 4,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  meetingSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
  },
  meetingDuration: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: theme.spacing.sm,
  },
  meetingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
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
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
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
    fontSize: 12,
    fontWeight: "600",
    color: "#000000",
  },
  meetingIdContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  meetingStartedText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  meetingIdText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginTop: 2,
  },
});

export default SchoolLifeMain;
