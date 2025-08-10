import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CHART_SIZE = 120;

interface Student {
  id: number;
  attendance: "present" | "absent" | "late";
}

interface AttendanceRecord {
  date: string;
  present_student_count: number;
  absent_student_count: number;
  late_student_count?: number;
  total_student_count: number;
}

interface CompactAttendanceChartProps {
  // Support both the modern interface and legacy interface for compatibility
  students?: Student[];
  attendanceData?: AttendanceRecord[];
  selectedGrade?: string;
  loading?: boolean;
  onSegmentPress?: (status: string, count: number) => void;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  total: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}

const CompactAttendanceChart: React.FC<CompactAttendanceChartProps> = ({
  students = [],
  attendanceData = [],
  selectedGrade,
  loading = false,
  onSegmentPress,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const animationValue = useSharedValue(0);

  // Calculate attendance statistics from both possible data sources
  const stats = useMemo((): AttendanceStats => {
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let total = 0;

    if (students && students.length > 0) {
      // Use students data if provided (modern interface)
      const validStudents = Array.isArray(students) ? students : [];
      presentCount = validStudents.filter(
        (s) => s?.attendance === "present",
      ).length;
      absentCount = validStudents.filter(
        (s) => s?.attendance === "absent",
      ).length;
      lateCount = validStudents.filter((s) => s?.attendance === "late").length;
      total = validStudents.length;
    } else if (attendanceData && attendanceData.length > 0) {
      // Use attendance data if provided (legacy interface)
      const validAttendanceData = Array.isArray(attendanceData)
        ? attendanceData
        : [];
      presentCount = validAttendanceData.reduce(
        (sum, record) => sum + (record.present_student_count || 0),
        0,
      );
      absentCount = validAttendanceData.reduce(
        (sum, record) => sum + (record.absent_student_count || 0),
        0,
      );
      lateCount = validAttendanceData.reduce(
        (sum, record) => sum + (record.late_student_count || 0),
        0,
      );
      total = presentCount + absentCount + lateCount;
    }

    return {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      total,
      presentPercentage:
        total > 0 ? Math.round((presentCount / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absentCount / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((lateCount / total) * 100) : 0,
    };
  }, [students, attendanceData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const data = [];

    if (stats.present > 0) {
      data.push({
        value: stats.present,
        color: "#4CAF50",
        gradientCenterColor: "#66BB6A",
        focused: selectedSegment === "present",
        text: stats.presentPercentage + "%",
        label: "Present",
      });
    }

    if (stats.absent > 0) {
      data.push({
        value: stats.absent,
        color: "#F44336",
        gradientCenterColor: "#EF5350",
        focused: selectedSegment === "absent",
        text: stats.absentPercentage + "%",
        label: "Absent",
      });
    }

    if (stats.late > 0) {
      data.push({
        value: stats.late,
        color: "#FF9800",
        gradientCenterColor: "#FFA726",
        focused: selectedSegment === "late",
        text: stats.latePercentage + "%",
        label: "Late",
      });
    }

    // If no data, show placeholder
    if (data.length === 0) {
      data.push({
        value: 1,
        color: "#E0E0E0",
        gradientCenterColor: "#E8E8E8",
        focused: false,
        text: "0%",
        label: "No Data",
      });
    }

    return data;
  }, [stats, selectedSegment]);

  // Handle segment press
  const handleSegmentPress = (item: any) => {
    const status = item.label.toLowerCase();
    if (status !== "no data") {
      setSelectedSegment(selectedSegment === status ? null : status);
      onSegmentPress?.(status, item.value);

      // Animate
      animationValue.value = withSpring(selectedSegment === status ? 0 : 1);
    }
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return { icon: "check-circle", color: "#4CAF50", label: "Present" };
      case "absent":
        return { icon: "cancel", color: "#F44336", label: "Absent" };
      case "late":
        return { icon: "schedule", color: "#FF9800", label: "Late" };
      default:
        return { icon: "help", color: "#666", label: "Unknown" };
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(animationValue.value, [0, 1], [1, 1.05]),
      },
    ],
  }));

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="pie-chart" size={16} color="#920734" />
            <Text style={styles.title}>Attendance Overview</Text>
          </View>
          {selectedGrade && (
            <Text style={styles.subtitle}>{selectedGrade}</Text>
          )}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#920734" />
          <Text style={styles.loadingText}>Loading attendance data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="pie-chart" size={16} color="#920734" />
          <Text style={styles.title}>Attendance Overview</Text>
        </View>
        {selectedGrade && <Text style={styles.subtitle}>{selectedGrade}</Text>}
      </View>

      {/* Chart Container */}
      <Animated.View style={[styles.chartContainer, animatedStyle]}>
        {stats.total > 0 ? (
          <View style={styles.chartWrapper}>
            {/* Pie Chart */}
            <PieChart
              data={chartData}
              donut
              showGradient
              sectionAutoFocus
              radius={CHART_SIZE / 2}
              innerRadius={CHART_SIZE / 3}
              innerCircleColor="#FAFAFA"
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerValue}>{stats.total}</Text>
                  <Text style={styles.centerUnit}>Students</Text>
                </View>
              )}
              onPress={handleSegmentPress}
              focusOnPress
              toggleFocusOnPress
            />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <MaterialIcons name="school" size={32} color="#E0E0E0" />
            <Text style={styles.noDataText}>No Students</Text>
            <Text style={styles.noDataSubtext}>
              Select a grade to view attendance
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Statistics Cards */}
      {stats.total > 0 && (
        <View style={styles.statsContainer}>
          {[
            {
              key: "present",
              ...getStatusConfig("present"),
              count: stats.present,
              percentage: stats.presentPercentage,
            },
            {
              key: "absent",
              ...getStatusConfig("absent"),
              count: stats.absent,
              percentage: stats.absentPercentage,
            },
            {
              key: "late",
              ...getStatusConfig("late"),
              count: stats.late,
              percentage: stats.latePercentage,
            },
          ].map((stat) => (
            <TouchableOpacity
              key={stat.key}
              style={[
                styles.statCard,
                selectedSegment === stat.key && {
                  backgroundColor: stat.color + "15",
                  borderColor: stat.color,
                },
              ]}
              onPress={() =>
                handleSegmentPress({ label: stat.label, value: stat.count })
              }
              activeOpacity={0.7}
            >
              <View style={styles.statHeader}>
                <MaterialIcons
                  name={stat.icon as any}
                  size={14}
                  color={stat.color}
                />
                <Text style={[styles.statCount, { color: stat.color }]}>
                  {stat.count}
                </Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statPercentage, { color: stat.color }]}>
                {stat.percentage}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Insights */}
      {stats.total > 0 && (
        <View style={styles.insightsContainer}>
          <LinearGradient
            colors={["#920734", "#A91D47"]}
            style={styles.insightCard}
          >
            <MaterialIcons name="insights" size={16} color="#FFFFFF" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Attendance Rate</Text>
              <Text style={styles.insightValue}>
                {stats.presentPercentage}%
              </Text>
            </View>
            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>
                {stats.presentPercentage >= 95
                  ? "Excellent"
                  : stats.presentPercentage >= 85
                    ? "Good"
                    : stats.presentPercentage >= 75
                      ? "Fair"
                      : "Needs Attention"}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Selected Segment Details */}
      {selectedSegment && stats.total > 0 && (
        <View style={styles.detailsContainer}>
          <LinearGradient
            colors={[
              getStatusConfig(selectedSegment).color + "15",
              getStatusConfig(selectedSegment).color + "05",
            ]}
            style={styles.detailsCard}
          >
            <View style={styles.detailsHeader}>
              <MaterialIcons
                name={getStatusConfig(selectedSegment).icon as any}
                size={20}
                color={getStatusConfig(selectedSegment).color}
              />
              <Text style={styles.detailsTitle}>
                {getStatusConfig(selectedSegment).label} Students
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedSegment(null)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.detailsContent}>
              <Text style={styles.detailsValue}>
                {selectedSegment === "present"
                  ? stats.present
                  : selectedSegment === "absent"
                    ? stats.absent
                    : selectedSegment === "late"
                      ? stats.late
                      : 0}{" "}
                out of {stats.total} students
              </Text>
              <Text style={styles.detailsPercentage}>
                (
                {selectedSegment === "present"
                  ? stats.presentPercentage
                  : selectedSegment === "absent"
                    ? stats.absentPercentage
                    : selectedSegment === "late"
                      ? stats.latePercentage
                      : 0}
                % of total)
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#920734",
    backgroundColor: "#920734" + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  chartWrapper: {
    position: "relative",
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  centerUnit: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    marginTop: 8,
  },
  noDataSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 4,
  },
  statCount: {
    fontSize: 16,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  statPercentage: {
    fontSize: 12,
    fontWeight: "700",
  },
  insightsContainer: {
    marginBottom: 12,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  insightBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insightBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 12,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detailsTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 4,
  },
  detailsContent: {
    gap: 2,
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  detailsPercentage: {
    fontSize: 12,
    color: "#666",
  },
});

export default CompactAttendanceChart;
