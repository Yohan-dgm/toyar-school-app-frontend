import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { getLevelFromRating } from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 40;

const DynamicGrowthChart = ({ selectedMetric }) => {
  if (!selectedMetric) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="analytics" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>
          Select a metric to view growth chart
        </Text>
      </View>
    );
  }

  const { level, color: levelColor } = getLevelFromRating(
    selectedMetric.rating
  );

  // Prepare chart data
  const chartData = {
    labels: ["Term 1", "Term 2", "Term 3", "Term 4"],
    datasets: [
      {
        data: selectedMetric.trend,
        color: (opacity = 1) =>
          selectedMetric.color +
          Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, "0"),
        strokeWidth: 3,
      },
      // Class average line
      {
        data: Array(4).fill(selectedMetric.classAverage),
        color: (opacity = 1) => `rgba(160, 160, 160, ${opacity})`,
        strokeWidth: 2,
        withDots: false,
      },
    ],
    legend: ["Student Performance", "Class Average"],
  };

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 1,
    color: (opacity = 1) =>
      selectedMetric.color +
      Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, "0"),
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: selectedMetric.color,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#E0E0E0",
      strokeWidth: 1,
    },
  };

  // Bar chart data for comparison
  const barData = {
    labels: ["Term 1", "Term 2", "Term 3", "Term 4"],
    datasets: [
      {
        data: selectedMetric.trend,
        color: (opacity = 1) =>
          selectedMetric.color +
          Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, "0"),
      },
    ],
  };

  const barConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 1,
    color: (opacity = 1) =>
      selectedMetric.color +
      Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, "0"),
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#E0E0E0",
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons
            name={selectedMetric.icon}
            size={24}
            color={selectedMetric.color}
          />
          <Text style={styles.title}>{selectedMetric.title}</Text>
        </View>

        <View style={styles.currentRating}>
          <Text style={[styles.ratingValue, { color: selectedMetric.color }]}>
            {selectedMetric.rating.toFixed(1)}
          </Text>
          <Text style={[styles.ratingLevel, { color: levelColor }]}>
            {level}
          </Text>
        </View>
      </View>

      {/* Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progress Trend</Text>
        <LineChart
          data={chartData}
          width={CHART_WIDTH - 40}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          fromZero={false}
          segments={4}
        />
      </View>

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Term Comparison</Text>
        <BarChart
          data={barData}
          width={CHART_WIDTH - 40}
          height={160}
          chartConfig={barConfig}
          style={styles.chart}
          showValuesOnTopOfBars={true}
          fromZero={false}
          segments={4}
        />
      </View>

      {/* Performance Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Current</Text>
          <Text style={[styles.summaryValue, { color: selectedMetric.color }]}>
            {selectedMetric.rating.toFixed(1)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Class Avg</Text>
          <Text style={styles.summaryValue}>
            {selectedMetric.classAverage.toFixed(1)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Growth</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  selectedMetric.trend[3] > selectedMetric.trend[0]
                    ? "#4CAF50"
                    : "#FF9800",
              },
            ]}
          >
            {selectedMetric.trend[3] > selectedMetric.trend[0] ? "+" : ""}
            {(selectedMetric.trend[3] - selectedMetric.trend[0]).toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    margin: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    margin: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#999999",
    marginTop: 10,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginLeft: 8,
    flex: 1,
  },
  currentRating: {
    alignItems: "flex-end",
  },
  ratingValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
  },
  ratingLevel: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
  },
  chartContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#333333",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
});

export default DynamicGrowthChart;
