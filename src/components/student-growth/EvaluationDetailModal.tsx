import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { feedbackCardTheme } from "../../data/studentGrowthData";

interface Evaluation {
  id: number;
  edu_fb_id: number;
  edu_fd_evaluation_type_id: number;
  reviewer_feedback: string;
  created_at: string;
  is_parent_visible: number;
  is_active: boolean;
  created_by: {
    id: number;
    call_name_with_title: string;
  };
  evaluation_type: {
    id: number;
    name: string;
    status_code: number;
  };
}

interface EvaluationDetailModalProps {
  visible: boolean;
  onClose: () => void;
  evaluation: Evaluation | null;
}

const { height: screenHeight } = Dimensions.get("window");

const EvaluationDetailModal: React.FC<EvaluationDetailModalProps> = ({
  visible,
  onClose,
  evaluation,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    console.log(
      "📱 EvaluationDetailModal - Visibility changed:",
      visible,
      evaluation?.id,
    );
    if (visible && evaluation) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, evaluation]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // Get status color based on status code
  const getStatusColor = (statusCode: number, isActive: boolean) => {
    if (!isActive) return feedbackCardTheme.grayMedium;

    switch (statusCode) {
      case 1: // Under Observation
        return feedbackCardTheme.warning;
      case 2: // Accept
        return feedbackCardTheme.success;
      case 3: // Reject
        return feedbackCardTheme.error;
      default:
        return feedbackCardTheme.primary;
    }
  };

  // Get status icon based on status code
  const getStatusIcon = (statusCode: number, isActive: boolean) => {
    if (!isActive) return "radio-button-unchecked";

    switch (statusCode) {
      case 1: // Under Observation
        return "visibility";
      case 2: // Accept
        return "check-circle";
      case 3: // Reject
        return "cancel";
      default:
        return "radio-button-checked";
    }
  };

  // Format date in readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status text
  const getStatusText = (statusCode: number) => {
    switch (statusCode) {
      case 1:
        return "Under Observation";
      case 2:
        return "Accepted";
      case 3:
        return "Rejected";
      default:
        return "Pending Review";
    }
  };

  if (!evaluation) {
    return null;
  }

  const statusColor = getStatusColor(
    evaluation.evaluation_type.status_code,
    evaluation.is_active,
  );
  const statusIcon = getStatusIcon(
    evaluation.evaluation_type.status_code,
    evaluation.is_active,
  );
  const statusText = getStatusText(evaluation.evaluation_type.status_code);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={handleClose}
        >
          <BlurView intensity={30} style={StyleSheet.absoluteFillObject} />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.modal}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: statusColor },
                ]}
              >
                <MaterialIcons
                  name={statusIcon}
                  size={20}
                  color={feedbackCardTheme.white}
                />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  {evaluation.evaluation_type.name}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor + "20" },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusText}
                    </Text>
                  </View>
                  {!evaluation.is_active && (
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveBadgeText}>Inactive</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={feedbackCardTheme.grayMedium}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Reviewer Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviewer Information</Text>
              <View style={styles.reviewerCard}>
                <View style={styles.reviewerIcon}>
                  <MaterialIcons
                    name="person"
                    size={24}
                    color={feedbackCardTheme.primary}
                  />
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>
                    {evaluation.created_by.call_name_with_title}
                  </Text>
                  <Text style={styles.reviewerRole}>Educator</Text>
                </View>
              </View>
            </View>

            {/* Evaluation Feedback */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evaluation Feedback</Text>
              <View style={styles.feedbackCard}>
                {evaluation.reviewer_feedback ? (
                  <Text style={styles.feedbackText}>
                    {evaluation.reviewer_feedback}
                  </Text>
                ) : (
                  <Text style={styles.noFeedbackText}>
                    No detailed feedback provided for this evaluation.
                  </Text>
                )}
              </View>
            </View>

            {/* Evaluation Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evaluation Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <MaterialIcons
                    name="schedule"
                    size={16}
                    color={feedbackCardTheme.grayMedium}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(evaluation.created_at)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <MaterialIcons
                    name="visibility"
                    size={16}
                    color={feedbackCardTheme.grayMedium}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Parent Visibility</Text>
                    <Text style={styles.detailValue}>
                      {evaluation.is_parent_visible
                        ? "Visible to Parents"
                        : "Not Visible to Parents"}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <MaterialIcons
                    name="tag"
                    size={16}
                    color={feedbackCardTheme.grayMedium}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Evaluation ID</Text>
                    <Text style={styles.detailValue}>#{evaluation.id}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: feedbackCardTheme.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.6,
    shadowColor: feedbackCardTheme.shadow.large,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: feedbackCardTheme.grayMedium + "40",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: feedbackCardTheme.grayLight,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: feedbackCardTheme.shadow.small,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: feedbackCardTheme.black,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  inactiveBadge: {
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inactiveBadgeText: {
    fontSize: 12,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: feedbackCardTheme.black,
    marginBottom: 16,
  },
  reviewerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: feedbackCardTheme.primary + "08",
    borderRadius: 16,
    padding: 16,
  },
  reviewerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: feedbackCardTheme.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: feedbackCardTheme.black,
    marginBottom: 4,
  },
  reviewerRole: {
    fontSize: 14,
    color: feedbackCardTheme.grayMedium,
  },
  feedbackCard: {
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: feedbackCardTheme.primary,
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 24,
    color: feedbackCardTheme.grayDark,
  },
  noFeedbackText: {
    fontSize: 15,
    lineHeight: 24,
    color: feedbackCardTheme.grayMedium,
    fontStyle: "italic",
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: feedbackCardTheme.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: feedbackCardTheme.grayLight,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: feedbackCardTheme.grayMedium,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: feedbackCardTheme.black,
    fontWeight: "500",
  },
});

export default EvaluationDetailModal;
