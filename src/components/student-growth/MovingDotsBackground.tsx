import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { modernColors, maroonTheme } from "../../data/studentGrowthData";

interface MovingDotsBackgroundProps {
  numberOfDots?: number;
  animationDuration?: number;
}

interface Particle {
  id: string;
  animatedX: Animated.Value;
  animatedY: Animated.Value;
  animatedOpacity: Animated.Value;
  animatedScale: Animated.Value;
  color: string;
  size: number;
  speed: number;
  type: "dot" | "triangle" | "square";
}

const MovingDotsBackground: React.FC<MovingDotsBackgroundProps> = ({
  numberOfDots = 15,
  animationDuration = 4000,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const particleColors = [
      maroonTheme.primary + "35",
      maroonTheme.accent + "30",
      maroonTheme.light + "40",
      modernColors.primary + "25",
      "#8B5CF6" + "20",
      "#10B981" + "25",
      "#F59E0B" + "20",
      "#EC4899" + "30",
    ];

    const particleTypes: ("dot" | "triangle" | "square")[] = [
      "dot",
      "triangle",
      "square",
    ];

    const createParticles = () => {
      const newParticles: Particle[] = [];

      for (let i = 0; i < numberOfDots; i++) {
        const startX = Math.random() * containerWidth;
        const startY = Math.random() * containerHeight;

        const particle: Particle = {
          id: `particle-${i}`,
          animatedX: new Animated.Value(startX),
          animatedY: new Animated.Value(startY),
          animatedOpacity: new Animated.Value(Math.random() * 0.6 + 0.2),
          animatedScale: new Animated.Value(Math.random() * 0.4 + 0.6),
          color: particleColors[i % particleColors.length],
          size: Math.random() * 12 + 6,
          speed: Math.random() * 1500 + animationDuration,
          type: particleTypes[i % particleTypes.length],
        };

        newParticles.push(particle);
      }

      setParticles(newParticles);
    };

    if (containerWidth > 0 && containerHeight > 0) {
      createParticles();
    }
  }, [containerWidth, containerHeight, numberOfDots, animationDuration]);

  useEffect(() => {
    if (particles.length === 0 || containerWidth === 0 || containerHeight === 0)
      return;

    // Simple animation without conflicts
    particles.forEach((particle, index) => {
      const delay = index * 150;

      // Single simple movement animation
      setTimeout(() => {
        const createMovement = () => {
          const targetX = Math.random() * containerWidth;
          const targetY = Math.random() * containerHeight;

          Animated.parallel([
            Animated.timing(particle.animatedX, {
              toValue: targetX,
              duration: particle.speed,
              useNativeDriver: true,
            }),
            Animated.timing(particle.animatedY, {
              toValue: targetY,
              duration: particle.speed,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Recursively continue movement
            setTimeout(createMovement, Math.random() * 1000 + 500);
          });
        };

        createMovement();
      }, delay);

      // Simple opacity pulse
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.animatedOpacity, {
              toValue: 0.3,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.animatedOpacity, {
              toValue: 0.7,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, delay + 300);

      // Simple scale breathing
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.animatedScale, {
              toValue: 0.8,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(particle.animatedScale, {
              toValue: 1.0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, delay + 600);
    });

    return () => {
      // Clean up all animations
      particles.forEach((particle) => {
        particle.animatedX.stopAnimation();
        particle.animatedY.stopAnimation();
        particle.animatedOpacity.stopAnimation();
        particle.animatedScale.stopAnimation();
      });
    };
  }, [particles, containerWidth, containerHeight]);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      opacity: particle.animatedOpacity,
      transform: [
        {
          translateX: particle.animatedX.interpolate({
            inputRange: [0, containerWidth || 1],
            outputRange: [0, containerWidth || 1],
            extrapolate: "clamp",
          }),
        },
        {
          translateY: particle.animatedY.interpolate({
            inputRange: [0, containerHeight || 1],
            outputRange: [0, containerHeight || 1],
            extrapolate: "clamp",
          }),
        },
        { scale: particle.animatedScale },
      ],
    };

    switch (particle.type) {
      case "triangle":
        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.triangle,
              {
                ...baseStyle,
                borderBottomColor: particle.color,
                borderBottomWidth: particle.size,
                borderLeftWidth: particle.size / 2,
                borderRightWidth: particle.size / 2,
              },
            ]}
          />
        );
      case "square":
        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.square,
              {
                ...baseStyle,
                width: particle.size * 0.8,
                height: particle.size * 0.8,
                backgroundColor: particle.color,
              },
            ]}
          />
        );
      default: // dot
        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.dot,
              {
                ...baseStyle,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: particle.color,
              },
            ]}
          />
        );
    }
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
    >
      {/* Dynamic wave background */}
      <LinearGradient
        colors={[
          "rgba(128, 0, 0, 0.02)",
          "rgba(139, 92, 246, 0.01)",
          "rgba(16, 185, 129, 0.015)",
          "rgba(245, 158, 11, 0.01)",
        ]}
        style={styles.waveBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Render all particles */}
      {particles.map(renderParticle)}

      {/* Enhanced gradient overlay with depth */}
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.01)",
          "rgba(128, 0, 0, 0.005)",
          "rgba(255, 255, 255, 0.02)",
        ]}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: "hidden",
  },
  waveBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  dot: {
    position: "absolute",
    shadowColor: maroonTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  triangle: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    shadowColor: maroonTheme.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  square: {
    position: "absolute",
    shadowColor: modernColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 3,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

export default MovingDotsBackground;
