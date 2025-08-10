import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { MaterialIcons } from "@expo/vector-icons";
import { AttendanceRecord } from "../../api/attendance-api";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 60;

interface AttendanceChartProps {
  attendanceData: AttendanceRecord[];
  selectedGrade: string;
  loading?: boolean;
}

interface ChartDataPoint {
  value: number;
  label: string;
  month: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  color?: string;
}

interface MonthlyStats {
  month: string;
  monthLabel: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({
  attendanceData = [],
  selectedGrade,
  loading = false,
}) => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [selectedDataPoint, setSelectedDataPoint] =
    useState<ChartDataPoint | null>(null);

  // Process attendance data into monthly statistics
  const monthlyData = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) {
      return [];
    }

    // Get last 6 months
    const months = getLastSixMonths();
    const monthlyStats: MonthlyStats[] = [];

    months.forEach(({ month, label }) => {
      // Filter records for this month (using timezone-safe parsing)
      const monthRecords = attendanceData.filter((record) => {
        // Parse date safely to avoid timezone issues
        const [recordYear, recordMonth] = record.date.split("-").map(Number);
        const recordMonthStr = `${recordYear}-${String(recordMonth).padStart(2, "0")}`;
        return recordMonthStr === month;
      });

      // Always add data for each month, even if no records
      const totalPresent = monthRecords.reduce(
        (sum, record) => sum + record.present_student_count,
        0,
      );
      const totalAbsent = monthRecords.reduce(
        (sum, record) => sum + record.absent_student_count,
        0,
      );
      const totalStudents = totalPresent + totalAbsent;
      const attendanceRate =
        totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

      monthlyStats.push({
        month,
        monthLabel: label,
        totalStudents,
        presentCount: totalPresent,
        absentCount: totalAbsent,
        attendanceRate: Math.round(attendanceRate * 10) / 10, // Round to 1 decimal
      });
    });

    return monthlyStats;
  }, [attendanceData]);

  // Convert monthly data to chart format
  const chartData = useMemo(() => {
    return monthlyData.map((monthStat, index) => ({
      value: monthStat.attendanceRate,
      label: monthStat.monthLabel,
      month: monthStat.month,
      totalStudents: monthStat.totalStudents,
      presentCount: monthStat.presentCount,
      absentCount: monthStat.absentCount,
      color: getAttendanceColor(monthStat.attendanceRate),
      frontColor: getAttendanceColor(monthStat.attendanceRate), // For bar chart
    }));
  }, [monthlyData]);

  // Handle data point press
  const handleDataPointPress = (dataPoint: ChartDataPoint) => {
    setSelectedDataPoint(dataPoint);
  };

  // Toggle chart type
  const toggleChartType = () => {
    setChartType((prev) => (prev === "line" ? "bar" : "line"));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#920734" />
        <Text style={styles.loadingText}>Loading attendance chart...</Text>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="timeline" size={64} color="#E0E0E0" />
        <Text style={styles.emptyTitle}>No Attendance Data</Text>
        <Text style={styles.emptyText}>
          No attendance records found for the selected period
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="timeline" size={16} color="#920734" />
          <Text style={styles.title}>Monthly Attendance</Text>
        </View>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleChartType}>
          <MaterialIcons
            name={chartType === "line" ? "bar-chart" : "show-chart"}
            size={16}
            color="#920734"
          />
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {chartType === "line" ? (
          <LineChart
            data={chartData}
            width={CHART_WIDTH - 60}
            height={120}
            color="#920734"
            thickness={2}
            dataPointsColor="#920734"
            dataPointsRadius={4}
            textColor="#666"
            textShiftY={-5}
            textShiftX={-8}
            textFontSize={10}
            showVerticalLines={false}
            onPress={handleDataPointPress}
            curved
            animateOnDataChange
            animationDuration={800}
            yAxisLabelSuffix="%"
            maxValue={100}
            stepValue={25}
            noOfSections={4}
            yAxisColor="#E0E0E0"
            xAxisColor="#E0E0E0"
            backgroundColor="#FFFFFF"
            hideYAxisText={false}
            yAxisTextStyle={{ fontSize: 9, color: "#666" }}
            xAxisLabelTextStyle={{ fontSize: 9, color: "#666" }}
          />
        ) : (
          <BarChart
            data={chartData}
            width={CHART_WIDTH - 60}
            height={120}
            barWidth={20}
            spacing={15}
            roundedTop
            roundedBottom
            showGradient
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisColor="#E0E0E0"
            xAxisColor="#E0E0E0"
            textColor="#666"
            textShiftY={-5}
            textFontSize={10}
            onPress={handleDataPointPress}
            animateOnDataChange
            animationDuration={800}
            yAxisLabelSuffix="%"
            maxValue={100}
            stepValue={25}
            noOfSections={4}
            yAxisTextStyle={{ fontSize: 9, color: "#666" }}
            xAxisLabelTextStyle={{ fontSize: 9, color: "#666" }}
          />
        )}
      </View>

      {/* Compact Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>90%+</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FF9800" }]} />
          <Text style={styles.legendText}>80-90%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#F44336" }]} />
          <Text style={styles.legendText}>&lt;80%</Text>
        </View>
      </View>

      {/* Selected Data Point Details */}
      {selectedDataPoint && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>
              {selectedDataPoint.label} Details
            </Text>
            <TouchableOpacity onPress={() => setSelectedDataPoint(null)}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContent}>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Attendance Rate:</Text>
              <Text
                style={[
                  styles.detailsValue,
                  { color: selectedDataPoint.color },
                ]}
              >
                {selectedDataPoint.value.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Present Students:</Text>
              <Text style={styles.detailsValue}>
                {selectedDataPoint.presentCount}
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Absent Students:</Text>
              <Text style={styles.detailsValue}>
                {selectedDataPoint.absentCount}
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Total Students:</Text>
              <Text style={styles.detailsValue}>
                {selectedDataPoint.totalStudents}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// Helper function to get last 6 months (synchronized with API)
const getLastSixMonths = () => {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "short" });
    months.push({ month, label });
  }

  return months;
};

// Helper function to get color based on attendance rate
const getAttendanceColor = (rate: number): string => {
  if (rate >= 90) return "#4CAF50"; // Green - Excellent
  if (rate >= 80) return "#FF9800"; // Orange - Good
  return "#F44336"; // Red - Needs Improvement
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  toggleButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#FAFAFA",
    borderRadius: 6,
    padding: 8,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9,
    color: "#666",
  },
  detailsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  detailsContent: {
    gap: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsLabel: {
    fontSize: 12,
    color: "#666",
  },
  detailsValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
});

export default AttendanceChart;
