import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import { theme } from "../../../../styles/theme";
import { useAuth } from "../../../../context/AuthContext";
import ActivityFeed from "../../../../components/activity-feed/ActivityFeed";
import ActivityFeedAPITest from "../../../../components/test/ActivityFeedAPITest";

const SchoolLifeMain = () => {
  const { user } = useAuth();
  const [showAPITest, setShowAPITest] = useState(false);

  return (
    <View style={styles.container}>
      {/* Test Button - Remove this after testing */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => setShowAPITest(true)}
      >
        <Text style={styles.testButtonText}>🧪 Test API</Text>
      </TouchableOpacity>

      <ActivityFeed userCategory={user?.user_category || 1} />

      {/* API Test Modal */}
      <Modal
        visible={showAPITest}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAPITest(false)}
          >
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
          <ActivityFeedAPITest />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  testButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  testButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#666",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1001,
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SchoolLifeMain;
