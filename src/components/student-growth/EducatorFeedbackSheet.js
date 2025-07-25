import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { educatorFeedback } from "../../data/studentGrowthData";

const { width, height } = Dimensions.get("window");

const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <MaterialIcons
        key={i}
        name={i < rating ? "star" : "star-border"}
        size={size}
        color={i < rating ? "#FFD700" : "#E0E0E0"}
      />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

const FeedbackCard = ({ feedback, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const feedbackDate = new Date(timestamp);
    const diffInHours = Math.abs(now - feedbackDate) / 36e5;

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return feedbackDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(feedback.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  return (
    <View style={styles.feedbackCard}>
      {/* Header with student info */}
      <View style={styles.cardHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>SP</Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>
              Student Calling Name with Title
            </Text>
            <Text style={styles.admissionInfo}>Admission Number</Text>
            <Text style={styles.gradeInfo}>Grade Level</Text>
          </View>
        </View>
      </View>

      {/* Rating and Categories */}
      <View style={styles.ratingSection}>
        <StarRating rating={feedback.rating} size={18} />
        <Text style={styles.ratingText}>{feedback.rating.toFixed(1)}</Text>

        <View style={styles.categoriesContainer}>
          <View style={[styles.categoryTag, styles.primaryCategory]}>
            <MaterialIcons name="favorite" size={14} color="#FFFFFF" />
            <Text style={styles.categoryText}>{feedback.category}</Text>
          </View>
          <View style={styles.subCategoryTag}>
            <Text style={styles.subCategoryText}>
              sub:{feedback.subCategory}
            </Text>
          </View>
          <View style={styles.subCategoryTag}>
            <Text style={styles.subCategoryText}>sub:Category 3</Text>
          </View>
        </View>
      </View>

      {/* Metadata */}
      <View style={styles.metadataSection}>
        <Text style={styles.metadataTitle}>Metadata:</Text>
        <Text style={styles.metadataText}>
          By Educator - {feedback.metadata.educator}
        </Text>
        <Text style={styles.metadataText}>
          By Class Teacher - {feedback.metadata.class_teacher}
        </Text>
        <Text style={styles.metadataText}>
          By Principal - {feedback.metadata.principal}
        </Text>
        <Text style={styles.metadataText}>
          Approved By - {feedback.approved_by}
        </Text>

        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>
            {feedback.isRecent
              ? formatTimestamp(feedback.timestamp)
              : formatTimestamp(feedback.timestamp)}
          </Text>
        </View>
      </View>

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Comment</Text>
        <Text style={styles.commentText}>{feedback.comment}</Text>
      </View>

      {/* Reply Section */}
      <View style={styles.replySection}>
        {!showReplyInput ? (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => setShowReplyInput(true)}
          >
            <MaterialIcons
              name="reply"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.replyButtonText}>Reply to Educator</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Parent reply message"
              placeholderTextColor="#999999"
              value={replyText}
              onChangeText={setReplyText}
              multiline
              numberOfLines={3}
            />
            <View style={styles.replyActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowReplyInput(false);
                  setReplyText("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendReply}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const EducatorFeedbackSheet = ({ isVisible, onClose }) => {
  const bottomSheetRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const filteredFeedback = useMemo(() => {
    if (selectedFilter === "all") return educatorFeedback;
    return educatorFeedback.filter(
      (feedback) =>
        feedback.category
          .toLowerCase()
          .includes(selectedFilter.toLowerCase()) ||
        feedback.subject.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  }, [selectedFilter]);

  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const handleReply = (feedbackId, replyText) => {
    console.log("Reply to feedback:", feedbackId, replyText);
    // Here you would typically send the reply to your backend
  };

  const filterOptions = [
    { id: "all", label: "All Feedback", icon: "list" },
    { id: "academic", label: "Academic", icon: "school" },
    { id: "behaviour", label: "Behaviour", icon: "psychology" },
    { id: "extracurricular", label: "Extra Curricular", icon: "sports" },
    { id: "recent", label: "Recent (24h)", icon: "schedule" },
    { id: "high-rating", label: "High Rating (4+)", icon: "star" },
    { id: "needs-attention", label: "Needs Attention (<3)", icon: "warning" },
  ];

  const getFilteredFeedback = () => {
    let filtered = educatorFeedback;

    switch (selectedFilter) {
      case "academic":
        filtered = filtered.filter((f) =>
          f.category.toLowerCase().includes("academic")
        );
        break;
      case "behaviour":
        filtered = filtered.filter((f) =>
          f.category.toLowerCase().includes("behaviour")
        );
        break;
      case "extracurricular":
        filtered = filtered.filter((f) =>
          f.category.toLowerCase().includes("extra")
        );
        break;
      case "recent":
        filtered = filtered.filter((f) => f.isRecent);
        break;
      case "high-rating":
        filtered = filtered.filter((f) => f.rating >= 4);
        break;
      case "needs-attention":
        filtered = filtered.filter((f) => f.rating < 3);
        break;
      default:
        break;
    }

    return filtered;
  };

  if (!isVisible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Educator Feedback</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterTab,
                selectedFilter === option.id && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedFilter(option.id)}
            >
              <MaterialIcons
                name={option.icon}
                size={16}
                color={selectedFilter === option.id ? "#FFFFFF" : "#666666"}
              />
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === option.id && styles.activeFilterTabText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feedback List */}
      <BottomSheetScrollView style={styles.scrollContainer}>
        {getFilteredFeedback().map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            onReply={handleReply}
          />
        ))}

        {getFilteredFeedback().length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="feedback" size={64} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>
              No feedback found for "
              {filterOptions.find((f) => f.id === selectedFilter)?.label}"
            </Text>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "#E0E0E0",
    width: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
  closeButton: {
    padding: 4,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    gap: 6,
  },
  activeFilterTab: {
    backgroundColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardHeader: {
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#920734",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
  admissionInfo: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  gradeInfo: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  starContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginRight: 12,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  primaryCategory: {
    backgroundColor: "#920734",
  },
  categoryText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: "#FFFFFF",
  },
  subCategoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  subCategoryText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  metadataSection: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  metadataTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 4,
  },
  metadataText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginBottom: 2,
  },
  timestampContainer: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  timestampText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#999999",
  },
  commentSection: {
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#333333",
    lineHeight: 20,
  },
  replySection: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  replyButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  replyInputContainer: {
    gap: 12,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#000000",
    textAlignVertical: "top",
    minHeight: 80,
  },
  replyActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  sendButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#999999",
    marginTop: 16,
  },
});

export default EducatorFeedbackSheet;
