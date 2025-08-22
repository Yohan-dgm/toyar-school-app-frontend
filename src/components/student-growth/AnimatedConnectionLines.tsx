import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from "react-native-svg";
import { modernColors } from "../../data/studentGrowthData";

interface AnimatedConnectionLinesProps {
  cards: any[];
  containerWidth: number;
  containerHeight: number;
  selectedCardId?: string | null;
  onConnectionComplete?: () => void;
}

interface CardPosition {
  x: number;
  y: number;
  id: string;
  index: number;
}

const AnimatedConnectionLines: React.FC<AnimatedConnectionLinesProps> = ({
  cards,
  containerWidth,
  containerHeight,
  selectedCardId,
  onConnectionComplete,
}) => {
  const [animationProgress] = useState(new Animated.Value(0));
  const [connectionAnimations] = useState(
    Array.from({ length: cards.length - 1 }, () => new Animated.Value(0)),
  );

  useEffect(() => {
    const startSequentialAnimation = () => {
      // Reset all animations
      animationProgress.setValue(0);
      connectionAnimations.forEach((anim) => anim.setValue(0));

      // Start main progress animation
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: false,
      }).start();

      // Start staggered connection animations
      const staggerDelay = 500;
      connectionAnimations.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(index * staggerDelay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]).start(() => {
          if (index === connectionAnimations.length - 1) {
            onConnectionComplete?.();
          }
        });
      });
    };

    // Start animation after a brief delay
    const timer = setTimeout(startSequentialAnimation, 1000);
    return () => clearTimeout(timer);
  }, [cards.length]);

  // Calculate card positions based on grid layout
  const getCardPositions = (): CardPosition[] => {
    const cardWidth = (containerWidth - 60) / 3;
    const cardHeight = 140;
    const positions: CardPosition[] = [];

    cards.forEach((card, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;

      positions.push({
        id: card.id,
        index,
        x: col * (cardWidth + 15) + cardWidth / 2 + 30,
        y: row * (cardHeight + 20) + cardHeight / 2 + 30,
      });
    });

    return positions;
  };

  const cardPositions = getCardPositions();

  // Generate sequential connection paths (1→2→3→...→13)
  const getSequentialConnectionPaths = () => {
    const connections = [];

    for (let i = 0; i < cardPositions.length - 1; i++) {
      const fromPos = cardPositions[i];
      const toPos = cardPositions[i + 1];

      if (!fromPos || !toPos) continue;

      // Calculate control points for natural curves
      const deltaX = toPos.x - fromPos.x;
      const deltaY = toPos.y - fromPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const controlOffset = Math.min(distance * 0.3, 50);
      const control1X =
        fromPos.x +
        deltaX * 0.3 +
        (deltaY > 0 ? -controlOffset : controlOffset);
      const control1Y =
        fromPos.y +
        deltaY * 0.3 +
        (deltaX > 0 ? controlOffset : -controlOffset);
      const control2X =
        toPos.x - deltaX * 0.3 + (deltaY > 0 ? controlOffset : -controlOffset);
      const control2Y =
        toPos.y - deltaY * 0.3 + (deltaX > 0 ? -controlOffset : controlOffset);

      const path = `M ${fromPos.x} ${fromPos.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${toPos.x} ${toPos.y}`;

      connections.push({
        path,
        fromIndex: i,
        toIndex: i + 1,
        fromPos,
        toPos,
        animationIndex: i,
      });
    }

    return connections;
  };

  const connectionPaths = getSequentialConnectionPaths();

  // Render animated particles along connections
  const renderConnectionParticles = () => {
    return connectionPaths.map((connection, index) => {
      const progress =
        connectionAnimations[connection.animationIndex]?._value || 0;

      if (progress < 0.3) return null;

      return (
        <Circle
          key={`particle-${index}`}
          cx={
            connection.fromPos.x +
            (connection.toPos.x - connection.fromPos.x) * progress
          }
          cy={
            connection.fromPos.y +
            (connection.toPos.y - connection.fromPos.y) * progress
          }
          r={3}
          fill={modernColors.primary}
          opacity={0.8}
        />
      );
    });
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerWidth, height: containerHeight },
      ]}
    >
      <Svg
        height={containerHeight}
        width={containerWidth}
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          {/* Gradient for active connections */}
          <SvgLinearGradient
            id="activeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={modernColors.primary}
              stopOpacity="0.8"
            />
            <Stop
              offset="100%"
              stopColor={modernColors.secondary}
              stopOpacity="0.8"
            />
          </SvgLinearGradient>

          {/* Gradient for completed connections */}
          <SvgLinearGradient
            id="completedGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={modernColors.secondary}
              stopOpacity="0.6"
            />
            <Stop
              offset="100%"
              stopColor={modernColors.accent}
              stopOpacity="0.6"
            />
          </SvgLinearGradient>

          {/* Gradient for upcoming connections */}
          <SvgLinearGradient
            id="upcomingGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={modernColors.accent}
              stopOpacity="0.3"
            />
            <Stop
              offset="100%"
              stopColor={modernColors.accent}
              stopOpacity="0.1"
            />
          </SvgLinearGradient>
        </Defs>

        <G>
          {/* Render connection paths */}
          {connectionPaths.map((connection, index) => {
            const animProgress =
              connectionAnimations[connection.animationIndex]?._value || 0;
            const isActive = animProgress > 0 && animProgress < 1;
            const isCompleted = animProgress >= 1;

            let gradient = "upcomingGradient";
            let strokeWidth = 2;
            let opacity = 0.3;

            if (isActive) {
              gradient = "activeGradient";
              strokeWidth = 4;
              opacity = 0.9;
            } else if (isCompleted) {
              gradient = "completedGradient";
              strokeWidth = 3;
              opacity = 0.7;
            }

            return (
              <Path
                key={`connection-${index}`}
                d={connection.path}
                stroke={`url(#${gradient})`}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={opacity}
                strokeDasharray={isActive ? "8,4" : "0"}
              />
            );
          })}

          {/* Render connection particles */}
          {renderConnectionParticles()}

          {/* Render card connection points */}
          {cardPositions.map((position, index) => {
            const isActive =
              index === 0 || connectionAnimations[index - 1]?._value > 0;
            const isSelected = selectedCardId === position.id;

            return (
              <Circle
                key={`point-${position.id}`}
                cx={position.x}
                cy={position.y}
                r={isSelected ? 8 : isActive ? 6 : 4}
                fill={
                  isSelected
                    ? modernColors.primary
                    : isActive
                      ? modernColors.secondary
                      : modernColors.accent
                }
                opacity={isActive ? 1 : 0.5}
                stroke={isSelected ? "#FFFFFF" : "transparent"}
                strokeWidth={2}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
});

export default AnimatedConnectionLines;
