import React, { forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";

const StudentsModal = forwardRef<Modalize>((_, ref) => {
  const studentData = [
    {
      id: "1",
      name: "Alice Johnson",
      grade: "Grade 10",
      class: "10A",
      attendance: "95%",
      status: "Active",
    },
    {
      id: "2",
      name: "Bob Smith",
      grade: "Grade 9",
      class: "9B",
      attendance: "88%",
      status: "Active",
    },
    {
      id: "3",
      name: "Carol Davis",
      grade: "Grade 11",
      class: "11C",
      attendance: "92%",
      status: "Active",
    },
    {
      id: "4",
      name: "David Wilson",
      grade: "Grade 8",
      class: "8A",
      attendance: "87%",
      status: "Active",
    },
  ];

  const renderStudentCard = (student: any) => (
    <TouchableOpacity key={student.id} style={styles.studentCard}>
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person" size={24} color="#2196F3" />
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentDetails}>
          {student.grade} • {student.class}
        </Text>
        <Text style={styles.attendanceText}>
          Attendance: {student.attendance}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.statusText}>{student.status}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modalize
      ref={ref}
      modalTopOffset={0}
      modalHeight={999999}
      adjustToContentHeight={false}
      modalStyle={styles.modal}
      rootStyle={styles.modalRoot}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      HeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="school" size={24} color="#2196F3" />
            <Text style={styles.headerTitle}>All Students</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Total: {studentData.length} students
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
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,250</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>94%</Text>
            <Text style={styles.statLabel}>Avg Attendance</Text>
          </View>
        </View>

        {/* Students List */}
        <ScrollView
          style={styles.studentsList}
          showsVerticalScrollIndicator={false}
        >
          {studentData.map(renderStudentCard)}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.actionButtonText}>Add Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <MaterialIcons name="file-download" size={20} color="#2196F3" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Export List
            </Text>
          </TouchableOpacity>
        </View>
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  studentsList: {
    flex: 1,
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  studentDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  attendanceText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  statusContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#2196F3",
  },
});

export default StudentsModal;
