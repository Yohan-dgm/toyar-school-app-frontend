import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  stackedAreaData,
  modernColors,
  studentGrowthMetrics,
} from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");

interface StackedAreaChartProps {
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  height = 200,
  showGrid = true,
  showLabels = true,
}) => {
  const chartWidth = width - 32;

  // Create the stacked data structure for 13 intelligence categories
  const keys = [
    "intrapersonal",
    "interpersonal",
    "music",
    "bodily_kinesthetic",
    "linguistic",
    "mathematical_logical",
  ];
  const colors = [
    "#8B5CF6",
    "#3B82F6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.header}>
          <Text style={styles.title}>Intelligence Areas Over Time</Text>
          <Text style={styles.subtitle}>
            13 intelligence categories tracking
          </Text>
        </View>
      )}

      <View style={[styles.chartContainer, { height }]}>
        {/* Fallback stacked chart representation */}
        <View style={styles.chartFallback}>
          <Text style={styles.chartPlaceholder}>📊 Stacked Area Chart</Text>
          <Text style={styles.chartSubtext}>
            Intelligence development over months
          </Text>

          {/* Simple stacked representation */}
          <View style={styles.stackedBarsContainer}>
            {stackedAreaData.map((monthData, monthIndex) => (
              <View key={monthIndex} style={styles.monthColumn}>
                <Text style={styles.monthLabel}>{monthData.month}</Text>
                <View style={styles.stackedBar}>
                  {keys.map((key, keyIndex) => (
                    <View
                      key={key}
                      style={[
                        styles.stackSegment,
                        {
                          backgroundColor: colors[keyIndex],
                          height: `${(monthData[key] || 0) / 6}%`, // Normalize to fit
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {showLabels && (
        <View style={styles.legend}>
          <View style={styles.legendGrid}>
            {keys.map((key, index) => {
              const metricTitle =
                studentGrowthMetrics.find((m) => m.id === key)?.title || key;
              return (
                <View key={key} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: colors[index] },
                    ]}
                  />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {metricTitle}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
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
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: modernColors.textSecondary,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartFallback: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
  },
  chartPlaceholder: {
    fontSize: 18,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 14,
    color: modernColors.textSecondary,
    marginBottom: 16,
  },
  stackedBarsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  monthColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    marginHorizontal: 2,
  },
  monthLabel: {
    fontSize: 10,
    color: modernColors.textSecondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  stackedBar: {
    width: 20,
    height: 80,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  stackSegment: {
    width: "100%",
    opacity: 0.8,
  },
  legend: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: modernColors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
});

export default StackedAreaChart;
