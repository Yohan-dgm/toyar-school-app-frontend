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

const TeachersModal = forwardRef<Modalize>((_, ref) => {
  const teacherData = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      subject: "Mathematics",
      experience: "8 years",
      classes: 5,
      rating: 4.8,
      status: "Active",
    },
    {
      id: "2",
      name: "Mr. Michael Brown",
      subject: "English Literature",
      experience: "12 years",
      classes: 4,
      rating: 4.9,
      status: "Active",
    },
    {
      id: "3",
      name: "Ms. Emily Davis",
      subject: "Science",
      experience: "6 years",
      classes: 6,
      rating: 4.7,
      status: "Active",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      subject: "History",
      experience: "15 years",
      classes: 3,
      rating: 4.9,
      status: "Active",
    },
  ];

  const renderTeacherCard = (teacher: any) => (
    <TouchableOpacity key={teacher.id} style={styles.teacherCard}>
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person" size={24} color="#4CAF50" />
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{teacher.name}</Text>
        <Text style={styles.subjectText}>{teacher.subject}</Text>
        <Text style={styles.experienceText}>
          {teacher.experience} • {teacher.classes} classes
        </Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>{teacher.rating}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.statusText}>{teacher.status}</Text>
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
            <MaterialIcons name="people" size={24} color="#4CAF50" />
            <Text style={styles.headerTitle}>All Teachers</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Total: {teacherData.length} teaching staff
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
            placeholder="Search teachers..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85</Text>
            <Text style={styles.statLabel}>Total Staff</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Departments</Text>
          </View>
        </View>

        {/* Teachers List */}
        <ScrollView
          style={styles.teachersList}
          showsVerticalScrollIndicator={false}
        >
          {teacherData.map(renderTeacherCard)}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.actionButtonText}>Add Teacher</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <MaterialIcons name="assessment" size={20} color="#4CAF50" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              View Reports
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
    color: "#4CAF50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  teachersList: {
    flex: 1,
  },
  teacherCard: {
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
    backgroundColor: "#e8f5e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  subjectText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 2,
  },
  experienceText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#FFC107",
    fontWeight: "600",
    marginLeft: 4,
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
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#4CAF50",
  },
});

export default TeachersModal;
