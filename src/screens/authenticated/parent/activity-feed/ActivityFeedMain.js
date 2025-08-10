import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { transformStudentWithProfilePicture } from "../../../../utils/studentProfileUtils";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import ActivityFeed from "../../../../components/activity-feed/ActivityFeed";
import { setSelectedStudent } from "../../../../state-store/slices/app-slice";

const ActivityFeedMain = () => {
  const dispatch = useDispatch();

  // Get global state
  const { sessionData, selectedStudent } = useSelector((state) => state.app);

  // Get user category from session data
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;
  const isParent = userCategory === USER_CATEGORIES.PARENT;

  // Get student data from backend API response
  const backendStudentList = sessionData?.data?.student_list || [];

  // Transform backend student data to match UI requirements
  const students = backendStudentList.map((student) => {
    return transformStudentWithProfilePicture(student, sessionData);
  });

  // Auto-select first student if none selected and students are available
  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      console.log(
        `🎓 ActivityFeedMain - Auto-selecting first student: ${students[0]?.student_calling_name}`,
      );
      dispatch(setSelectedStudent(students[0]));
    }
  }, [students.length, selectedStudent, dispatch]);

  // Debug logging
  console.log(
    "🏠 ActivityFeedMain - User category:",
    userCategory,
    "Is parent:",
    isParent,
  );
  console.log("🏠 ActivityFeedMain - Students count:", students.length);
  console.log(
    "🏠 ActivityFeedMain - Selected student:",
    selectedStudent?.student_calling_name,
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {/* <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>
          Welcome to Activity Feed
        </Text>
        {isParent && selectedStudent && (
          <Text style={styles.studentText}>
            Viewing activities for {selectedStudent.student_calling_name}
          </Text>
        )}
      </View> */}

      {/* Activity Feed Component */}
      <View style={styles.feedContainer}>
        <ActivityFeed userCategory={userCategory} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  welcomeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: "#000000",
    marginBottom: 4,
  },
  studentText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
  },
  feedContainer: {
    flex: 1,
  },
});

export default ActivityFeedMain;
