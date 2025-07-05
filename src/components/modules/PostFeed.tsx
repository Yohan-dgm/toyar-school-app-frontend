import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { TCard } from "@/components/ui/TCard";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  category: string;
  imageUrl?: string;
  priority: "high" | "medium" | "low";
}

interface PostFeedProps {
  userRole: "parent" | "educator" | "student";
}

export const PostFeed: React.FC<PostFeedProps> = ({ userRole }) => {
  // Mock data - replace with actual API call
  const getMockPosts = (): Post[] => {
    const basePosts = [
      {
        id: "1",
        title: "School Sports Day 2024",
        content:
          "Join us for our annual sports day celebration. All students and parents are welcome to participate in this exciting event.",
        author: "Principal Johnson",
        timestamp: "2 hours ago",
        category: "Event",
        priority: "high" as const,
        imageUrl: undefined,
      },
      {
        id: "2",
        title: "Parent-Teacher Conference",
        content:
          "Schedule your meetings with teachers to discuss your child's progress. Booking opens next Monday.",
        author: "Admin Office",
        timestamp: "5 hours ago",
        category: "Meeting",
        priority: "medium" as const,
      },
      {
        id: "3",
        title: "New Library Books Available",
        content:
          "We've added 200+ new books to our library collection. Students can now borrow them during library hours.",
        author: "Librarian Smith",
        timestamp: "1 day ago",
        category: "Update",
        priority: "low" as const,
      },
    ];

    // Add role-specific posts
    if (userRole === "educator") {
      basePosts.unshift({
        id: "edu-1",
        title: "Staff Meeting Tomorrow",
        content:
          "Monthly staff meeting scheduled for tomorrow at 3 PM in the conference room. Please bring your progress reports.",
        author: "HR Department",
        timestamp: "30 minutes ago",
        category: "Staff",
        priority: "high" as const,
        imageUrl: undefined,
      });
    }

    if (userRole === "student") {
      basePosts.unshift({
        id: "stu-1",
        title: "Assignment Deadline Reminder",
        content:
          "Don't forget to submit your science project by Friday. Late submissions will not be accepted.",
        author: "Ms. Anderson",
        timestamp: "1 hour ago",
        category: "Assignment",
        priority: "high" as const,
        imageUrl: undefined,
      });
    }

    return basePosts;
  };

  const posts = getMockPosts();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF6B6B";
      case "medium":
        return "#FFD93D";
      case "low":
        return "#6BCF7F";
      default:
        return "#E0E0E0";
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postContainer}>
      <TCard style={styles.postCard}>
        {/* Priority Indicator */}
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        />

        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postMeta}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postText}>{item.content}</Text>
        </View>

        {/* Post Footer */}
        <View style={styles.postFooter}>
          <Text style={styles.author}>By {item.author}</Text>
        </View>
      </TCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scroll since it's inside ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  postContainer: {
    marginBottom: 12,
  },
  postCard: {
    padding: 0,
    overflow: "hidden",
  },
  priorityIndicator: {
    height: 4,
    width: "100%",
  },
  postHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B45FF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#999999",
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 22,
  },
  postText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  postFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  author: {
    fontSize: 12,
    color: "#999999",
    fontStyle: "italic",
  },
});

export default PostFeed;
