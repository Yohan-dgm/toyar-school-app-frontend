import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { modernColors, maroonTheme } from "../../data/studentGrowthData";

const { width } = Dimensions.get("window");

export interface CategoryOption {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

interface CategorySelectorProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  disabled?: boolean;
}

// Default categories including "Overall" plus all 13 intelligence categories
export const DEFAULT_CATEGORIES: CategoryOption[] = [
  {
    id: "overall",
    name: "Overall Performance",
    shortName: "Overall",
    color: maroonTheme.primary,
  },
  {
    id: "intrapersonal",
    name: "Intrapersonal Intelligence",
    shortName: "Intrapersonal",
    color: "#8B5CF6",
  },
  {
    id: "interpersonal",
    name: "Interpersonal Intelligence",
    shortName: "Interpersonal",
    color: "#06B6D4",
  },
  {
    id: "music",
    name: "Music Intelligence",
    shortName: "Music",
    color: "#10B981",
  },
  {
    id: "bodily_kinesthetic",
    name: "Bodily Kinesthetic Intelligence",
    shortName: "Bodily Kinesthetic",
    color: "#F59E0B",
  },
  {
    id: "linguistic",
    name: "Linguistic Intelligence",
    shortName: "Linguistic",
    color: "#EF4444",
  },
  {
    id: "mathematical_logical",
    name: "Mathematical / Logical Intelligence",
    shortName: "Mathematical",
    color: "#8B5A2B",
  },
  {
    id: "existential",
    name: "Existential Intelligence",
    shortName: "Existential",
    color: "#EC4899",
  },
  {
    id: "spatial",
    name: "Spatial Intelligence",
    shortName: "Spatial",
    color: "#6366F1",
  },
  {
    id: "naturalistic",
    name: "Naturalistic Intelligence",
    shortName: "Naturalistic",
    color: "#F97316",
  },
  {
    id: "school_community",
    name: "Contribution to School Community",
    shortName: "School Community",
    color: "#84CC16",
  },
  {
    id: "society",
    name: "Contribution to Society",
    shortName: "Society",
    color: "#14B8A6",
  },
  {
    id: "attendance",
    name: "Attendance and Punctuality",
    shortName: "Attendance",
    color: "#8B5CF6",
  },
  {
    id: "lifeskills",
    name: "Life Skills Development",
    shortName: "Life Skills",
    color: "#F59E0B",
  },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onCategoryChange,
  disabled = false,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleCategoryPress = (categoryId: string) => {
    if (!disabled) {
      onCategoryChange(categoryId);
      console.log("📊 CategorySelector - Selected category:", categoryId);
    }
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Performance Category</Text>

      {/* Selected Category Display */}
      <View style={styles.selectedContainer}>
        <View
          style={[
            styles.selectedIndicator,
            {
              backgroundColor:
                selectedCategoryData?.color || maroonTheme.primary,
            },
          ]}
        />
        <Text style={styles.selectedText} numberOfLines={1}>
          {selectedCategoryData?.name || "Select Category"}
        </Text>
        {/* <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={modernColors.textSecondary}
        /> */}
      </View>

      {/* Scrollable Category Options */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategory;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && styles.selectedChip,
                disabled && styles.disabledChip,
              ]}
              onPress={() => handleCategoryPress(category.id)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryIndicator,
                  { backgroundColor: category.color },
                  isSelected && styles.selectedIndicator,
                ]}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedCategoryText,
                ]}
                numberOfLines={1}
              >
                {category.shortName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  selectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: modernColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  selectedText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: modernColors.text,
  },
  scrollContainer: {
    maxHeight: 50,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: modernColors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 8,
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedChip: {
    backgroundColor: maroonTheme.primary + "15",
    borderColor: maroonTheme.primary + "30",
    shadowColor: maroonTheme.primary,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  disabledChip: {
    opacity: 0.5,
  },
  categoryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: modernColors.textSecondary,
    textAlign: "center",
    flex: 1,
  },
  selectedCategoryText: {
    color: maroonTheme.primary,
    fontWeight: "600",
  },
});

export default CategorySelector;
