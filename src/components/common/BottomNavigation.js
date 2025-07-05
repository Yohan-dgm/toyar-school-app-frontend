import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { theme } from "../../styles/theme";

const { width } = Dimensions.get("window");

const BottomNavigation = ({ activeTab = "schoolLife", onTabPress }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [hoverAnimations] = useState(() =>
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(0))
  );
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      id: "schoolLife",
      icon: "home",
      iconFamily: "MaterialIcons",
      title: "School Life",
    },
    {
      id: "feedback",
      icon: "contacts",
      iconFamily: "MaterialCommunityIcons",
      title: "Educator Feedback",
    },
    {
      id: "calendar",
      icon: "calendar-today",
      iconFamily: "MaterialIcons",
      title: "Calendar",
    },
    {
      id: "academic",
      icon: "school",
      iconFamily: "MaterialIcons",
      title: "Academic Performance",
    },
    {
      id: "performance",
      icon: "pie-chart",
      iconFamily: "MaterialIcons",
      title: "Student Performance",
    },
  ];

  const handleTabPress = (tabId) => {
    // Animate tab press with scale effect
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onTabPress?.(tabId);
  };

  const handlePressIn = (index) => {
    Animated.timing(hoverAnimations[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.timing(hoverAnimations[index], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const renderTab = (tab, index) => {
    const isActive = activeTab === tab.id;
    const IconComponent =
      tab.iconFamily === "MaterialCommunityIcons"
        ? MaterialCommunityIcons
        : MaterialIcons;

    const animatedScale = hoverAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1],
    });

    const animatedBackgroundColor = hoverAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"],
    });

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabContainer}
        onPress={() => handleTabPress(tab.id)}
        onPressIn={() => handlePressIn(index)}
        onPressOut={() => handlePressOut(index)}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.tabItem,
            {
              transform: [{ scale: isActive ? 1.08 : animatedScale }],
              // backgroundColor: isActive ? theme.colors.primary : "gray",
              backgroundColor: isActive ? "black" : "gray",
            },
          ]}
        >
          <IconComponent
            name={tab.icon}
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
          {tabs.map((tab, index) => renderTab(tab, index))}
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
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 58,
    borderRadius: 34,
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: "#000",
      },
      android: {
        elevation: 2,
        shadowColor: "#000",
      },
    }),
  },
});

export default BottomNavigation;
