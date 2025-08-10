import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

interface AuthStatusCheckerProps {
  onAuthenticationRequired?: () => void;
  showFullStatus?: boolean;
}

const AuthStatusChecker: React.FC<AuthStatusCheckerProps> = ({
  onAuthenticationRequired,
  showFullStatus = true,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const dispatch = useDispatch();

  // Get authentication state from Redux
  const authState = useSelector((state: any) => ({
    token: state.app?.token,
    isAuthenticated: state.app?.isAuthenticated,
    user: state.app?.user,
  }));

  const checkTokenValidity = async () => {
    setIsChecking(true);

    try {
      // Test the token with a simple API call
      const baseUrl = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;
      const response = await fetch(
        `${baseUrl}/api/educator-feedback-management/feedback/list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(authState.token && {
              Authorization: `Bearer ${authState.token}`,
            }),
          },
          body: JSON.stringify({
            page_size: 1,
            page: 1,
            search_phrase: "",
            search_filter_list: [],
          }),
        },
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        data.status === "authentication-required"
      ) {
        Alert.alert(
          "Authentication Expired",
          "Your session has expired. Please log out and log back in.",
          [{ text: "OK", onPress: onAuthenticationRequired }],
        );
      } else if (response.ok || data.success) {
        Alert.alert(
          "Authentication Valid",
          "Your session is active and working properly.",
        );
      } else {
        Alert.alert(
          "API Error",
          `Server returned: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "Could not connect to the server. Please check your internet connection.",
      );
      console.error("Auth check error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleForceLogout = () => {
    Alert.alert(
      "Force Logout",
      "This will clear your authentication data and redirect you to login.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Dispatch logout action - adjust based on your Redux setup
            // dispatch(logout()); // You'll need to implement this
            if (onAuthenticationRequired) {
              onAuthenticationRequired();
            }
          },
        },
      ],
    );
  };

  if (!showFullStatus) {
    // Compact version - just show status icons
    return (
      <View style={styles.compactContainer}>
        <MaterialIcons
          name={authState.isAuthenticated ? "check-circle" : "error"}
          size={16}
          color={authState.isAuthenticated ? "#4CAF50" : "#F44336"}
        />
        <MaterialIcons
          name={authState.token ? "vpn-key" : "key-off"}
          size={16}
          color={authState.token ? "#4CAF50" : "#F44336"}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Status</Text>

      <View style={styles.statusGrid}>
        <View style={styles.statusItem}>
          <MaterialIcons
            name={authState.isAuthenticated ? "check-circle" : "error"}
            size={20}
            color={authState.isAuthenticated ? "#4CAF50" : "#F44336"}
          />
          <Text style={styles.statusLabel}>Authenticated</Text>
          <Text style={styles.statusValue}>
            {authState.isAuthenticated ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.statusItem}>
          <MaterialIcons
            name={authState.token ? "vpn-key" : "key-off"}
            size={20}
            color={authState.token ? "#4CAF50" : "#F44336"}
          />
          <Text style={styles.statusLabel}>Token</Text>
          <Text style={styles.statusValue}>
            {authState.token ? "Present" : "Missing"}
          </Text>
        </View>

        <View style={styles.statusItem}>
          <MaterialIcons
            name={authState.user ? "person" : "person-off"}
            size={20}
            color={authState.user ? "#4CAF50" : "#F44336"}
          />
          <Text style={styles.statusLabel}>User</Text>
          <Text style={styles.statusValue}>
            {authState.user?.user_category_name || "Unknown"}
          </Text>
        </View>
      </View>

      {authState.token && (
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenLabel}>Token Preview:</Text>
          <Text style={styles.tokenValue}>
            {authState.token.substring(0, 20)}...
          </Text>
          <Text style={styles.tokenLength}>
            Length: {authState.token.length} characters
          </Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={checkTokenValidity}
          disabled={isChecking}
        >
          <MaterialIcons
            name="wifi-protected-setup"
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.buttonText}>
            {isChecking ? "Testing..." : "Test Auth"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleForceLogout}
        >
          <MaterialIcons name="logout" size={16} color="#F44336" />
          <Text style={styles.logoutButtonText}>Force Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  compactContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  tokenInfo: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
    marginBottom: 2,
  },
  tokenLength: {
    fontSize: 10,
    color: "#999",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  testButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#920734",
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  logoutButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F44336",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButtonText: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AuthStatusChecker;
