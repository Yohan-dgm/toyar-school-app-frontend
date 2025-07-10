import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface TypingIndicatorProps {
  visible: boolean;
  text?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  visible,
  text = "SnapBot is thinking...",
}) => {
  const opacity = useSharedValue(0);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    if (visible) {
      // Fade in the indicator
      opacity.value = withTiming(1, { duration: 300 });

      // Start the dot animations with delays
      dot1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );

      dot2.value = withRepeat(
        withSequence(
          withDelay(200, withTiming(1, { duration: 600 })),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );

      dot3.value = withRepeat(
        withSequence(
          withDelay(400, withTiming(1, { duration: 600 })),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      // Fade out the indicator
      opacity.value = withTiming(0, { duration: 300 });

      // Reset dot animations
      dot1.value = 0.3;
      dot2.value = 0.3;
      dot3.value = 0.3;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, dot1Style]} />
          <Animated.View style={[styles.dot, dot2Style]} />
          <Animated.View style={[styles.dot, dot3Style]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: width * 0.8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    color: "#666666",
    fontSize: 14,
    fontStyle: "italic",
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
    marginHorizontal: 2,
  },
});

export default TypingIndicator;
