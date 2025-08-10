import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
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

interface FeedbackActionModalProps {
  visible: boolean;
  feedback: FeedbackItem | null;
  onClose: () => void;
  onEdit: (feedback: FeedbackItem) => void;
  onDelete: (feedback: FeedbackItem) => void;
  onViewDetails: (feedback: FeedbackItem) => void;
}

const FeedbackActionModal: React.FC<FeedbackActionModalProps> = ({
  visible,
  feedback,
  onClose,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  if (!feedback) return null;

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getRatingColor = (rating: string | number) => {
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    if (!numRating || numRating === 0) return "#999";
    if (numRating <= 2) return "#F44336";
    if (numRating <= 3.5) return "#FF9800";
    if (numRating <= 4.5) return "#4CAF50";
    return "#2E7D32";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Feedback Details</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => onEdit(feedback)}
            >
              <MaterialIcons name="edit" size={20} color="#920734" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => onDelete(feedback)}
            >
              <MaterialIcons name="delete" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Student Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Student Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={20} color="#920734" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>
                    {feedback.student.full_name}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="badge" size={20} color="#920734" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Admission Number</Text>
                  <Text style={styles.infoValue}>
                    {feedback.student.admission_number}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="school" size={20} color="#920734" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Grade & Class</Text>
                  <Text style={styles.infoValue}>
                    {feedback.grade_level.name} -{" "}
                    {feedback.grade_level_class.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Feedback Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feedback Details</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <MaterialIcons name="category" size={20} color="#920734" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Category</Text>
                  <Text style={styles.infoValue}>{feedback.category.name}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="star"
                  size={20}
                  color={getRatingColor(feedback.rating)}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Rating</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: getRatingColor(feedback.rating) },
                    ]}
                  >
                    {feedback.rating || "No rating"}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name={feedback.status === 1 ? "check-circle" : "cancel"}
                  size={20}
                  color={feedback.status === 1 ? "#4CAF50" : "#F44336"}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: feedback.status === 1 ? "#4CAF50" : "#F44336" },
                    ]}
                  >
                    {feedback.status === 1 ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color="#920734"
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Created By</Text>
                  <Text style={styles.infoValue}>
                    {feedback.created_by.call_name_with_title}
                    {feedback.created_by_designation && (
                      <Text style={styles.designation}>
                        {" "}
                        ({feedback.created_by_designation})
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="schedule" size={20} color="#920734" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Created Date</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(feedback.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Evaluations */}
          {feedback.evaluations && feedback.evaluations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evaluations</Text>
              {feedback.evaluations.map((evaluation) => (
                <View key={evaluation.id} style={styles.evaluationCard}>
                  <View style={styles.evaluationHeader}>
                    <Text style={styles.evaluationType}>
                      {evaluation.evaluation_type.name}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            evaluation.evaluation_type.status_code === 1
                              ? "#4CAF50"
                              : "#FF9800",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {evaluation.evaluation_type.status_code === 1
                          ? "Completed"
                          : "Pending"}
                      </Text>
                    </View>
                  </View>
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comments</Text>
              {feedback.comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                      {comment.created_by.call_name_with_title}
                    </Text>
                    <Text style={styles.commentDate}>
                      {formatDate(comment.created_at)}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => onViewDetails(feedback)}
            >
              <MaterialIcons name="visibility" size={20} color="#920734" />
              <Text style={styles.actionButtonText}>View Full Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(feedback)}
            >
              <MaterialIcons name="edit" size={20} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Edit Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(feedback)}
            >
              <MaterialIcons name="delete" size={20} color="#F44336" />
              <Text style={styles.actionButtonText}>Delete Feedback</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 48, // Account for status bar
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  designation: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  evaluationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  evaluationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  evaluationType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  evaluationFeedback: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  evaluationDate: {
    fontSize: 12,
    color: "#666",
  },
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  commentDate: {
    fontSize: 12,
    color: "#666",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  actionSection: {
    marginVertical: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
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
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
});

export default FeedbackActionModal;
