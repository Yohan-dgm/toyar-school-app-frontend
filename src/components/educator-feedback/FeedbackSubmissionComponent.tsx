import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface Student {
  id: number;
  name: string;
  full_name?: string;
  admission_number: string;
  grade?: string;
}

interface FeedbackSubmissionComponentProps {
  // Form data
  description: string;
  onDescriptionChange: (text: string) => void;
  selectedSubcategories: string[];
  onSubcategoriesChange: (subcategories: string[]) => void;
  availableSubcategories: Subcategory[];

  // Context data
  selectedStudent: Student | null;
  selectedGrade: string | null;
  selectedCategory: string | null;
  calculatedRating: number;

  // Submission state
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;

  // Validation
  isFormValid: boolean;
  errors?: Record<string, string>;

  // UI options
  showSubcategories?: boolean;
  showRating?: boolean;
  showSummary?: boolean;
}

/**
 * FeedbackSubmissionComponent - Reusable component for submitting feedback
 *
 * Features:
 * - Feedback description input with character count
 * - Subcategory selection with multi-select chips
 * - Form validation and error display
 * - Submission summary with context
 * - Loading states during submission
 * - Comprehensive form validation
 */
const FeedbackSubmissionComponent: React.FC<
  FeedbackSubmissionComponentProps
