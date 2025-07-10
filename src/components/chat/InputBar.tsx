import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface InputBarProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  maxLength = 1000,
  multiline = true,
}) => {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const insets = useSafeAreaInsets();
  const textInputRef = useRef<TextInput>(null);
  const sendButtonScale = useSharedValue(1);
  const sendButtonOpacity = useSharedValue(0.5);

  const canSend = message.trim().length > 0 && !disabled;

  useEffect(() => {
    sendButtonScale.value = withSpring(canSend ? 1.1 : 1, {
      damping: 15,
      stiffness: 150,
    });
    sendButtonOpacity.value = withTiming(canSend ? 1 : 0.5, { duration: 200 });
  }, [canSend]);

  const sendButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
    opacity: sendButtonOpacity.value,
  }));

  const handleSend = () => {
    console.log("InputBar handleSend called", {
      canSend,
      message: message.trim(),
    });

    if (!canSend) {
      console.log("Cannot send - canSend is false");
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      console.log("Cannot send - empty message");
      return;
    }

    // Validate message length
    if (trimmedMessage.length > maxLength) {
      console.log("Cannot send - message too long");
      Alert.alert(
        "Message Too Long",
        `Please keep your message under ${maxLength} characters.`
      );
      return;
    }

    // Send the message
    console.log("Calling onSendMessage with:", trimmedMessage);
    onSendMessage(trimmedMessage);
    setMessage("");
    setInputHeight(40);

    // Animate send button
    sendButtonScale.value = withSpring(0.8, { damping: 15, stiffness: 200 });
    setTimeout(() => {
      sendButtonScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 100);
  };

  const handleContentSizeChange = (event: any) => {
    if (multiline) {
      const { height } = event.nativeEvent.contentSize;
      const newHeight = Math.min(Math.max(40, height), 120); // Min 40, Max 120
      setInputHeight(newHeight);
    }
  };

  const handleSubmitEditing = () => {
    if (!multiline) {
      handleSend();
    }
  };

  const handleKeyPress = (event: any) => {
    if (Platform.OS === "web" && event.nativeEvent.key === "Enter") {
      if (event.nativeEvent.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        event.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
      style={styles.keyboardAvoidingView}
    >
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, { height: inputHeight + 16 }]}>
            <TextInput
              ref={textInputRef}
              style={[styles.textInput, { height: inputHeight }]}
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor="#999999"
              multiline={multiline}
              maxLength={maxLength}
              editable={!disabled}
              onContentSizeChange={handleContentSizeChange}
              onSubmitEditing={handleSubmitEditing}
              onKeyPress={handleKeyPress}
              blurOnSubmit={!multiline}
              returnKeyType={multiline ? "default" : "send"}
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              selectionColor="#9b0737"
            />
          </View>

          <Animated.View
            style={[styles.sendButtonContainer, sendButtonAnimatedStyle]}
          >
            <TouchableOpacity
              style={[
                styles.sendButton,
                canSend ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={handleSend}
              disabled={!canSend}
              activeOpacity={0.7}
            >
              <Ionicons
                name="send"
                size={20}
                color={canSend ? "#FFFFFF" : "#CCCCCC"}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Character count indicator */}
        {message.length > maxLength * 0.8 && (
          <View style={styles.characterCount}>
            <Ionicons
              name={
                message.length > maxLength ? "warning" : "information-circle"
              }
              size={12}
              color={message.length > maxLength ? "#FF3B30" : "#999999"}
            />
            <Text
              style={[
                styles.characterCountText,
                message.length > maxLength && styles.characterCountError,
              ]}
            >
              {message.length}/{maxLength}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    justifyContent: "center",
    minHeight: 56,
  },
  textInput: {
    fontSize: 16,
    color: "#000000",
    textAlignVertical: "top",
    includeFontPadding: false,
  },
  sendButtonContainer: {
    marginBottom: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonActive: {
    backgroundColor: "#007AFF",
  },
  sendButtonInactive: {
    backgroundColor: "#E5E5EA",
  },
  characterCount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 4,
  },
  characterCountError: {
    color: "#FF3B30",
  },
});

export default InputBar;
