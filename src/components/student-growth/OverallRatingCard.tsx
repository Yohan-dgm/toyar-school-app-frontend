import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { modernColors } from "../../data/studentGrowthData";

interface OverallRatingCardProps {
  id: string;
  title: string;
  icon: string;
  rating: number;
  level: string;
  color: string;
  // description: string;
  onPress?: () => void;
}

const OverallRatingCard: React.FC<OverallRatingCardProps> = ({
  id,
  title,
  icon,
  rating,
  level,
  color,
  // description,
  onPress,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  // Enhanced animation on press
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Progressive rating display
  const renderProgressiveRating = () => {
    const percentage = (rating / 5) * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={styles.ratingText}>{rating.toFixed(2)}</Text>
      </View>
    );
  };

  // Create enhanced gradient colors
  const gradientColors = [color + "25", color + "15", "#FFFFFF", color + "08"];

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.touchableCard}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient colors={gradientColors} style={styles.card}>
          {/* Enhanced glassmorphism overlay */}
          <View style={styles.glassOverlay} />

          {/* Animated glow effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim,
                backgroundColor: color + "20",
              },
            ]}
          />

          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <MaterialIcons
              name="star"
              size={16}
              color={modernColors.premium.gold}
            />
            <Text style={styles.premiumText}>OVERALL</Text>
          </View>

          {/* Icon Container with enhanced styling */}
          <View
            style={[styles.iconContainer, { backgroundColor: color + "20" }]}
          >
            <MaterialIcons name={icon as any} size={32} color={color} />
          </View>

          {/* Intelligence Title */}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          {/* Enhanced Rating Display */}
          <View style={styles.ratingContainer}>
            {renderProgressiveRating()}
          </View>

          {/* Level Indicator with enhanced styling */}
          <View
            style={[styles.levelIndicator, { backgroundColor: color + "25" }]}
          >
            <Text style={[styles.levelText, { color: color }]}>{level}</Text>
          </View>

          {/* Premium accent border */}
          <View style={[styles.accentBorder, { backgroundColor: color }]} />

          {/* Animated corner accents */}
          <View
            style={[
              styles.cornerAccent,
              styles.topLeftAccent,
              { backgroundColor: color },
            ]}
          />
          <View
            style={[
              styles.cornerAccent,
              styles.bottomRightAccent,
              { backgroundColor: color },
            ]}
          />

          {/* Sparkle effects */}
          <View style={[styles.sparkle, styles.sparkle1]}>
            <MaterialIcons name="auto-awesome" size={12} color={color + "60"} />
          </View>
          <View style={[styles.sparkle, styles.sparkle2]}>
            <MaterialIcons name="auto-awesome" size={8} color={color + "40"} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    marginHorizontal: 16,
  },
  touchableCard: {
    width: "100%",
    height: "100%",
  },
  card: {
    height: 180,
    borderRadius: 24,
    padding: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
  },
  glowEffect: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    zIndex: -1,
  },
  premiumBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: "800",
    color: modernColors.text,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: modernColors.text,
    marginBottom: 12,
    lineHeight: 20,
    textAlign: "center",
  },
  ratingContainer: {
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "800",
    color: modernColors.text,
    minWidth: 40,
    textAlign: "center",
  },
  levelIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "center",
  },
  levelText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  accentBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 6,
    height: "100%",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  cornerAccent: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  topLeftAccent: {
    top: 0,
    left: 0,
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 20,
  },
  bottomRightAccent: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 20,
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: 24,
    right: 24,
  },
  sparkle2: {
    bottom: 24,
    left: 24,
  },
});

export default React.memo(OverallRatingCard);
