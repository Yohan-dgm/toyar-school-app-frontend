import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { modernColors, maroonTheme } from "../../data/studentGrowthData";

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

interface EvaluationTimelineProps {
  evaluations: Evaluation[];
  compact?: boolean;
}

const EvaluationTimeline: React.FC<EvaluationTimelineProps> = ({
  evaluations,
  compact = false,
}) => {
  // Sort evaluations by date (newest first)
  const sortedEvaluations = [...evaluations].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const getStatusColor = (statusCode: number, isActive: boolean) => {
    if (!isActive) return modernColors.textSecondary;

    switch (statusCode) {
      case 1: // Under Observation
        return "#F59E0B"; // Orange
      case 2: // Accept
        return "#10B981"; // Green
      case 3: // Reject
        return "#EF4444"; // Red
      default:
        return modernColors.primary;
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

  if (!evaluations || evaluations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="timeline"
          size={20}
          color={modernColors.textSecondary}
        />
        <Text style={styles.emptyText}>No evaluations yet</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={styles.header}>
        <MaterialIcons name="timeline" size={16} color={modernColors.text} />
        <Text style={styles.headerTitle}>Evaluation Timeline</Text>
      </View>

      <ScrollView
        horizontal={compact}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.timelineContainer, compact && styles.compactTimeline]}
        contentContainerStyle={compact ? styles.horizontalContent : undefined}
      >
        {sortedEvaluations.map((evaluation, index) => {
          const statusColor = getStatusColor(
            evaluation.evaluation_type.status_code,
            evaluation.is_active,
          );
          const statusIcon = getStatusIcon(
            evaluation.evaluation_type.status_code,
            evaluation.is_active,
          );

          return (
            <View
              key={evaluation.id}
              style={[
                styles.timelineItem,
                compact && styles.compactTimelineItem,
                index === sortedEvaluations.length - 1 &&
                  styles.lastTimelineItem,
              ]}
            >
              {/* Timeline connector line */}
              {!compact && index < sortedEvaluations.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: statusColor + "30" },
                  ]}
                />
              )}

              {/* Status indicator */}
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: statusColor },
                ]}
              >
                <MaterialIcons
                  name={statusIcon}
                  size={compact ? 12 : 16}
                  color="white"
                />
              </View>

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

                {evaluation.reviewer_feedback && (
                  <Text
                    style={[styles.feedback, compact && styles.compactFeedback]}
                    numberOfLines={compact ? 2 : undefined}
                  >
                    {evaluation.reviewer_feedback}
                  </Text>
                )}

                <View style={styles.meta}>
                  <Text
                    style={[styles.creator, compact && styles.compactCreator]}
                  >
                    {evaluation.created_by.call_name_with_title}
                  </Text>
                  <Text style={[styles.date, compact && styles.compactDate]}>
                    {formatDate(evaluation.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: modernColors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  compactContainer: {
    backgroundColor: "transparent",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: modernColors.text,
    marginLeft: 6,
  },
  timelineContainer: {
    flex: 1,
  },
  compactTimeline: {
    maxHeight: 100,
  },
  horizontalContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineItem: {
    flexDirection: "row",
    position: "relative",
    paddingBottom: 16,
  },
  compactTimelineItem: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 16,
    paddingBottom: 0,
    minWidth: 120,
  },
  lastTimelineItem: {
    paddingBottom: 0,
  },
  timelineLine: {
    position: "absolute",
    left: 11,
    top: 24,
    width: 2,
    bottom: 0,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingTop: 1,
  },
  compactContent: {
    alignItems: "center",
    marginTop: 8,
    flex: 0,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: modernColors.text,
    flex: 1,
  },
  compactStatusTitle: {
    fontSize: 12,
    textAlign: "center",
    flex: 0,
  },
  inactiveText: {
    color: modernColors.textSecondary,
  },
  inactiveBadge: {
    backgroundColor: modernColors.textSecondary + "20",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inactiveBadgeText: {
    fontSize: 10,
    color: modernColors.textSecondary,
    fontWeight: "500",
  },
  feedback: {
    fontSize: 13,
    color: modernColors.text,
    lineHeight: 18,
    marginBottom: 6,
  },
  compactFeedback: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  meta: {
    flexDirection: "column",
    gap: 2,
  },
  creator: {
    fontSize: 12,
    color: modernColors.textSecondary,
    fontWeight: "500",
  },
  compactCreator: {
    fontSize: 10,
    textAlign: "center",
  },
  date: {
    fontSize: 11,
    color: modernColors.textSecondary,
  },
  compactDate: {
    fontSize: 9,
    textAlign: "center",
  },
  emptyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: modernColors.backgroundSecondary,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 13,
    color: modernColors.textSecondary,
    marginLeft: 8,
  },
});

export default EvaluationTimeline;
