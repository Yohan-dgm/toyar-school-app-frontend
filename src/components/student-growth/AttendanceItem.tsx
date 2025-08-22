import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { feedbackCardTheme } from "../../data/studentGrowthData";

interface AttendanceItemData {
  id: number;
  date: string;
  time: string | null;
  student_id: number;
  attendance_type_id: number;
  notes: string | null;
  out_time: string | null;
  in_time: string | null;
  attendance_type: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    full_name: string;
    full_name_with_title: string;
    admission_number: string;
  };
}

interface AttendanceItemProps {
  attendance: AttendanceItemData;
  index: number;
  onPress?: () => void;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  attendance,
  index,
  onPress,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Helper functions
  const getAttendanceStatus = (typeId: number) => {
    switch (typeId) {
      case 1:
        return "Present";
      case 3:
        return "Absent";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (typeId: number) => {
    switch (typeId) {
      case 1:
        return feedbackCardTheme.success; // Green for Present
      case 3:
        return feedbackCardTheme.error; // Red for Absent
      default:
        return feedbackCardTheme.grayMedium;
    }
  };

  const getStatusIcon = (typeId: number) => {
    switch (typeId) {
      case 1:
        return "check-circle";
      case 3:
        return "cancel";
      default:
        return "help-outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";

    // Handle both 24h format (07:30) and 12h format (7:30 AM)
    try {
      // If it's already in HH:MM format, convert to 12h format
      if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  // Simplified attendance logic
  const isPresent = attendance.attendance_type_id === 1;
  const isAbsent = attendance.attendance_type_id === 3;

  // Animation effects
  useEffect(() => {
    const delay = index * 150; // Staggered animation

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index]);

  // Press animation
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) onPress();
  };

  const statusColor = getStatusColor(attendance.attendance_type_id);
  const statusIcon = getStatusIcon(attendance.attendance_type_id);
  const statusText = getAttendanceStatus(attendance.attendance_type_id);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: statusColor }]}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        {/* Main Content */}
        <View style={styles.content}>
          {/* Date and Status */}
          <View style={styles.mainRow}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(attendance.date)}</Text>
              <View style={styles.statusContainer}>
                <MaterialIcons
                  name={statusIcon}
                  size={16}
                  color={statusColor}
                />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusText}
                </Text>
              </View>
            </View>

            {/* Times (only for present) */}
            {isPresent && (
              <View style={styles.timesContainer}>
                <View style={styles.timeRow}>
                  <MaterialIcons
                    name="login"
                    size={14}
                    color={feedbackCardTheme.success}
                  />
                  <Text style={styles.timeText}>
                    {formatTime(attendance.in_time)}
                  </Text>
                </View>
                <View style={styles.timeRow}>
                  <MaterialIcons name="logout" size={14} color="#2196F3" />
                  <Text style={styles.timeText}>
                    {formatTime(attendance.out_time)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Notes for absent days */}
          {isAbsent && attendance.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{attendance.notes}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    backgroundColor: feedbackCardTheme.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: feedbackCardTheme.shadow.small,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 3,
  },
  content: {
    gap: 12,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
    color: feedbackCardTheme.black,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  timesContainer: {
    gap: 4,
    alignItems: "flex-end",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: feedbackCardTheme.grayDark,
    fontWeight: "500",
    minWidth: 60,
    textAlign: "right",
  },
  notesContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: feedbackCardTheme.grayLight,
  },
  notesText: {
    fontSize: 12,
    color: feedbackCardTheme.grayMedium,
    fontStyle: "italic",
    lineHeight: 16,
  },
});

export default AttendanceItem;
