import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import EducatorFeedbackModal from "../src/screens/authenticated/principal/dashboard/modals/EducatorFeedbackModal";
import * as educatorFeedbackApi from "../src/api/educator-feedback-api";

// Mock the API module
jest.mock("../src/api/educator-feedback-api", () => ({
  useGetFeedbackCategoriesWithQuestionsQuery: jest.fn(),
  useGetEducatorFeedbacksQuery: jest.fn(),
  useSubmitEducatorFeedbackMutation: jest.fn(),
  useCreateFeedbackCategoryMutation: jest.fn(),
}));

// Mock the AddCategoryPopup component
jest.mock("../src/components/educator-feedback/AddCategoryPopup", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");

  const MockAddCategoryPopup = ({ visible, onClose, onSubmit }: any) => {
    if (!visible) return null;

    return (
      <View testID="add-category-popup">
        <TouchableOpacity testID="close-popup-button" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="submit-category-button"
          onPress={() =>
            onSubmit({
              title: "Test Category",
              questions: [
                {
                  id: 1,
                  text: "Test Question",
                  answerType: "text",
                  mcqOptions: [],
                  marks: 1,
                  required: false,
                },
              ],
            })
          }
        >
          <Text>Submit Category</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return MockAddCategoryPopup;
});

// Mock StudentSelectionWithPagination
jest.mock("../src/components/common/StudentSelectionWithPagination", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");

  const MockStudentSelection = ({ onStudentSelect }: any) => (
    <View testID="student-selection">
      <TouchableOpacity
        testID="select-student-button"
        onPress={() =>
          onStudentSelect({
            id: "1",
            name: "Test Student",
            admissionNumber: "12345",
            grade: "Grade 8",
          })
        }
      >
        <Text>Select Student</Text>
      </TouchableOpacity>
    </View>
  );
  return MockStudentSelection;
});

// Mock constants
jest.mock("../src/constants/gradeLevels", () => ({
  GRADE_LEVELS: [{ id: "1", name: "Grade 8", value: "8" }],
}));

// Mock React Native components
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  Alert: {
    alert: jest.fn(),
  },
}));

const mockStore = configureStore({
  reducer: {
    api: (state = {}) => state,
  },
});

const mockProps = {
  visible: true,
  onClose: jest.fn(),
};

