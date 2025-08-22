import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

interface RippleEffectProps {
  trigger: boolean;
  x: number;
  y: number;
  color: string;
  onAnimationComplete?: () => void;
}

const RippleEffect: React.FC<RippleEffectProps> = ({
  trigger,
  x,
  y,
  color,
  onAnimationComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (trigger) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0.8);

      // Start ripple animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          left: x - 50,
          top: y - 50,
          backgroundColor: color,
          transform: [
            {
              scale: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 4],
              }),
            },
          ],
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ripple: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    pointerEvents: "none",
    zIndex: 1000,
  },
});

export default RippleEffect;
