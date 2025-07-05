import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
// Header and BottomNavigation now handled by parent layout

const EducatorFeedbackMain = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  // Tab press handling now done by layout

  const handleChatPress = (teacher) => {
    setActiveChat(teacher);
    console.log("Navigate to chat with:", teacher.name);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const teachers = [
    {
      id: 1,
      name: "Mrs. Sarah Perera",
      subject: "Mathematics",
      avatar: "👩‍🏫",
      lastMessage: "Great progress in algebra this week!",
      lastMessageTime: "2 hours ago",
      unreadCount: 2,
      status: "online",
    },
    {
      id: 2,
      name: "Mr. David Wilson",
      subject: "Science",
      avatar: "👨‍🔬",
      lastMessage: "Please review the chemistry homework",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      status: "offline",
    },
    {
      id: 3,
      name: "Ms. Emily Davis",
      subject: "English Literature",
      avatar: "👩‍💼",
      lastMessage: "Excellent essay on Shakespeare!",
      lastMessageTime: "3 days ago",
      unreadCount: 1,
      status: "online",
    },
    {
      id: 4,
      name: "Mr. Michael Brown",
      subject: "Physical Education",
      avatar: "🏃‍♂️",
      lastMessage: "Sports day preparation meeting",
      lastMessageTime: "1 week ago",
      unreadCount: 0,
      status: "offline",
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: "Schedule Meeting",
      icon: "schedule",
      color: "#4CAF50",
      action: () => console.log("Schedule Meeting"),
    },
    {
      id: 2,
      title: "View Reports",
      icon: "assessment",
      color: "#2196F3",
      action: () => console.log("View Reports"),
    },
    {
      id: 3,
      title: "Send Feedback",
      icon: "feedback",
      color: "#FF9800",
      action: () => console.log("Send Feedback"),
    },
    {
      id: 4,
      title: "Parent Portal",
      icon: "web",
      color: "#9C27B0",
      action: () => console.log("Parent Portal"),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>💬 Educator Feedback</Text>
          <Text style={styles.headerSubtitle}>
            Communicate directly with your child's teachers and educators
          </Text>
        </View>
        {/* Recent Feedback */}
        <View style={styles.recentFeedbackContainer}>
          <Text style={styles.sectionTitle}>Recent Feedback</Text>

          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Text style={styles.feedbackTitle}>Weekly Progress Report</Text>
              <Text style={styles.feedbackDate}>March 15, 2024</Text>
            </View>
            <Text style={styles.feedbackContent}>
              Your child has shown excellent improvement in mathematics this
              week. Keep up the great work with daily practice!
            </Text>
            <View style={styles.feedbackFooter}>
              <Text style={styles.feedbackTeacher}>- Mrs. Sarah Perera</Text>
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Text style={styles.feedbackTitle}>
                Science Project Evaluation
              </Text>
              <Text style={styles.feedbackDate}>March 12, 2024</Text>
            </View>
            <Text style={styles.feedbackContent}>
              Outstanding creativity in the volcano project! The presentation
              was well-structured and demonstrated good understanding of the
              concepts.
            </Text>
            <View style={styles.feedbackFooter}>
              <Text style={styles.feedbackTeacher}>- Mr. David Wilson</Text>
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Quick Message */}
        <View style={styles.quickMessageContainer}>
          <Text style={styles.sectionTitle}>Send Quick Message</Text>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message to all teachers..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Teachers Chat List */}
        <View style={styles.chatListContainer}>
          <View style={styles.chatListHeader}>
            <Text style={styles.sectionTitle}>Teachers & Educators</Text>
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons
                name="search"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {teachers.map((teacher) => (
            <TouchableOpacity
              key={teacher.id}
              style={styles.chatItem}
              onPress={() => handleChatPress(teacher)}
            >
              <View style={styles.chatAvatar}>
                <Text style={styles.avatarText}>{teacher.avatar}</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        teacher.status === "online" ? "#4CAF50" : "#9E9E9E",
                    },
                  ]}
                />
              </View>

              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.teacherName}>{teacher.name}</Text>
                  <Text style={styles.messageTime}>
                    {teacher.lastMessageTime}
                  </Text>
                </View>

                <Text style={styles.subjectText}>{teacher.subject}</Text>

                <View style={styles.messagePreview}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {teacher.lastMessage}
                  </Text>
                  {teacher.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>
                        {teacher.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <MaterialIcons name="chevron-right" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  { borderLeftColor: action.color },
                ]}
                onPress={action.action}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color },
                  ]}
                >
                  <MaterialIcons name={action.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#666666" />
              </TouchableOpacity>
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
  headerSection: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    gap: theme.spacing.sm,
  },
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  quickActionText: {
    flex: 1,
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  chatListContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  chatListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  searchButton: {
    padding: theme.spacing.xs,
  },
  chatItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatAvatar: {
    position: "relative",
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  teacherName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  messageTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
  },
  subjectText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  unreadText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  recentFeedbackContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  feedbackCard: {
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
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  feedbackTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  feedbackDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
  },
  feedbackContent: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  feedbackFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  feedbackTeacher: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
  },
  viewMoreButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
  },
  quickMessageContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  messageInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageInput: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    textAlignVertical: "top",
    marginRight: theme.spacing.sm,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EducatorFeedbackMain;
