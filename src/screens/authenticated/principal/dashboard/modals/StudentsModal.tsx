import React, { forwardRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { useGetAllStudentsWithPaginationQuery } from "../../../../../api/educator-feedback-api";

const StudentsModal = forwardRef<Modalize>((_, ref) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search input and reset page when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchPhrase);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchPhrase]);

  // API call for students with proper pagination
  const {
    data: studentsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllStudentsWithPaginationQuery({
    page: currentPage,
    page_size: pageSize, // Match backend's actual page size (10)
    search_phrase: debouncedSearch,
    search_filter_list: [],
  });

  // Extract data from API response - handle different response structures
  const responseData = studentsResponse?.data || studentsResponse;
  const students = responseData?.students || responseData?.data || [];
  const totalCount = responseData?.total_count || 0;
  const totalPages =
    responseData?.total_pages ||
    (totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1);
  const hasNextPage =
    responseData?.has_next_page === true ||
    (totalCount > 0 && currentPage < totalPages);
  const hasPreviousPage =
    responseData?.has_previous_page === true || currentPage > 1;

  // Debug logging
  console.log("StudentsModal Debug:", {
    currentPage,
    pageSize,
    studentsCount: students.length,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    responseData,
  });

  // No need for client-side filtering since API handles search
  const filteredStudents = students;

  // Pagination navigation functions
  const handlePreviousPage = () => {
    if (hasPreviousPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleJumpToPage = () => {
    Alert.prompt(
      "Jump to Page",
      `Enter page number (1-${totalPages}):`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go",
          onPress: (value) => {
            const pageNum = parseInt(value || "1", 10);
            if (pageNum >= 1 && pageNum <= totalPages) {
              setCurrentPage(pageNum);
            } else {
              Alert.alert(
                "Invalid Page",
                `Please enter a page number between 1 and ${totalPages}`,
              );
            }
          },
        },
      ],
      "plain-text",
      currentPage.toString(),
    );
  };

  const renderStudentItem = ({ item: student }: { item: any }) => (
    <View style={styles.studentCard}>
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: student.profile_image || student.profileImage,
          }}
          style={styles.profileImage}
          onError={() => console.log("Failed to load profile image")}
        />
      </View>

      {/* Student Information */}
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.full_name}</Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="school" size={16} color="#666" />
          <Text style={styles.infoText}>
            {student.grade_level?.name || `Grade ${student.grade_level_id}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="badge" size={16} color="#666" />
          <Text style={styles.infoText}>{student.admission_number}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="home" size={16} color="#666" />
          <Text style={styles.infoText}>
            {student.school_house?.name || "No House Assigned"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#F44336" />
          <Text style={styles.errorTitle}>Failed to Load Students</Text>
          <Text style={styles.errorText}>
            {error && typeof error === "object" && "message" in error
              ? (error as any).message
              : "Please check your internet connection and try again."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <MaterialIcons name="refresh" size={20} color="white" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="school" size={48} color="#ccc" />
          <Text style={styles.emptyTitle}>No Students Found</Text>
          <Text style={styles.emptyText}>
            {searchPhrase
              ? "Try adjusting your search terms."
              : "No students available."}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                !hasPreviousPage && styles.navButtonDisabled,
              ]}
              onPress={handlePreviousPage}
              disabled={!hasPreviousPage}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={hasPreviousPage ? "#2196F3" : "#ccc"}
              />
              <Text
                style={[
                  styles.navButtonText,
                  !hasPreviousPage && styles.navButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleJumpToPage}
              style={styles.pageIndicator}
            >
              <Text style={styles.pageText}>{currentPage}</Text>
              <Text style={styles.pageTotal}>of {totalPages}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                !hasNextPage && styles.navButtonDisabled,
              ]}
              onPress={handleNextPage}
              disabled={!hasNextPage}
            >
              <Text
                style={[
                  styles.navButtonText,
                  !hasNextPage && styles.navButtonTextDisabled,
                ]}
              >
                Next
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={hasNextPage ? "#2196F3" : "#ccc"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modalize
      ref={ref}
      modalTopOffset={0}
      modalHeight={999999}
      adjustToContentHeight={false}
      modalStyle={styles.modal}
      rootStyle={styles.modalRoot}
      HeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="school" size={24} color="#2196F3" />
            <Text style={styles.headerTitle}>All Students</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {!isLoading && totalCount > 0
              ? `Page ${currentPage} of ${totalPages} - Showing ${filteredStudents.length} of ${totalCount} students${debouncedSearch ? ` (search: "${debouncedSearch}")` : ""}`
              : isLoading
                ? "Loading students..."
                : "No students found"}
          </Text>
        </View>
      }
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            placeholderTextColor="#999"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
          />
          {searchPhrase.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchPhrase("")}
              style={styles.clearSearchButton}
            >
              <MaterialIcons name="clear" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Student List */}
        <View style={styles.studentListSection}>{renderContent()}</View>
      </View>
    </Modalize>
  );
});

const styles = StyleSheet.create({
  modalRoot: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    height: "100%",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 99999,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 36,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  clearSearchButton: {
    padding: 4,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  jumpButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  jumpButtonText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
    marginLeft: 4,
  },
  studentListSection: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  studentCardContainer: {
    alignItems: "center",
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    minWidth: 80,
  },
  navButtonDisabled: {
    backgroundColor: "#f5f5f5",
  },
  navButtonText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  navButtonTextDisabled: {
    color: "#ccc",
  },
  pageIndicator: {
    alignItems: "center",
  },
  pageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  pageTotal: {
    fontSize: 14,
    color: "#666",
  },
  // Loading, Error, and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F44336",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default StudentsModal;
