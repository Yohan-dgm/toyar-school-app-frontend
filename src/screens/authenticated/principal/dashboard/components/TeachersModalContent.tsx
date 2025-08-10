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
import { useGetAllTeachersWithPaginationQuery } from "../../../../../api/teacher-api";

const TeachersModalContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedTeachers, setExpandedTeachers] = useState<Set<number>>(
    new Set()
  );
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string | null>(
    null
  );
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<
    string | null
  >(null);
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

  // Reset to first page when subject filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubjectFilter]);

  // API call for teachers with proper pagination
  const {
    data: teachersResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllTeachersWithPaginationQuery({
    page: 1,
    page_size: 10000, // Fetch all teachers for client-side pagination
    search_phrase: debouncedSearch,
    search_filter_list: [],
  });

  // Extract data from API response - handle different response structures
  const responseData = teachersResponse?.data || teachersResponse;
  const allTeachers = responseData?.teachers || responseData?.data || [];

  // Extract unique educator grades from teachers data
  const uniqueEducatorGrades = useMemo(() => {
    const grades = new Set<string>();
    allTeachers.forEach((teacher: any) => {
      if (
        teacher.educator_grade &&
        typeof teacher.educator_grade === "string" &&
        teacher.educator_grade.trim()
      ) {
        grades.add(teacher.educator_grade.trim());
      }
    });
    return Array.from(grades).sort();
  }, [allTeachers]);

  // Extract unique subjects from teachers data
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    allTeachers.forEach((teacher: any) => {
      if (teacher.subject_names && Array.isArray(teacher.subject_names)) {
        teacher.subject_names.forEach((subject: string) => {
          if (subject && subject.trim()) {
            subjects.add(subject.trim());
          }
        });
      }
    });
    return Array.from(subjects).sort();
  }, [allTeachers]);

  // Filter teachers by search, grade, and subject
  const filteredTeachers = useMemo(() => {
    let filtered = allTeachers;

    // Apply search filter
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (teacher: any) =>
          teacher.full_name?.toLowerCase().includes(searchLower) ||
          teacher.full_name_with_title?.toLowerCase().includes(searchLower) ||
          teacher.calling_name?.toLowerCase().includes(searchLower) ||
          teacher.employee_number?.toLowerCase().includes(searchLower) ||
          teacher.email?.toLowerCase().includes(searchLower) ||
          teacher.designation?.toLowerCase().includes(searchLower)
      );
    }

    // Apply educator grade filter
    if (selectedGradeFilter !== null) {
      filtered = filtered.filter(
        (teacher: any) => teacher.educator_grade === selectedGradeFilter
      );
    }

    // Apply subject filter
    if (selectedSubjectFilter !== null) {
      filtered = filtered.filter(
        (teacher: any) =>
          teacher.subject_names &&
          Array.isArray(teacher.subject_names) &&
          teacher.subject_names.includes(selectedSubjectFilter)
      );
    }

    return filtered;
  }, [
    allTeachers,
    debouncedSearch,
    selectedGradeFilter,
    selectedSubjectFilter,
  ]);

  // Client-side pagination for filtered data
  const pageSize = 10;
  const totalCount = filteredTeachers.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate start and end indexes for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the filtered data for current page
  const teachers = filteredTeachers.slice(startIndex, endIndex);

  // Calculate pagination states
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Use calculated pagination data
  const actualTotalCount = totalCount;
  const actualTotalPages = totalPages;
  const actualHasNextPage = hasNextPage;
  const actualHasPreviousPage = hasPreviousPage;

  // Debug logging for pagination
  console.log("🔍 TeachersModal Pagination Debug:", {
    currentPage,
    allTeachersCount: allTeachers.length,
    displayedTeachersCount: teachers.length,
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
                `Please enter a page number between 1 and ${actualTotalPages}`
              );
            }
          },
        },
      ],
      "plain-text",
      currentPage.toString()
    );
  };

  // Toggle teacher expansion
  const toggleTeacherExpansion = (teacherId: number) => {
    const newExpanded = new Set(expandedTeachers);
    if (newExpanded.has(teacherId)) {
      newExpanded.delete(teacherId);
    } else {
      newExpanded.add(teacherId);
    }
    setExpandedTeachers(newExpanded);
  };

  // Filter handlers
  const handleGradeFilter = (grade: string | null) => {
    setSelectedGradeFilter(grade);
  };

  const handleSubjectFilter = (subject: string | null) => {
    setSelectedSubjectFilter(subject);
  };

  const clearAllFilters = () => {
    setSelectedGradeFilter(null);
    setSelectedSubjectFilter(null);
    setSearchPhrase("");
  };

  const handleImageError = (teacherId: number) => {
    setFailedImages((prev) => new Set([...prev, teacherId]));
  };

  const renderTeacherItem = ({ item: teacher }: { item: any }) => {
    const isExpanded = expandedTeachers.has(teacher.id);
    const hasValidImage =
      teacher.profile_image_url &&
      teacher.profile_image_url.trim() !== "" &&
      !failedImages.has(teacher.id);

    return (
      <View style={styles.teacherContainer}>
        <TouchableOpacity
          style={styles.teacherListItem}
          onPress={() => toggleTeacherExpansion(teacher.id)}
          activeOpacity={0.7}
        >
          {/* Profile Image */}
          <View style={styles.teacherAvatar}>
            {hasValidImage ? (
              <Image
                source={{ uri: teacher.profile_image_url }}
                style={styles.teacherAvatarImage}
                resizeMode="cover"
                onError={() => handleImageError(teacher.id)}
              />
            ) : (
              <MaterialIcons name="person" size={20} color="#920734" />
            )}
          </View>

          {/* Teacher Info */}
          <View style={styles.teacherListInfo}>
            <Text style={styles.teacherNameList}>
              {teacher.full_name_with_title || teacher.full_name}
            </Text>
            <Text style={styles.teacherEmployeeNumber}>
              {teacher.employee_number} | {teacher.educator_grade}
            </Text>
            <Text style={styles.teacherDesignation}>{teacher.designation}</Text>
            {teacher.subjects && teacher.subjects.length > 0 && (
              <Text style={styles.teacherSubjects}>
                Subjects: {teacher.subject_names.slice(0, 2).join(", ")}
                {teacher.subject_names.length > 2 &&
                  ` +${teacher.subject_names.length - 2} more`}
              </Text>
            )}
          </View>

          {/* Expand/Collapse Icon */}
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={20}
            color="#920734"
          />
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>
                  {teacher.email || "Not provided"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>
                  {teacher.phone || "Not provided"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender:</Text>
                <Text style={styles.detailValue}>
                  {teacher.gender || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Employee Type:</Text>
                <Text style={styles.detailValue}>{teacher.employee_type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Joined Date:</Text>
                <Text style={styles.detailValue}>
                  {teacher.joined_date
                    ? new Date(teacher.joined_date).toLocaleDateString()
                    : "Not specified"}
                </Text>
              </View>
            </View>

            {teacher.subjects && teacher.subjects.length > 0 && (
              <View style={styles.expandedSection}>
                <Text style={styles.sectionTitle}>Subjects Taught</Text>
                {teacher.subjects.map((subject: any, index: number) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{subject.name}:</Text>
                    <Text style={styles.detailValue}>
                      {subject.code} - {subject.program}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="school" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Teachers Found</Text>
      <Text style={styles.emptyText}>
        {searchPhrase || selectedGradeFilter || selectedSubjectFilter
          ? "Try adjusting your search terms or filters."
          : "No teachers available."}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color="#F44336" />
      <Text style={styles.errorTitle}>Failed to Load Teachers</Text>
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
    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter by Grade</Text>
          {(selectedGradeFilter !== null ||
            selectedSubjectFilter !== null ||
            searchPhrase) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <MaterialIcons name="clear" size={12} color="#920734" />
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

          {/* Individual Grades */}
          {uniqueEducatorGrades.map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.gradeFilterChip,
                selectedGradeFilter === grade && styles.gradeFilterChipSelected,
              ]}
              onPress={() => handleGradeFilter(grade)}
            >
              <MaterialIcons
                name="school"
                size={12}
                color={selectedGradeFilter === grade ? "#FFFFFF" : "#920734"}
              />
              <Text
                style={[
                  styles.gradeFilterChipText,
                  selectedGradeFilter === grade &&
                    styles.gradeFilterChipTextSelected,
                ]}
              >
                {grade}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSubjectFilter = () => {
    if (uniqueSubjects.length === 0) return null;

    return (
      <View style={styles.subjectFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subjectFilterScroll}
          contentContainerStyle={styles.subjectFilterContent}
        >
          {/* All Subjects */}
          <TouchableOpacity
            style={[
              styles.subjectFilterChip,
              selectedSubjectFilter === null &&
                styles.subjectFilterChipSelected,
            ]}
            onPress={() => handleSubjectFilter(null)}
          >
            <MaterialIcons
              name="subject"
              size={12}
              color={selectedSubjectFilter === null ? "#FFFFFF" : "#920734"}
            />
            <Text
              style={[
                styles.subjectFilterChipText,
                selectedSubjectFilter === null &&
                  styles.subjectFilterChipTextSelected,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {/* Individual Subjects */}
          {uniqueSubjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.subjectFilterChip,
                selectedSubjectFilter === subject &&
                  styles.subjectFilterChipSelected,
              ]}
              onPress={() => handleSubjectFilter(subject)}
            >
              <MaterialIcons
                name="book"
                size={12}
                color={
                  selectedSubjectFilter === subject ? "#FFFFFF" : "#920734"
                }
              />
              <Text
                style={[
                  styles.subjectFilterChipText,
                  selectedSubjectFilter === subject &&
                    styles.subjectFilterChipTextSelected,
                ]}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachers..."
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

      {/* Teachers List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#920734" />
          <Text style={styles.loadingText}>Loading teachers...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderTeacherItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.teachersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            teachers.length === 0 ? styles.emptyListContainer : undefined
          }
        />
      )}

      {/* Subject Filter at Bottom */}
      {renderSubjectFilter()}

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
    backgroundColor: "#FDF2F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3E8FF",
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
  // Subject Filter Styles (Bottom)
  subjectFilterContainer: {
    marginBottom: 6,
    paddingVertical: 6,
    backgroundColor: "#FDF2F8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  subjectFilterScroll: {
    flexGrow: 0,
  },
  subjectFilterContent: {
    paddingHorizontal: 8,
  },
  subjectFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3E8FF",
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
  subjectFilterChipSelected: {
    backgroundColor: "#920734",
    borderColor: "#920734",
    shadowColor: "#920734",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  subjectFilterChipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#920734",
    marginLeft: 2,
  },
  subjectFilterChipTextSelected: {
    color: "#FFFFFF",
  },
  teachersList: {
    flex: 1,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  teacherContainer: {
    marginBottom: 6,
  },
  teacherListItem: {
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
  teacherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDF2F8",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#920734",
    justifyContent: "center",
    alignItems: "center",
  },
  teacherAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  teacherListInfo: {
    flex: 1,
    paddingRight: 8,
  },
  teacherNameList: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
    lineHeight: 18,
  },
  teacherEmployeeNumber: {
    fontSize: 12,
    color: "#920734",
    fontWeight: "600",
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  teacherDesignation: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  teacherSubjects: {
    fontSize: 10,
    color: "#920734",
    fontWeight: "500",
    fontStyle: "italic",
  },
  expandedContent: {
    backgroundColor: "#F8FAFC",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 12,
    marginTop: -4,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E2E8F0",
  },
  expandedSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    width: 100,
  },
  detailValue: {
    fontSize: 11,
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
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
    lineHeight: 20,
    marginBottom: 20,
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
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
    lineHeight: 20,
  },
});

export default TeachersModalContent;
