import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useGetFeedbackListQuery } from "../../../api/educator-feedback-api";
import FeedbackListComponent from "../../../components/educator-feedback/FeedbackListComponent";
import FeedbackActionModal from "../../../components/educator-feedback/FeedbackActionModal";
import AuthStatusChecker from "../../../components/auth/AuthStatusChecker";
import { TButton } from "../../../components/ui/TButton";
import { TCard } from "../../../components/ui/TCard";

interface SearchFilters {
  search_phrase: string;
  search_filter_list: string[];
}

const EducatorFeedbackManagement: React.FC = () => {
  // Get authentication state from Redux
  const authState = useSelector((state: any) => ({
    token: state.app?.token,
    isAuthenticated: state.app?.isAuthenticated,
    user: state.app?.user,
  }));

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    search_phrase: "",
    search_filter_list: [],
  });
  const [tempSearchPhrase, setTempSearchPhrase] = useState("");

  // Modal state
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Log authentication state
  console.log("🔐 EDUCATOR FEEDBACK MANAGEMENT - Auth State:", {
    timestamp: new Date().toISOString(),
    hasToken: !!authState.token,
    tokenLength: authState.token ? authState.token.length : 0,
    tokenPreview: authState.token
      ? `${authState.token.substring(0, 15)}...`
      : "No token",
    isAuthenticated: authState.isAuthenticated,
    hasUser: !!authState.user,
    userRole: authState.user?.user_category_name || "Unknown",
    userId: authState.user?.id || "Unknown",
  });

  // API call to get feedback list
  const {
    data: feedbackResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetFeedbackListQuery({
    page: currentPage,
    page_size: pageSize,
    search_phrase: searchFilters.search_phrase,
    search_filter_list: searchFilters.search_filter_list,
  });

  // Enhanced debugging for API state
  console.log("🎯 EDUCATOR FEEDBACK MANAGEMENT - API State:", {
    timestamp: new Date().toISOString(),
    apiParams: {
      page: currentPage,
      page_size: pageSize,
      search_phrase: searchFilters.search_phrase,
      search_filter_list: searchFilters.search_filter_list,
    },
    apiState: {
      isLoading,
      isFetching,
      hasError: !!error,
      hasData: !!feedbackResponse,
      dataType: feedbackResponse ? typeof feedbackResponse : null,
    },
    errorDetails: error
      ? {
          message: error.message || "Unknown error",
          status: error.status,
          data: error.data,
          fullError: error,
        }
      : null,
  });

  // Derived state from API response
  const feedbacks = useMemo(() => {
    console.log("🔍 FEEDBACK MANAGEMENT - Processing API Response:", {
      feedbackResponse,
      responseType: typeof feedbackResponse,
      hasData: !!feedbackResponse?.data,
      dataType: feedbackResponse?.data ? typeof feedbackResponse.data : null,
      dataKeys: feedbackResponse?.data
        ? Object.keys(feedbackResponse.data)
        : null,
      feedbacksArray:
        feedbackResponse?.data?.data || feedbackResponse?.data?.feedbacks || [],
    });

    const feedbacksArray =
      feedbackResponse?.data?.data || feedbackResponse?.data?.feedbacks || [];
    console.log("📋 EXTRACTED FEEDBACKS:", {
      count: feedbacksArray.length,
      firstItem: feedbacksArray[0],
    });

    // Log subcategories information for debugging
    if (feedbacksArray.length > 0) {
      console.log("🏷️ SUBCATEGORIES DEBUG:", {
        feedbacksWithSubcategories: feedbacksArray.filter(
          (f: any) => f.subcategories && f.subcategories.length > 0,
        ).length,
        totalSubcategories: feedbacksArray.reduce(
          (total: number, f: any) => total + (f.subcategories?.length || 0),
          0,
        ),
        sampleSubcategories: feedbacksArray[0]?.subcategories || [],
        subcategoriesStructure:
          feedbacksArray[0]?.subcategories?.map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            raw: sub,
          })) || [],
      });
    }

    // Final data verification before returning to UI
    console.log("🎯 MANAGEMENT PAGE - Final Data to UI:", {
      feedbacksArrayLength: feedbacksArray.length,
      firstThreeFeedbacks: feedbacksArray.slice(0, 3).map((f) => ({
        id: f.id,
        studentName: f.student?.full_name,
        subcategoriesCount: f.subcategories?.length || 0,
        hasComments: Array.isArray(f.comments) && f.comments.length > 0,
        hasEvaluations:
          Array.isArray(f.evaluations) && f.evaluations.length > 0,
        allPropertiesPresent: {
          id: !!f.id,
          student: !!f.student,
          category: !!f.category,
          subcategories: Array.isArray(f.subcategories),
          comments: Array.isArray(f.comments),
          evaluations: Array.isArray(f.evaluations),
        },
      })),
      dataIsPassingToFeedbackListComponent: true,
    });

    return feedbacksArray;
  }, [feedbackResponse]);

  const paginationInfo = useMemo(() => {
    if (!feedbackResponse?.data) return undefined;

    const data = feedbackResponse.data;
    const totalPages = Math.ceil(data.total / data.per_page);

    return {
      current_page: data.current_page,
      total_pages: totalPages,
      total_count: data.total,
      page_size: data.per_page,
      has_next: data.current_page < totalPages,
      has_previous: data.current_page > 1,
    };
  }, [feedbackResponse]);

  // Handlers
  const handleSearch = () => {
    setSearchFilters({
      search_phrase: tempSearchPhrase.trim(),
      search_filter_list: [],
    });
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setTempSearchPhrase("");
    setSearchFilters({
      search_phrase: "",
      search_filter_list: [],
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (paginationInfo?.has_next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationInfo?.has_previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemAction = (item: any, action: string) => {
    setSelectedFeedback(item);
    switch (action) {
      case "view":
        setIsActionModalVisible(true);
        break;
      case "edit":
        setIsActionModalVisible(true);
        break;
      case "delete":
        setIsActionModalVisible(true);
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  // Modal handlers
  const handleCloseModal = () => {
    setIsActionModalVisible(false);
    setSelectedFeedback(null);
  };

  const handleEditFeedback = (feedback: any) => {
    handleCloseModal();
    Alert.alert(
      "Edit Feedback",
      `Edit functionality for ${feedback.student.full_name} will be implemented here.`,
      [{ text: "OK" }],
    );
  };

  const handleDeleteFeedback = (feedback: any) => {
    handleCloseModal();
    Alert.alert(
      "Delete Feedback",
      `Are you sure you want to delete feedback for ${feedback.student.full_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement delete functionality
            console.log("Delete feedback:", feedback.id);
            Alert.alert("Success", "Feedback deleted successfully!");
          },
        },
      ],
    );
  };

  const handleViewDetails = (feedback: any) => {
    handleCloseModal();
    Alert.alert(
      "Full Details",
      `Full details view for ${feedback.student.full_name} will be implemented here.`,
      [{ text: "OK" }],
    );
  };

  const handleRefresh = () => {
    refetch();
  };

  // Get error message
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if ("message" in error) return error.message;
    if (
      "data" in error &&
      typeof error.data === "object" &&
      error.data &&
      "message" in error.data
    ) {
      return error.data.message;
    }
    return "An error occurred while loading feedback.";
  };

  // Show authentication warning if not properly authenticated
  if (!authState.isAuthenticated || !authState.token) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authErrorContainer}>
          <MaterialIcons name="lock-outline" size={48} color="#F44336" />
          <Text style={styles.authErrorTitle}>Authentication Required</Text>
          <Text style={styles.authErrorMessage}>
            You need to be logged in to access educator feedback management.
          </Text>
          <View style={styles.debugInfo}>
            <Text style={styles.debugTitle}>🔍 Auth Debug Info:</Text>
            <Text style={styles.debugText}>
              • Has Token: {authState.token ? "Yes" : "No"}
            </Text>
            <Text style={styles.debugText}>
              • Is Authenticated: {authState.isAuthenticated ? "Yes" : "No"}
            </Text>
            <Text style={styles.debugText}>
              • Has User: {authState.user ? "Yes" : "No"}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Educator Feedback Management</Text>
        <Text style={styles.subtitle}>
          Manage and review all educator feedback submissions
        </Text>
        {/* Debug Data Status */}
        <View style={styles.dataStatus}>
          <Text style={styles.dataStatusText}>
            📊 Data Status:{" "}
            {isLoading
              ? "Loading..."
              : error
                ? "Error"
                : feedbacks.length > 0
                  ? `${feedbacks.length} items`
                  : "No data"}
          </Text>
          {feedbacks.length > 0 && (
            <Text style={styles.subcategoriesStatus}>
              🏷️ Subcategories:{" "}
              {
                feedbacks.filter(
                  (f) => f.subcategories && f.subcategories.length > 0,
                ).length
              }{" "}
              items have subcategories
            </Text>
          )}
        </View>
        {/* Auth Status */}
        <View style={styles.authStatus}>
          <Text style={styles.authStatusText}>
            🔐 Auth: {authState.isAuthenticated ? "✅ Valid" : "❌ Invalid"} |
            Token: {authState.token ? "✅ Present" : "❌ Missing"} | User:{" "}
            {authState.user?.user_category_name || "Unknown"}
          </Text>
        </View>
      </View>

      {/* Authentication Status Checker */}
      <View style={styles.authSection}>
        <AuthStatusChecker
          showFullStatus={false}
          onAuthenticationRequired={() => {
            Alert.alert(
              "Authentication Required",
              "Please log out and log back in to refresh your session.",
              [{ text: "OK" }],
            );
          }}
        />
      </View>

      {/* Search Section */}
      <TCard style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search feedback by student name, admission number, or category..."
              value={tempSearchPhrase}
              onChangeText={setTempSearchPhrase}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {tempSearchPhrase.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearButton}
              >
                <MaterialIcons name="clear" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          <TButton
            title="Search"
            variant="primary"
            onPress={handleSearch}
            style={styles.searchButton}
            loading={isFetching}
          />
        </View>

        {/* Active Search Indicator */}
        {searchFilters.search_phrase && (
          <View style={styles.activeSearchContainer}>
            <MaterialIcons name="search" size={16} color="#920734" />
            <Text style={styles.activeSearchText}>
              Searching for: &ldquo;{searchFilters.search_phrase}&rdquo;
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <MaterialIcons name="close" size={16} color="#920734" />
            </TouchableOpacity>
          </View>
        )}
      </TCard>

      {/* Statistics */}
      {paginationInfo && (
        <TCard style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {paginationInfo.total_count}
              </Text>
              <Text style={styles.statLabel}>Total Feedback</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {paginationInfo.current_page}
              </Text>
              <Text style={styles.statLabel}>Current Page</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {paginationInfo.total_pages}
              </Text>
              <Text style={styles.statLabel}>Total Pages</Text>
            </View>
          </View>
        </TCard>
      )}

      {/* Feedback List */}
      <View style={styles.listContainer}>
        <FeedbackListComponent
          feedbacks={feedbacks}
          pagination={paginationInfo}
          isLoading={isLoading}
          error={getErrorMessage()}
          onRefresh={handleRefresh}
          refreshing={isFetching}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onPageChange={handlePageChange}
          onItemAction={handleItemAction}
          showPagination={true}
          showActions={true}
          showEducatorInfo={true}
          emptyMessage={
            searchFilters.search_phrase
              ? `No feedback found for "${searchFilters.search_phrase}". Try a different search term.`
              : "No educator feedback found. Feedback will appear here once educators start submitting evaluations."
          }
        />
      </View>

      {/* Loading Overlay */}
      {isLoading && feedbacks.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#920734" />
          <Text style={styles.loadingText}>Loading feedback data...</Text>
        </View>
      )}

      {/* Action Modal */}
      <FeedbackActionModal
        visible={isActionModalVisible}
        feedback={selectedFeedback}
        onClose={handleCloseModal}
        onEdit={handleEditFeedback}
        onDelete={handleDeleteFeedback}
        onViewDetails={handleViewDetails}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  dataStatus: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#F0F8FF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#920734",
  },
  dataStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#920734",
    marginBottom: 2,
  },
  subcategoriesStatus: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
  },
  authStatus: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#F0F8FF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  authStatusText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#2196F3",
  },
  authErrorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  authErrorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  authErrorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  debugInfo: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FFEAA7",
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 6,
  },
  debugText: {
    fontSize: 10,
    color: "#856404",
    marginBottom: 2,
  },
  authSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    minWidth: 80,
  },
  activeSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
    gap: 8,
  },
  activeSearchText: {
    flex: 1,
    fontSize: 14,
    color: "#920734",
    fontWeight: "500",
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#920734",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
  listContainer: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default EducatorFeedbackManagement;
