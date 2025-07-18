import React, { useEffect, useRef } from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Animated } from "react-native";
import { Home, Users } from "@/lib/icons";
import { BlurView } from "expo-blur";

// Animated Tab Icon Component for smooth transitions
const AnimatedTabIcon = ({
  focused,
  IconComponent,
  size = 20,
}: {
  focused: boolean;
  IconComponent: any;
  size?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();

    // Background opacity animation
    Animated.timing(backgroundOpacityAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#2D2D2D",
          opacity: backgroundOpacityAnim,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: focused ? 0.15 : 0,
          shadowRadius: focused ? 3 : 0,
          elevation: focused ? 3 : 0,
        }}
      />
      <IconComponent size={size} color={focused ? "#FFFFFF" : "#333333"} />
    </Animated.View>
  );
};

export default function PublicLayout() {
  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#9b0737",
          tabBarInactiveTintColor: "rgba(155, 7, 55, 0.6)",
          tabBarStyle: {
            position: "absolute",
            bottom: 30,
            // left: "50%", // Center the navbar
            marginLeft: "35%", // Half of the total width (120px / 2 = 60px)
            width: 120, // Small compact width for 2 icons
            height: 60,
            backgroundColor: "#FFFFFF", // Pure white background
            borderRadius: 30, // Perfect pill shape
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.08)",
            paddingBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 10, // Reduced horizontal padding
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={60} // Reduced blur intensity
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  borderRadius: 30,
                  overflow: "hidden",
                }}
                tint="light"
              />
            ) : null,
          tabBarShowLabel: false, // Explicitly hide labels
          tabBarLabelStyle: {
            // Completely hide labels without using fontSize: 0
            opacity: 0,
            height: 0,
            width: 0,
            position: "absolute",
            left: -1000, // Move completely off-screen
            top: -1000,
          },
          tabBarIconStyle: {
            marginBottom: 0,
            marginTop: 0,
          },
          tabBarItemStyle: {
            borderRadius: 20, // Smaller circle
            width: 40, // Smaller width
            height: 40, // Smaller height
            marginHorizontal: 2, // Much smaller gap between icons
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          },
          tabBarActiveBackgroundColor: "transparent",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon
                focused={focused}
                IconComponent={Home}
                size={20}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: "User",
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon
                focused={focused}
                IconComponent={Users}
                size={20}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
