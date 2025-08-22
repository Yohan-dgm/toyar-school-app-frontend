import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
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

interface AnimatedEvaluationTimelineProps {
  evaluations: Evaluation[];
  compact?: boolean;
  isVisible?: boolean;
  onEvaluationPress?: (evaluation: Evaluation) => void;
}

const AnimatedEvaluationTimeline: React.FC<AnimatedEvaluationTimelineProps> = ({
  evaluations,
  compact = false,
  isVisible = true,
  onEvaluationPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Sort evaluations by date (newest first)
  const sortedEvaluations = [...evaluations].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Animate timeline appearance
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    }
  }, [isVisible]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const AnimatedTimelineItem = ({
    evaluation,
    index,
    isLast,
  }: {
    evaluation: Evaluation;
    index: number;
    isLast: boolean;
  }) => {
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      const delay = index * 100;
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(itemFadeAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(itemSlideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, [index]);

    const statusColor = getStatusColor(
      evaluation.evaluation_type.status_code,
      evaluation.is_active,
    );
    const statusIcon = getStatusIcon(
      evaluation.evaluation_type.status_code,
      evaluation.is_active,
    );

    const handlePress = () => {
      console.log(
        "🎯 AnimatedEvaluationTimeline - Item pressed:",
        evaluation.id,
      );
      if (onEvaluationPress) {
        onEvaluationPress(evaluation);
      }
    };

    const TimelineContent = (
      <Animated.View
        style={[
          styles.timelineItem,
          compact && styles.compactTimelineItem,
          {
            opacity: itemFadeAnim,
            transform: [{ translateX: itemSlideAnim }],
          },
        ]}
      >
        {/* Timeline connector line */}
        {!compact && !isLast && (
          <View
            style={[
              styles.timelineLine,
              { backgroundColor: statusColor + "30" },
            ]}
          />
        )}

        {/* Status indicator */}
        <Animated.View
          style={[
            styles.statusIndicator,
            { backgroundColor: statusColor },
            compact && styles.compactStatusIndicator,
          ]}
        >
          <MaterialIcons
            name={statusIcon}
            size={compact ? 12 : 16}
            color={feedbackCardTheme.white}
          />
        </Animated.View>

        {/* Content */}
        <View style={[styles.content, compact && styles.compactContent]}>
          <View style={styles.contentHeader}>
            <Text
              style={[
                styles.statusTitle,
                compact && styles.compactStatusTitle,
                !evaluation.is_active && styles.inactiveText,
              ]}
            >
              {evaluation.evaluation_type.name}
            </Text>
            {!evaluation.is_active && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Inactive</Text>
              </View>
            )}
          </View>

          {/* Compact mode clickable indicator */}
          {compact && onEvaluationPress && (
            <View style={styles.compactClickIndicator}>
              <MaterialIcons
                name="touch-app"
                size={12}
                color={feedbackCardTheme.primary}
              />
              <Text style={styles.compactClickText}>Tap for details</Text>
            </View>
          )}

          {evaluation.reviewer_feedback && (
            <Text
              style={[styles.feedback, compact && styles.compactFeedback]}
              numberOfLines={compact ? 2 : undefined}
            >
              {evaluation.reviewer_feedback}
            </Text>
          )}

          <View style={styles.meta}>
            <Text style={[styles.creator, compact && styles.compactCreator]}>
              {evaluation.created_by.call_name_with_title}
            </Text>
            <Text style={[styles.date, compact && styles.compactDate]}>
              {formatDate(evaluation.created_at)}
            </Text>
          </View>

          {/* View Details Button */}
          {onEvaluationPress && !compact && (
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <MaterialIcons
                name="arrow-forward"
                size={14}
                color={feedbackCardTheme.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );

    // Return clickable or non-clickable version
    if (onEvaluationPress && compact) {
      return (
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={[styles.clickableTimelineItem, styles.compactClickableCard]}
        >
          {TimelineContent}
        </TouchableOpacity>
      );
    }

    return TimelineContent;
  };

  if (!evaluations || evaluations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="timeline"
          size={20}
          color={feedbackCardTheme.grayMedium}
        />
        <Text style={styles.emptyText}>No evaluations yet</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        compact && styles.compactContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <MaterialIcons
          name="timeline"
          size={16}
          color={feedbackCardTheme.primary}
        />
        <Text style={styles.headerTitle}>Evaluation Timeline</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{evaluations.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal={compact}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.timelineContainer, compact && styles.compactTimeline]}
        contentContainerStyle={compact ? styles.horizontalContent : undefined}
      >
        {sortedEvaluations.map((evaluation, index) => (
          <AnimatedTimelineItem
            key={evaluation.id}
            evaluation={evaluation}
            index={index}
            isLast={index === sortedEvaluations.length - 1}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: feedbackCardTheme.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: feedbackCardTheme.border.light,
  },
  compactContainer: {
    backgroundColor: "transparent",
    padding: 12,
    borderWidth: 0,
    marginTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: feedbackCardTheme.black,
    marginLeft: 8,
    flex: 1,
  },
  countBadge: {
    backgroundColor: feedbackCardTheme.primary + "15",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 10,
    fontWeight: "600",
    color: feedbackCardTheme.primary,
  },
  timelineContainer: {
    flex: 1,
  },
  compactTimeline: {
    maxHeight: 120,
  },
  horizontalContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineItem: {
    flexDirection: "row",
    position: "relative",
    paddingBottom: 20,
  },
  compactTimelineItem: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
    paddingBottom: 0,
    minWidth: 140,
  },
  timelineLine: {
    position: "absolute",
    left: 15,
    top: 32,
    width: 2,
    bottom: 0,
  },
  statusIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: feedbackCardTheme.shadow.small,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactStatusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 0,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  compactContent: {
    alignItems: "center",
    flex: 0,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: feedbackCardTheme.black,
    flex: 1,
  },
  compactStatusTitle: {
    fontSize: 12,
    textAlign: "center",
    flex: 0,
  },
  inactiveText: {
    color: feedbackCardTheme.grayMedium,
  },
  inactiveBadge: {
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inactiveBadgeText: {
    fontSize: 8,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
  },
  feedback: {
    fontSize: 13,
    color: feedbackCardTheme.grayDark,
    lineHeight: 18,
    marginBottom: 8,
  },
  compactFeedback: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  meta: {
    flexDirection: "column",
    gap: 4,
  },
  creator: {
    fontSize: 12,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
  },
  compactCreator: {
    fontSize: 10,
    textAlign: "center",
  },
  date: {
    fontSize: 11,
    color: feedbackCardTheme.grayMedium,
  },
  compactDate: {
    fontSize: 9,
    textAlign: "center",
  },
  emptyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 13,
    color: feedbackCardTheme.grayMedium,
    marginLeft: 8,
  },
  clickableTimelineItem: {
    // Wrapper for clickable timeline items in compact mode
  },
  compactClickableCard: {
    backgroundColor: feedbackCardTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: feedbackCardTheme.primary + "20",
    marginHorizontal: 4,
    padding: 8,
    shadowColor: feedbackCardTheme.shadow.small,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactClickIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: feedbackCardTheme.primary + "10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: feedbackCardTheme.primary + "30",
  },
  compactClickText: {
    fontSize: 10,
    fontWeight: "500",
    color: feedbackCardTheme.primary,
    marginLeft: 4,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: feedbackCardTheme.primary + "10",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: feedbackCardTheme.primary + "30",
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: feedbackCardTheme.primary,
    marginRight: 4,
  },
});

export default AnimatedEvaluationTimeline;
