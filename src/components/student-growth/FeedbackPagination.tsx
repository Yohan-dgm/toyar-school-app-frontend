import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { modernColors, maroonTheme } from "../../data/studentGrowthData";

interface FeedbackPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  isLoading?: boolean;
}

const FeedbackPagination: React.FC<FeedbackPaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPreviousPage,
  onNextPage,
  isLoading = false,
}) => {
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  if (totalRecords === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Records info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Showing {startRecord}-{endRecord} of {totalRecords} feedback records
        </Text>
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.previousButton,
            !canGoPrevious && styles.disabledButton,
          ]}
          onPress={onPreviousPage}
          disabled={!canGoPrevious}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="chevron-left"
            size={20}
            color={canGoPrevious ? "#FFFFFF" : modernColors.textSecondary}
          />
          <Text
            style={[
              styles.navButtonText,
              !canGoPrevious && styles.disabledButtonText,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>{currentPage}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !canGoNext && styles.disabledButton,
          ]}
          onPress={onNextPage}
          disabled={!canGoNext}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navButtonText,
              !canGoNext && styles.disabledButtonText,
            ]}
          >
            Next
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={canGoNext ? "#FFFFFF" : modernColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: modernColors.surface,
    borderTopWidth: 1,
    borderTopColor: modernColors.backgroundSecondary,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: modernColors.textSecondary,
    marginBottom: 4,
  },
  pageInfo: {
    fontSize: 12,
    color: modernColors.textSecondary,
    fontWeight: "500",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: maroonTheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    justifyContent: "center",
  },
  previousButton: {
    // Specific styling for previous button if needed
  },
  nextButton: {
    // Specific styling for next button if needed
  },
  disabledButton: {
    backgroundColor: modernColors.backgroundSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginHorizontal: 4,
  },
  disabledButtonText: {
    color: modernColors.textSecondary,
  },
  pageIndicator: {
    backgroundColor: modernColors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: maroonTheme.primary + "30",
  },
  pageIndicatorText: {
    fontSize: 16,
    fontWeight: "700",
    color: maroonTheme.primary,
    minWidth: 20,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: maroonTheme.primary,
    marginHorizontal: 2,
    opacity: 0.4,
  },
  loadingDotDelay1: {
    opacity: 0.7,
  },
  loadingDotDelay2: {
    opacity: 1,
  },
});

export default FeedbackPagination;
