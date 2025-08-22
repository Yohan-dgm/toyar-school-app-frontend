import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  pieChartData,
  modernColors,
  studentGrowthMetrics,
} from "../../data/studentGrowthData";

interface ModernPieChartProps {
  size?: number;
  innerRadius?: string;
  showLegend?: boolean;
  showPercentages?: boolean;
}

const ModernPieChart: React.FC<ModernPieChartProps> = ({
  size = 200,
  innerRadius = "60%",
  showLegend = true,
  showPercentages = true,
}) => {
  // Calculate total for percentages
  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentages = pieChartData.map((item) => ({
    ...item,
    percentage: Math.round((item.value / total) * 100),
  }));

  const legendData = studentGrowthMetrics.map((metric, index) => ({
    color: metric.color,
    title: metric.title,
    percentage: dataWithPercentages[index]?.percentage || 0,
    rating: metric.rating,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance Distribution</Text>

      <View style={styles.chartSection}>
        <View style={styles.chartContainer}>
          {/* Fallback circular representation */}
          <View style={[styles.circularChart, { width: size, height: size }]}>
            <View style={styles.pieChartFallback}>
              {dataWithPercentages.slice(0, 8).map((item, index) => (
                <View
                  key={item.key}
                  style={[
                    styles.pieSegment,
                    {
                      backgroundColor:
                        studentGrowthMetrics[index]?.color ||
                        modernColors.primary,
                      transform: [{ rotate: `${index * 45}deg` }],
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Center text */}
          <View style={styles.centerText}>
            <Text style={styles.centerTitle}>Overall</Text>
            <Text style={styles.centerValue}>84%</Text>
            <Text style={styles.centerSubtext}>Performance</Text>
          </View>
        </View>

        {showLegend && (
          <ScrollView
            style={styles.legendContainer}
            showsVerticalScrollIndicator={false}
          >
            {legendData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendLeft}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <View style={styles.legendRight}>
                  {showPercentages && (
                    <Text style={styles.legendPercentage}>
                      {item.percentage}%
                    </Text>
                  )}
                  <Text style={styles.legendRating}>
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: modernColors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: modernColors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  chartSection: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  circularChart: {
    borderRadius: 1000,
    backgroundColor: "#f0f0f0",
    position: "relative",
    overflow: "hidden",
  },
  pieChartFallback: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  pieSegment: {
    position: "absolute",
    width: "50%",
    height: "50%",
    top: 0,
    left: "50%",
    transformOrigin: "0 100%",
    opacity: 0.8,
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: {
    fontSize: 12,
    color: modernColors.textSecondary,
    fontWeight: "500",
  },
  centerValue: {
    fontSize: 24,
    fontWeight: "700",
    color: modernColors.text,
    marginVertical: 2,
  },
  centerSubtext: {
    fontSize: 10,
    color: modernColors.textSecondary,
  },
  legendContainer: {
    flex: 1,
    maxHeight: 200,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTitle: {
    fontSize: 11,
    color: modernColors.text,
    fontWeight: "500",
    flex: 1,
  },
  legendRight: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60,
    justifyContent: "flex-end",
  },
  legendPercentage: {
    fontSize: 10,
    color: modernColors.textSecondary,
    marginRight: 8,
    minWidth: 24,
    textAlign: "right",
  },
  legendRating: {
    fontSize: 11,
    color: modernColors.text,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "right",
  },
});

export default ModernPieChart;
