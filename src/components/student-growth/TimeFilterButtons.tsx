import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { timeFilters, modernColors } from "../../data/studentGrowthData";

interface TimeFilterButtonsProps {
  onFilterChange?: (filterId: string) => void;
  selectedFilter?: string;
}

const TimeFilterButtons: React.FC<TimeFilterButtonsProps> = ({
  onFilterChange,
  selectedFilter: externalSelectedFilter,
}) => {
  const [internalSelectedFilter, setInternalSelectedFilter] = useState("week");
  const selectedFilter = externalSelectedFilter || internalSelectedFilter;

  const handleFilterPress = (filterId: string) => {
    setInternalSelectedFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {timeFilters.map((filter) => {
          const isSelected = selectedFilter === filter.id;

          if (isSelected) {
            return (
              <LinearGradient
                key={filter.id}
                colors={[modernColors.primary, modernColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.selectedButtonGradient}
              >
                <TouchableOpacity
                  style={styles.selectedButton}
                  onPress={() => handleFilterPress(filter.id)}
                  activeOpacity={0.8}
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
              activeOpacity={0.7}
            >
              <Text style={styles.unselectedButtonText}>{filter.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: modernColors.surface,
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedButtonGradient: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  selectedButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  selectedButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  unselectedButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginHorizontal: 2,
  },
  unselectedButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: modernColors.textSecondary,
  },
});

export default TimeFilterButtons;
