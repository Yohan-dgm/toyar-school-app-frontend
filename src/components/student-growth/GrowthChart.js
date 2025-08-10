import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import {
  getChartDataForMetric,
  getLevelFromRating,
} from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 40;

const GrowthChart = ({ selectedMetric }) => {
  const [chartType, setChartType] = useState("bar"); // 'bar' or 'line'
  const [showComparison, setShowComparison] = useState(true);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (selectedMetric) {
      opacity.value = withTiming(1, { duration: 500 });
    }
  }, [selectedMetric]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!selectedMetric) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="analytics" size={64} color="#E0E0E0" />
        <Text style={styles.emptyText}>
          Select a metric to view growth chart
        </Text>
      </View>
    );
  }

  const chartData = getChartDataForMetric(selectedMetric.id);
  if (!chartData) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="error" size={64} color="#E0E0E0" />
        <Text style={styles.emptyText}>Chart data not available</Text>
      </View>
    );
  }

  const { level, color: levelColor } = getLevelFromRating(
    selectedMetric.rating,
  );

  // Prepare bar chart data with safety checks
  const barData = chartData.barData
    ? chartData.barData.map((item, index) => ({
        ...item,
        topLabelComponent: () => (
          <Text style={styles.barTopLabel}>{item.value || 0}</Text>
        ),
      }))
    : [];

  // Add class average bars if comparison is enabled
  const comparisonBarData =
    showComparison && chartData.classAverageData
      ? chartData.classAverageData.map((value, index) => ({
          value: value || 0,
          frontColor: "#E0E0E0",
          label: `Term ${index + 1}`,
        }))
      : [];

  // Prepare line chart data with safety checks
  const lineData = chartData.lineData || [];
  const classAverageLineData =
    showComparison && chartData.classAverageData
      ? chartData.classAverageData.map((value, index) => ({
          value: value || 0,
        }))
      : [];

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <BarChart
        data={barData}
        width={CHART_WIDTH - 60}
        height={200}
        barWidth={35}
        spacing={showComparison ? 15 : 25}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={1}
        yAxisThickness={1}
        xAxisColor="#E0E0E0"
        yAxisColor="#E0E0E0"
        yAxisTextStyle={{ color: "#666666", fontSize: 12 }}
        xAxisLabelTextStyle={{
          color: "#666666",
          fontSize: 12,
          textAlign: "center",
        }}
        noOfSections={4}
        maxValue={5}
        isAnimated
        animationDuration={1000}
        showGradient
        gradientColor={selectedMetric.color + "40"}
        frontColor={selectedMetric.color}
        initialSpacing={20}
        endSpacing={20}
      />

      {showComparison && (
        <View style={styles.comparisonLegend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: selectedMetric.color },
              ]}
            />
            <Text style={styles.legendText}>Student Performance</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#E0E0E0" }]}
            />
            <Text style={styles.legendText}>Class Average</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderLineChart = () => (
    <View style={styles.chartContainer}>
      <LineChart
        data={lineData}
        data2={showComparison ? classAverageLineData : undefined}
        width={CHART_WIDTH - 60}
        height={200}
        spacing={70}
        color={selectedMetric.color}
        color2="#E0E0E0"
        thickness={3}
        thickness2={2}
        dataPointsColor={selectedMetric.color}
        dataPointsColor2="#E0E0E0"
        dataPointsRadius={6}
        dataPointsRadius2={4}
        hideRules
        hideYAxisText={false}
        xAxisThickness={1}
        yAxisThickness={1}
        xAxisColor="#E0E0E0"
        yAxisColor="#E0E0E0"
        curved
        isAnimated
        animationDuration={1200}
        areaChart
        startFillColor={selectedMetric.color + "40"}
        endFillColor={selectedMetric.color + "10"}
        startOpacity={0.8}
        endOpacity={0.3}
        yAxisTextStyle={{ color: "#666666", fontSize: 12 }}
        xAxisLabelTextStyle={{ color: "#666666", fontSize: 12 }}
        maxValue={5}
        noOfSections={4}
        initialSpacing={20}
        endSpacing={20}
      />

      {showComparison && (
        <View style={styles.comparisonLegend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: selectedMetric.color },
              ]}
            />
            <Text style={styles.legendText}>Student Trend</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#E0E0E0" }]}
            />
            <Text style={styles.legendText}>Class Average</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      entering={FadeIn}
      exiting={FadeOut}
    >
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
          <Text style={styles.ratingValue}>
            {selectedMetric.rating.toFixed(1)}
          </Text>
          <Text style={[styles.ratingLevel, { color: levelColor }]}>
            {level}
          </Text>
        </View>
      </View>

      {/* Chart Controls */}
      <View style={styles.controls}>
        <View style={styles.chartTypeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              chartType === "bar" && styles.activeToggle,
            ]}
            onPress={() => setChartType("bar")}
          >
            <MaterialIcons
              name="bar-chart"
              size={20}
              color={chartType === "bar" ? "#FFFFFF" : "#666666"}
            />
            <Text
              style={[
                styles.toggleText,
                chartType === "bar" && styles.activeToggleText,
              ]}
            >
              Bar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              chartType === "line" && styles.activeToggle,
            ]}
            onPress={() => setChartType("line")}
          >
            <MaterialIcons
              name="show-chart"
              size={20}
              color={chartType === "line" ? "#FFFFFF" : "#666666"}
            />
            <Text
              style={[
                styles.toggleText,
                chartType === "line" && styles.activeToggleText,
              ]}
            >
              Trend
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.comparisonToggle,
            showComparison && styles.activeComparison,
          ]}
          onPress={() => setShowComparison(!showComparison)}
        >
          <MaterialIcons
            name="compare"
            size={20}
            color={showComparison ? "#FFFFFF" : "#666666"}
          />
          <Text
            style={[
              styles.comparisonText,
              showComparison && styles.activeComparisonText,
            ]}
          >
            Compare
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {chartType === "bar" ? renderBarChart() : renderLineChart()}

      {/* Performance Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Current Term</Text>
          <Text style={[styles.summaryValue, { color: selectedMetric.color }]}>
            {selectedMetric.rating.toFixed(1)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Class Average</Text>
          <Text style={styles.summaryValue}>
            {selectedMetric.classAverage.toFixed(1)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Improvement</Text>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    margin: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#999999",
    marginTop: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginLeft: 8,
    flex: 1,
  },
  currentRating: {
    alignItems: "flex-end",
  },
  ratingValue: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
  ratingLevel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTypeToggle: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  activeToggle: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  activeToggleText: {
    color: "#FFFFFF",
  },
  comparisonToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    gap: 4,
  },
  activeComparison: {
    backgroundColor: theme.colors.primary,
  },
  comparisonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  activeComparisonText: {
    color: "#FFFFFF",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  barTopLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  comparisonLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
});

export default GrowthChart;
