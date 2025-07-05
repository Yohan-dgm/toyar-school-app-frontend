import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

// Main Section Screens
import SchoolLifeMain from "../screens/authenticated/parent/school-life/SchoolLifeMain";
import EducatorFeedbackMain from "../screens/authenticated/parent/educator-feedback/EducatorFeedbackMain";
import CalendarMain from "../screens/authenticated/parent/calendar/CalendarMain";
import AcademicMain from "../screens/authenticated/parent/academic/AcademicMain";
import PerformanceMain from "../screens/authenticated/parent/performance/PerformanceMain";

// Legacy screens (for backward compatibility)
import ParentHomeScreen from "../screens/authenticated/parent/ParentHomeScreen";

const Stack = createStackNavigator();

const ParentNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {/* Main Navigation Screens */}
      <Stack.Screen
        name="SchoolLifeMain"
        component={SchoolLifeMain}
        options={{ title: "School Life" }}
      />

      <Stack.Screen
        name="EducatorFeedbackMain"
        component={EducatorFeedbackMain}
        options={{ title: "Educator Feedback" }}
      />

      <Stack.Screen
        name="CalendarMain"
        component={CalendarMain}
        options={{ title: "Calendar & Attendance" }}
      />

      <Stack.Screen
        name="AcademicMain"
        component={AcademicMain}
        options={{ title: "Academic Performance" }}
      />

      <Stack.Screen
        name="PerformanceMain"
        component={PerformanceMain}
        options={{ title: "Student Performance" }}
      />

      {/* Legacy Support */}
      <Stack.Screen
        name="ParentHomeScreen"
        component={ParentHomeScreen}
        options={{ title: "Home" }}
      />

      {/* Placeholder screens for future development */}
      <Stack.Screen
        name="AnnouncementDetail"
        component={PlaceholderScreen}
        options={{ title: "Announcement Details" }}
      />

      <Stack.Screen
        name="EventDetail"
        component={PlaceholderScreen}
        options={{ title: "Event Details" }}
      />

      <Stack.Screen
        name="SchoolEvents"
        component={PlaceholderScreen}
        options={{ title: "School Events" }}
      />

      <Stack.Screen
        name="StudentDirectory"
        component={PlaceholderScreen}
        options={{ title: "Student Directory" }}
      />

      <Stack.Screen
        name="SchoolGallery"
        component={PlaceholderScreen}
        options={{ title: "Photo Gallery" }}
      />

      <Stack.Screen
        name="SchoolNews"
        component={PlaceholderScreen}
        options={{ title: "School News" }}
      />

      <Stack.Screen
        name="ChatDetail"
        component={PlaceholderScreen}
        options={{ title: "Chat" }}
      />

      <Stack.Screen
        name="ScheduleMeeting"
        component={PlaceholderScreen}
        options={{ title: "Schedule Meeting" }}
      />

      <Stack.Screen
        name="ViewReports"
        component={PlaceholderScreen}
        options={{ title: "View Reports" }}
      />

      <Stack.Screen
        name="SendFeedback"
        component={PlaceholderScreen}
        options={{ title: "Send Feedback" }}
      />

      <Stack.Screen
        name="ParentPortal"
        component={PlaceholderScreen}
        options={{ title: "Parent Portal" }}
      />

      <Stack.Screen
        name="AttendanceDetail"
        component={PlaceholderScreen}
        options={{ title: "Attendance Details" }}
      />

      <Stack.Screen
        name="AddEvent"
        component={PlaceholderScreen}
        options={{ title: "Add Event" }}
      />

      <Stack.Screen
        name="ViewCalendar"
        component={PlaceholderScreen}
        options={{ title: "Full Calendar" }}
      />

      <Stack.Screen
        name="AttendanceReport"
        component={PlaceholderScreen}
        options={{ title: "Attendance Report" }}
      />

      <Stack.Screen
        name="EventReminders"
        component={PlaceholderScreen}
        options={{ title: "Event Reminders" }}
      />

      <Stack.Screen
        name="SubjectDetail"
        component={PlaceholderScreen}
        options={{ title: "Subject Details" }}
      />

      <Stack.Screen
        name="ReportDetail"
        component={PlaceholderScreen}
        options={{ title: "Report Details" }}
      />

      <Stack.Screen
        name="GradeBook"
        component={PlaceholderScreen}
        options={{ title: "Grade Book" }}
      />

      <Stack.Screen
        name="AssignmentTracker"
        component={PlaceholderScreen}
        options={{ title: "Assignment Tracker" }}
      />

      <Stack.Screen
        name="TestSchedule"
        component={PlaceholderScreen}
        options={{ title: "Test Schedule" }}
      />

      <Stack.Screen
        name="ProgressAnalytics"
        component={PlaceholderScreen}
        options={{ title: "Progress Analytics" }}
      />

      <Stack.Screen
        name="MetricDetail"
        component={PlaceholderScreen}
        options={{ title: "Metric Details" }}
      />

      <Stack.Screen
        name="SkillDetail"
        component={PlaceholderScreen}
        options={{ title: "Skill Details" }}
      />

      <Stack.Screen
        name="DetailedReport"
        component={PlaceholderScreen}
        options={{ title: "Detailed Report" }}
      />

      <Stack.Screen
        name="ProgressChart"
        component={PlaceholderScreen}
        options={{ title: "Progress Chart" }}
      />

      <Stack.Screen
        name="GoalSetting"
        component={PlaceholderScreen}
        options={{ title: "Goal Setting" }}
      />

      <Stack.Screen
        name="ComparePerformance"
        component={PlaceholderScreen}
        options={{ title: "Compare Performance" }}
      />
    </Stack.Navigator>
  );
};

// Placeholder component for future screens
const PlaceholderScreen = ({ route, navigation }) => {
  const { title } = route.params || {};

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        padding: 20,
      }}
    >
      <MaterialIcons name="construction" size={64} color="#920734" />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#920734",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        {route.name}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#666666",
          marginTop: 10,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        This screen is under development.{"\n"}
        It will be available in future updates.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#920734",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 30,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentNavigator;
