import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import {
  studentGrowthMetrics,
  getLevelFromRating,
} from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2; // 2 items per row with padding

const AnimatedStar = ({ filled, halfFilled, size, color, delay = 0 }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 200,
      delay: delay * 100,
    });
    opacity.value = withTiming(1, {
      duration: 300,
      delay: delay * 100,
    });
  }, [filled, halfFilled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconName = filled ? "star" : halfFilled ? "star-half" : "star-border";
  const iconColor = filled || halfFilled ? color : "#E0E0E0";

  return (
    <Animated.View style={animatedStyle}>
      <MaterialIcons name={iconName} size={size} color={iconColor} />
    </Animated.View>
  );
};

const StarRating = ({
  rating,
  size = 16,
  color = "#FFD700",
  animated = false,
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    const filled = i < fullStars;
    const halfFilled = i === fullStars && hasHalfStar;

    if (animated) {
      stars.push(
        <AnimatedStar
          key={i}
          filled={filled}
          halfFilled={halfFilled}
          size={size}
          color={color}
          delay={i}
        />
      );
    } else {
      const iconName = filled
        ? "star"
        : halfFilled
          ? "star-half"
          : "star-border";
      const iconColor = filled || halfFilled ? color : "#E0E0E0";
      stars.push(
        <MaterialIcons key={i} name={iconName} size={size} color={iconColor} />
      );
    }
  }

  return <View style={styles.starContainer}>{stars}</View>;
};

const MetricCard = ({ metric, isSelected, onPress, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const { level, color: levelColor } = getLevelFromRating(metric.rating);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    // Bounce animation
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );

    // Flash animation for selection
    opacity.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    onPress(metric);
  };

  // Special positioning for center item (Overall)
  const isCenter = index === 0;
  const cardStyle = isCenter ? styles.centerCard : styles.regularCard;

  return (
    <AnimatedTouchableOpacity
      style={[
        cardStyle,
        animatedStyle,
        isSelected && styles.selectedCard,
        { backgroundColor: isSelected ? metric.color + "20" : "#FFFFFF" },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Selection indicator */}
      {isSelected && (
        <View
          style={[styles.selectionIndicator, { backgroundColor: metric.color }]}
        />
      )}

      {/* Icon */}
      <View
        style={[styles.iconContainer, { backgroundColor: metric.color + "15" }]}
      >
        <MaterialIcons
          name={metric.icon}
          size={isCenter ? 32 : 24}
          color={metric.color}
        />
      </View>

      {/* Title */}
      <Text
        style={[styles.cardTitle, isCenter && styles.centerCardTitle]}
        numberOfLines={2}
      >
        {metric.title}
      </Text>

      {/* Rating */}
      <Text style={[styles.ratingText, { color: metric.color }]}>
        {metric.rating.toFixed(1)}
      </Text>

      {/* Stars */}
      <StarRating
        rating={metric.rating}
        size={isCenter ? 14 : 12}
        animated={isSelected}
        color={metric.rating < 3 ? "#FF9800" : "#FFD700"}
      />

      {/* Level */}
      <View style={[styles.levelBadge, { backgroundColor: levelColor + "20" }]}>
        <Text style={[styles.levelText, { color: levelColor }]}>{level}</Text>
      </View>

      {/* Warning indicator for low scores */}
      {metric.rating < 3 && (
        <View style={styles.warningIndicator}>
          <MaterialIcons name="warning" size={16} color="#FF3B30" />
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
};

const MetricsGrid = ({ selectedMetric, onMetricSelect }) => {
  // Arrange metrics in honeycomb pattern
  // Center: Overall (index 0)
  // Around: other 6 metrics
  const centerMetric = studentGrowthMetrics[0]; // Overall
  const surroundingMetrics = studentGrowthMetrics.slice(1);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Student Growth Metrics</Text>

      <View style={styles.gridContainer}>
        {/* Center metric (Overall) */}
        <View style={styles.centerRow}>
          <MetricCard
            metric={centerMetric}
            isSelected={selectedMetric?.id === centerMetric.id}
            onPress={onMetricSelect}
            index={0}
          />
        </View>

        {/* Surrounding metrics in 2 rows */}
        <View style={styles.topRow}>
          {surroundingMetrics.slice(0, 3).map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              isSelected={selectedMetric?.id === metric.id}
              onPress={onMetricSelect}
              index={index + 1}
            />
          ))}
        </View>

        <View style={styles.bottomRow}>
          {surroundingMetrics.slice(3, 6).map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              isSelected={selectedMetric?.id === metric.id}
              onPress={onMetricSelect}
              index={index + 4}
            />
          ))}
        </View>
      </View>

      {/* Selected metric description */}
      {selectedMetric && (
        <Animated.View
          style={styles.descriptionContainer}
          entering={withTiming}
        >
          <Text style={styles.descriptionTitle}>{selectedMetric.title}</Text>
          <Text style={styles.descriptionText}>
            {selectedMetric.description}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: GRID_PADDING,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  gridContainer: {
    alignItems: "center",
  },
  centerRow: {
    marginBottom: 15,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  centerCard: {
    width: ITEM_SIZE * 1.2,
    height: ITEM_SIZE * 1.2,
    borderRadius: (ITEM_SIZE * 1.2) / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  regularCard: {
    width: ITEM_SIZE * 0.85,
    height: ITEM_SIZE * 0.85,
    borderRadius: (ITEM_SIZE * 0.85) / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    elevation: 6,
    shadowOpacity: 0.15,
  },
  selectionIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: theme.fonts.medium,
    color: "#333333",
    textAlign: "center",
    marginBottom: 2,
  },
  centerCardTitle: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    marginBottom: 2,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  levelText: {
    fontSize: 8,
    fontFamily: theme.fonts.medium,
  },
  warningIndicator: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    lineHeight: 20,
  },
});

export default MetricsGrid;
