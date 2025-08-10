import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface BulkAttendanceActionsProps {
  visible: boolean;
  onClose: () => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onMarkAllLate: () => void;
  onResetAll: () => void;
  studentCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

const BulkAttendanceActions: React.FC<BulkAttendanceActionsProps> = ({
  visible,
  onClose,
  onMarkAllPresent,
  onMarkAllAbsent,
  onMarkAllLate,
  onResetAll,
  studentCount,
  presentCount,
  absentCount,
  lateCount,
}) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const scaleValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacityValue.value = withTiming(1, { duration: 200 });
    } else {
      scaleValue.value = withTiming(0, { duration: 150 });
      opacityValue.value = withTiming(0, { duration: 150 });
    }
  }, [visible, scaleValue, opacityValue]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
      { translateY: interpolate(scaleValue.value, [0, 1], [50, 0]) },
    ],
    opacity: opacityValue.value,
  }));

  const handleAction = (action: string, callback: () => void) => {
    const actionLabels: { [key: string]: string } = {
      present: "Mark All Present",
      absent: "Mark All Absent",
      late: "Mark All Late",
      reset: "Reset All Attendance",
    };

    const actionLabel = actionLabels[action] || "Perform Action";

    Alert.alert(
      "Confirm Bulk Action",
      `Are you sure you want to ${actionLabel.toLowerCase()} for all ${studentCount} students?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: action === "reset" ? "destructive" : "default",
          onPress: () => {
            try {
              callback();
              onClose();
            } catch (error) {
              console.error("Error executing bulk action:", error);
              Alert.alert(
                "Error",
                "Failed to execute bulk action. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const bulkActions = [
    {
      id: "present",
      label: "Mark All Present",
      description: `Set all ${studentCount} students as present`,
      icon: "check-circle",
      color: "#4CAF50",
      gradient: ["#4CAF50", "#45A049"],
      callback: onMarkAllPresent,
      count: presentCount,
      isDisabled: presentCount === studentCount,
    },
    {
      id: "absent",
      label: "Mark All Absent",
      description: `Set all ${studentCount} students as absent`,
      icon: "cancel",
      color: "#F44336",
      gradient: ["#F44336", "#E53935"],
      callback: onMarkAllAbsent,
      count: absentCount,
      isDisabled: absentCount === studentCount,
    },
    {
      id: "late",
      label: "Mark All Late",
      description: `Set all ${studentCount} students as late`,
      icon: "schedule",
      color: "#FF9800",
      gradient: ["#FF9800", "#FB8C00"],
      callback: onMarkAllLate,
      count: lateCount,
      isDisabled: lateCount === studentCount,
    },
    {
      id: "reset",
      label: "Reset All",
      description: "Reset all students to default (present)",
      icon: "refresh",
      color: "#666",
      gradient: ["#666", "#555"],
      callback: onResetAll,
      count: 0,
      isDisabled:
        presentCount === studentCount && absentCount === 0 && lateCount === 0,
    },
  ];

  // Debug logging
  console.log("🎯 BulkAttendanceActions render - visible:", visible);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        >
          <Animated.View style={[styles.container, animatedContainerStyle]}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <MaterialIcons name="group" size={24} color="#920734" />
                  <View style={styles.headerText}>
                    <Text style={styles.title}>Bulk Actions</Text>
                    <Text style={styles.subtitle}>
                      Quickly update attendance for all {studentCount} students
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Current Statistics */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Current Status</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <MaterialIcons
                      name="check-circle"
                      size={16}
                      color="#4CAF50"
                    />
                    <Text style={[styles.statValue, { color: "#4CAF50" }]}>
                      {presentCount}
                    </Text>
                    <Text style={styles.statLabel}>Present</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialIcons name="cancel" size={16} color="#F44336" />
                    <Text style={[styles.statValue, { color: "#F44336" }]}>
                      {absentCount}
                    </Text>
                    <Text style={styles.statLabel}>Absent</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialIcons name="schedule" size={16} color="#FF9800" />
                    <Text style={[styles.statValue, { color: "#FF9800" }]}>
                      {lateCount}
                    </Text>
                    <Text style={styles.statLabel}>Late</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialIcons name="people" size={16} color="#920734" />
                    <Text style={[styles.statValue, { color: "#920734" }]}>
                      {studentCount}
                    </Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsTitle}>Quick Actions</Text>
                {bulkActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.actionButton,
                      action.isDisabled && styles.disabledButton,
                      selectedAction === action.id && styles.selectedButton,
                    ]}
                    onPress={() => {
                      if (!action.isDisabled) {
                        setSelectedAction(action.id);
                        setTimeout(() => {
                          setSelectedAction(null);
                          handleAction(action.id, action.callback);
                        }, 150);
                      }
                    }}
                    disabled={action.isDisabled}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        action.isDisabled
                          ? ["#E0E0E0", "#D0D0D0"]
                          : action.gradient
                      }
                      style={styles.actionGradient}
                    >
                      <View style={styles.actionContent}>
                        <View style={styles.actionHeader}>
                          <View style={styles.actionIconContainer}>
                            <MaterialIcons
                              name={
                                action.icon as keyof typeof MaterialIcons.glyphMap
                              }
                              size={24}
                              color={action.isDisabled ? "#999" : "#FFFFFF"}
                            />
                          </View>
                          <View style={styles.actionInfo}>
                            <Text
                              style={[
                                styles.actionLabel,
                                action.isDisabled && styles.disabledText,
                              ]}
                            >
                              {action.label}
                            </Text>
                            <Text
                              style={[
                                styles.actionDescription,
                                action.isDisabled && styles.disabledDescription,
                              ]}
                            >
                              {action.description}
                            </Text>
                          </View>
                        </View>

                        {action.isDisabled && (
                          <View style={styles.disabledBadge}>
                            <MaterialIcons
                              name="check"
                              size={12}
                              color="#4CAF50"
                            />
                            <Text style={styles.disabledBadgeText}>
                              Applied
                            </Text>
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Warning Note */}
              <View style={styles.warningContainer}>
                <MaterialIcons name="warning" size={16} color="#FF9800" />
                <Text style={styles.warningText}>
                  Bulk actions will override individual student attendance
                  settings. This action cannot be undone.
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 25,
  },
  backdropTouchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 30,
    zIndex: 10000,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 4,
  },
  statsContainer: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  selectedButton: {
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    padding: 16,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
  },
  disabledText: {
    color: "#999",
  },
  disabledDescription: {
    color: "#999",
  },
  disabledBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  disabledBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    margin: 20,
    marginTop: 0,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  warningText: {
    fontSize: 12,
    color: "#E65100",
    flex: 1,
    lineHeight: 16,
  },
});

export default BulkAttendanceActions;
