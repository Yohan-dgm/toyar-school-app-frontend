import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import * as Animatable from "react-native-animatable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatProvider } from "../../contexts/ChatContext";
import ChatScreen from "../chat/ChatScreen";
import { ErrorBoundary } from "../ErrorBoundary";
import { fetchDeepSeekResponse } from "../../services/api";
import { ChatMessage } from "../../types/chat";

const { width, height } = Dimensions.get("window");

interface SnapBotProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SnapBot: React.FC<SnapBotProps> = ({ isVisible, onClose }) => {
  const slideY = useSharedValue(height);
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();

  // Test API function
  const testAPI = async () => {
    console.log("Testing API connection...");
    try {
      const testMessage: ChatMessage = {
        id: "test-1",
        role: "user",
        content: "Hello, this is a test message",
        timestamp: new Date(),
      };

      const response = await fetchDeepSeekResponse([testMessage], false);
      console.log("API Test Success:", response);
    } catch (error) {
      console.error("API Test Failed:", error);
    }
  };

  useEffect(() => {
    console.log("SnapBot visibility changed:", isVisible);
    if (isVisible) {
      console.log("Animating SnapBot in...");
      slideY.value = withSpring(0, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      console.log("Animating SnapBot out...");
      slideY.value = withSpring(height, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
    opacity: opacity.value,
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.chatContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.botIconContainer}>
                <Image
                  source={require("../../assets/snapbot.png")}
                  style={styles.botIcon}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.botName}>SnapBot</Text>
                <Text style={styles.botStatus}>AI Assistant • Online</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={testAPI} style={styles.testButton}>
                <Text style={styles.testButtonText}>Test</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Real Chat Functionality with Error Boundary */}
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error("SnapBot Error:", error, errorInfo);
            }}
          >
            <ChatProvider>
              <View style={styles.chatContent}>
                <ChatScreen
                  title="SnapBot Chat"
                  enableStreaming={true}
                  maxMessages={50}
                />
              </View>
            </ChatProvider>
          </ErrorBoundary>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: Math.min(width * 0.9, 380),
    height: height * 0.7,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
    zIndex: 10000,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  chatContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  testButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  testButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  botIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  botIcon: {
    width: 40,
    height: 40,
  },
  botName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  botStatus: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});
