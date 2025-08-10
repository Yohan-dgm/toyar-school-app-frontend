import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface FeedbackCategory {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  questions?: Question[];
  subcategories?: Subcategory[];
}

interface PredefinedAnswer {
  id: number;
  text: string;
  weight: number;
  marks: number;
  question_id: number;
}

interface Question {
  id: number;
  text: string;
  answer_type: "mcq" | "text" | "number" | "boolean" | "likert" | "custom";
  answer_type_id?: number; // 1=MCQ, 2=Likert, 3=Custom
  category_id?: number;
  mcq_options?: string[];
  predefined_answers?: PredefinedAnswer[];
  marks?: number;
  required?: boolean;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface CategorySelectionComponentProps {
  categories: FeedbackCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryName: string) => void;
  selectedSubcategories?: string[];
  onSubcategoriesChange?: (subcategories: string[]) => void;
  isLoading?: boolean;
  error?: any;
  isRequired?: boolean;
  showQuestionCount?: boolean;
  showSubcategoryCount?: boolean;
  showSubcategorySelection?: boolean;
}

/**
 * CategorySelectionComponent - Reusable component for selecting feedback categories
 *
 * Features:
 * - Displays categories in a horizontal scrollable list
 * - Shows loading state while fetching categories
 * - Handles error states gracefully
 * - Supports required field validation styling
 * - Shows question and subcategory counts when available
 * - Responsive chip-based UI with selection indicators
 */
