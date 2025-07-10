import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { theme } from "../../styles/theme";
import { NavigationConfig, NavigationTab } from "../../config/navigationConfig";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface DynamicBottomNavigationProps {
  navigationConfig: NavigationConfig;
  activeTab?: string;
  onTabPress: (tabId: string) => void;
}

const DynamicBottomNavigation: React.FC<DynamicBottomNavigationProps> = ({
  navigationConfig,
  activeTab,
  onTabPress,
}) => {
  const animatedValue = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const currentActiveTab = activeTab || navigationConfig.defaultTab;

  const handleTabPress = (tabId: string) => {
    // Animate tab press with scale effect
    animatedValue.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );

    onTabPress?.(tabId);
  };

  const renderTab = (tab: NavigationTab, index: number) => {
    const isActive = currentActiveTab === tab.id;
    const IconComponent =
      tab.iconFamily === "MaterialCommunityIcons"
        ? MaterialCommunityIcons
        : MaterialIcons;

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabContainer}
        onPress={() => handleTabPress(tab.id)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.tabItem,
            {
              transform: [{ scale: isActive ? 1.08 : 1 }],
              backgroundColor: isActive ? "black" : "gray",
            },
          ]}
        >
          <IconComponent
            name={tab.icon as any}
            size={24}
            color={isActive ? "#FFFFFF" : "white"}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      <BlurView intensity={35} tint="dark" style={styles.navigationBar}>
        <View style={styles.navigationContent}>
          {navigationConfig.tabs.map((tab, index) => renderTab(tab, index))}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.sm,
  },
  navigationBar: {
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
        shadowColor: "#000",
      },
    }),
  },
  navigationContent: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: theme.spacing.sm,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default DynamicBottomNavigation;
