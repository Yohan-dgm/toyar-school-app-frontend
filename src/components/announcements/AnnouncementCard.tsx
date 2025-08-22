import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  AnnouncementItem,
  AnnouncementCardProps,
  PRIORITY_COLORS,
  STATUS_COLORS,
} from "../../types/communication-management";

const { width: screenWidth } = Dimensions.get("window");

export default function AnnouncementCard({
  announcement,
  onView,
  onLike,
  onBookmark,
  onShare,
  showActions = true,
  compact = false,
}: AnnouncementCardProps) {
  const handleView = () => onView?.(announcement.id);
  const handleLike = () => onLike?.(announcement.id);
  const handleBookmark = () => onBookmark?.(announcement.id);
  const handleShare = () => onShare?.(announcement.id);

  const priorityColor = PRIORITY_COLORS[announcement.priority_level];
  const statusColor = STATUS_COLORS[announcement.status];

  const renderPriorityBadge = () => (
    <View
      style={[
        styles.priorityBadge,
        {
          backgroundColor: priorityColor + "20",
          borderColor: priorityColor + "40",
        },
      ]}
    >
      <Text style={[styles.priorityText, { color: priorityColor }]}>
        {announcement.priority_label} Priority
      </Text>
    </View>
  );

  const renderStatusBadge = () => (
    <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
      <Text style={[styles.statusText, { color: statusColor }]}>
        {announcement.status_label}
      </Text>
    </View>
  );

  const renderCategoryBadge = () => (
    <View
      style={[
        styles.categoryBadge,
        {
          backgroundColor: announcement.category.color + "20",
        },
      ]}
    >
      <MaterialIcons
        name={announcement.category.icon as any}
        size={12}
        color={announcement.category.color}
        style={styles.categoryIcon}
      />
      <Text
        style={[styles.categoryText, { color: announcement.category.color }]}
      >
        {announcement.category.name}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {announcement.is_pinned && (
          <View style={styles.pinnedBadge}>
            <MaterialIcons name="push-pin" size={14} color="#6366f1" />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}

        {announcement.is_featured && (
          <View style={styles.featuredBadge}>
            <MaterialIcons name="star" size={14} color="#f59e0b" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>

      <View style={styles.headerRight}>
        <Text style={styles.timeAgo}>{announcement.time_ago}</Text>
      </View>
    </View>
  );

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title} numberOfLines={compact ? 2 : 3}>
        {announcement.title}
      </Text>

      <View style={styles.badgeContainer}>
        {renderPriorityBadge()}
        {renderStatusBadge()}
        {renderCategoryBadge()}
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {announcement.image_url && (
        <Image
          source={{ uri: announcement.image_url }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.excerpt} numberOfLines={compact ? 2 : 4}>
        {announcement.excerpt}
      </Text>

      {announcement.tags_array.length > 0 && !compact && (
        <View style={styles.tagsContainer}>
          {announcement.tags_array.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {announcement.tags_array.length > 3 && (
            <Text style={styles.moreTagsText}>
              +{announcement.tags_array.length - 3} more
            </Text>
          )}
        </View>
      )}

      {announcement.attachment_urls &&
        announcement.attachment_urls.length > 0 && (
          <View style={styles.attachmentIndicator}>
            <MaterialIcons name="attach-file" size={16} color="#6b7280" />
            <Text style={styles.attachmentText}>
              {announcement.attachment_urls.length} attachment
              {announcement.attachment_urls.length > 1 ? "s" : ""}
            </Text>
          </View>
        )}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.stat}>
        <MaterialIcons name="visibility" size={14} color="#6b7280" />
        <Text style={styles.statText}>{announcement.view_count}</Text>
      </View>

      <View style={styles.stat}>
        <MaterialIcons
          name={announcement.is_liked ? "favorite" : "favorite-border"}
          size={14}
          color={announcement.is_liked ? "#ef4444" : "#6b7280"}
        />
        <Text style={styles.statText}>{announcement.like_count}</Text>
      </View>

      <View style={styles.stat}>
        <MaterialIcons name="access-time" size={14} color="#6b7280" />
        <Text style={styles.statText}>{announcement.read_time} min read</Text>
      </View>

      <View style={styles.statsSpacer} />

      <Text style={styles.creatorText}>by {announcement.creator.name}</Text>
    </View>
  );

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.likeButton,
            announcement.is_liked && styles.likeButtonActive,
          ]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={announcement.is_liked ? "favorite" : "favorite-border"}
            size={18}
            color={announcement.is_liked ? "#ffffff" : "#ef4444"}
          />
          <Text
            style={[
              styles.actionButtonText,
              announcement.is_liked && styles.actionButtonTextActive,
            ]}
          >
            {announcement.is_liked ? "Liked" : "Like"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.bookmarkButton,
            announcement.is_bookmarked && styles.bookmarkButtonActive,
          ]}
          onPress={handleBookmark}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={announcement.is_bookmarked ? "bookmark" : "bookmark-border"}
            size={18}
            color={announcement.is_bookmarked ? "#ffffff" : "#3b82f6"}
          />
          <Text
            style={[
              styles.actionButtonText,
              announcement.is_bookmarked && styles.actionButtonTextActive,
            ]}
          >
            {announcement.is_bookmarked ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" size={18} color="#6b7280" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <View style={styles.actionsSpacer} />

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleView}
          activeOpacity={0.7}
        >
          <Text style={styles.readMoreText}>Read More</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard]}
      onPress={handleView}
      activeOpacity={0.7}
    >
      {renderHeader()}
      {renderTitle()}
      {renderContent()}
      {renderStats()}
      {renderActions()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  compactCard: {
    padding: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  pinnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366f1",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#f59e0b",
  },
  timeAgo: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  categoryIcon: {
    marginRight: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  contentContainer: {
    marginBottom: 12,
  },
  featuredImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  excerpt: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  moreTagsText: {
    fontSize: 11,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  attachmentIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statsSpacer: {
    flex: 1,
  },
  creatorText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    fontStyle: "italic",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  actionButtonTextActive: {
    color: "#ffffff",
  },
  likeButton: {
    borderWidth: 1,
    borderColor: "#ef4444",
    backgroundColor: "transparent",
  },
  likeButtonActive: {
    backgroundColor: "#ef4444",
  },
  bookmarkButton: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    backgroundColor: "transparent",
  },
  bookmarkButtonActive: {
    backgroundColor: "#3b82f6",
  },
  actionsSpacer: {
    flex: 1,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
});
