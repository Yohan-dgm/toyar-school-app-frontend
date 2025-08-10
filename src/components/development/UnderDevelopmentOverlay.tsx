import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";

interface UnderDevelopmentOverlayProps {
  children: React.ReactNode;
  featureName?: string;
  isEnabled?: boolean;
  comingSoonFeatures?: string[];
}

const UnderDevelopmentOverlay: React.FC<UnderDevelopmentOverlayProps> = ({
  children,
  featureName = "Notifications",
  isEnabled = true,
  comingSoonFeatures,
}) => {
  const [showModal, setShowModal] = React.useState(false);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* Blurred Content */}
      <BlurView intensity={50} style={styles.blurContainer}>
        <View style={styles.contentWrapper}>{children}</View>
      </BlurView>

      {/* Clickable Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setShowModal(true)}
        activeOpacity={1}
      >
        <View style={styles.overlayContent}>
          <MaterialIcons name="construction" size={48} color="#FF9800" />
          <Text style={styles.overlayTitle}>Under Development</Text>
          <Text style={styles.overlaySubtitle}>
            {featureName} feature is coming soon
          </Text>
          <Text style={styles.tapText}>Tap for more info</Text>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="construction" size={32} color="#FF9800" />
              <Text style={styles.modalTitle}>Feature Under Development</Text>
            </View>

            <Text style={styles.modalDescription}>
              The {featureName.toLowerCase()} feature is currently being
              developed by our team. We&apos;re working hard to bring you the
              best experience possible.
            </Text>

            <View style={styles.featureList}>
              <Text style={styles.featureListTitle}>Coming Soon:</Text>
              {(
                comingSoonFeatures || [
                  "Real-time notifications",
                  "Message management",
                  "Priority filtering",
                  "Push notifications",
                ]
              ).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#4CAF50"
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  blurContainer: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    opacity: 0.2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  overlayContent: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 32,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  overlaySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  tapText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 12,
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "left",
  },
  featureList: {
    marginBottom: 24,
  },
  featureListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UnderDevelopmentOverlay;
