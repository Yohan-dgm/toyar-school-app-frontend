import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FullScreenModal from "../../screens/authenticated/principal/dashboard/components/FullScreenModal";
import {
  useGetStudentAttendanceListQuery,
  createStudentAttendanceQueryParams,
  StudentAttendanceRecord,
} from "../../api/attendance-api";

interface StudentAttendanceDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  attendanceDate: string;
  gradeLevelClassName: string;
}

const StudentAttendanceDetailsModal: React.FC<
  StudentAttendanceDetailsModalProps
> = ({ visible, onClose, attendanceDate, gradeLevelClassName }) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchPhrase, setSearchPhrase] = useState("");

  // API query
  const queryParams = createStudentAttendanceQueryParams(
    currentPage,
    pageSize,
    searchPhrase,
    "All",
    attendanceDate,
    gradeLevelClassName,
  );

  const {
    data: studentAttendanceData,
    error,
    isLoading,
    isFetching,
  } = useGetStudentAttendanceListQuery(queryParams);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchPhrase]);

  // Reset states when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentPage(1);
      setSearchPhrase("");
    }
  }, [visible]);

  // Handle search
  const handleSearchChange = (text: string) => {
    setSearchPhrase(text);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calculate pagination info
  const totalRecords = studentAttendanceData?.data.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  // Get attendance status color
  const getAttendanceStatusColor = (attendanceType: string): string => {
    switch (attendanceType.toLowerCase()) {
      case "in":
        return "#4CAF50"; // Green
      case "out":
        return "#FF9800"; // Orange
      case "absent":
        return "#F44336"; // Red
      default:
        return "#666";
    }
  };

  // Get attendance status background color
  const getAttendanceStatusBackground = (attendanceType: string): string => {
    switch (attendanceType.toLowerCase()) {
      case "in":
        return "#E8F5E8"; // Light Green
      case "out":
        return "#FFF3E0"; // Light Orange
      case "absent":
        return "#FFEBEE"; // Light Red
      default:
        return "#F5F5F5";
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString: string): string => {
    // Parse the date string properly to avoid timezone issues
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render student attendance record
  const renderStudentRecord = (record: StudentAttendanceRecord) => {
    const statusColor = getAttendanceStatusColor(record.attendance_type.name);
    const statusBackground = getAttendanceStatusBackground(
      record.attendance_type.name,
    );

    return (
      <View key={record.id} style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {record.student.full_name_with_title}
            </Text>
            <Text style={styles.admissionNumber}>
              ID: {record.student.admission_number}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusBackground }]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {record.attendance_type.name}
            </Text>
          </View>
        </View>

        <View style={styles.recordContent}>
          {record.attendance_type.name !== "Absent" && (
            <View style={styles.timeInfo}>
              {record.in_time && (
                <View style={styles.timeItem}>
                  <MaterialIcons name="login" size={14} color="#4CAF50" />
                  <Text style={styles.timeLabel}>In: </Text>
                  <Text style={styles.timeValue}>{record.in_time}</Text>
                </View>
              )}
              {record.out_time && (
                <View style={styles.timeItem}>
                  <MaterialIcons name="logout" size={14} color="#FF9800" />
                  <Text style={styles.timeLabel}>Out: </Text>
                  <Text style={styles.timeValue}>{record.out_time}</Text>
                </View>
              )}
            </View>
          )}

          {record.notes && (
            <View style={styles.notesContainer}>
              <MaterialIcons name="note" size={14} color="#666" />
              <Text style={styles.notesText}>{record.notes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Render loading state
  if (isLoading && !studentAttendanceData) {
    return (
      <FullScreenModal
        visible={visible}
        onClose={onClose}
        title="Student Attendance Details"
        backgroundColor="#F8F9FA"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#920734" />
          <Text style={styles.loadingText}>Loading student attendance...</Text>
        </View>
      </FullScreenModal>
    );
  }

  // Render error state
  if (error) {
    return (
      <FullScreenModal
        visible={visible}
        onClose={onClose}
        title="Student Attendance Details"
        backgroundColor="#F8F9FA"
      >
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#F44336" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>
            Unable to load student attendance data. Please try again.
          </Text>
        </View>
      </FullScreenModal>
    );
  }

  return (
    <FullScreenModal
      visible={visible}
      onClose={onClose}
      title="Student Attendance Details"
      backgroundColor="#F8F9FA"
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color="#920734"
                />
                <Text style={styles.infoLabel}>Date:</Text>
                <Text style={styles.infoValue}>
                  {formatDisplayDate(attendanceDate)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="class" size={16} color="#920734" />
                <Text style={styles.infoLabel}>Class:</Text>
                <Text style={styles.infoValue}>{gradeLevelClassName}</Text>
              </View>
            </View>

            {/* Summary Stats */}
            {studentAttendanceData && (
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {studentAttendanceData.data.present_student_count}
                  </Text>
                  <Text style={styles.statLabel}>Present</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {studentAttendanceData.data.absent_student_count}
                  </Text>
                  <Text style={styles.statLabel}>Absent</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalRecords}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
              </View>
            )}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              placeholderTextColor="#666"
              value={searchPhrase}
              onChangeText={handleSearchChange}
            />
          </View>

          {/* Results Info */}
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              Showing {startRecord}-{endRecord} of {totalRecords} students
            </Text>
            {isFetching && <ActivityIndicator size="small" color="#920734" />}
          </View>

          {/* Student Records */}
          <View style={styles.recordsList}>
            {studentAttendanceData?.data.data?.length > 0 ? (
              studentAttendanceData.data.data.map(renderStudentRecord)
            ) : (
              <View style={styles.noDataContainer}>
                <MaterialIcons name="person-off" size={64} color="#999" />
                <Text style={styles.noDataTitle}>No Student Records</Text>
                <Text style={styles.noDataText}>
                  No student attendance records found for the selected date and
                  class.
                </Text>
              </View>
            )}
          </View>

          {/* Pagination */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={20}
                  color={currentPage === 1 ? "#999" : "#920734"}
                />
                <Text
                  style={[
                    styles.paginationText,
                    currentPage === 1 && styles.disabledText,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <View style={styles.pageInfo}>
                <Text style={styles.pageText}>
                  Page {currentPage} of {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={[
                    styles.paginationText,
                    currentPage === totalPages && styles.disabledText,
                  ]}
                >
                  Next
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={currentPage === totalPages ? "#999" : "#920734"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </FullScreenModal>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F44336",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  headerInfo: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#920734",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  resultsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 12,
    color: "#666",
  },
  recordsList: {
    marginBottom: 16,
  },
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
    marginRight: 12,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  admissionNumber: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  recordContent: {
    gap: 6,
  },
  timeInfo: {
    flexDirection: "row",
    gap: 16,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: "#666",
  },
  timeValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 4,
  },
  notesText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },
  noDataContainer: {
    alignItems: "center",
    padding: 40,
  },
  noDataTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#920734",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  paginationText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginHorizontal: 4,
  },
  disabledText: {
    color: "#999",
  },
  pageInfo: {
    alignItems: "center",
  },
  pageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default StudentAttendanceDetailsModal;
