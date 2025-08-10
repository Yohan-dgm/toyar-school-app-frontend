import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import {
  studentGrowthMetrics,
  getLevelFromRating,
} from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");
const HEX_SIZE = 65; // Smaller hexagon size

const HexagonCard = ({ metric, isSelected, onPress, style }) => {
  const { level, color: levelColor } = getLevelFromRating(metric.rating);

  return (
    <TouchableOpacity
      style={[styles.hexagonContainer, style]}
      onPress={() => onPress(metric)}
      activeOpacity={0.8}
    >
      {/* Hexagon shape */}
      <View
        style={[
          styles.hexagon,
          {
            backgroundColor: isSelected ? metric.color + "30" : "#FFFFFF",
            borderColor: isSelected ? metric.color : "#E0E0E0",
            borderWidth: isSelected ? 3 : 1,
          },
        ]}
      >
        {/* Selection pulse effect */}
        {isSelected && (
          <View
            style={[
              styles.selectionPulse,
              { backgroundColor: metric.color + "15" },
            ]}
          />
        )}

        {/* Icon */}
        <MaterialIcons name={metric.icon} size={20} color={metric.color} />

        {/* Rating */}
        <Text style={[styles.hexRating, { color: metric.color }]}>
          {metric.rating.toFixed(1)}
        </Text>

        {/* Mini stars */}
        <View style={styles.miniStars}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.starDot,
                {
                  backgroundColor:
                    i < Math.floor(metric.rating) ? metric.color : "#E0E0E0",
                },
              ]}
            />
          ))}
        </View>

        {/* Warning indicator for low scores */}
        {metric.rating < 3 && (
          <View style={styles.hexWarning}>
            <MaterialIcons name="warning" size={12} color="#FF3B30" />
          </View>
        )}
      </View>

      {/* Title below hexagon */}
      <Text style={styles.hexTitle} numberOfLines={1}>
        {metric.title.split(" ")[0]}
      </Text>
    </TouchableOpacity>
  );
};

const BeeHiveMetrics = ({ selectedMetric, onMetricSelect }) => {
  // Arrange metrics in bee hive pattern
  // Center: Overall (index 0)
  // Around: other 6 metrics in honeycomb pattern
  const centerMetric = studentGrowthMetrics[0]; // Overall
  const surroundingMetrics = studentGrowthMetrics.slice(1);

  return (
    <View style={styles.container}>
      <View style={styles.hiveContainer}>
        {/* Top row - 2 hexagons */}
        <View style={styles.topRow}>
          <HexagonCard
            metric={surroundingMetrics[0]}
            isSelected={selectedMetric?.id === surroundingMetrics[0]?.id}
            onPress={onMetricSelect}
            style={styles.topLeft}
          />
          <HexagonCard
            metric={surroundingMetrics[1]}
            isSelected={selectedMetric?.id === surroundingMetrics[1]?.id}
            onPress={onMetricSelect}
            style={styles.topRight}
          />
        </View>

        {/* Middle row - 3 hexagons with center */}
        <View style={styles.middleRow}>
          <HexagonCard
            metric={surroundingMetrics[2]}
            isSelected={selectedMetric?.id === surroundingMetrics[2]?.id}
            onPress={onMetricSelect}
            style={styles.middleLeft}
          />

          {/* Center hexagon - Overall */}
          <HexagonCard
            metric={centerMetric}
            isSelected={selectedMetric?.id === centerMetric.id}
            onPress={onMetricSelect}
            style={[styles.centerHex, { transform: [{ scale: 1.2 }] }]}
          />

          <HexagonCard
            metric={surroundingMetrics[3]}
            isSelected={selectedMetric?.id === surroundingMetrics[3]?.id}
            onPress={onMetricSelect}
            style={styles.middleRight}
          />
        </View>

        {/* Bottom row - 2 hexagons */}
        <View style={styles.bottomRow}>
          <HexagonCard
            metric={surroundingMetrics[4]}
            isSelected={selectedMetric?.id === surroundingMetrics[4]?.id}
            onPress={onMetricSelect}
            style={styles.bottomLeft}
          />
          <HexagonCard
            metric={surroundingMetrics[5]}
            isSelected={selectedMetric?.id === surroundingMetrics[5]?.id}
            onPress={onMetricSelect}
            style={styles.bottomRight}
          />
        </View>
      </View>

      {/* Selected metric info */}
      {selectedMetric && (
        <View style={styles.selectedInfo}>
          <Text style={[styles.selectedTitle, { color: selectedMetric.color }]}>
            {selectedMetric.title}
          </Text>
          <Text style={styles.selectedDescription}>
            {selectedMetric.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },
  hiveContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: -10,
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  hexagonContainer: {
    alignItems: "center",
    margin: 8,
  },
  hexagon: {
    width: HEX_SIZE,
    height: HEX_SIZE,
    borderRadius: HEX_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: "relative",
  },
  selectionPulse: {
    position: "absolute",
    width: HEX_SIZE + 10,
    height: HEX_SIZE + 10,
    borderRadius: (HEX_SIZE + 10) / 2,
    top: -5,
    left: -5,
  },
  hexRating: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    marginTop: 2,
  },
  miniStars: {
    flexDirection: "row",
    marginTop: 2,
    gap: 1,
  },
  starDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  hexWarning: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  hexTitle: {
    fontSize: 10,
    fontFamily: theme.fonts.medium,
    color: "#333333",
    textAlign: "center",
    marginTop: 4,
    maxWidth: HEX_SIZE,
  },
  centerHex: {
    marginHorizontal: 15,
  },
  topLeft: { marginRight: 20 },
  topRight: { marginLeft: 20 },
  middleLeft: { marginRight: 10 },
  middleRight: { marginLeft: 10 },
  bottomLeft: { marginRight: 20 },
  bottomRight: { marginLeft: 20 },
  selectedInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    width: width - 40,
    alignItems: "center",
  },
  selectedTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginBottom: 5,
    textAlign: "center",
  },
  selectedDescription: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default BeeHiveMetrics;
