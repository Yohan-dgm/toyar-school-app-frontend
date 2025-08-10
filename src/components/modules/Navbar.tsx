import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "@/state-store/slices/app-slice";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/styles/theme";
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  Home,
  Users,
  BookOpen,
} from "@/lib/icons";

const { width } = Dimensions.get("window");

interface NavbarProps {
  userRole: "parent" | "educator" | "student";
}

export const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    dispatch(setIsAuthenticated(false));
    router.replace("/public");
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "parent":
        return theme.colors.primary; // Use our theme primary color
      case "educator":
        return theme.colors.secondary;
      case "student":
        return theme.colors.accentGreen;
      default:
        return theme.colors.primary;
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case "parent":
        return "Parent Portal";
      case "educator":
        return "Educator Dashboard";
      case "student":
        return "Student Hub";
      default:
        return "School App";
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Home", onPress: () => {} },
      { icon: Bell, label: "Notifications", onPress: () => {} },
    ];

    switch (userRole) {
      case "parent":
        return [
          ...baseItems,
          { icon: BookOpen, label: "Progress", onPress: () => {} },
          { icon: Settings, label: "Settings", onPress: () => {} },
        ];
      case "educator":
        return [
          ...baseItems,
          {
            icon: Users,
            label: "Students",
            onPress: () =>
              router.push("/authenticated/educator/user-management/user"),
          },
          { icon: BookOpen, label: "Classes", onPress: () => {} },
          { icon: Settings, label: "Settings", onPress: () => {} },
        ];
      case "student":
        return [
          ...baseItems,
          { icon: BookOpen, label: "Assignments", onPress: () => {} },
          { icon: Settings, label: "Settings", onPress: () => {} },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: getRoleColor() }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left Side - Menu */}
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color="#1a1a1a" />
        </TouchableOpacity>

        {/* Center - Logo and Title */}
        <View style={styles.centerContainer}>
          <Image
            source={user?.logo_url || require("@/assets/images/nexis-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{getRoleTitle()}</Text>
        </View>

        {/* Right Side - Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Role Indicator */}
      <View style={[styles.roleIndicator, { backgroundColor: getRoleColor() }]}>
        <Text style={styles.roleText}>{userRole.toUpperCase()}</Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.navContainer}>
        {getNavItems().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={item.onPress}
          >
            <item.icon size={20} color="#666666" />
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  menuButton: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 164,
    height: 48,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  logoutButton: {
    padding: 8,
  },
  roleIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 1,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
    minWidth: 60,
  },
  navLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
});

export default Navbar;
