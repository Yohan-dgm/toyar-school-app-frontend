import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { multiLineChartData, modernColors } from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");

interface MultiLineChartProps {
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  height = 180,
  showGrid = true,
  showLabels = true,
}) => {
  const chartWidth = width - 32;

  // Extract data arrays for the chart
  const data = multiLineChartData.map((line) => line.data);

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.header}>
          <Text style={styles.title}>Performance Trends</Text>
          <Text style={styles.subtitle}>Monthly progress tracking</Text>
        </View>
      )}

      <View style={[styles.chartContainer, { height }]}>
        {/* Fallback chart representation */}
        <View style={styles.chartFallback}>
          <Text style={styles.chartPlaceholder}>📈 Multi-line Chart</Text>
          <Text style={styles.chartSubtext}>Performance trends over time</Text>

          {/* Simple bar representation */}
          <View style={styles.barsContainer}>
            {[85, 88, 92, 89, 91, 94, 87, 90, 88, 93, 89, 95].map(
              (value, index) => (
                <View key={index} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${value}%`,
                        backgroundColor:
                          multiLineChartData[index % 4]?.svg?.stroke ||
                          modernColors.primary,
                      },
                    ]}
                  />
                </View>
              ),
            )}
          </View>
        </View>
      </View>

      {showLabels && (
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: modernColors.primary },
                ]}
              />
              <Text style={styles.legendText}>Overall</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: modernColors.secondary },
                ]}
              />
              <Text style={styles.legendText}>Academic</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: modernColors.accent },
                ]}
              />
              <Text style={styles.legendText}>Behaviour</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: modernColors.success },
                ]}
              />
              <Text style={styles.legendText}>Emotional</Text>
            </View>
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
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    marginHorizontal: 1,
  },
  bar: {
    width: "80%",
    borderRadius: 2,
    opacity: 0.8,
  },
  legend: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
  },
});

export default MultiLineChart;