> = ({
  description,
  onDescriptionChange,
  selectedSubcategories,
  onSubcategoriesChange,
  availableSubcategories,
  selectedStudent,
  selectedGrade,
  selectedCategory,
  calculatedRating,
  isSubmitting,
  onSubmit,
  onCancel,
  isFormValid,
  errors = {},
  showSubcategories = true,
  showRating = true,
  showSummary = true,
}) => {
  const MAX_DESCRIPTION_LENGTH = 1000;
  const MIN_DESCRIPTION_LENGTH = 10;

  // Handle subcategory toggle
  const toggleSubcategory = (subcategoryName: string) => {
    const currentIndex = selectedSubcategories.indexOf(subcategoryName);
    const newSelected = [...selectedSubcategories];

    if (currentIndex === -1) {
      newSelected.push(subcategoryName);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    onSubcategoriesChange(newSelected);
  };

  // Get description validation status
  const getDescriptionStatus = () => {
    const length = description.trim().length;
    if (length === 0)
      return { type: "empty", message: "Description is required" };
    if (length < MIN_DESCRIPTION_LENGTH)
      return {
        type: "short",
        message: `Minimum ${MIN_DESCRIPTION_LENGTH} characters required`,
      };
    if (length > MAX_DESCRIPTION_LENGTH)
      return {
        type: "long",
        message: `Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed`,
      };
    return { type: "valid", message: "Description looks good" };
  };

  const descriptionStatus = getDescriptionStatus();
  const characterCount = description.length;
  const isDescriptionValid = descriptionStatus.type === "valid";

  // Get rating display
  const getRatingDisplay = () => {
    if (calculatedRating === 0) return { text: "No rating", color: "#999" };
    if (calculatedRating <= 2)
      return { text: "Needs Improvement", color: "#F44336" };
    if (calculatedRating <= 3.5)
      return { text: "Satisfactory", color: "#FF9800" };
    if (calculatedRating <= 4.5) return { text: "Good", color: "#4CAF50" };
    return { text: "Excellent", color: "#2E7D32" };
  };

  const ratingDisplay = getRatingDisplay();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Submission Summary */}
      {showSummary && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Feedback Summary</Text>

          <View style={styles.summaryRow}>
            <MaterialIcons name="person" size={16} color="#920734" />
            <Text style={styles.summaryLabel}>Student:</Text>
            <Text style={styles.summaryValue}>
              {selectedStudent
                ? `${selectedStudent.name} (${selectedStudent.admission_number})`
                : "Not selected"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <MaterialIcons name="school" size={16} color="#920734" />
            <Text style={styles.summaryLabel}>Grade:</Text>
            <Text style={styles.summaryValue}>
              {selectedGrade || "Not selected"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <MaterialIcons name="category" size={16} color="#920734" />
            <Text style={styles.summaryLabel}>Category:</Text>
            <Text style={styles.summaryValue}>
              {selectedCategory || "Not selected"}
            </Text>
          </View>

          {showRating && (
            <View style={styles.summaryRow}>
              <MaterialIcons name="star" size={16} color="#920734" />
              <Text style={styles.summaryLabel}>Rating:</Text>
              <Text
                style={[styles.summaryValue, { color: ratingDisplay.color }]}
              >
                {calculatedRating.toFixed(1)} - {ratingDisplay.text}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Subcategories Selection */}
      {showSubcategories && availableSubcategories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subcategories (Optional)</Text>
          <Text style={styles.sectionHelp}>
            Select specific areas within {selectedCategory} that this feedback
            relates to.
          </Text>

          <View style={styles.subcategoriesContainer}>
            {availableSubcategories.map((subcategory) => {
              const isSelected = selectedSubcategories.includes(
                subcategory.name,
              );

              return (
                <TouchableOpacity
                  key={subcategory.id}
                  style={[
                    styles.subcategoryChip,
                    isSelected && styles.selectedSubcategoryChip,
                  ]}
                  onPress={() => toggleSubcategory(subcategory.name)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={
                      isSelected ? "check-circle" : "radio-button-unchecked"
                    }
                    size={16}
                    color={isSelected ? "#FFFFFF" : "#920734"}
                  />
                  <Text
                    style={[
                      styles.subcategoryChipText,
                      isSelected && styles.selectedSubcategoryChipText,
                    ]}
                  >
                    {subcategory.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedSubcategories.length > 0 && (
            <Text style={styles.selectedSubcategoriesText}>
              Selected: {selectedSubcategories.join(", ")}
            </Text>
          )}
        </View>
      )}

      {/* Description Input */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            !isDescriptionValid && styles.errorSectionTitle,
          ]}
        >
          Feedback Description <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <Text style={styles.sectionHelp}>
          Provide detailed feedback about the student's performance, behavior,
          or progress.
        </Text>

        <TextInput
          style={[
            styles.descriptionInput,
            !isDescriptionValid && styles.errorInput,
          ]}
          placeholder="Enter detailed feedback about the student..."
          placeholderTextColor="#999"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={MAX_DESCRIPTION_LENGTH}
        />

        <View style={styles.inputFooter}>
          <Text
            style={[
              styles.validationMessage,
              descriptionStatus.type === "valid" && styles.validMessage,
              (descriptionStatus.type === "short" ||
                descriptionStatus.type === "long") &&
                styles.errorMessage,
            ]}
          >
            {descriptionStatus.message}
          </Text>

          <Text
            style={[
              styles.characterCount,
              characterCount > MAX_DESCRIPTION_LENGTH * 0.9 &&
                styles.warningCharacterCount,
              characterCount > MAX_DESCRIPTION_LENGTH &&
                styles.errorCharacterCount,
            ]}
          >
            {characterCount}/{MAX_DESCRIPTION_LENGTH}
          </Text>
        </View>

        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}
      </View>

      {/* Form Validation Summary */}
      {!isFormValid && (
        <View style={styles.validationSummary}>
          <MaterialIcons name="warning" size={20} color="#F44336" />
          <Text style={styles.validationSummaryText}>
            Please complete all required fields before submitting.
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormValid || isSubmitting) && styles.disabledSubmitButton,
          ]}
          onPress={onSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submittingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.submittingText}>Submitting...</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.submitButtonText,
                !isFormValid && styles.disabledSubmitButtonText,
              ]}
            >
              Submit Feedback
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    marginRight: 8,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  errorSectionTitle: {
    color: "#F44336",
  },
  requiredAsterisk: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHelp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  subcategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  subcategoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#920734",
  },
  selectedSubcategoryChip: {
    backgroundColor: "#920734",
    borderColor: "#920734",
  },
  subcategoryChipText: {
    fontSize: 13,
    color: "#920734",
    marginLeft: 6,
    fontWeight: "500",
  },
  selectedSubcategoryChipText: {
    color: "#FFFFFF",
  },
  selectedSubcategoriesText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FFFFFF",
    minHeight: 120,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "#F44336",
    backgroundColor: "#FFF5F5",
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  validationMessage: {
    fontSize: 12,
    color: "#666",
  },
  validMessage: {
    color: "#4CAF50",
  },
  errorMessage: {
    color: "#F44336",
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
  },
  warningCharacterCount: {
    color: "#FF9800",
  },
  errorCharacterCount: {
    color: "#F44336",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: 4,
  },
  validationSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  validationSummaryText: {
    fontSize: 14,
    color: "#D32F2F",
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#920734",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledSubmitButton: {
    backgroundColor: "#CCCCCC",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledSubmitButtonText: {
    color: "#999999",
  },
  submittingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submittingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

export default FeedbackSubmissionComponent;
