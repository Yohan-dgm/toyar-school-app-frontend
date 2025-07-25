import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state-store/store";
import { logout } from "../../../state-store/slices/app-slice";
import { AuthContext } from "../../../context/AuthContext";
import { theme } from "../../../styles/theme";
import { USER_CATEGORIES, getUserCategoryDisplayName } from "../../../constants/userCategories";

interface UniversalDrawerMenuProps {
  onClose: () => void;
}

const UniversalDrawerMenu: React.FC<UniversalDrawerMenuProps> = ({ onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setUser } = useContext(AuthContext);
  
  // Get user information from Redux
  const { user, selectedStudent } = useSelector((state: RootState) => state.app);
  const userCategory = user?.user_category || USER_CATEGORIES.PARENT;
  const userDisplayName = getUserCategoryDisplayName(userCategory);

  // Get user profile information
  const userInfo = {
    name: user?.full_name || "User Name",
    email: user?.email || "user@school.com",
    role: userDisplayName,
    profileImage: require("../../../assets/images/sample-profile.png"), // Default profile image
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            setUser(null);
            router.replace("/login");
          },
        },
      ]
    );
  };

  // Common menu items for all users
  const commonMenuItems = [
    {
      id: "profile",
      title: "Profile",
      icon: "person",
      onPress: () => {
        onClose();
        // Navigate to profile or open profile modal
      },
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications",
      onPress: () => {
        onClose();
        // Navigate to notifications
      },
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help",
      onPress: () => {
        onClose();
        // Navigate to help
      },
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings",
      onPress: () => {
        onClose();
        // Navigate to settings
      },
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "privacy-tip",
      onPress: () => {
        onClose();
        // Navigate to privacy policy
      },
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      icon: "description",
      onPress: () => {
        onClose();
        // Navigate to terms
      },
    },
  ];

  // Role-specific menu items
  const getRoleSpecificItems = () => {
    const items: any[] = [];

    // Payment section only for parents
    if (userCategory === USER_CATEGORIES.PARENT) {
      items.push({
        id: "payment",
        title: "Payment & Billing",
        icon: "payment",
        onPress: () => {
          onClose();
          // Navigate to payment section
        },
      });
    }

    // Admin-specific items
    if (userCategory === USER_CATEGORIES.ADMIN || 
        userCategory === USER_CATEGORIES.SENIOR_MANAGEMENT ||
        userCategory === USER_CATEGORIES.PRINCIPAL) {
      items.push({
        id: "admin",
        title: "Administration",
        icon: "admin-panel-settings",
        onPress: () => {
          onClose();
          // Navigate to admin panel
        },
      });
    }

    // Educator-specific items
    if (userCategory === USER_CATEGORIES.EDUCATOR) {
      items.push({
        id: "gradebook",
        title: "Grade Book",
        icon: "book",
        onPress: () => {
          onClose();
          // Navigate to gradebook
        },
      });
    }

    // Sport coach specific items
    if (userCategory === USER_CATEGORIES.SPORT_COACH) {
      items.push({
        id: "team-management",
        title: "Team Management",
        icon: "sports",
        onPress: () => {
          onClose();
          // Navigate to team management
        },
      });
    }

    // Security specific items
    if (userCategory === USER_CATEGORIES.SECURITY) {
      items.push({
        id: "security-reports",
        title: "Security Reports",
        icon: "security",
        onPress: () => {
          onClose();
          // Navigate to security reports
        },
      });
    }

    // Toyar team specific items
    if (userCategory === USER_CATEGORIES.TOYAR_TEAM) {
      items.push({
        id: "system-admin",
        title: "System Administration",
        icon: "computer",
        onPress: () => {
          onClose();
          // Navigate to system admin
        },
      });
    }

    return items;
  };

  const roleSpecificItems = getRoleSpecificItems();

  const MenuSeparator = () => <View style={styles.separator} />;

  const MenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <MaterialIcons 
        name={item.icon} 
        size={24} 
        color={theme.colors.primary} 
      />
      <Text style={styles.menuText}>{item.title}</Text>
      <MaterialIcons 
        name="chevron-right" 
        size={24} 
        color="#CCCCCC" 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Image source={userInfo.profileImage} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{userInfo.role}</Text>
            </View>
          </View>
        </View>

        <MenuSeparator />

        {/* Role-specific items (if any) */}
        {roleSpecificItems.length > 0 && (
          <>
            {roleSpecificItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
            <MenuSeparator />
          </>
        )}

        {/* Common menu items */}
        {commonMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}

        <MenuSeparator />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SchoolSnap v1.0.0</Text>
          <Text style={styles.footerSubtext}>Toyar Technologies</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40, // Same width as close button for centering
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  separator: {
    height: 8,
    backgroundColor: "#F0F0F0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 15,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 15,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#CCCCCC",
  },
});

export default UniversalDrawerMenu;