const CategorySelectionComponent: React.FC<CategorySelectionComponentProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  selectedSubcategories = [],
  onSubcategoriesChange,
  isLoading = false,
  error = null,
  isRequired = true,
  showQuestionCount = true,
  showSubcategoryCount = true,
  showSubcategorySelection = false,
}) => {
  // Filter valid categories
  const validCategories = React.useMemo(() => {
    return (categories || []).filter(
      (category) => category && category.name && category.active !== false,
    );
  }, [categories]);

  // Get category question count
  const getQuestionCount = (category: FeedbackCategory): number => {
    return category.questions?.length || 0;
  };

  // Get category subcategory count
  const getSubcategoryCount = (category: FeedbackCategory): number => {
    return category.subcategories?.length || 0;
  };

  // Get category display info
  const getCategoryInfo = (category: FeedbackCategory): string => {
    const parts: string[] = [];

    if (showQuestionCount) {
      const questionCount = getQuestionCount(category);
      if (questionCount > 0) {
        parts.push(
          `${questionCount} question${questionCount !== 1 ? "s" : ""}`,
        );
      }
    }

    if (showSubcategoryCount) {
      const subcategoryCount = getSubcategoryCount(category);
      if (subcategoryCount > 0) {
        parts.push(
          `${subcategoryCount} subcategor${subcategoryCount !== 1 ? "ies" : "y"}`,
        );
      }
    }

    return parts.join(" • ");
  };

  // Get available subcategories (all categories except the selected main one)
  const getAvailableSubcategories = React.useMemo(() => {
    if (!selectedCategory || !showSubcategorySelection) return [];

    return validCategories.filter(
      (category) => category.name !== selectedCategory,
    );
  }, [validCategories, selectedCategory, showSubcategorySelection]);

  // Handle subcategory toggle
  const handleSubcategoryToggle = (subcategoryName: string) => {
    if (!onSubcategoriesChange) return;

    const currentIndex = selectedSubcategories.indexOf(subcategoryName);
    const newSelected = [...selectedSubcategories];

    if (currentIndex === -1) {
      newSelected.push(subcategoryName);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    onSubcategoriesChange(newSelected);
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          isRequired && !selectedCategory && styles.requiredFieldTitle,
        ]}
      >
        Main Category
        {isRequired && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>

      <Text style={styles.helpText}>
        Select a feedback category. Each category contains specific questions
        and subcategories.
      </Text>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#920734" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : error ? (
        /* Error State */
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#F44336" />
          <Text style={styles.errorText}>
            Failed to load categories. Please check your connection and try
            again.
          </Text>
        </View>
      ) : validCategories.length > 0 ? (
        /* Categories List */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesListContent}
        >
          {validCategories.map((category) => {
            const isSelected = selectedCategory === category.name;
            const categoryInfo = getCategoryInfo(category);

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  isSelected && styles.selectedCategoryChip,
                ]}
                onPress={() => onCategorySelect(category.name)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryHeader}>
                  <MaterialIcons
                    name="category"
                    size={18}
                    color={isSelected ? "#FFFFFF" : "#920734"}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.selectedCategoryText,
                    ]}
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </View>

                {categoryInfo && (
                  <Text
                    style={[
                      styles.categoryInfo,
                      isSelected && styles.selectedCategoryInfo,
                    ]}
                    numberOfLines={1}
                  >
                    {categoryInfo}
                  </Text>
                )}

                {category.description && (
                  <Text
                    style={[
                      styles.categoryDescription,
                      isSelected && styles.selectedCategoryDescription,
                    ]}
                    numberOfLines={2}
                  >
                    {category.description}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        /* No Categories State */
        <View style={styles.noCategoriesContainer}>
          <MaterialIcons name="info" size={24} color="#999" />
          <Text style={styles.noCategoriesText}>
            No feedback categories available at the moment.
          </Text>
        </View>
      )}

      {/* Subcategory Selection */}
      {showSubcategorySelection &&
        selectedCategory &&
        getAvailableSubcategories.length > 0 && (
          <View style={styles.subcategorySection}>
            <Text style={styles.subcategorySectionTitle}>
              Additional Categories (Optional)
            </Text>
            <Text style={styles.subcategoryHelpText}>
              Select additional categories that also apply to this feedback.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoriesList}
              contentContainerStyle={styles.subcategoriesListContent}
            >
              {getAvailableSubcategories.map((category) => {
                const isSelected = selectedSubcategories.includes(
                  category.name,
                );
                const categoryInfo = getCategoryInfo(category);

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.subcategoryChip,
                      isSelected && styles.selectedSubcategoryChip,
                    ]}
                    onPress={() => handleSubcategoryToggle(category.name)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.subcategoryHeader}>
                      <MaterialIcons
                        name={
                          isSelected ? "check-circle" : "radio-button-unchecked"
                        }
                        size={16}
                        color={isSelected ? "#FFFFFF" : "#4CAF50"}
                      />
                      <Text
                        style={[
                          styles.subcategoryText,
                          isSelected && styles.selectedSubcategoryText,
                        ]}
                        numberOfLines={2}
                      >
                        {category.name}
                      </Text>
                    </View>

                    {categoryInfo && (
                      <Text
                        style={[
                          styles.subcategoryInfo,
                          isSelected && styles.selectedSubcategoryInfo,
                        ]}
                        numberOfLines={1}
                      >
                        {categoryInfo}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedSubcategories.length > 0 && (
              <Text style={styles.selectedSubcategoriesText}>
                Selected: {selectedSubcategories.join(", ")}
              </Text>
            )}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  requiredFieldTitle: {
    color: "#920734",
  },
  requiredAsterisk: {
    color: "#F44336",
    fontSize: 18,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#E53E3E",
    textAlign: "center",
    flex: 1,
  },
  categoriesList: {
    marginTop: 8,
  },
  categoriesListContent: {
    paddingRight: 16,
  },
  categoryChip: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#920734",
    minWidth: 140,
    maxWidth: 200,
  },
  selectedCategoryChip: {
    backgroundColor: "#920734",
    borderColor: "#920734",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#920734",
    marginLeft: 6,
    flex: 1,
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  categoryInfo: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic",
  },
  selectedCategoryInfo: {
    color: "#E0E0E0",
  },
  categoryDescription: {
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
  },
  selectedCategoryDescription: {
    color: "#F0F0F0",
  },
  noCategoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  noCategoriesText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  // Subcategory styles
  subcategorySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  subcategorySectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subcategoryHelpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  subcategoriesList: {
    marginTop: 8,
  },
  subcategoriesListContent: {
    paddingRight: 16,
  },
  subcategoryChip: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    minWidth: 120,
    maxWidth: 180,
  },
  selectedSubcategoryChip: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  subcategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  subcategoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4CAF50",
    marginLeft: 6,
    flex: 1,
  },
  selectedSubcategoryText: {
    color: "#FFFFFF",
  },
  subcategoryInfo: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic",
  },
  selectedSubcategoryInfo: {
    color: "#E0E0E0",
  },
  selectedSubcategoriesText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 12,
    fontStyle: "italic",
    fontWeight: "500",
  },
});

export default CategorySelectionComponent;
