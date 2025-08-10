import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { SCHOOL_HOUSES } from "../../../../../constants/schoolHouses";

interface StatCardProps {
  title: string;
  count: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  gradient: [string, string];
  isLoading?: boolean;
  subtitle?: string;
  delay?: number;
  variant?: "default" | "house" | "compact" | "detailed";
  houseTheme?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon,
  color,
  gradient,
  isLoading = false,
  subtitle,
  delay = 0,
  variant = "default",
  houseTheme,
}) => {
  // Get house colors if houseTheme is provided
  const houseColors = houseTheme
    ? SCHOOL_HOUSES.find((h) => h.id === houseTheme)?.colors
    : null;
  const animatedValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.8);
  const opacityValue = useSharedValue(0);
  const [displayCount, setDisplayCount] = useState(0);

  const updateDisplayCount = (value: number) => {
    setDisplayCount(Math.round(value));
  };

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacityValue.value = withTiming(1, { duration: 400 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isLoading && count >= 0) {
      // Count-up animation with continuous updates
      const startTime = Date.now();
      const duration = 1000 + delay;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.round(count * progress);

        setDisplayCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const timer = setTimeout(() => {
        animate();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [count, isLoading, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => {
    const animatedCount = interpolate(
      animatedValue.value,
      [0, count],
      [0, count],
    );
    return {
      // We'll handle the count in the component since interpolate doesn't return text
    };
  });

  const formatCount = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  // Dynamic styles based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case "compact":
        return [styles.container, styles.compactContainer];
      case "detailed":
        return [styles.container, styles.detailedContainer];
      case "house":
        return [styles.container, styles.houseContainer];
      default:
        return styles.container;
    }
  };

  const gradientColors = houseColors ? houseColors.gradient : gradient;
  const primaryColor = houseColors ? houseColors.primary : color;

  return (
    <Animated.View style={[getContainerStyle(), animatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        locations={[0, 1]}
      >
        {/* Icon Section */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconBackground,
              { backgroundColor: `${primaryColor}20` },
            ]}
          >
            <MaterialIcons name={icon} size={24} color={primaryColor} />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Count */}
          <View style={styles.countContainer}>
            {isLoading ? (
              <View style={styles.loadingSkeleton} />
            ) : (
              <Text style={[styles.count, { color: primaryColor }]}>
                {formatCount(displayCount)}
              </Text>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {/* Subtitle */}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Decorative Element */}
        <View
          style={[styles.decorator, { backgroundColor: `${primaryColor}15` }]}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 120,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    padding: 12,
    position: "relative",
  },
  iconContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  countContainer: {
    marginBottom: 4,
  },
  count: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  loadingSkeleton: {
    height: 32,
    width: 60,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "500",
    color: "#666",
  },
  decorator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  compactContainer: {
    width: 120,
    height: 100,
  },
  detailedContainer: {
    width: 180,
    height: 140,
  },
  houseContainer: {
    width: 160,
    height: 130,
    borderRadius: 20,
  },
});

export default StatCard;
