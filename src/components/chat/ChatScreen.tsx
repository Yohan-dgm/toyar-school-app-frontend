import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions,
  Clipboard,
  ToastAndroid,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatContext } from "../../contexts/ChatContext";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import InputBar from "./InputBar";
import { ChatMessage } from "../../types/chat";
import { Security } from "../../utils/security";

const { height } = Dimensions.get("window");

interface ChatScreenProps {
  title?: string;
  enableStreaming?: boolean;
  maxMessages?: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  title = "SnapBot Chat",
  enableStreaming = true,
  maxMessages = 100,
}) => {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    retryMessage,
    clearChat,
    loadHistory,
  } = useChatContext();

  const [refreshing, setRefreshing] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Initialize session and load history
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Validate or create session
        const sessionResult = await Security.SessionManager.validateSession();
        if (!sessionResult.valid) {
          await Security.SessionManager.createSession();
        }
        setSessionValid(true);

        // Load chat history
        await loadHistory();
      } catch (error) {
        console.warn("Chat initialization failed:", error);
        setSessionValid(false);
      }
    };

    initializeChat();
  }, [loadHistory]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Handle sending messages with security validation
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!sessionValid) {
        Alert.alert(
          "Session Error",
          "Please restart the app to continue chatting.",
        );
        return;
      }

      // Validate message content
      const validation =
        Security.RequestValidator.validateMessageContent(content);
      if (!validation.valid) {
        Alert.alert("Invalid Message", validation.error);
        return;
      }

      // Check rate limits
      const rateLimitCheck = await Security.EnhancedRateLimiter.checkLimit();
      if (!rateLimitCheck.allowed) {
        Alert.alert(
          "Rate Limit Exceeded",
          rateLimitCheck.reason ||
            "Please wait before sending another message.",
          [
            {
              text: "OK",
              onPress: () => {
                const resetTime = new Date(rateLimitCheck.resetTime);
                const timeString = resetTime.toLocaleTimeString();
                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    `Rate limit resets at ${timeString}`,
                    ToastAndroid.LONG,
                  );
                }
              },
            },
          ],
        );
        return;
      }

      // Sanitize input
      const sanitizedContent = Security.ContentSanitizer.sanitizeInput(content);

      try {
        console.log("ChatScreen calling sendMessage with:", {
          sanitizedContent,
          enableStreaming,
        });
        await sendMessage(sanitizedContent, false); // Temporarily disable streaming for debugging
      } catch (error) {
        console.error("Send message error:", error);
        Alert.alert(
          "Send Error",
          "Failed to send message. Please check your connection and try again.",
        );
      }
    },
    [sessionValid, sendMessage, enableStreaming],
  );

  // Handle message retry
  const handleRetryMessage = useCallback(
    async (messageId: string) => {
      if (!sessionValid) {
        Alert.alert(
          "Session Error",
          "Please restart the app to continue chatting.",
        );
        return;
      }

      try {
        await retryMessage(messageId);
      } catch (error) {
        console.error("Retry message error:", error);
        Alert.alert(
          "Retry Error",
          "Failed to retry message. Please try again.",
        );
      }
    },
    [sessionValid, retryMessage],
  );

  // Handle copy message
  const handleCopyMessage = useCallback((content: string) => {
    Clipboard.setString(content);
    if (Platform.OS === "android") {
      ToastAndroid.show("Message copied to clipboard", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", "Message copied to clipboard");
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadHistory();
    } catch (error) {
      console.warn("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [loadHistory]);

  // Handle clear chat
  const handleClearChat = useCallback(() => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearChat,
        },
      ],
    );
  }, [clearChat]);

  // Render message item
  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble
        message={item}
        onRetry={handleRetryMessage}
        onCopy={handleCopyMessage}
      />
    ),
    [handleRetryMessage, handleCopyMessage],
  );

  // Get item key
  const getItemKey = useCallback((item: ChatMessage) => item.id, []);

  // Render empty state
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MessageBubble
          message={{
            id: "welcome",
            role: "assistant",
            content: `Hi! I'm SnapBot 🤖, your AI assistant. How can I help you today?\n\n**I can help with:**\n• Answering questions\n• Providing explanations\n• Creative writing\n• Problem solving\n• And much more!\n\nJust type your message below to get started.`,
            timestamp: new Date(),
          }}
          onCopy={handleCopyMessage}
        />
      </View>
    ),
    [handleCopyMessage],
  );

  if (!sessionValid) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MessageBubble
            message={{
              id: "session-error",
              role: "assistant",
              content:
                "Session expired. Please restart the app to continue chatting.",
              timestamp: new Date(),
              error: "Session validation failed",
            }}
            onRetry={() => {
              // Restart app or reload
              Alert.alert(
                "Restart Required",
                "Please close and reopen the app to continue.",
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={getItemKey}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          messages.length === 0 && styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={20}
        getItemLayout={(data, index) => ({
          length: 80, // Estimated item height
          offset: 80 * index,
          index,
        })}
      />

      {/* Typing indicator */}
      <TypingIndicator visible={isLoading || isStreaming} />

      {/* Input bar */}
      <InputBar
        onSendMessage={handleSendMessage}
        disabled={isLoading || isStreaming || !sessionValid}
        placeholder={
          !sessionValid
            ? "Session expired..."
            : isLoading || isStreaming
              ? "Please wait..."
              : "Type your message..."
        }
        maxLength={1000}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContent: {
    justifyContent: "center",
    minHeight: height * 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});

export default ChatScreen;
