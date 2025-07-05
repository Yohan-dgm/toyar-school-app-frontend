import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { TCard } from "@/components/ui/TCard";
import { Bell } from "@/lib/icons";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "urgent" | "info" | "reminder";
  timestamp: string;
  isRead: boolean;
}

interface AnnouncementsProps {
  userRole: "parent" | "educator" | "student";
}

export const Announcements: React.FC<AnnouncementsProps> = ({ userRole }) => {
  // Mock data - replace with actual API call
  const getMockAnnouncements = (): Announcement[] => {
    const baseAnnouncements: Announcement[] = [
      {
        id: "1",
        title: "School Closure Notice",
        message: "School will be closed tomorrow due to maintenance work.",
        type: "urgent" as const,
        timestamp: "1 hour ago",
        isRead: false,
      },
      {
        id: "2",
        title: "Lunch Menu Update",
        message: "New vegetarian options added to the cafeteria menu.",
        type: "info" as const,
        timestamp: "3 hours ago",
        isRead: true,
      },
    ];

    // Add role-specific announcements
    if (userRole === "parent") {
      baseAnnouncements.unshift({
        id: "parent-1",
        title: "Fee Payment Reminder",
        message:
          "Monthly fees are due by the 15th of this month. Please make payment to avoid late charges.",
        type: "reminder" as const,
        timestamp: "30 minutes ago",
        isRead: false,
      });
    }

    if (userRole === "educator") {
      baseAnnouncements.unshift({
        id: "edu-1",
        title: "Grade Submission Deadline",
        message: "Please submit all grades for mid-term exams by Friday 5 PM.",
        type: "urgent" as const,
        timestamp: "45 minutes ago",
        isRead: false,
      });
    }

    if (userRole === "student") {
      baseAnnouncements.unshift({
        id: "stu-1",
        title: "Exam Schedule Released",
        message:
          "Final exam schedule has been posted on the student portal. Check your timetable.",
        type: "info" as const,
        timestamp: "2 hours ago",
        isRead: false,
      });
    }

    return baseAnnouncements;
  };

  const announcements = getMockAnnouncements();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "#FF6B6B";
      case "info":
        return "#4ECDC4";
      case "reminder":
        return "#FFD93D";
      default:
        return "#E0E0E0";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return "🚨";
      case "info":
        return "ℹ️";
      case "reminder":
        return "⏰";
      default:
        return "📢";
    }
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <TouchableOpacity style={styles.announcementContainer}>
      <TCard
        style={[styles.announcementCard, !item.isRead && styles.unreadCard]}
      >
        {/* Header */}
        <View style={styles.announcementHeader}>
          <View style={styles.typeContainer}>
            <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(item.type) },
              ]}
            >
              <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

        {/* Content */}
        <View style={styles.announcementContent}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementMessage}>{item.message}</Text>
        </View>

        {/* Unread Indicator */}
        {!item.isRead && <View style={styles.unreadIndicator} />}
      </TCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {announcements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No announcements</Text>
          <Text style={styles.emptySubtext}>Check back later for updates</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncement}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scroll since it's inside ScrollView
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  announcementContainer: {
    marginBottom: 12,
  },
  announcementCard: {
    position: "relative",
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#8B45FF",
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 12,
    color: "#999999",
  },
  announcementContent: {
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
    lineHeight: 22,
  },
  announcementMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  unreadIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B45FF",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#CCCCCC",
    marginTop: 4,
  },
});

export default Announcements;
