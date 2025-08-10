import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { attendanceData } from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");

const AttendanceStatusIcon = ({ status, size = 24 }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "present":
        return { icon: "check-circle", color: "#4CAF50" };
      case "absent":
        return { icon: "cancel", color: "#F44336" };
      case "late":
        return { icon: "schedule", color: "#FF9800" };
      case "holiday":
        return { icon: "event", color: "#9C27B0" };
      case "weekend":
        return { icon: "weekend", color: "#607D8B" };
      default:
        return { icon: "help", color: "#999999" };
    }
  };

  const { icon, color } = getStatusConfig();

  return <MaterialIcons name={icon} size={size} color={color} />;
};

const AttendanceDay = ({ day }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    };
  };

  const { day: dayNumber, weekday } = formatDate(day.date);

  return (
    <View style={styles.attendanceDay}>
      <Text style={styles.dayNumber}>{dayNumber}</Text>
      <Text style={styles.weekday}>{weekday}</Text>
      <View style={styles.statusContainer}>
        <AttendanceStatusIcon status={day.status} size={20} />
      </View>
      {day.time && <Text style={styles.timeText}>{day.time}</Text>}
    </View>
  );
};

const WeeklyView = ({ weekData }) => {
  return (
    <View style={styles.weekContainer}>
      <Text style={styles.weekTitle}>{weekData.week}</Text>
      <View style={styles.daysContainer}>
        {weekData.days.map((day, index) => (
          <AttendanceDay key={index} day={day} />
        ))}
      </View>
    </View>
  );
};

const MonthlyStats = ({ monthlyStats }) => {
  const months = Object.keys(monthlyStats);

  return (
    <View style={styles.monthlyContainer}>
      <Text style={styles.sectionTitle}>Monthly Statistics</Text>
      {months.map((month) => {
        const stats = monthlyStats[month];
        return (
          <View key={month} style={styles.monthCard}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthName}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </Text>
              <Text
                style={[
                  styles.monthPercentage,
                  {
                    color:
                      stats.percentage >= 95
                        ? "#4CAF50"
                        : stats.percentage >= 90
                          ? "#FF9800"
                          : "#F44336",
                  },
                ]}
              >
                {stats.percentage}%
              </Text>
            </View>
            <View style={styles.monthStats}>
              <View style={styles.statItem}>
                <AttendanceStatusIcon status="present" size={16} />
                <Text style={styles.statText}>{stats.present} days</Text>
              </View>
              <View style={styles.statItem}>
                <AttendanceStatusIcon status="absent" size={16} />
                <Text style={styles.statText}>{stats.absent} days</Text>
              </View>
              <View style={styles.statItem}>
                <AttendanceStatusIcon status="late" size={16} />
                <Text style={styles.statText}>{stats.late} days</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const AttendanceOverview = ({ data }) => {
  return (
    <View style={styles.overviewContainer}>
      <Text style={styles.sectionTitle}>Attendance Overview</Text>

      {/* Main Stats */}
      <View style={styles.mainStatsContainer}>
        <View style={styles.percentageCircle}>
          <Text style={styles.percentageText}>
            {data.attendancePercentage}%
          </Text>
          <Text style={styles.percentageLabel}>Attendance</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <AttendanceStatusIcon status="present" size={24} />
            <Text style={styles.statNumber}>{data.presentDays}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>

          <View style={styles.statCard}>
            <AttendanceStatusIcon status="absent" size={24} />
            <Text style={styles.statNumber}>{data.absentDays}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>

          <View style={styles.statCard}>
            <AttendanceStatusIcon status="late" size={24} />
            <Text style={styles.statNumber}>{data.lateDays}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>
          {data.presentDays} of {data.totalDays} school days attended
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${data.attendancePercentage}%`,
                backgroundColor:
                  data.attendancePercentage >= 95
                    ? "#4CAF50"
                    : data.attendancePercentage >= 90
                      ? "#FF9800"
                      : "#F44336",
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const AttendanceSheet = ({ isVisible, onClose }) => {
  const bottomSheetRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'weekly', 'monthly'

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "weekly", label: "Weekly", icon: "view-week" },
    { id: "monthly", label: "Monthly", icon: "calendar-view-month" },
  ];

  if (!isVisible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Student Attendance</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <MaterialIcons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? "#FFFFFF" : "#666666"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <BottomSheetScrollView style={styles.scrollContainer}>
        {activeTab === "overview" && (
          <AttendanceOverview data={attendanceData} />
        )}

        {activeTab === "weekly" && (
          <View style={styles.weeklyContainer}>
            <Text style={styles.sectionTitle}>Weekly Attendance</Text>
            {attendanceData.weeklyData.map((week, index) => (
              <WeeklyView key={index} weekData={week} />
            ))}
          </View>
        )}

        {activeTab === "monthly" && (
          <MonthlyStats monthlyStats={attendanceData.monthlyStats} />
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "#E0E0E0",
    width: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    gap: 6,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginVertical: 16,
  },
  overviewContainer: {
    paddingBottom: 20,
  },
  mainStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  percentageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    borderWidth: 4,
    borderColor: "#4CAF50",
  },
  percentageText: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: "#4CAF50",
  },
  percentageLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  statsGrid: {
    flex: 1,
    gap: 8,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    minWidth: 30,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    flex: 1,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  weeklyContainer: {
    paddingBottom: 20,
  },
  weekContainer: {
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  weekTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attendanceDay: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
  weekday: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  statusContainer: {
    marginVertical: 4,
  },
  timeText: {
    fontSize: 10,
    fontFamily: theme.fonts.regular,
    color: "#999999",
  },
  monthlyContainer: {
    paddingBottom: 20,
  },
  monthCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#000000",
  },
  monthPercentage: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
  },
  monthStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
});

export default AttendanceSheet;
