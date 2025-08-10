import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import {
  getStudentProfilePicture,
  getDefaultStudentProfileImage,
  getLocalFallbackProfileImage,
} from "../../utils/studentProfileUtils";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 cards per row with margins

interface Student {
  id: number;
  name: string;
  full_name: string;
  admission_number: string;
  profile_image?: string;
  attachment?: any;
  attachments?: any[];
  student_attachment_list?: any[];
  grade: string;
  class: string;
  house?: string;
  attendance: "present" | "absent" | "late";
}

interface ModernStudentAttendanceCardProps {
  student: Student;
  onAttendanceChange: (
    studentId: number,
    status: "present" | "absent" | "late",
  ) => void;
  onStudentPress: (student: Student) => void;
  isSelected?: boolean;
}

const ModernStudentAttendanceCard: React.FC<
  ModernStudentAttendanceCardProps
> = ({ student, onAttendanceChange, onStudentPress, isSelected = false }) => {
  const scaleValue = useSharedValue(1);
  const selectedValue = useSharedValue(isSelected ? 1 : 0);

  // Animation for card press
  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  // Get status colors and configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return {
          color: "#4CAF50",
          background: "#E8F5E8",
          gradient: ["#4CAF50", "#45A049"],
          icon: "check-circle",
          label: "Present",
        };
      case "absent":
        return {
          color: "#F44336",
          background: "#FFEBEE",
          gradient: ["#F44336", "#E53935"],
          icon: "cancel",
          label: "Absent",
        };
      case "late":
        return {
          color: "#FF9800",
          background: "#FFF3E0",
          gradient: ["#FF9800", "#FB8C00"],
          icon: "schedule",
          label: "Late",
        };
      default:
        return {
          color: "#666",
          background: "#F5F5F5",
          gradient: ["#666", "#555"],
          icon: "help",
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(student.attendance);

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectedValue.value,
      [0, 1],
      [statusConfig.background, statusConfig.color + "20"],
    ),
  }));

  // Get student profile image with fallback
  const getStudentProfileImage = (student: Student) => {
    const profilePictureSource = getStudentProfilePicture(student);
    const profileImage =
      profilePictureSource || getDefaultStudentProfileImage();
    const finalProfileImage = profileImage || getLocalFallbackProfileImage();
    return finalProfileImage;
  };

  // Quick status change buttons
  const StatusButton = ({
    status,
    config,
  }: {
    status: string;
    config: any;
  }) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        student.attendance === status && { backgroundColor: config.color },
      ]}
      onPress={() => {
        // Use the centralized attendance change handler
        // which will handle late attendance modal logic  
        onAttendanceChange(student.id, status as any);
      }}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={config.icon}
        size={16}
        color={student.attendance === status ? "#fff" : config.color}
      />
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onStudentPress(student)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Status Indicator Strip */}
        <LinearGradient
          colors={statusConfig.gradient}
          style={styles.statusStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={getStudentProfileImage(student)}
              style={styles.profileImage}
              defaultSource={getLocalFallbackProfileImage()}
            />

            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig.color },
              ]}
            >
              <MaterialIcons
                name={statusConfig.icon as any}
                size={12}
                color="#fff"
              />
            </View>
          </View>
        </View>

        {/* Student Information */}
        <View style={styles.infoSection}>
          <Text style={styles.studentName} numberOfLines={1}>
            {student.full_name}
          </Text>
          <Text style={styles.admissionNumber}>{student.admission_number}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.gradeClass}>
              {student.grade} - {student.class}
            </Text>
            {student.house && (
              <Text style={styles.house} numberOfLines={1}>
                {student.house}
              </Text>
            )}
          </View>
        </View>

        {/* Status Section */}
        <Animated.View style={[styles.statusSection, statusAnimatedStyle]}>
          <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </Animated.View>

        {/* Quick Action Buttons */}
        <View style={styles.actionButtons}>
          <StatusButton status="present" config={getStatusConfig("present")} />
          <StatusButton status="absent" config={getStatusConfig("absent")} />
          <StatusButton status="late" config={getStatusConfig("late")} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    position: "relative",
    overflow: "hidden",
  },
  statusStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statusBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 4,
  },
  admissionNumber: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 6,
  },
  metaInfo: {
    alignItems: "center",
  },
  gradeClass: {
    fontSize: 12,
    fontWeight: "600",
    color: "#920734",
    marginBottom: 2,
  },
  house: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
  },
  statusSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});

export default ModernStudentAttendanceCard;
