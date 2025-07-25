import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { theme } from "../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../constants/userCategories";

// Import drawer components (to be created)
import EducatorFeedbackDrawer from "./drawers/EducatorFeedbackDrawer";
import MarkAttendanceDrawer from "./drawers/MarkAttendanceDrawer";
import StudentDetailsDrawer from "./drawers/StudentDetailsDrawer";
import StudentAnalysisDrawer from "./drawers/StudentAnalysisDrawer";
import AddActivityDrawer from "./drawers/AddActivityDrawer";

const { height } = Dimensions.get("window");

const UserActionsMain = () => {
  // Modal refs
  const feedbackModalRef = useRef(null);
  const attendanceModalRef = useRef(null);
  const studentDetailsModalRef = useRef(null);
  const studentAnalysisModalRef = useRef(null);
  const addActivityModalRef = useRef(null);

  // Get global state
  const { sessionData } = useSelector((state) => state.app);

  // Get user category from session data
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;
  const isEducator = userCategory === USER_CATEGORIES.EDUCATOR;

  // Action items configuration
  const actionItems = [
    {
      id: "feedback",
      title: "Educator Feedbacks",
      subtitle: "Add and manage student feedback",
      icon: "rate-review",
      color: "#4CAF50",
      onPress: () => feedbackModalRef.current?.open(),
    },
    {
      id: "attendance",
      title: "Mark Attendance",
      subtitle: "Mark classroom attendance",
      icon: "how-to-reg",
      color: "#2196F3",
      onPress: () => attendanceModalRef.current?.open(),
    },
    {
      id: "students",
      title: "Student Details",
      subtitle: "View classroom student information",
      icon: "people",
      color: "#FF9800",
      onPress: () => studentDetailsModalRef.current?.open(),
    },
    {
      id: "analysis",
      title: "Student Analysis",
      subtitle: "View student performance analytics",
      icon: "analytics",
      color: "#9C27B0",
      onPress: () => studentAnalysisModalRef.current?.open(),
    },
    {
      id: "activity",
      title: "Add Activity Feed",
      subtitle: "Post classroom activities",
      icon: "post-add",
      color: "#F44336",
      onPress: () => addActivityModalRef.current?.open(),
    },
  ];

  const renderActionCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.actionCard, { borderLeftColor: item.color }]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionCardContent}>
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
        >
          <MaterialIcons name={item.icon} size={28} color={item.color} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>{item.title}</Text>
          <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={theme.colors.secondary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {/* <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <MaterialIcons
            name="settings"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.headerTitle}>User Actions</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage classroom activities and student interactions
        </Text>
      </View> */}

      {/* Actions List */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsContainer}>
          {actionItems.map(renderActionCard)}
        </View>
      </ScrollView>

      {/* Bottom Drawer Modals */}
      <Modalize
        ref={feedbackModalRef}
        modalHeight={height * 0.85}
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        overlayStyle={styles.overlayStyle}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
      >
        <EducatorFeedbackDrawer />
      </Modalize>

      <Modalize
        ref={attendanceModalRef}
        modalHeight={height * 0.75}
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        overlayStyle={styles.overlayStyle}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
      >
        <MarkAttendanceDrawer />
      </Modalize>

      <Modalize
        ref={studentDetailsModalRef}
        modalHeight={height * 0.8}
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        overlayStyle={styles.overlayStyle}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
      >
        <StudentDetailsDrawer />
      </Modalize>

      <Modalize
        ref={studentAnalysisModalRef}
        modalHeight={height * 0.85}
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        overlayStyle={styles.overlayStyle}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
      >
        <StudentAnalysisDrawer />
      </Modalize>

      <Modalize
        ref={addActivityModalRef}
        modalHeight={height * 0.8}
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        overlayStyle={styles.overlayStyle}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
      >
        <AddActivityDrawer />
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  actionsContainer: {
    padding: theme.spacing.md,
  },
  actionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  modalStyle: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleStyle: {
    backgroundColor: theme.colors.border,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  overlayStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default UserActionsMain;
