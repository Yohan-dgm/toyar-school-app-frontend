import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-package";
import { ChatMessage } from "../../types/chat";

const { width } = Dimensions.get("window");

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRetry,
  onCopy,
}) => {
  const isUser = message.role === "user";
  const isError = !!message.error;

  const handleLongPress = () => {
    if (onCopy) {
      Alert.alert("Message Options", "What would you like to do?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy Text",
          onPress: () => onCopy(message.content),
        },
        ...(isError && onRetry
          ? [
              {
                text: "Retry",
                onPress: () => onRetry(message.id),
              },
            ]
          : []),
      ]);
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContent = () => {
    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{message.error}</Text>
          {onRetry && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => onRetry(message.id)}
            >
              <Ionicons name="refresh" size={14} color="#007AFF" />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (isUser) {
      return <Text style={styles.userText}>{message.content}</Text>;
    }

    // Render markdown for assistant messages
    return (
      <Markdown
        styles={markdownStyles}
        rules={{
          // Custom rules for better mobile rendering
          paragraph: (node, children, parent, styles) => (
            <Text key={node.key} style={styles.paragraph}>
              {children}
            </Text>
          ),
          code_inline: (node, children, parent, styles) => (
            <Text key={node.key} style={styles.code_inline}>
              {children}
            </Text>
          ),
          code_block: (node, children, parent, styles) => (
            <View key={node.key} style={styles.code_block}>
              <Text style={styles.code_block_text}>{node.content}</Text>
            </View>
          ),
        }}
      >
        {message.content}
      </Markdown>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          isError && styles.errorBubble,
          message.isStreaming && styles.streamingBubble,
        ]}
      >
        {renderContent()}

        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>

          {message.isStreaming && (
            <View style={styles.streamingIndicator}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: width * 0.8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#F2F2F7",
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: "#FFE5E5",
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  streamingBubble: {
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
  },
  retryText: {
    color: "#007AFF",
    fontSize: 12,
    marginLeft: 4,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  userTimestamp: {
    color: "#FFFFFF",
  },
  assistantTimestamp: {
    color: "#666666",
  },
  streamingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#007AFF",
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});

// Markdown styles for assistant messages
const markdownStyles = {
  paragraph: {
    color: "#000000",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  code_inline: {
    backgroundColor: "#E8E8E8",
    color: "#D73A49",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "Courier",
  },
  code_block: {
    backgroundColor: "#F6F8FA",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  code_block_text: {
    fontFamily: "Courier",
    fontSize: 14,
    color: "#24292E",
  },
  list_item: {
    color: "#000000",
    fontSize: 16,
    lineHeight: 22,
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
  },
  heading3: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  blockquote: {
    backgroundColor: "#F6F8FA",
    borderLeftWidth: 4,
    borderLeftColor: "#DFE2E5",
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
};

export default memo(MessageBubble);
