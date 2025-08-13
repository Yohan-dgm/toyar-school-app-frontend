import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGetAllStudentsWithPaginationQuery } from "../../../../../api/educator-feedback-api";
import {
  GRADE_LEVELS,
  getGradesByCategory,
} from "../../../../../constants/gradeLevels";

// Profile picture utility imports
import {
  getStudentProfilePicture,
  getLocalFallbackProfileImage,
} from "../../../../../utils/studentProfileUtils";
import { getHouseProfileColor } from "../../../../../constants/schoolHouses";

// Helper function to extract house name from student data
const getStudentHouseName = (student: any): string | null => {
  if (!student.school_house) return null;

  // Handle both string and object formats
  if (typeof student.school_house === "string") {
    return student.school_house;
  } else if (
    typeof student.school_house === "object" &&
    student.school_house.name
  ) {
    return student.school_house.name;
  }

  return null;
};

const StudentsModalContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedStudents, setExpandedStudents] = useState<Set<number>>(
    new Set(),
  );
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | null>(
    null,
  );
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<string | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchPhrase);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchPhrase]);

  // Reset to first page when grade filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGradeFilter]);

  // Reset to first page when house filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedHouseFilter]);

  // API call for students with proper pagination
  const {
    data: studentsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllStudentsWithPaginationQuery({
    page: 1,
    page_size: 10000, // Fetch all students for client-side pagination
    search_phrase: debouncedSearch,
    search_filter_list: [],
  });

  // Extract data from API response - handle different response structures
  const responseData = studentsResponse?.data || studentsResponse;
  const allStudents = responseData?.students || responseData?.data || [];

  // Extract unique houses from students data
  const uniqueHouses = useMemo(() => {
    const houses = new Set<string>();
    allStudents.forEach((student: any) => {
      const houseName = getStudentHouseName(student);
      if (houseName && houseName.trim()) {
        houses.add(houseName.trim());
      }
    });
    return Array.from(houses).sort();
  }, [allStudents]);

  // Filter students by search, grade, and house
  const filteredStudents = useMemo(() => {
    let filtered = allStudents;

    // Apply search filter
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (student: any) =>
          student.full_name?.toLowerCase().includes(searchLower) ||
          student.admission_number?.toLowerCase().includes(searchLower) ||
          student.student_calling_name?.toLowerCase().includes(searchLower),
      );
    }

    // Apply grade filter
    if (selectedGradeFilter !== null) {
      filtered = filtered.filter(
        (student: any) => student.grade_level_id === selectedGradeFilter,
      );
    }

    // Apply house filter
    if (selectedHouseFilter !== null) {
      filtered = filtered.filter((student: any) => {
        const houseName = getStudentHouseName(student);
        return houseName && houseName.trim() === selectedHouseFilter;
      });
    }

    return filtered;
  }, [allStudents, debouncedSearch, selectedGradeFilter, selectedHouseFilter]);

  // Client-side pagination for filtered data
  const pageSize = 10;
  const totalCount = filteredStudents.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate start and end indexes for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the filtered data for current page
  const students = filteredStudents.slice(startIndex, endIndex);

  // Calculate pagination states
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Use calculated pagination data
  const actualTotalCount = totalCount;
  const actualTotalPages = totalPages;
  const actualHasNextPage = hasNextPage;
  const actualHasPreviousPage = hasPreviousPage;

  // Debug logging for pagination
  console.log("🔍 StudentsModal Pagination Debug:", {
    currentPage,
    allStudentsCount: allStudents.length,
    displayedStudentsCount: students.length,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    searchPhrase: debouncedSearch,
    startIndex,
    endIndex,
    pageSize,
  });

  // Pagination handlers
  const handlePreviousPage = () => {
    if (actualHasPreviousPage && currentPage > 1) {
      console.log(`📖 Going to previous page: ${currentPage - 1}`);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (actualHasNextPage && currentPage < actualTotalPages) {
      console.log(`📖 Going to next page: ${currentPage + 1}`);
      setCurrentPage(currentPage + 1);
    }
  };

  const handleJumpToPage = () => {
    Alert.prompt(
      "Jump to Page",
      `Enter page number (1-${actualTotalPages}):`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go",
          onPress: (value) => {
            const pageNum = parseInt(value || "1", 10);
            if (pageNum >= 1 && pageNum <= actualTotalPages) {
              console.log(`📖 Jumping to page: ${pageNum}`);
              setCurrentPage(pageNum);
            } else {
              Alert.alert(
                "Invalid Page",
                `Please enter a page number between 1 and ${actualTotalPages}`,
              );
            }
          },
        },
      ],
      "plain-text",
      currentPage.toString(),
    );
  };

  // Toggle student expansion
  const toggleStudentExpansion = (studentId: number) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
  };

  // Filter handlers
  const handleGradeFilter = (gradeId: number | null) => {
    setSelectedGradeFilter(gradeId);
  };

  const handleHouseFilter = (house: string | null) => {
    setSelectedHouseFilter(house);
  };

  const clearAllFilters = () => {
    setSelectedGradeFilter(null);
    setSelectedHouseFilter(null);
    setSearchPhrase("");
  };

  const renderStudentItem = ({ item: student }: { item: any }) => {
    const isExpanded = expandedStudents.has(student.id);

    // Get student profile image using utility function
    const profileImageSource =
      getStudentProfilePicture(student) || getLocalFallbackProfileImage();

    // Debug house data and color
    const houseName = getStudentHouseName(student);
    const houseColor = getHouseProfileColor(student.school_house);
    console.log(`🏠 Student ${student.full_name}:`, {
      rawHouseData: student.school_house,
      extractedHouseName: houseName,
      borderColor: houseColor,
    });

    return (
      <View style={styles.studentContainer}>
        <TouchableOpacity
          style={styles.studentListItem}
          onPress={() => toggleStudentExpansion(student.id)}
        >
          {/* Profile Image */}
          <Image
            source={profileImageSource}
            style={[
              styles.studentAvatar,
              {
                borderColor: getHouseProfileColor(student.school_house),
              },
            ]}
            onError={() => console.log("Failed to load profile image")}
          />

          {/* Student Information */}
          <View style={styles.studentListInfo}>
            <Text style={styles.studentNameList}>{student.full_name}</Text>
            <Text style={styles.studentAdmissionNumber}>
              {student.admission_number}
            </Text>
            <Text style={styles.studentGradeHouse}>
              {student.grade_level?.name || `Grade ${student.grade_level_id}`} •{" "}
              {getStudentHouseName(student) || "No House"}
            </Text>
          </View>

          {/* Chevron */}
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={24}
            color="#920734"
          />
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Large Profile Image Section */}
            <View style={styles.largeProfileSection}>
              {/* <Text style={styles.debugText}>Profile Section</Text> */}
              <View style={styles.profileImageContainer}>
                <Image
                  source={profileImageSource}
                  style={[
                    styles.largeProfileImage,
                    {
                      borderColor: getHouseProfileColor(student.school_house),
                    },
                  ]}
                  defaultSource={getLocalFallbackProfileImage()}
                  onError={(error) => {
                    console.log("Failed to load large profile image:", error);
                    console.log("Profile image source:", profileImageSource);
                  }}
                  onLoad={() => {
                    console.log("Large profile image loaded successfully");
                  }}
                />
              </View>
              <Text style={styles.largeProfileName}>{student.full_name}</Text>
              <Text style={styles.largeProfileDetails}>
                {student.admission_number} •{" "}
                {student.grade_level?.name || `Grade ${student.grade_level_id}`}
              </Text>
            </View>
            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name with Title:</Text>
                <Text style={styles.detailValue}>
                  {student.full_name_with_title || student.full_name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Calling Name:</Text>
                <Text style={styles.detailValue}>
                  {student.student_calling_name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender:</Text>
                <Text style={styles.detailValue}>
                  {student.gender || "Not specified"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date of Birth:</Text>
                <Text style={styles.detailValue}>
                  {student.date_of_birth || "Not specified"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Blood Group:</Text>
                <Text style={styles.detailValue}>
                  {student.blood_group || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>
                  {student.student_phone || "Not provided"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>
                  {student.student_email || "Not provided"}
                </Text>
              </View>
              {student.student_address && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>
                    {student.student_address.replace(/<[^>]*>/g, "")}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Academic Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Joined Date:</Text>
                <Text style={styles.detailValue}>
                  {student.joined_date || "Not specified"}
                </Text>
              </View>
              {student.school_studied_before && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Previous School:</Text>
                  <Text style={styles.detailValue}>
                    {student.school_studied_before}
                  </Text>
                </View>
              )}
              {student.special_health_conditions && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Health Conditions:</Text>
                  <Text style={styles.detailValue}>
                    {student.special_health_conditions.replace(/<[^>]*>/g, "")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
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

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color="#F44336" />
      <Text style={styles.errorTitle}>Failed to Load Students</Text>
      <Text style={styles.errorText}>
        {error && typeof error === "object" && "message" in error
          ? (error as any).message
          : "Please check your internet connection and try again."}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <MaterialIcons name="refresh" size={20} color="white" />
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGradeFilter = () => {
    const earlyYears = getGradesByCategory("early_years");
    const primary = getGradesByCategory("primary");
    const secondary = getGradesByCategory("secondary");

    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter by Grade</Text>
          {(selectedGradeFilter !== null ||
            selectedHouseFilter !== null ||
            searchPhrase) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <MaterialIcons name="clear" size={16} color="#920734" />
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gradeFilterScroll}
          contentContainerStyle={styles.gradeFilterContent}
        >
          {/* All Grades */}
          <TouchableOpacity
            style={[
              styles.gradeFilterChip,
              selectedGradeFilter === null && styles.gradeFilterChipSelected,
            ]}
            onPress={() => handleGradeFilter(null)}
          >
            <MaterialIcons
              name="dashboard"
              size={12}
              color={selectedGradeFilter === null ? "#FFFFFF" : "#920734"}
            />
            <Text
              style={[
                styles.gradeFilterChipText,
                selectedGradeFilter === null &&
                  styles.gradeFilterChipTextSelected,
              ]}
            >
              All Grades
            </Text>
          </TouchableOpacity>

          {/* Early Years */}
          {earlyYears.map((grade) => (
            <TouchableOpacity
              key={grade.id}
              style={[
                styles.gradeFilterChip,
                selectedGradeFilter === grade.id &&
                  styles.gradeFilterChipSelected,
              ]}
              onPress={() => handleGradeFilter(grade.id)}
            >
              <MaterialIcons
                name="child-care"
                size={12}
                color={selectedGradeFilter === grade.id ? "#FFFFFF" : "#920734"}
              />
              <Text
                style={[
                  styles.gradeFilterChipText,
                  selectedGradeFilter === grade.id &&
                    styles.gradeFilterChipTextSelected,
                ]}
              >
                {grade.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Primary Grades */}
          {primary.map((grade) => (
            <TouchableOpacity
              key={grade.id}
              style={[
                styles.gradeFilterChip,
                selectedGradeFilter === grade.id &&
                  styles.gradeFilterChipSelected,
              ]}
              onPress={() => handleGradeFilter(grade.id)}
            >
              <MaterialIcons
                name="school"
                size={12}
                color={selectedGradeFilter === grade.id ? "#FFFFFF" : "#920734"}
              />
              <Text
                style={[
                  styles.gradeFilterChipText,
                  selectedGradeFilter === grade.id &&
                    styles.gradeFilterChipTextSelected,
                ]}
              >
                {grade.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Secondary Grades */}
          {secondary.map((grade) => (
            <TouchableOpacity
              key={grade.id}
              style={[
                styles.gradeFilterChip,
                selectedGradeFilter === grade.id &&
                  styles.gradeFilterChipSelected,
              ]}
              onPress={() => handleGradeFilter(grade.id)}
            >
              <MaterialIcons
                name="account-balance"
                size={12}
                color={selectedGradeFilter === grade.id ? "#FFFFFF" : "#920734"}
              />
              <Text
                style={[
                  styles.gradeFilterChipText,
                  selectedGradeFilter === grade.id &&
                    styles.gradeFilterChipTextSelected,
                ]}
              >
                {grade.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderHouseFilter = () => {
    if (uniqueHouses.length === 0) return null;

    return (
      <View style={styles.houseFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.houseFilterScroll}
          contentContainerStyle={styles.houseFilterContent}
        >
          {/* All Houses */}
          <TouchableOpacity
            style={[
              styles.houseFilterChip,
              selectedHouseFilter === null && styles.houseFilterChipSelected,
            ]}
            onPress={() => handleHouseFilter(null)}
          >
            <MaterialIcons
              name="home"
              size={12}
              color={selectedHouseFilter === null ? "#FFFFFF" : "#920734"}
            />
            <Text
              style={[
                styles.houseFilterChipText,
                selectedHouseFilter === null &&
                  styles.houseFilterChipTextSelected,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {/* Individual Houses */}
          {uniqueHouses.map((house) => (
            <TouchableOpacity
              key={house}
              style={[
                styles.houseFilterChip,
                selectedHouseFilter === house && styles.houseFilterChipSelected,
              ]}
              onPress={() => handleHouseFilter(house)}
            >
              <MaterialIcons
                name="business"
                size={12}
                color={selectedHouseFilter === house ? "#FFFFFF" : "#920734"}
              />
              <Text
                style={[
                  styles.houseFilterChipText,
                  selectedHouseFilter === house &&
                    styles.houseFilterChipTextSelected,
                ]}
              >
                {house}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>All Students</Text>
        <Text style={styles.headerSubtitle}>
          {!isLoading && actualTotalCount > 0
            ? `Page ${currentPage} of ${actualTotalPages} - Showing ${students.length} of ${actualTotalCount} students${debouncedSearch ? ` (search: "${debouncedSearch}")` : ""}`
            : isLoading
              ? "Loading students..."
              : "No students found"}
        </Text>
      </View> */}

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

      {/* Grade Filter */}
      {renderGradeFilter()}

      {/* Pagination Info */}
      {/* <View style={styles.paginationInfo}> */}
      {/* <View style={styles.paginationInfoRow}>
          <MaterialIcons name="group" size={16} color="#2196F3" />
          <Text style={styles.paginationText}>
            {actualTotalCount > 0
              ? `Showing ${students.length} of ${actualTotalCount} students`
              : "No students found"}
          </Text>
        </View> */}
      {/* {actualTotalPages > 1 && (
          <View style={styles.paginationInfoRow}>
            <MaterialIcons name="layers" size={16} color="#666" />
            <Text style={styles.paginationSubText}>
              Page {currentPage} of {actualTotalPages}
            </Text>
          </View>
        )} */}
      {/* </View> */}

      {/* Students List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#920734" />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.studentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            students.length === 0 ? styles.emptyListContainer : undefined
          }
        />
      )}

      {/* House Filter at Bottom */}
      {renderHouseFilter()}

      {/* Pagination - EducatorFeedbackModal Style */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            !actualHasPreviousPage && styles.disabledButton,
          ]}
          onPress={handlePreviousPage}
          disabled={!actualHasPreviousPage}
        >
          <MaterialIcons
            name="chevron-left"
            size={20}
            color={!actualHasPreviousPage ? "#CCC" : "#920734"}
          />
          <Text
            style={[
              styles.paginationText,
              !actualHasPreviousPage && styles.disabledText,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} of {actualTotalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            !actualHasNextPage && styles.disabledButton,
          ]}
          onPress={handleNextPage}
          disabled={!actualHasNextPage}
        >
          <Text
            style={[
              styles.paginationText,
              !actualHasNextPage && styles.disabledText,
            ]}
          >
            Next
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={!actualHasNextPage ? "#CCC" : "#920734"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FAFAFA",
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 8,
    fontWeight: "500",
  },
  clearSearchButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  // Grade Filter Styles
  filterContainer: {
    marginBottom: 8,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  clearFiltersText: {
    fontSize: 10,
    color: "#920734",
    fontWeight: "600",
    marginLeft: 2,
  },
  gradeFilterScroll: {
    flexGrow: 0,
  },
  gradeFilterContent: {
    paddingRight: 8,
  },
  gradeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 6,
    minHeight: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  gradeFilterChipSelected: {
    backgroundColor: "#920734",
    borderColor: "#920734",
    shadowColor: "#920734",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  gradeFilterChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
    marginLeft: 4,
  },
  gradeFilterChipTextSelected: {
    color: "#FFFFFF",
  },
  // House Filter Styles
  houseFilterContainer: {
    marginBottom: 6,
    paddingVertical: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  houseFilterScroll: {
    flexGrow: 0,
  },
  houseFilterContent: {
    paddingHorizontal: 8,
  },
  houseFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
    minHeight: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  houseFilterChipSelected: {
    backgroundColor: "#920734",
    borderColor: "#920734",
    shadowColor: "#920734",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  houseFilterChipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#920734",
    marginLeft: 2,
  },
  houseFilterChipTextSelected: {
    color: "#FFFFFF",
  },
  paginationInfo: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  paginationInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  paginationText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginLeft: 8,
  },
  paginationSubText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  studentsList: {
    flex: 1,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  studentContainer: {
    marginBottom: 6,
  },
  studentListItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0F2FE",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB", // Default, will be overridden dynamically
  },
  studentListInfo: {
    flex: 1,
    paddingRight: 8,
  },
  studentNameList: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
    lineHeight: 18,
  },
  studentAdmissionNumber: {
    fontSize: 12,
    color: "#920734",
    fontWeight: "600",
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  studentGradeHouse: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  expandedContent: {
    backgroundColor: "#F8FAFC",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 20,
    marginTop: -8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E2E8F0",
  },
  largeProfileSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  profileImageContainer: {
    marginBottom: 16,
    padding: 4,
    backgroundColor: "#F0F9FF",
    borderRadius: 64,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  largeProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0F2FE",
    borderWidth: 4,
    borderColor: "#E5E7EB", // Default, will be overridden dynamically
  },
  largeProfileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "center",
  },
  largeProfileDetails: {
    fontSize: 14,
    color: "#920734",
    fontWeight: "600",
    textAlign: "center",
  },
  debugText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    backgroundColor: "#FFCCCC",
    padding: 4,
    borderRadius: 4,
  },
  expandedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    width: 140,
  },
  detailValue: {
    fontSize: 14,
    color: "#1E293B",
    flex: 1,
    fontWeight: "500",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 6,
  },
  disabledButton: {
    borderColor: "#CCC",
    backgroundColor: "#F9F9F9",
  },
  paginationText: {
    fontSize: 14,
    color: "#920734",
    fontWeight: "600",
  },
  disabledText: {
    color: "#CCC",
  },
  pageInfo: {
    alignItems: "center",
  },
  pageText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
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

export default StudentsModalContent;
