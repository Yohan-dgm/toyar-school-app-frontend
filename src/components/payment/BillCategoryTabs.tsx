import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BillCategory } from "../../types/payment";
import { theme } from "../../styles/theme";

interface BillCategoryTabsProps {
  selectedCategory: BillCategory | "all";
  onCategorySelect: (category: BillCategory | "all") => void;
  categoryCounts: { [key in BillCategory]?: number };
}

interface CategoryConfig {
  key: BillCategory | "all";
  label: string;
  icon: string;
  color: string;
}

const categories: CategoryConfig[] = [
  { key: "all", label: "All Bills", icon: "receipt", color: "#2196F3" },
  {
    key: "admission_fee",
    label: "Admission",
    icon: "school",
    color: "#4CAF50",
  },
  { key: "term_fee", label: "Term Fees", icon: "schedule", color: "#FF9800" },
  {
    key: "exam_bills",
    label: "Exam Bills",
    icon: "assignment",
    color: "#9C27B0",
  },
  { key: "sport_fee", label: "Sports", icon: "sports", color: "#E91E63" },
  {
    key: "refundable_deposits",
    label: "Deposits",
    icon: "account-balance",
    color: "#00BCD4",
  },
  {
    key: "general_bills",
    label: "General",
    icon: "receipt-long",
    color: "#795548",
  },
  {
    key: "material_bills",
    label: "Materials",
    icon: "inventory",
    color: "#607D8B",
  },
];

const BillCategoryTabs: React.FC<BillCategoryTabsProps> = ({
  selectedCategory,
  onCategorySelect,
  categoryCounts,
}) => {
  const getTotalCount = () => {
    return Object.values(categoryCounts).reduce(
      (sum, count) => sum + (count || 0),
      0,
    );
  };

  const getCountForCategory = (category: BillCategory | "all") => {
    if (category === "all") {
      return getTotalCount();
    }
    return categoryCounts[category] || 0;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          const count = getCountForCategory(category.key);

          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.tab,
                isSelected && styles.selectedTab,
                isSelected && { borderBottomColor: category.color },
              ]}
              onPress={() => onCategorySelect(category.key)}
            >
              <View style={styles.tabContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected ? category.color : "#F5F5F5",
                    },
                  ]}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={18}
                    color={isSelected ? "#FFFFFF" : category.color}
                  />
                </View>

                <Text
                  style={[
                    styles.tabText,
                    isSelected && styles.selectedTabText,
                    isSelected && { color: category.color },
                  ]}
                >
                  {category.label}
                </Text>

                {count > 0 && (
                  <View
                    style={[
                      styles.countBadge,
                      {
                        backgroundColor: isSelected
                          ? category.color
                          : "#E0E0E0",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countText,
                        { color: isSelected ? "#FFFFFF" : "#666666" },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedTab: {
    borderBottomWidth: 2,
  },
  tabContent: {
    alignItems: "center",
    minWidth: 80,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
    marginBottom: 2,
  },
  selectedTabText: {
    fontWeight: "600",
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

export default BillCategoryTabs;
