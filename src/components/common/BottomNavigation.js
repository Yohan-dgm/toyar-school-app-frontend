// DEPRECATED: This file has been replaced by DynamicBottomNavigation.tsx
// All imports have been commented out to prevent conflicts with React Native Reanimated
// This file is kept for reference only and should not be imported

/*
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

  // Rest of the component code commented out to prevent conflicts
  */

// Placeholder export to prevent import errors
const BottomNavigation = () => null;

export default BottomNavigation;
