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
const HEX_SIZE = 70; // Smaller hexagon size
const HEX_HEIGHT = HEX_SIZE * 0.866; // Height of hexagon

const StarRating = ({ rating, size = 16, color = "#FFD700" }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    const filled = i < fullStars;
    const halfFilled = i === fullStars && hasHalfStar;

    const iconName = filled ? "star" : halfFilled ? "star-half" : "star-border";
    const iconColor = filled || halfFilled ? color : "#E0E0E0";

    stars.push(
      <MaterialIcons key={i} name={iconName} size={size} color={iconColor} />,
    );
  }

  return <View style={styles.starContainer}>{stars}</View>;
};

const MetricCard = ({ metric, isSelected, onPress }) => {
  const { level, color: levelColor } = getLevelFromRating(metric.rating);

  return (
    <TouchableOpacity
      style={[
        styles.metricCard,
        isSelected && styles.selectedCard,
        { backgroundColor: isSelected ? metric.color + "20" : "#FFFFFF" },
      ]}
      onPress={() => onPress(metric)}
      activeOpacity={0.7}
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
        <MaterialIcons name={metric.icon} size={24} color={metric.color} />
      </View>

      {/* Title */}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {metric.title}
      </Text>

      {/* Rating */}
      <Text style={[styles.ratingText, { color: metric.color }]}>
        {metric.rating.toFixed(1)}
      </Text>

      {/* Stars */}
      <StarRating
        rating={metric.rating}
        size={12}
        color={metric.rating < 3 ? "#FF9800" : "#FFD700"}
      />

      {/* Level */}
      <View style={[styles.levelBadge, { backgroundColor: levelColor + "20" }]}>
        <Text style={[styles.levelText, { color: levelColor }]}>{level}</Text>
      </View>

      {/* Warning indicator for low scores */}
      {metric.rating < 3 && (
        <View style={styles.warningIndicator}>
          <MaterialIcons name="warning" size={14} color="#FF3B30" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const SimpleMetricsGrid = ({ selectedMetric, onMetricSelect }) => {
  const renderMetricCard = ({ item }) => (
    <MetricCard
      metric={item}
      isSelected={selectedMetric?.id === item.id}
      onPress={onMetricSelect}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Student Growth Metrics</Text>

      <FlatList
        data={studentGrowthMetrics}
        renderItem={renderMetricCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Selected metric description */}
      {selectedMetric && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>{selectedMetric.title}</Text>
          <Text style={styles.descriptionText}>
            {selectedMetric.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  gridContainer: {
    paddingBottom: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metricCard: {
    width: ITEM_WIDTH,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 160,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    elevation: 6,
    shadowOpacity: 0.15,
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: "#333333",
    textAlign: "center",
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginBottom: 4,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  levelText: {
    fontSize: 9,
    fontFamily: theme.fonts.medium,
  },
  warningIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
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

export default SimpleMetricsGrid;
