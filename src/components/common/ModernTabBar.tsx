import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { theme } from "../../styles/theme";

const { width: screenWidth } = Dimensions.get("window");

interface Tab {
  name: string;
  icon: string;
  label: string;
}

interface ModernTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const ModernTabBar: React.FC<ModernTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    tabs.reduce(
      (acc, tab) => {
        acc[tab.name] = new Animated.Value(tab.name === activeTab ? 1.05 : 1);
        return acc;
      },
      {} as Record<string, Animated.Value>,
    ),
  ).current;

  const colorAnims = useRef(
    tabs.reduce(
      (acc, tab) => {
        acc[tab.name] = new Animated.Value(tab.name === activeTab ? 1 : 0);
        return acc;
      },
      {} as Record<string, Animated.Value>,
    ),
  ).current;

  const activeIndex = tabs.findIndex((tab) => tab.name === activeTab);
  const tabWidth = (screenWidth - 48) / tabs.length; // Account for container padding

  useEffect(() => {
    // Animate indicator position
    Animated.spring(indicatorAnim, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();

    // Animate scales and colors
    tabs.forEach((tab, index) => {
      const isActive = tab.name === activeTab;

      // Scale animation
      Animated.spring(scaleAnims[tab.name], {
        toValue: isActive ? 1.05 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }).start();

      // Color animation
      Animated.timing(colorAnims[tab.name], {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [activeTab, activeIndex, tabWidth]);

  const handleTabPress = (tabName: string) => {
    // Add haptic feedback
    if (Platform.OS === "ios") {
      const { HapticFeedback } = require("react-native");
      if (HapticFeedback) {
        HapticFeedback.impact(HapticFeedback.ImpactFeedbackStyle.Light);
      }
    }
    onTabPress(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {/* Animated sliding indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth - 8,
              transform: [{ translateX: indicatorAnim }],
            },
          ]}
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => {
          const iconColor = colorAnims[tab.name].interpolate({
            inputRange: [0, 1],
            outputRange: ["#8E8E93", theme.colors.primary],
          });

          const textColor = colorAnims[tab.name].interpolate({
            inputRange: [0, 1],
            outputRange: ["#8E8E93", theme.colors.primary],
          });

          return (
            <Animated.View
              key={tab.name}
              style={[
                styles.tabButtonContainer,
                {
                  transform: [{ scale: scaleAnims[tab.name] }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => handleTabPress(tab.name)}
                activeOpacity={0.7}
              >
                <Animated.View style={styles.iconContainer}>
                  <Icon name={tab.icon} size={24} color={iconColor} />
                </Animated.View>
                <Animated.Text style={[styles.tabLabel, { color: textColor }]}>
                  {tab.label}
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 4,
    position: "relative",
    height: 64,
  },
  indicator: {
    position: "absolute",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    top: 4,
    left: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabButtonContainer: {
    flex: 1,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: theme.fonts.medium,
  },
});

export default ModernTabBar;
