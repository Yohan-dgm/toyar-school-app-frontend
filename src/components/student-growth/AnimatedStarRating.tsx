import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { feedbackCardTheme } from "../../data/studentGrowthData";

interface AnimatedStarRatingProps {
  rating: number; // 0-5 rating value
  maxStars?: number; // Maximum number of stars (default 5)
  size?: number; // Star size (default 16)
  animationDelay?: number; // Delay before animation starts
  showRatingText?: boolean; // Show rating text below stars
  compact?: boolean; // Compact mode for smaller spaces
}

const AnimatedStarRating: React.FC<AnimatedStarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  animationDelay = 0,
  showRatingText = true,
  compact = false,
}) => {
  const starAnimations = useRef(
    Array.from({ length: maxStars }, () => new Animated.Value(0)),
  ).current;

  const textFadeAnim = useRef(new Animated.Value(0)).current;

  // Ensure rating is within bounds
  const clampedRating = Math.max(0, Math.min(maxStars, rating));

  // Calculate star states
  const getStarType = (starIndex: number): "full" | "half" | "empty" => {
    const starValue = starIndex + 1;
    if (clampedRating >= starValue) {
      return "full";
    } else if (clampedRating >= starValue - 0.5) {
      return "half";
    } else {
      return "empty";
    }
  };

  // Get star color based on type
  const getStarColor = (type: "full" | "half" | "empty"): string => {
    switch (type) {
      case "full":
        return feedbackCardTheme.warning || "#FFD700"; // Gold
      case "half":
        return feedbackCardTheme.warning || "#FFD700"; // Gold
      case "empty":
        return feedbackCardTheme.grayLight || "#E0E0E0"; // Light gray
    }
  };

  // Get rating text based on value
  const getRatingText = (rating: number): string => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Good";
    if (rating >= 2.5) return "Average";
    if (rating >= 1.5) return "Below Average";
    return "Poor";
  };

  // Animation effect
  useEffect(() => {
    // Reset animations
    starAnimations.forEach((anim) => anim.setValue(0));
    textFadeAnim.setValue(0);

    // Start star animations with staggered delay
    const animateStars = () => {
      const animations = starAnimations.map((anim, index) => {
        return Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: index * 100, // Staggered by 100ms each
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        });
      });

      Animated.parallel(animations).start(() => {
        // Animate rating text after stars
        if (showRatingText) {
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      });
    };

    // Apply initial delay if specified
    if (animationDelay > 0) {
      setTimeout(animateStars, animationDelay);
    } else {
      animateStars();
    }
  }, [rating, maxStars, animationDelay]);

  const renderStar = (index: number) => {
    const starType = getStarType(index);
    const starColor = getStarColor(starType);
    const anim = starAnimations[index];

    // For half stars, we'll use a gradient effect by overlaying icons
    const renderHalfStar = () => (
      <View style={[styles.starContainer, { width: size, height: size }]}>
        {/* Background empty star */}
        <MaterialIcons
          name="star"
          size={size}
          color={getStarColor("empty")}
          style={styles.starBackground}
        />
        {/* Half-filled star using clip */}
        <View style={[styles.halfStarContainer, { width: size / 2 }]}>
          <MaterialIcons
            name="star"
            size={size}
            color={getStarColor("full")}
            style={styles.starForeground}
          />
        </View>
      </View>
    );

    const renderFullOrEmptyStar = () => (
      <MaterialIcons name="star" size={size} color={starColor} />
    );

    return (
      <Animated.View
        key={index}
        style={[
          styles.animatedStar,
          {
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
            opacity: anim,
          },
        ]}
      >
        {starType === "half" ? renderHalfStar() : renderFullOrEmptyStar()}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* Stars Row */}
      <View style={styles.starsRow}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </View>

      {/* Rating Text */}
      {showRatingText && (
        <Animated.View
          style={[
            styles.ratingTextContainer,
            compact && styles.compactRatingTextContainer,
            {
              opacity: textFadeAnim,
              transform: [
                {
                  translateY: textFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            style={[styles.ratingValue, compact && styles.compactRatingValue]}
          >
            {clampedRating.toFixed(1)}
          </Text>
          <Text
            style={[styles.ratingLabel, compact && styles.compactRatingLabel]}
          >
            {getRatingText(clampedRating)}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  compactContainer: {
    alignItems: "flex-end",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  animatedStar: {
    // Individual star container for animation
  },
  starContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  starBackground: {
    position: "absolute",
  },
  halfStarContainer: {
    overflow: "hidden",
    position: "absolute",
    left: 0,
  },
  starForeground: {
    // Positioned to align with background star
  },
  ratingTextContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  compactRatingTextContainer: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: feedbackCardTheme.black,
    marginBottom: 2,
  },
  compactRatingValue: {
    fontSize: 12,
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: feedbackCardTheme.grayMedium,
  },
  compactRatingLabel: {
    fontSize: 9,
  },
});

export default AnimatedStarRating;
