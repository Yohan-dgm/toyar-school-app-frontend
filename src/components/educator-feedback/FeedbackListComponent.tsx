import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface FeedbackItem {
  id: number;
  student_id: number;
  grade_level_id: number;
  grade_level_class_id: number;
  edu_fb_category_id: number;
  rating: string;
  decline_reason: string | null;
  status: number;
  created_by_designation: string;
  created_at: string;
  updated_at: string;
  created_by: {
    id: number;
    call_name_with_title: string;
  };
  student: {
    id: number;
    full_name: string;
    admission_number: string;
    grade_level_id: number;
  };
  grade_level: {
    id: number;
    name: string;
  };
  grade_level_class: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  subcategories: {
    id: number;
    name: string;
    category_id: number;
  }[];
  evaluations: {
    id: number;
    edu_fb_id: number;
    edu_fd_evaluation_type_id: number;
    reviewer_feedback: string;
    created_at: string;
    evaluation_type: {
      id: number;
      name: string;
      status_code: number;
    };
  }[];
  comments: {
    id: number;
    edu_fb_id: number;
    comment: string;
    is_active: boolean | null;
    created_by: {
      id: number;
      call_name_with_title: string;
    };
    created_at: string;
    updated_at: string;
  }[];
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

interface FeedbackListComponentProps {
  feedbacks: FeedbackItem[];
  pagination?: PaginationInfo;
  isLoading?: boolean;
  error?: any;
  onRefresh?: () => void;
  refreshing?: boolean;

  // Pagination
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onPageChange?: (page: number) => void;

  // Item actions
  onFeedbackPress?: (feedback: FeedbackItem) => void;
  onEditFeedback?: (feedback: FeedbackItem) => void;
  onDeleteFeedback?: (feedback: FeedbackItem) => void;
  onItemAction?: (item: FeedbackItem, action: string) => void;

  // Display options
  showPagination?: boolean;
  showActions?: boolean;
  showEducatorInfo?: boolean;
  emptyMessage?: string;
}

/**
 * FeedbackListComponent - Reusable component for displaying feedback lists
 *
 * Features:
 * - Displays feedback in a scrollable list with cards
 * - Shows student and educator information
 * - Supports pagination with navigation controls
 * - Pull-to-refresh functionality
 * - Loading and error states
 * - Individual feedback actions (view, edit, delete)
 * - Rating display with color coding
 * - Responsive card design
 */
const FeedbackListComponent: React.FC<FeedbackListComponentProps> = ({
  feedbacks,
  pagination,
  isLoading = false,
  error = null,
  onRefresh,
  refreshing = false,
  onNextPage,
  onPreviousPage,
  onPageChange,
  onFeedbackPress,
  onEditFeedback,
  onDeleteFeedback,
  onItemAction,
  showPagination = true,
  showActions = true,
  showEducatorInfo = true,
  emptyMessage = "No feedback found. Try adjusting your filters or create the first feedback.",
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (itemId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Get rating display with color
  const getRatingDisplay = (rating: string | number) => {
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    if (!numRating || numRating === 0)
      return { text: "No rating", color: "#999", icon: "help-outline" };
    if (numRating <= 2)
      return {
        text: "Needs Improvement",
        color: "#F44336",
        icon: "trending-down",
      };
    if (numRating <= 3.5)
      return { text: "Satisfactory", color: "#FF9800", icon: "trending-flat" };
    if (numRating <= 4.5)
      return { text: "Good", color: "#4CAF50", icon: "trending-up" };
    return { text: "Excellent", color: "#2E7D32", icon: "star" };
  };

  // Get student profile image
  const getStudentProfileImage = (student: any): string => {
    return student.profile_image || "https://via.placeholder.com/40?text=👤";
  };

  // Render pagination controls
  const renderPagination = () => {
    if (!showPagination || !pagination) return null;

    const {
      current_page,
      total_pages,
      total_count,
      page_size,
      has_next,
      has_previous,
    } = pagination;
    const startItem = (current_page - 1) * page_size + 1;
    const endItem = Math.min(current_page * page_size, total_count);

    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationInfo}>
          Showing {startItem}-{endItem} of {total_count} feedback
          {total_count !== 1 ? "s" : ""}
        </Text>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              !has_previous && styles.disabledPaginationButton,
            ]}
            onPress={onPreviousPage}
            disabled={!has_previous}
          >
            <MaterialIcons
              name="chevron-left"
              size={20}
              color={has_previous ? "#920734" : "#CCCCCC"}
            />
            <Text
              style={[
                styles.paginationButtonText,
                !has_previous && styles.disabledPaginationButtonText,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page {current_page} of {total_pages}
          </Text>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              !has_next && styles.disabledPaginationButton,
            ]}
            onPress={onNextPage}
            disabled={!has_next}
          >
            <Text
              style={[
                styles.paginationButtonText,
                !has_next && styles.disabledPaginationButtonText,
              ]}
            >
              Next
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={has_next ? "#920734" : "#CCCCCC"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render feedback item
  const renderFeedbackItem = (feedback: FeedbackItem) => {
    const ratingDisplay = getRatingDisplay(feedback.rating);
    const isExpanded = expandedItems.has(feedback.id);
    const latestComment = feedback.comments?.[0]?.comment || "No comments";
    const evaluationType =
      feedback.evaluations?.[0]?.evaluation_type?.name || "No evaluation";

    return (
      <View key={feedback.id} style={styles.feedbackCard}>
        {/* Main Summary Row */}
        <TouchableOpacity
          style={styles.summaryRow}
          onPress={() => toggleExpanded(feedback.id)}
          activeOpacity={0.7}
        >
          <View style={styles.summaryContent}>
            <View style={styles.leftSection}>
              <Text style={styles.studentName}>
                {feedback.student.full_name}
              </Text>
              <Text style={styles.admissionNumber}>
                {feedback.student.admission_number}
              </Text>
              <Text style={styles.gradeLevel}>{feedback.grade_level.name}</Text>
            </View>

            <View style={styles.middleSection}>
              <Text style={styles.evaluationType}>{evaluationType}</Text>
              <Text style={styles.comment} numberOfLines={1}>
                {latestComment}
              </Text>
              <Text style={styles.createdBy}>
                By: {feedback.created_by.call_name_with_title}
              </Text>
              {/* Debug: Show subcategories count */}
              <Text style={styles.debugSubcategories}>
                🏷️ Subcategories: {feedback.subcategories?.length || 0}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <MaterialIcons
                name={isExpanded ? "expand-less" : "expand-more"}
                size={24}
                color="#920734"
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{feedback.category.name}</Text>
              </View>
              {feedback.subcategories && feedback.subcategories.length > 0 && (
                <View style={styles.subcategoriesSection}>
                  <Text style={styles.detailLabel}>Subcategories:</Text>
                  <View style={styles.subcategoriesContainer}>
                    {feedback.subcategories.map((subcategory) => (
                      <View key={subcategory.id} style={styles.subcategoryChip}>
                        <Text style={styles.subcategoryText}>
                          {subcategory.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Class:</Text>
                <Text style={styles.detailValue}>
                  {feedback.grade_level_class.name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rating:</Text>
                <Text style={styles.detailValue}>
                  {feedback.rating || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: feedback.status === 1 ? "#4CAF50" : "#F44336" },
                  ]}
                >
                  {feedback.status === 1 ? "Active" : "Inactive"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(feedback.created_at)}
                </Text>
              </View>
            </View>

            {/* Evaluations */}
            {feedback.evaluations && feedback.evaluations.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Evaluations</Text>
                {feedback.evaluations.map((evaluation) => (
                  <View key={evaluation.id} style={styles.evaluationItem}>
                    <Text style={styles.evaluationTitle}>
                      {evaluation.evaluation_type.name}
                    </Text>
                    <Text style={styles.evaluationFeedback}>
                      {evaluation.reviewer_feedback}
                    </Text>
                    <Text style={styles.evaluationDate}>
                      {formatDate(evaluation.created_at)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Comments */}
            {feedback.comments && feedback.comments.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Comments</Text>
                {feedback.comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                    <Text style={styles.commentAuthor}>
                      - {comment.created_by.call_name_with_title}
                    </Text>
                    <Text style={styles.commentDate}>
                      {formatDate(comment.created_at)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsExpanded}>
              <TouchableOpacity
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => onItemAction?.(feedback, "view")}
              >
                <MaterialIcons name="visibility" size={16} color="#920734" />
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onItemAction?.(feedback, "edit")}
              >
                <MaterialIcons name="edit" size={16} color="#4CAF50" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onItemAction?.(feedback, "delete")}
              >
                <MaterialIcons name="delete" size={16} color="#F44336" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Enhanced Debug logging
  console.log("🎯 FEEDBACK LIST COMPONENT - Received Props:", {
    timestamp: new Date().toISOString(),
    feedbacks,
    feedbacksCount: feedbacks.length,
    feedbacksType: typeof feedbacks,
    isArray: Array.isArray(feedbacks),
    firstFeedback: feedbacks[0],
    isLoading,
    isFetching: refreshing,
    hasError: !!error,
    errorType: error ? typeof error : null,
    errorMessage: error
      ? typeof error === "string"
        ? error
        : error.message || JSON.stringify(error)
      : null,
    errorDetails: error,
  });

  // Enhanced subcategories debugging
  console.log("🏷️ FEEDBACK LIST COMPONENT - Subcategories Debug:", {
    feedbacksWithSubcategories: feedbacks.filter(
      (f) => f.subcategories && f.subcategories.length > 0,
    ).length,
    totalSubcategories: feedbacks.reduce(
      (total, f) => total + (f.subcategories?.length || 0),
      0,
    ),
    subcategoriesDetails: feedbacks
      .map((feedback, index) => ({
        feedbackId: feedback.id,
        studentName: feedback.student?.full_name,
        subcategoriesCount: feedback.subcategories?.length || 0,
        subcategories:
          feedback.subcategories?.map((sub) => ({
            id: sub.id,
            name: sub.name,
            originalData: sub,
          })) || [],
        hasSubcategories: Boolean(
          feedback.subcategories && feedback.subcategories.length > 0,
        ),
      }))
      .slice(0, 3), // Show only first 3 for brevity
    sampleFeedbackWithAllData: feedbacks[0]
      ? {
          id: feedbacks[0].id,
          student: feedbacks[0].student,
          subcategories: feedbacks[0].subcategories,
          allKeys: Object.keys(feedbacks[0]),
        }
      : null,
  });

  // Loading state
  if (isLoading && feedbacks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#920734" />
        <Text style={styles.loadingText}>Loading feedback...</Text>
      </View>
    );
  }

  // Error state
  if (error && feedbacks.length === 0) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || error?.data?.message || "Unknown error occurred";

    const errorCode = error?.status || error?.data?.status || "No code";

    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#F44336" />
        <Text style={styles.errorTitle}>Failed to load feedback</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <Text style={styles.errorCode}>Error Code: {errorCode}</Text>

        {/* Debug information for error state */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>🔍 Error Debug Info:</Text>
          <Text style={styles.debugText}>• Error Type: {typeof error}</Text>
          <Text style={styles.debugText}>
            • Has Message: {error?.message ? "Yes" : "No"}
          </Text>
          <Text style={styles.debugText}>
            • Has Status: {error?.status ? "Yes" : "No"}
          </Text>
          <Text style={styles.debugText}>
            • Has Data: {error?.data ? "Yes" : "No"}
          </Text>
        </View>

        {onRefresh && (
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Empty state with enhanced debugging
  if (feedbacks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="feedback" size={48} color="#CCCCCC" />
        <Text style={styles.emptyTitle}>No Feedback Found</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>

        {/* Debug information for empty state */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>🔍 Debug Info:</Text>
          <Text style={styles.debugText}>
            • Loading: {isLoading ? "Yes" : "No"}
          </Text>
          <Text style={styles.debugText}>• Error: {error ? "Yes" : "No"}</Text>
          <Text style={styles.debugText}>
            • Feedbacks Array:{" "}
            {Array.isArray(feedbacks) ? "Array" : typeof feedbacks}
          </Text>
          <Text style={styles.debugText}>• Length: {feedbacks.length}</Text>
        </View>

        {onRefresh && (
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <MaterialIcons name="refresh" size={16} color="#920734" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#920734"]}
              tintColor="#920734"
            />
          ) : undefined
        }
      >
        {feedbacks.map(renderFeedbackItem)}

        {isLoading && feedbacks.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#920734" />
            <Text style={styles.loadingMoreText}>Loading more...</Text>
          </View>
        )}
      </ScrollView>

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  retryButton: {
    backgroundColor: "#920734",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#920734",
  },
  refreshButtonText: {
    color: "#920734",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  debugInfo: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFEAA7",
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 6,
  },
  debugText: {
    fontSize: 10,
    color: "#856404",
    marginBottom: 2,
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    paddingVertical: 8,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flex: 2,
    paddingRight: 12,
  },
  middleSection: {
    flex: 3,
    paddingHorizontal: 12,
  },
  rightSection: {
    flex: 0.5,
    alignItems: "center",
  },
  admissionNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  gradeLevel: {
    fontSize: 12,
    color: "#920734",
    fontWeight: "500",
  },
  evaluationType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  comment: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  createdBy: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  debugSubcategories: {
    fontSize: 10,
    color: "#920734",
    fontWeight: "600",
    marginTop: 2,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
    marginTop: 12,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  evaluationItem: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  evaluationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  evaluationFeedback: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  evaluationDate: {
    fontSize: 11,
    color: "#999",
  },
  commentItem: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  commentDate: {
    fontSize: 11,
    color: "#999",
  },
  actionButtonsExpanded: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  viewButton: {
    backgroundColor: "#F0F8FF",
    borderColor: "#920734",
  },
  editButton: {
    backgroundColor: "#F0FFF0",
    borderColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#FFF0F0",
    borderColor: "#F44336",
  },
  actionButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  studentImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#E0E0E0",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  studentMeta: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  categoryRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryText: {
    fontSize: 14,
    color: "#920734",
    fontWeight: "500",
    marginLeft: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 2,
  },
  subcategoriesSection: {
    marginBottom: 6,
  },
  subcategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  subcategoryChip: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  subcategoryText: {
    fontSize: 11,
    color: "#920734",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  feedbackFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  educatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  educatorText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  loadingMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  paginationContainer: {
    backgroundColor: "#F8F9FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paginationInfo: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#920734",
  },
  disabledPaginationButton: {
    backgroundColor: "#F5F5F5",
    borderColor: "#CCCCCC",
  },
  paginationButtonText: {
    fontSize: 14,
    color: "#920734",
    fontWeight: "500",
  },
  disabledPaginationButtonText: {
    color: "#CCCCCC",
  },
  pageInfo: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default FeedbackListComponent;