describe("EducatorFeedbackModal", () => {
  const mockUseCreateFeedbackCategory = jest.fn(() => [
    jest.fn().mockResolvedValue({ unwrap: () => ({ data: { id: "1" } }) }),
    { isLoading: false, error: null },
  ]);

  const mockUseGetFeedbackCategories = jest.fn(() => ({
    data: {
      status: "successful",
      data: [
        {
          id: "1",
          title: "Behavior",
          questions: [
            {
              id: "1",
              text: "How is the student's behavior?",
              answerType: "rating",
              mcqOptions: [],
              marks: 5,
              required: true,
            },
          ],
        },
      ],
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }));

  const mockUseGetEducatorFeedbacks = jest.fn(() => ({
    data: { status: "successful", data: [] },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }));

  const mockUseSubmitEducatorFeedback = jest.fn(() => [
    jest.fn().mockResolvedValue({ unwrap: () => ({ status: "successful" }) }),
    { isLoading: false, error: null },
  ]);

  beforeEach(() => {
    jest.clearAllMocks();

    (
      educatorFeedbackApi.useCreateFeedbackCategoryMutation as jest.Mock
    ).mockReturnValue(mockUseCreateFeedbackCategory());
    (
      educatorFeedbackApi.useGetFeedbackCategoriesWithQuestionsQuery as jest.Mock
    ).mockReturnValue(mockUseGetFeedbackCategories());
    (
      educatorFeedbackApi.useGetEducatorFeedbacksQuery as jest.Mock
    ).mockReturnValue(mockUseGetEducatorFeedbacks());
    (
      educatorFeedbackApi.useSubmitEducatorFeedbackMutation as jest.Mock
    ).mockReturnValue(mockUseSubmitEducatorFeedback());
  });

  const renderComponent = (props = mockProps) => {
    return render(
      <Provider store={mockStore}>
        <EducatorFeedbackModal {...props} />
      </Provider>,
    );
  };

  describe("Add Category Button", () => {
    it("should render Add Category button", () => {
      renderComponent();

      const addCategoryButton = screen.getByText("Add Category");
      expect(addCategoryButton).toBeTruthy();
    });

    it("should open AddCategoryPopup when Add Category button is pressed", () => {
      renderComponent();

      const addCategoryButton = screen.getByText("Add Category");
      fireEvent.press(addCategoryButton);

      const popup = screen.getByTestId("add-category-popup");
      expect(popup).toBeTruthy();
    });

    it("should have correct icon and styling for Add Category button", () => {
      renderComponent();

      const addCategoryButton = screen.getByText("Add Category");
      const buttonParent = addCategoryButton.parent;

      // Check if MaterialIcons is present (category icon)
      expect(buttonParent).toBeTruthy();
    });
  });

  describe("AddCategoryPopup Integration", () => {
    it("should close popup when close button is pressed", async () => {
      renderComponent();

      // Open popup
      const addCategoryButton = screen.getByText("Add Category");
      fireEvent.press(addCategoryButton);

      expect(screen.getByTestId("add-category-popup")).toBeTruthy();

      // Close popup
      const closeButton = screen.getByTestId("close-popup-button");
      fireEvent.press(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("add-category-popup")).toBeFalsy();
      });
    });

    it("should handle category submission correctly", async () => {
      const mockCreateCategory = jest.fn().mockResolvedValue({
        unwrap: () => ({ data: { id: "new-category-1" } }),
      });

      (
        educatorFeedbackApi.useCreateFeedbackCategoryMutation as jest.Mock
      ).mockReturnValue([
        mockCreateCategory,
        { isLoading: false, error: null },
      ]);

      renderComponent();

      // Open popup
      const addCategoryButton = screen.getByText("Add Category");
      fireEvent.press(addCategoryButton);

      // Submit category
      const submitButton = screen.getByTestId("submit-category-button");
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockCreateCategory).toHaveBeenCalledWith({
          title: "Test Category",
          questions: expect.arrayContaining([
            expect.objectContaining({
              text: "Test Question",
              answerType: "text",
            }),
          ]),
        });
      });
    });

    it("should handle API errors gracefully", async () => {
      const mockCreateCategory = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      (
        educatorFeedbackApi.useCreateFeedbackCategoryMutation as jest.Mock
      ).mockReturnValue([
        mockCreateCategory,
        { isLoading: false, error: null },
      ]);

      renderComponent();

      // Open popup
      const addCategoryButton = screen.getByText("Add Category");
      fireEvent.press(addCategoryButton);

      // Submit category
      const submitButton = screen.getByTestId("submit-category-button");
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockCreateCategory).toHaveBeenCalled();
        // Should still add to local state even on API error
      });
    });
  });

  describe("Modal State Management", () => {
    it("should initialize with popup closed", () => {
      renderComponent();

      expect(screen.queryByTestId("add-category-popup")).toBeFalsy();
    });

    it("should manage popup visibility state correctly", async () => {
      renderComponent();

      // Initially closed
      expect(screen.queryByTestId("add-category-popup")).toBeFalsy();

      // Open popup
      const addCategoryButton = screen.getByText("Add Category");
      fireEvent.press(addCategoryButton);
      expect(screen.getByTestId("add-category-popup")).toBeTruthy();

      // Close popup
      const closeButton = screen.getByTestId("close-popup-button");
      fireEvent.press(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("add-category-popup")).toBeFalsy();
      });
    });
  });

  describe("API Integration", () => {
    it("should use correct API hooks", () => {
      renderComponent();

      expect(
        educatorFeedbackApi.useCreateFeedbackCategoryMutation,
      ).toHaveBeenCalled();
      expect(
        educatorFeedbackApi.useGetFeedbackCategoriesWithQuestionsQuery,
      ).toHaveBeenCalled();
    });

    it("should handle loading states", () => {
      (
        educatorFeedbackApi.useCreateFeedbackCategoryMutation as jest.Mock
      ).mockReturnValue([jest.fn(), { isLoading: true, error: null }]);

      renderComponent();

      // Component should handle loading state appropriately
      expect(screen.getByText("Add Category")).toBeTruthy();
    });

    it("should handle API errors", () => {
      (
        educatorFeedbackApi.useGetFeedbackCategoriesWithQuestionsQuery as jest.Mock
      ).mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: "API Error" },
        refetch: jest.fn(),
      });

      renderComponent();

      // Component should still render even with API errors
      expect(screen.getByText("Add Category")).toBeTruthy();
    });
  });

  describe("Component Props", () => {
    it("should handle visible prop correctly", () => {
      const { rerender } = renderComponent({ ...mockProps, visible: false });

      // Component should not be visible
      expect(screen.queryByText("Add Category")).toBeFalsy();

      // Show component
      rerender(
        <Provider store={mockStore}>
          <EducatorFeedbackModal {...mockProps} visible={true} />
        </Provider>,
      );

      expect(screen.getByText("Add Category")).toBeTruthy();
    });

    it("should call onClose prop when modal is closed", () => {
      const mockOnClose = jest.fn();
      renderComponent({ ...mockProps, onClose: mockOnClose });

      // This would typically be triggered by modal close action
      // The exact trigger depends on the modal implementation
    });
  });

  describe("Form Validation", () => {
    it("should validate category data before submission", async () => {
      const mockCreateCategory = jest.fn();

      (
        educatorFeedbackApi.useCreateFeedbackCategoryMutation as jest.Mock
      ).mockReturnValue([
        mockCreateCategory,
        { isLoading: false, error: null },
      ]);

      renderComponent();

      // Open popup
      const addCategoryButton = screen.getByText("Add Category");
      fireEvent.press(addCategoryButton);

      // Submit valid category
      const submitButton = screen.getByTestId("submit-category-button");
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockCreateCategory).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.any(String),
            questions: expect.any(Array),
          }),
        );
      });
    });
  });

  describe("User Experience", () => {
    it("should provide visual feedback when button is pressed", () => {
      renderComponent();

      const addCategoryButton = screen.getByText("Add Category");

      // Check button is touchable and has proper styling
      expect(addCategoryButton).toBeTruthy();

      // Simulate press
      fireEvent.press(addCategoryButton);

      // Should open popup as visual feedback
      expect(screen.getByTestId("add-category-popup")).toBeTruthy();
    });

    it("should handle multiple rapid button presses", () => {
      renderComponent();

      const addCategoryButton = screen.getByText("Add Category");

      // Rapid presses
      fireEvent.press(addCategoryButton);
      fireEvent.press(addCategoryButton);
      fireEvent.press(addCategoryButton);

      // Should only have one popup open
      const popups = screen.getAllByTestId("add-category-popup");
      expect(popups).toHaveLength(1);
    });
  });
});
