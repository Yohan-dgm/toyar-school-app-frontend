import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { setIsAuthenticated } from "../../state-store/slices/app-slice";
import { theme } from "../../styles/theme";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

const DrawerMenu = ({ isVisible, onClose }) => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isVisible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleLogout = () => {
    console.log("🔹 Drawer Menu: Logout pressed");

    // Clear user data and authentication state
    setUser(null);
    dispatch(setIsAuthenticated(false));

    // Close drawer first
    onClose();

    // Navigate to public index page
    setTimeout(() => {
      router.replace("/public");
    }, 300); // Small delay to allow drawer close animation
  };

  const menuItems = [
    {
      id: "profile",
      title: "Profile",
      icon: "person",
      onPress: () => {
        console.log("🔹 Drawer Menu: Navigate to Profile");
        onClose();
      },
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications",
      onPress: () => {
        console.log("🔹 Drawer Menu: Navigate to Notifications");
        onClose();
      },
    },
    {
      id: "payments",
      title: "Payments",
      icon: "payments",
      onPress: () => {
        console.log("🔹 Drawer Menu: Navigate to Payments");
        onClose();
      },
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings",
      onPress: () => {
        console.log("🔹 Drawer Menu: Navigate to Settings");
        onClose();
      },
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help",
      onPress: () => {
        console.log("Navigate to Help");
        onClose();
      },
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "policy",
      onPress: () => {
        console.log("Navigate to Privacy Policy");
        onClose();
      },
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      icon: "description",
      onPress: () => {
        console.log("Navigate to Terms");
        onClose();
      },
    },
    {
      id: "logout",
      title: "Logout",
      icon: "logout",
      onPress: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header Section */}
        <LinearGradient
          colors={["rgb(4 46 102)", "rgb(147 42 45)"]}
          style={[styles.drawerHeader, { paddingTop: insets.top + 20 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image
              source={require("../../assets/images/sample-profile.png")}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>
              {user?.full_name || "Parent User"}
            </Text>
            <Text style={styles.userRole}>Parent Account</Text>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, item.isLogout && styles.logoutItem]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.isLogout ? "#EF4444" : theme.colors.text}
              />
              <Text
                style={[
                  styles.menuItemText,
                  item.isLogout && styles.logoutText,
                ]}
              >
                {item.title}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={item.isLogout ? "#EF4444" : "#94A3B8"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.appVersion}>SchoolSnap v1.0.0</Text>
          <Text style={styles.footerText}>Nexis College International</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: height,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  drawerHeader: {
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    alignItems: "center",
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.sm,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userRole: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#E0E7FF",
  },
  menuContainer: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
    marginTop: theme.spacing.sm,
  },
  menuItemText: {
    flex: 1,
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  logoutText: {
    color: "#EF4444",
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    alignItems: "center",
  },
  appVersion: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  footerText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#64748B",
  },
});

export default DrawerMenu;
