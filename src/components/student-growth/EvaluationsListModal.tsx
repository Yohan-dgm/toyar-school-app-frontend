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

interface EvaluationsListModalProps {
  visible: boolean;
  onClose: () => void;
  evaluations: Evaluation[];
  categoryName?: string;
}

const { height: screenHeight } = Dimensions.get("window");

const EvaluationsListModal: React.FC<EvaluationsListModalProps> = ({
  visible,
  onClose,
  evaluations,
  categoryName = "Category",
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    console.log(
      "📋 EvaluationsListModal - Visibility changed:",
      visible,
      evaluations?.length,
    );
    if (visible && evaluations) {
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
  }, [visible, evaluations]);

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
      month: "short",
      day: "numeric",
      year: "numeric",
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

  // Sort evaluations by date (newest first)
  const sortedEvaluations = [...(evaluations || [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const renderEvaluationCard = (evaluation: Evaluation, index: number) => {
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
      <View key={evaluation.id} style={styles.evaluationCard}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View
              style={[styles.statusIndicator, { backgroundColor: statusColor }]}
            >
              <MaterialIcons
                name={statusIcon}
                size={16}
                color={feedbackCardTheme.white}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.evaluationType}>
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
          <Text style={styles.dateText}>
            {formatDate(evaluation.created_at)}
          </Text>
        </View>

        {/* Reviewer Information */}
        <View style={styles.reviewerSection}>
          <View style={styles.reviewerIcon}>
            <MaterialIcons
              name="person"
              size={16}
              color={feedbackCardTheme.primary}
            />
          </View>
          <Text style={styles.reviewerName}>
            {evaluation.created_by.call_name_with_title}
          </Text>
        </View>

        {/* Feedback Content */}
        {evaluation.reviewer_feedback && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackLabel}>Evaluation Feedback</Text>
            <Text style={styles.feedbackText}>
              {evaluation.reviewer_feedback}
            </Text>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <MaterialIcons
              name="visibility"
              size={14}
              color={feedbackCardTheme.grayMedium}
            />
            <Text style={styles.infoText}>
              {evaluation.is_parent_visible
                ? "Visible to Parents"
                : "Not Visible to Parents"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons
              name="tag"
              size={14}
              color={feedbackCardTheme.grayMedium}
            />
            <Text style={styles.infoText}>ID: #{evaluation.id}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!evaluations || evaluations.length === 0) {
    return null;
  }

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
            <View style={styles.headerContent}>
              <MaterialIcons
                name="list"
                size={24}
                color={feedbackCardTheme.primary}
              />
              <View style={styles.headerText}>
                <Text style={styles.title}>All Evaluations</Text>
                <Text style={styles.subtitle}>
                  {sortedEvaluations.length} evaluations for {categoryName}
                </Text>
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
            {sortedEvaluations.map((evaluation, index) =>
              renderEvaluationCard(evaluation, index),
            )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: feedbackCardTheme.grayLight,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: feedbackCardTheme.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: feedbackCardTheme.grayMedium,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  evaluationCard: {
    backgroundColor: feedbackCardTheme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: feedbackCardTheme.grayLight,
    shadowColor: feedbackCardTheme.shadow.small,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  evaluationType: {
    fontSize: 16,
    fontWeight: "600",
    color: feedbackCardTheme.black,
    marginBottom: 6,
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
    fontSize: 11,
    fontWeight: "600",
  },
  inactiveBadge: {
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inactiveBadgeText: {
    fontSize: 11,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
  },
  reviewerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: feedbackCardTheme.primary + "08",
    borderRadius: 8,
    padding: 8,
  },
  reviewerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: feedbackCardTheme.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "500",
    color: feedbackCardTheme.black,
  },
  feedbackSection: {
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: feedbackCardTheme.grayMedium,
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    color: feedbackCardTheme.grayDark,
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: feedbackCardTheme.primary,
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: feedbackCardTheme.grayMedium,
    marginLeft: 4,
  },
});

export default EvaluationsListModal;
