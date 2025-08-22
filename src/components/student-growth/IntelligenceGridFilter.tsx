import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { modernColors, maroonTheme } from "../../data/studentGrowthData";

interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}

interface IntelligenceGridFilterProps {
  onFilterChange?: (filterId: string) => void;
  selectedFilter?: string;
}

// Dynamic filter generation based on current date
const getCurrentFilters = (): FilterOption[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleDateString("en-US", { month: "short" });

  return [
    { id: "all", label: "All", active: false },
    { id: "current-year", label: currentYear.toString(), active: true }, // Auto-selected
    {
      id: "current-month",
      label: `${currentMonth} ${currentYear}`,
      active: false,
    },
  ];
};

const IntelligenceGridFilter: React.FC<IntelligenceGridFilterProps> = ({
  onFilterChange,
  selectedFilter: externalSelectedFilter,
}) => {
  const [internalSelectedFilter, setInternalSelectedFilter] =
    useState("current-year");
  const [scaleAnim] = useState(new Animated.Value(1));
  const selectedFilter = externalSelectedFilter || internalSelectedFilter;

  // Get dynamic filters
  const intelligenceGridFilters = getCurrentFilters();

  const handleFilterPress = (filterId: string) => {
    // Add spring animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    setInternalSelectedFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.buttonContainer}>
        {intelligenceGridFilters.map((filter) => {
          const isSelected = selectedFilter === filter.id;

          if (isSelected) {
            return (
              <LinearGradient
                key={filter.id}
                colors={[maroonTheme.primary, maroonTheme.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.selectedButtonGradient}
              >
                <TouchableOpacity
                  style={styles.selectedButton}
                  onPress={() => handleFilterPress(filter.id)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectedButtonText}>{filter.label}</Text>
                </TouchableOpacity>
              </LinearGradient>
            );
          }

          return (
            <TouchableOpacity
              key={filter.id}
              style={styles.unselectedButton}
              onPress={() => handleFilterPress(filter.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.unselectedButtonText}>{filter.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 3,
    shadowColor: maroonTheme.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(128, 0, 0, 0.1)",
    minWidth: 240,
    maxWidth: 280,
  },
  selectedButtonGradient: {
    borderRadius: 22,
    marginHorizontal: 1,
    minWidth: 70,
  },
  selectedButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  selectedButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  unselectedButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    marginHorizontal: 1,
    minWidth: 70,
  },
  unselectedButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: modernColors.textSecondary,
    letterSpacing: 0.2,
  },
});

export default React.memo(IntelligenceGridFilter);
