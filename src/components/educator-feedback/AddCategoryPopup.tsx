import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCreateFeedbackCategoryMutation } from "../../api/educator-feedback-api";

// Define theme colors inline since we're not sure about the theme import path
const theme = {
  colors: {
    background: "#FFFFFF",
    card: "#F8F9FA",
    text: "#333333",
    secondary: "#666666",
    primary: "#920734",
    border: "#E0E0E0",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

interface MCQOption {
  id: number;
  text: string;
  marks: number;
}

interface Question {
  id: number;
  text: string;
  answerType: "rating" | "mcq" | "custom" | "text" | "number" | "boolean";
  mcqOptions: MCQOption[];
  marks: number;
  required?: boolean;
}

interface CategoryData {
  title: string;
  questions: Question[];
}

interface AddCategoryPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: CategoryData) => void;
  onSuccess?: () => void;
}

const AddCategoryPopup: React.FC<AddCategoryPopupProps> = ({
  visible,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  // API Integration
  const [createCategory, { isLoading: isSubmitting, error: submitError }] =
    useCreateFeedbackCategoryMutation();

  // Form State
  const [categoryTitle, setCategoryTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      answerType: "text",
      mcqOptions: [],
      marks: 1,
      required: false,
    },
  ]);

  const answerTypes = [
    {
      id: "text" as const,
      label: "Text Answer",
      needsOptions: false,
      description: "Students provide written responses",
    },
    {
      id: "mcq" as const,
      label: "Multiple Choice",
      needsOptions: true,
      description: "Students select from predefined options",
    },
    {
      id: "number" as const,
      label: "Number",
      needsOptions: false,
      description: "Students enter numeric values",
    },
    {
      id: "boolean" as const,
      label: "Yes/No",
      needsOptions: false,
      description: "Students answer yes or no",
    },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: "",
      answerType: "text",
      mcqOptions: [],
      marks: 1,
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (
    questionId: number,
    field: keyof Question,
    value: any,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q,
      ),
    );
  };

  const addMCQOption = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const newOption: MCQOption = {
      id: Date.now(),
      text: "",
      marks: 1,
    };
    updateQuestion(questionId, "mcqOptions", [
      ...(question.mcqOptions || []),
      newOption,
    ]);
  };

  const removeMCQOption = (questionId: number, optionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedOptions = question.mcqOptions.filter(
      (opt) => opt.id !== optionId,
    );
    updateQuestion(questionId, "mcqOptions", updatedOptions);
  };

  const updateMCQOption = (
    questionId: number,
    optionId: number,
    field: keyof MCQOption,
    value: any,
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedOptions = question.mcqOptions.map((opt) =>
      opt.id === optionId ? { ...opt, [field]: value } : opt,
    );
    updateQuestion(questionId, "mcqOptions", updatedOptions);
  };

  const handleSubmit = async () => {
    // Validation
    if (!categoryTitle.trim()) {
      Alert.alert("Error", "Please enter a category title");
      return;
    }

    const emptyQuestions = questions.filter((q) => !q.text.trim());
    if (emptyQuestions.length > 0) {
      Alert.alert("Error", "Please fill in all question texts");
      return;
    }

    const mcqQuestionsWithoutOptions = questions.filter(
      (q) =>
        q.answerType === "mcq" && (!q.mcqOptions || q.mcqOptions.length === 0),
    );
    if (mcqQuestionsWithoutOptions.length > 0) {
      Alert.alert(
        "Error",
        "Multiple choice questions must have at least one option",
      );
      return;
    }

    const mcqOptionsWithoutText = questions.some(
      (q) =>
        q.answerType === "mcq" && q.mcqOptions.some((opt) => !opt.text.trim()),
    );
    if (mcqOptionsWithoutText) {
      Alert.alert("Error", "All multiple choice options must have text");
      return;
    }

    // Prepare category data for API
    const categoryData = {
      title: categoryTitle.trim(),
      questions: questions.map((q) => ({
        text: q.text.trim(),
        answerType: q.answerType,
        mcqOptions:
          q.answerType === "mcq"
            ? q.mcqOptions.map((opt) => opt.text.trim())
            : [],
        marks: q.marks,
        required: q.required || false,
      })),
    };

    try {
      console.log("📤 Submitting category:", categoryData);

      // Submit to API
      const result = await createCategory(categoryData).unwrap();

      console.log("✅ Category created successfully:", result);

      Alert.alert("Success", "Category created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Call legacy onSubmit if provided (for backward compatibility)
            if (onSubmit) {
              const legacyData: CategoryData = {
                title: categoryTitle.trim(),
                questions: questions.map((q) => ({
                  id: q.id,
                  text: q.text.trim(),
                  answerType: q.answerType,
                  mcqOptions: q.answerType === "mcq" ? q.mcqOptions : [],
                  marks: q.marks,
                  required: q.required,
                })),
              };
              onSubmit(legacyData);
            }

            // Call success callback
            if (onSuccess) {
              onSuccess();
            }

            // Reset form and close
            handleResetForm();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error("❌ Failed to create category:", error);

      let errorMessage = "Failed to create category. Please try again.";

      // Handle specific API errors
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errors) {
        // Handle validation errors
        const errors = Object.values(error.data.errors).flat();
        errorMessage = errors.join(", ");
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const handleResetForm = () => {
    setCategoryTitle("");
    setQuestions([
      {
        id: 1,
        text: "",
        answerType: "text",
        mcqOptions: [],
        marks: 1,
        required: false,
      },
    ]);
  };

  const handleCancel = () => {
    // Check if form has any data
    const hasData =
      categoryTitle.trim() !== "" ||
      questions.some((q) => q.text.trim() !== "" || q.mcqOptions.length > 0);

    if (hasData && !isSubmitting) {
      Alert.alert(
        "Cancel",
        "Are you sure you want to cancel? All changes will be lost.",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => {
              handleResetForm();
              onClose();
            },
          },
        ],
      );
    } else {
      handleResetForm();
      onClose();
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <View key={question.id} style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionLabel}>Question {index + 1}</Text>
          {questions.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeQuestion(question.id)}
            >
              <MaterialIcons name="close" size={20} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          style={styles.questionInput}
          placeholder="Enter your question..."
          value={question.text}
          onChangeText={(text) => updateQuestion(question.id, "text", text)}
          multiline
        />

        <Text style={styles.answerTypeLabel}>Answer Type</Text>
        <View style={styles.answerTypeContainer}>
          {answerTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.answerTypeChip,
                question.answerType === type.id && styles.selectedAnswerType,
              ]}
              onPress={() => updateQuestion(question.id, "answerType", type.id)}
            >
              <Text
                style={[
                  styles.answerTypeText,
                  question.answerType === type.id &&
                    styles.selectedAnswerTypeText,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Required Field Toggle */}
        <View style={styles.requiredContainer}>
          <TouchableOpacity
            style={styles.requiredToggle}
            onPress={() =>
              updateQuestion(question.id, "required", !question.required)
            }
          >
            <MaterialIcons
              name={question.required ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={question.required ? theme.colors.primary : "#999"}
            />
            <Text
              style={[
                styles.requiredLabel,
                question.required && styles.requiredLabelActive,
              ]}
            >
              Required field
            </Text>
          </TouchableOpacity>
        </View>

        {question.answerType === "rating" && (
          <View style={styles.ratingPreview}>
            <Text style={styles.previewLabel}>Rating Scale Preview:</Text>
            <View style={styles.ratingScale}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <View key={rating} style={styles.ratingItem}>
                  <View style={styles.ratingCircle}>
                    <Text style={styles.ratingNumber}>{rating}</Text>
                  </View>
                  <Text style={styles.ratingLabel}>
                    {rating === 1
                      ? "Poor"
                      : rating === 2
                        ? "Fair"
                        : rating === 3
                          ? "Good"
                          : rating === 4
                            ? "Very Good"
                            : "Excellent"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {question.answerType === "mcq" && (
          <View style={styles.mcqContainer}>
            <View style={styles.mcqHeader}>
              <Text style={styles.mcqLabel}>MCQ Options</Text>
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={() => addMCQOption(question.id)}
              >
                <MaterialIcons
                  name="add"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            </View>

            {(question.mcqOptions || []).map((option, optionIndex) => (
              <View key={option.id} style={styles.mcqOptionContainer}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionLabel}>
                    Option {optionIndex + 1}
                  </Text>
                  {question.mcqOptions.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeOptionButton}
                      onPress={() => removeMCQOption(question.id, option.id)}
                    >
                      <MaterialIcons name="close" size={16} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>

                <TextInput
                  style={styles.optionInput}
                  placeholder="Enter option text..."
                  value={option.text}
                  onChangeText={(text) =>
                    updateMCQOption(question.id, option.id, "text", text)
                  }
                />

                <View style={styles.marksContainer}>
                  <Text style={styles.marksLabel}>Marks (1-5):</Text>
                  <View style={styles.marksSelector}>
                    {[1, 2, 3, 4, 5].map((mark) => (
                      <TouchableOpacity
                        key={mark}
                        style={[
                          styles.markButton,
                          option.marks === mark && styles.selectedMarkButton,
                        ]}
                        onPress={() =>
                          updateMCQOption(question.id, option.id, "marks", mark)
                        }
                      >
                        <Text
                          style={[
                            styles.markText,
                            option.marks === mark && styles.selectedMarkText,
                          ]}
                        >
                          {mark}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}

            {(!question.mcqOptions || question.mcqOptions.length === 0) && (
              <TouchableOpacity
                style={styles.firstOptionButton}
                onPress={() => addMCQOption(question.id)}
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.firstOptionText}>Add First Option</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {question.answerType === "custom" && (
          <View style={styles.customPreview}>
            <Text style={styles.previewLabel}>Custom Answer Preview:</Text>
            <TextInput
              style={styles.customAnswerPreview}
              placeholder="Students will type their answer here..."
              multiline
              editable={false}
            />
          </View>
        )}
      </View>
    );
  };

  console.log("🎯 About to render Modal with visible:", visible);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Category</Text>
          <TouchableOpacity onPress={handleCancel}>
            <MaterialIcons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.categoryTitleSection}>
            <Text style={styles.sectionTitle}>Category Title</Text>
            <TextInput
              style={styles.categoryTitleInput}
              placeholder="Enter category title..."
              value={categoryTitle}
              onChangeText={setCategoryTitle}
            />
          </View>

          <View style={styles.questionsSection}>
            <View style={styles.questionsSectionHeader}>
              <Text style={styles.sectionTitle}>Questions</Text>
              <TouchableOpacity
                style={styles.addQuestionButton}
                onPress={addQuestion}
              >
                <MaterialIcons
                  name="add"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.addQuestionText}>Add Question</Text>
              </TouchableOpacity>
            </View>

            {questions.map((question, index) =>
              renderQuestion(question, index),
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Text
              style={[
                styles.cancelButtonText,
                isSubmitting && styles.disabledButtonText,
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.disabledSubmitButton,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submittingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.submittingText}>Creating...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Create Category</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  categoryTitleSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoryTitleInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  questionsSection: {
    marginBottom: theme.spacing.xl,
  },
  questionsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  addQuestionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addQuestionText: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  },
  questionContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  removeButton: {
    padding: theme.spacing.xs,
  },
  questionInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 60,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    textAlignVertical: "top",
  },
  answerTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  answerTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: theme.spacing.md,
  },
  answerTypeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedAnswerType: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  answerTypeText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "500",
  },
  selectedAnswerTypeText: {
    color: "white",
    fontWeight: "600",
  },
  ratingPreview: {
    marginTop: theme.spacing.sm,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: theme.spacing.sm,
  },
  ratingScale: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingItem: {
    alignItems: "center",
    flex: 1,
  },
  ratingCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  ratingNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  ratingLabel: {
    fontSize: 10,
    color: theme.colors.secondary,
    textAlign: "center",
  },
  mcqContainer: {
    marginTop: theme.spacing.sm,
  },
  mcqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  mcqLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  addOptionText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  },
  mcqOptionContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.secondary,
  },
  removeOptionButton: {
    padding: theme.spacing.xs,
  },
  optionInput: {
    backgroundColor: "white",
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  marksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  marksLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  marksSelector: {
    flexDirection: "row",
  },
  markButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.xs,
  },
  selectedMarkButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  markText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  selectedMarkText: {
    color: "white",
  },
  firstOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
  },
  firstOptionText: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: theme.spacing.sm,
  },
  customPreview: {
    marginTop: theme.spacing.sm,
  },
  customAnswerPreview: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.secondary,
    minHeight: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
  },
  submitButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  requiredContainer: {
    marginBottom: theme.spacing.md,
  },
  requiredToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  requiredLabel: {
    fontSize: 14,
    color: "#999",
    marginLeft: theme.spacing.sm,
  },
  requiredLabelActive: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
  disabledSubmitButton: {
    backgroundColor: "#CCCCCC",
  },
  disabledButtonText: {
    color: "#999",
  },
  submittingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submittingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: theme.spacing.sm,
  },
});

export default AddCategoryPopup;
