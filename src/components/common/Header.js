import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useDrawer } from "../../context/DrawerContext";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import DrawerMenu from "./DrawerMenu";

const { width } = Dimensions.get("window");

const Header = () => {
  const { user } = useAuth();
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer();
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const insets = useSafeAreaInsets();

  // Get current time for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Mock notification data - replace with real data from API
  const notifications = [
    {
      id: 1,
      title: "Assignment Due Tomorrow",
      message: "Math homework for Emma Johnson is due tomorrow at 9:00 AM",
      time: "2 hours ago",
      read: false,
      type: "assignment",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      message: "Scheduled meeting with Ms. Smith on Friday at 3:00 PM",
      time: "1 day ago",
      read: false,
      type: "meeting",
    },
    {
      id: 3,
      title: "School Event",
      message: "Annual sports day registration is now open",
      time: "2 days ago",
      read: true,
      type: "event",
    },
    {
      id: 4,
      title: "Fee Payment Reminder",
      message: "Monthly fee payment is due by the end of this week",
      time: "3 days ago",
      read: false,
      type: "payment",
    },
  ];

  // Mock student data - replace with real data from API
  const students = [
    {
      id: 1,
      name: "senu Perera",
      profileImage: require("../../assets/images/sample-profile.png"),
      studentId: "NX001",
      campus: "Yakkala College",
    },
    {
      id: 2,
      name: "hasith Perera",
      profileImage: require("../../assets/images/sample-profile.png"),
      studentId: "NX001",
      campus: "Yakkala College",
    },
    {
      id: 3,
      name: "niki Perera",
      profileImage: require("../../assets/images/sample-profile.png"),
      studentId: "NX001",
      campus: "Yakkala College",
    },
  ];

  const currentStudent = selectedStudent || students[0];

  // Calculate unread notifications count
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleMenuPress = () => {
    openDrawer();
  };

  const handleNotificationPress = () => {
    console.log("Notification pressed");
    setShowNotifications(true);
  };

  const handleMarkAsRead = (notificationId) => {
    console.log(`Mark notification ${notificationId} as read`);
    // In real app, this would update the notification status via API
  };

  const handleMarkAllAsRead = () => {
    console.log("Mark all notifications as read");
    // In real app, this would update all notifications via API
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setShowStudentSelector(false);
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.studentItem}
      onPress={() => handleStudentSelect(item)}
    >
      <Image source={item.profileImage} style={styles.studentItemImage} />
      <View style={styles.studentItemInfo}>
        <Text style={styles.studentItemName}>{item.name}</Text>
        <Text style={styles.studentItemId}>
          {item.studentId} - {item.campus}
        </Text>
      </View>
      {selectedStudent?.id === item.id && (
        <MaterialIcons name="check" size={24} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={Platform.OS === "android"}
      />

      {/* Top Section - Menu and Notification */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={
              user?.logo_url || require("../../assets/images/nexis-logo.png")
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.notificationButton}
        >
          <MaterialIcons name="notifications-none" size={26} color="#333" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Section - User Profile and Student Selector */}
      <View style={styles.bottomSection}>
        {/* Left Side - User Profile */}
        <View style={styles.userSection}>
          <Image
            source={require("../../assets/images/sample-profile.png")}
            style={styles.userProfileImage}
          />
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {user?.full_name || "Sarah Perera"}
            </Text>
            <Text style={styles.userRole}>Parent Account</Text>
          </View>
        </View>

        {/* <Text style={[styles.label, { marginBottom: 4 }]}> */}

        {/* Right Side - Student Selector */}
        <TouchableOpacity
          style={styles.studentSelector}
          onPress={() => setShowStudentSelector(true)}
        >
          <Image
            source={currentStudent.profileImage}
            style={[styles.selectedStudentImage, { Width: 80 }]}
          />
          <View style={styles.selectedStudentInfo}>
            <Text style={styles.selectedStudentName}>
              {currentStudent.name}
            </Text>
            <Text style={styles.selectedStudentId}>
              {currentStudent.studentId}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={10} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Student Selection Modal */}
      <Modal
        visible={showStudentSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStudentSelector(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowStudentSelector(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Student</Text>
            <FlatList
              data={students}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.studentList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowNotifications(false)}
        >
          <View style={styles.notificationModalContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <Text style={styles.markAllReadText}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={notifications}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.notificationItem,
                    !item.read && styles.unreadNotificationItem,
                  ]}
                  onPress={() => handleMarkAsRead(item.id)}
                >
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationIconContainer}>
                      <MaterialIcons
                        name={
                          item.type === "assignment"
                            ? "assignment"
                            : item.type === "meeting"
                              ? "event"
                              : item.type === "payment"
                                ? "payment"
                                : "notifications"
                        }
                        size={20}
                        color={!item.read ? theme.colors.primary : "#666666"}
                      />
                      {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.notificationTextContainer}>
                      <Text style={styles.notificationItemTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                        {item.message}
                      </Text>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Drawer Menu */}
      <DrawerMenu isVisible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: theme.spacing.md,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuButton: {
    padding: theme.spacing.xs,
    width: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
  },
  logo: {
    width: 120,
    height: 40,
    marginRight: theme.spacing.xs,
  },
  appName: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  notificationBadgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
    color: "#FFFFFF",
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#ffffff",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: "#000000",
  },
  userRole: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
  },
  studentSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
    minWidth: 160,
  },
  selectedStudentImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: theme.spacing.xs,
  },
  selectedStudentInfo: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  selectedStudentName: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#000000",
  },
  selectedStudentId: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: "#666666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.lg,
    width: width * 0.8,
    maxHeight: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  modalTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  studentList: {
    maxHeight: 300,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
    backgroundColor: "#F8FAFC",
  },
  studentItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  studentItemInfo: {
    flex: 1,
  },
  studentItemName: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  studentItemId: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#64748B",
  },
  notificationModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.lg,
    width: width * 0.9,
    maxHeight: 500,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  notificationTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  markAllReadText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F8F8",
  },
  unreadNotificationItem: {
    backgroundColor: "#FFF8F0",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIconContainer: {
    marginRight: theme.spacing.sm,
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationItemTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: "#000000",
    marginBottom: 4,
  },
  notificationMessage: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: "#999999",
  },
});

export default Header;
