import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { feedbackCardTheme } from "../../data/studentGrowthData";

interface FeedbackData {
  id: number;
  student_id: number;
  category: {
    id: number;
    name: string;
  };
  comments: {
    id: number;
    comment: string;
  }[];
  rating: string | number;
  created_at: string;
  status: number;
  created_by: {
    id: number;
    call_name_with_title: string;
  };
  evaluations: {
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
  }[];
}

interface AnimatedFeedbackCardProps {
  feedback: FeedbackData;
  index: number;
  onPress?: () => void;
  isExpanded?: boolean;
}

const { width } = Dimensions.get("window");

const AnimatedFeedbackCard: React.FC<AnimatedFeedbackCardProps> = ({
  feedback,
  index,
  onPress,
  isExpanded = false,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const ratingAnim = useRef(new Animated.Value(0)).current;
  const timelineAnim = useRef(new Animated.Value(0)).current;

  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  // Parse rating safely
  const parseRating = (rating: string | number): number => {
    if (typeof rating === "number") return rating;
    if (typeof rating === "string") return parseFloat(rating) || 0;
    return 0;
  };

  const ratingValue = parseRating(feedback.rating);
  const isActive = feedback.status === 2;

  // Get main comment
  const getMainComment = () => {
    if (feedback.comments && feedback.comments.length > 0) {
      return feedback.comments[0].comment;
    }
    return "";
  };

  // Rating color based on value
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return feedbackCardTheme.success;
    if (rating >= 3.5) return feedbackCardTheme.warning;
    if (rating >= 2.0) return feedbackCardTheme.error;
    return feedbackCardTheme.grayMedium;
  };

  // Rating text
  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Good";
    if (rating >= 2.0) return "Needs Improvement";
    return "Poor";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Card entrance animation
  useEffect(() => {
    const delay = index * 150; // Staggered animation

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Rating animation with delay
    setTimeout(() => {
      Animated.timing(ratingAnim, {
        toValue: ratingValue / 5, // Convert to 0-1 range
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, delay + 300);
  }, [index, ratingValue]);

  // Timeline toggle animation
  const toggleTimeline = () => {
    setIsTimelineExpanded(!isTimelineExpanded);
    Animated.timing(timelineAnim, {
      toValue: isTimelineExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  // Press animation
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) onPress();
  };

  // Animated circular progress for rating
  const AnimatedCircularProgress = () => {
    const progressValue = ratingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.ratingCircleContainer}>
        <View style={styles.ratingCircleBackground} />
        <Animated.View
          style={[
            styles.ratingCircleProgress,
            {
              borderColor: getRatingColor(ratingValue),
              borderTopWidth: 3,
              transform: [
                {
                  rotate: ratingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.ratingTextContainer}>
          <Text
            style={[
              styles.ratingNumber,
              { color: getRatingColor(ratingValue) },
            ]}
          >
            {ratingValue.toFixed(1)}
          </Text>
          <Text style={styles.ratingOutOf}>/ 5.0</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
        !isActive && styles.inactiveCard,
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        {/* Card Header */}
        <View style={styles.header}>
          <View style={styles.categorySection}>
            <View style={styles.categoryIcon}>
              <MaterialIcons
                name="psychology"
                size={20}
                color={feedbackCardTheme.primary}
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle} numberOfLines={1}>
                {feedback.category.name}
              </Text>
              <Text style={styles.categorySubtitle}>
                {getRatingText(ratingValue)}
              </Text>
            </View>
            {!isActive && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Inactive</Text>
              </View>
            )}
          </View>

          <AnimatedCircularProgress />
        </View>

        {/* Rating Badge */}
        <View style={styles.ratingBadgeContainer}>
          <View
            style={[
              styles.ratingBadge,
              { backgroundColor: getRatingColor(ratingValue) + "15" },
            ]}
          >
            <MaterialIcons
              name="star"
              size={14}
              color={getRatingColor(ratingValue)}
            />
            <Text
              style={[
                styles.ratingBadgeText,
                { color: getRatingColor(ratingValue) },
              ]}
            >
              {getRatingText(ratingValue)}
            </Text>
          </View>
        </View>

        {/* Comment Section */}
        {getMainComment() && (
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Feedback Comment</Text>
            <Text style={styles.commentText} numberOfLines={3}>
              {getMainComment()}
            </Text>
          </View>
        )}

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <View style={styles.creatorInfo}>
            <MaterialIcons
              name="person"
              size={16}
              color={feedbackCardTheme.grayMedium}
            />
            <Text style={styles.creatorText}>
              {feedback.created_by.call_name_with_title}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(feedback.created_at)}</Text>
        </View>

        {/* Timeline Toggle */}
        {feedback.evaluations && feedback.evaluations.length > 0 && (
          <TouchableOpacity
            style={styles.timelineToggle}
            onPress={toggleTimeline}
          >
            <MaterialIcons
              name="timeline"
              size={16}
              color={feedbackCardTheme.primary}
            />
            <Text style={styles.timelineToggleText}>
              {feedback.evaluations.length} Evaluations
            </Text>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: timelineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={feedbackCardTheme.primary}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: feedbackCardTheme.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: feedbackCardTheme.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: feedbackCardTheme.primary,
  },
  inactiveCard: {
    opacity: 0.7,
    borderLeftColor: feedbackCardTheme.grayMedium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  categorySection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: feedbackCardTheme.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: feedbackCardTheme.black,
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 13,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
  },
  inactiveBadge: {
    backgroundColor: feedbackCardTheme.grayLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  inactiveBadgeText: {
    fontSize: 10,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "600",
  },
  ratingCircleContainer: {
    width: 50,
    height: 50,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingCircleBackground: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: feedbackCardTheme.grayLight,
  },
  ratingCircleProgress: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: "transparent",
  },
  ratingTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: "700",
  },
  ratingOutOf: {
    fontSize: 8,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
  },
  ratingBadgeContainer: {
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  commentSection: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: feedbackCardTheme.grayMedium,
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: feedbackCardTheme.grayDark,
    lineHeight: 20,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  creatorText: {
    fontSize: 13,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
    marginLeft: 6,
  },
  dateText: {
    fontSize: 12,
    color: feedbackCardTheme.grayMedium,
    fontWeight: "500",
  },
  timelineToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: feedbackCardTheme.grayLight,
  },
  timelineToggleText: {
    fontSize: 13,
    color: feedbackCardTheme.primary,
    fontWeight: "600",
    flex: 1,
    marginLeft: 6,
  },
});

export default AnimatedFeedbackCard;
