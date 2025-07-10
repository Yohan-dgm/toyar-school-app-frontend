import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar, Agenda } from "react-native-calendars";
import { theme } from "../../../../styles/theme";
// Header and BottomNavigation now handled by parent layout

const CalendarMain = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [calendarViewMode, setCalendarViewMode] = useState("calendar"); // "calendar" or "agenda"
  const [activeAttendanceTab, setActiveAttendanceTab] = useState("academic"); // "academic", "sport", "event"
  // Tab press handling now done by layout

  const handleEventPress = (event) => {
    console.log("Navigate to event detail:", event.title);
  };

  const handleAttendancePress = () => {
    console.log("Navigate to attendance detail");
  };

  const handleViewAllEvents = () => {
    console.log("Navigate to all events page");
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Sample school calendar events data - Comprehensive JSON structure
  // API Structure: GET /api/school/events?month=2025-07&student_id=123
  // Response: { events: [...], success: true }
  const schoolEvents = [
    {
      id: 1,
      title: "Mathematics Test - Algebra & Geometry",
      date: "2025-07-15",
      time: "09:00 AM - 11:00 AM",
      type: "exam",
      subject: "Mathematics",
      teacher: "Mrs. Sarah Perera",
      location: "Room 101",
      description: "Chapter 5-7 covering algebra and geometry",
      grade: "Grade 10",
      duration: "2 hours",
      materials: ["Calculator", "Ruler", "Pencil"],
    },
    {
      id: 2,
      title: "Annual Science Fair 2025",
      date: "2025-07-18",
      time: "02:00 PM - 06:00 PM",
      type: "event",
      subject: "Science",
      teacher: "Mr. David Wilson",
      location: "School Hall",
      description:
        "Annual science exhibition and competition with student projects",
      grade: "All Grades",
      duration: "4 hours",
      materials: ["Project Display", "Presentation"],
    },
    {
      id: 3,
      title: "Basketball Championship - Semi Finals",
      date: "2025-07-20",
      time: "04:00 PM - 06:00 PM",
      type: "sports",
      subject: "Physical Education",
      teacher: "Coach Michael Thompson",
      location: "School Basketball Court",
      description: "Inter-school basketball championship semi-final match",
      grade: "Grade 9-12",
      duration: "2 hours",
      materials: ["Sports Uniform", "Water Bottle"],
    },
    {
      id: 4,
      title: "Parent-Teacher Conference",
      date: "2025-07-22",
      time: "04:00 PM - 08:00 PM",
      type: "meeting",
      subject: "General",
      teacher: "All Teachers",
      location: "Conference Room & Classrooms",
      description: "Quarterly progress discussion and academic counseling",
      grade: "All Grades",
      duration: "4 hours",
      materials: ["Report Cards", "Progress Reports"],
    },
    {
      id: 5,
      title: "Drama Club Performance - Romeo & Juliet",
      date: "2025-07-04",
      time: "07:00 PM - 09:00 PM",
      type: "cultural",
      subject: "Drama & Arts",
      teacher: "Ms. Jennifer Adams",
      location: "School Auditorium",
      description:
        "Annual drama club performance of Shakespeare's Romeo & Juliet",
      grade: "All Grades",
      duration: "2 hours",
      materials: ["Tickets", "Program"],
    },
    {
      id: 6,
      title: "Sports Day Practice Session",
      date: "2025-07-03",
      time: "10:00 AM - 12:00 PM",
      type: "sports",
      subject: "Physical Education",
      teacher: "Mr. Michael Brown",
      location: "Sports Ground",
      description: "Preparation and practice for annual sports day events",
      grade: "Grade 6-12",
      duration: "2 hours",
      materials: ["Sports Uniform", "Running Shoes"],
    },
    {
      id: 7,
      title: "English Literature Exam",
      date: "2025-07-04",
      time: "11:00 AM - 01:00 PM",
      type: "exam",
      subject: "English",
      teacher: "Ms. Emily Davis",
      location: "Room 205",
      description: "Poetry and prose analysis examination",
      grade: "Grade 11",
      duration: "2 hours",
      materials: ["Pen", "Answer Sheets"],
    },
    {
      id: 8,
      title: "Republic Day Celebration",
      date: "2025-07-03",
      time: "08:00 AM - 12:00 PM",
      type: "holiday",
      subject: "National Event",
      teacher: "All Staff",
      location: "School Grounds",
      description:
        "National Republic Day celebration with flag hoisting and cultural programs",
      grade: "All Grades",
      duration: "4 hours",
      materials: ["Uniform", "Indian Flag"],
    },
    {
      id: 9,
      title: "Art Exhibition - Student Showcase",
      date: "2025-07-05",
      time: "03:00 PM - 06:00 PM",
      type: "cultural",
      subject: "Art",
      teacher: "Mrs. Lisa Chen",
      location: "Art Gallery",
      description:
        "Student artwork showcase featuring paintings, sculptures, and digital art",
      grade: "All Grades",
      duration: "3 hours",
      materials: ["Art Portfolio"],
    },
    {
      id: 10,
      title: "Chemistry Lab Practical Exam",
      date: "2025-07-08",
      time: "10:30 AM - 12:30 PM",
      type: "exam",
      subject: "Chemistry",
      teacher: "Dr. Robert Smith",
      location: "Chemistry Lab 3",
      description:
        "Practical examination on organic compounds and chemical reactions",
      grade: "Grade 12",
      duration: "2 hours",
      materials: ["Lab Coat", "Safety Goggles", "Lab Manual"],
    },
    {
      id: 11,
      title: "Music Concert - Summer Melodies",
      date: "2025-07-12",
      time: "06:00 PM - 08:00 PM",
      type: "cultural",
      subject: "Music",
      teacher: "Mr. James Rodriguez",
      location: "School Auditorium",
      description:
        "Annual summer music concert featuring school choir and orchestra",
      grade: "All Grades",
      duration: "2 hours",
      materials: ["Concert Program"],
    },
    {
      id: 12,
      title: "Football Tournament Finals",
      date: "2025-07-16",
      time: "03:00 PM - 05:00 PM",
      type: "sports",
      subject: "Physical Education",
      teacher: "Coach Sarah Williams",
      location: "Football Field",
      description: "Inter-house football tournament final match",
      grade: "Grade 8-12",
      duration: "2 hours",
      materials: ["Sports Kit", "Team Jersey"],
    },
    {
      id: 13,
      title: "Weekly Assembly",
      date: "2025-07-07",
      time: "08:00 AM - 08:30 AM",
      type: "meeting",
      subject: "General",
      teacher: "Principal Johnson",
      location: "Main Hall",
      description: "Weekly school assembly with announcements and awards",
      grade: "All Grades",
      duration: "30 minutes",
      materials: [],
    },
    {
      id: 14,
      title: "Library Reading Session",
      date: "2025-07-09",
      time: "02:00 PM - 03:00 PM",
      type: "activity",
      subject: "Literature",
      teacher: "Ms. Patricia Lee",
      location: "School Library",
      description: "Guided reading session for literature enthusiasts",
      grade: "Grade 6-10",
      duration: "1 hour",
      materials: ["Reading Book"],
    },
    {
      id: 15,
      title: "Computer Programming Workshop",
      date: "2025-07-11",
      time: "01:00 PM - 03:00 PM",
      type: "activity",
      subject: "Computer Science",
      teacher: "Mr. Alex Kumar",
      location: "Computer Lab",
      description: "Introduction to Python programming for beginners",
      grade: "Grade 9-12",
      duration: "2 hours",
      materials: ["Laptop", "Notebook"],
    },
  ];

  // Complete student attendance data for July 2025 - Academic, Sport, Event
  // API Structure: GET /api/student/attendance?month=2025-07&student_id=123&type=academic
  // Response: { attendance: {...}, success: true }

  // Academic Attendance Data
  const academicAttendance = {
    month: "2025-07",
    studentId: "STU123",
    studentName: "John Doe",
    grade: "Grade 10",
    type: "academic",
    totalSchoolDays: 22,
    presentDays: 19,
    absentDays: 3,
    holidayDays: 9,
    weekendDays: 0, // Weekends handled separately
    attendancePercentage: 86.4,
    // Complete month attendance record
    dailyAttendance: {
      "2025-07-01": {
        status: "holiday",
        reason: "New Year's Day",
        note: "National Holiday",
      },
      "2025-07-02": {
        status: "present",
        checkIn: "08:15 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-03": {
        status: "present",
        checkIn: "08:10 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-04": { status: "weekend", reason: "Saturday" },
      "2025-07-05": { status: "weekend", reason: "Sunday" },
      "2025-07-06": {
        status: "present",
        checkIn: "08:20 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-07": {
        status: "present",
        checkIn: "08:05 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-08": {
        status: "absent",
        reason: "Sick Leave",
        note: "Medical certificate provided",
      },
      "2025-07-09": {
        status: "present",
        checkIn: "08:15 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-10": {
        status: "present",
        checkIn: "08:12 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-11": { status: "weekend", reason: "Saturday" },
      "2025-07-12": { status: "weekend", reason: "Sunday" },
      "2025-07-13": {
        status: "present",
        checkIn: "08:18 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-14": {
        status: "present",
        checkIn: "08:08 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-15": {
        status: "present",
        checkIn: "08:25 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-16": {
        status: "present",
        checkIn: "08:15 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-17": {
        status: "present",
        checkIn: "08:10 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-18": { status: "weekend", reason: "Saturday" },
      "2025-07-19": { status: "weekend", reason: "Sunday" },
      "2025-07-20": {
        status: "present",
        checkIn: "08:20 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-21": {
        status: "present",
        checkIn: "08:15 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-22": {
        status: "present",
        checkIn: "08:12 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-23": {
        status: "present",
        checkIn: "08:18 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-24": {
        status: "present",
        checkIn: "08:10 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-25": { status: "weekend", reason: "Saturday" },
      "2025-07-26": {
        status: "holiday",
        reason: "Republic Day",
        note: "National Holiday",
      },
      "2025-07-27": {
        status: "present",
        checkIn: "08:15 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-28": {
        status: "present",
        checkIn: "08:20 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-29": {
        status: "absent",
        reason: "Family Emergency",
        note: "Prior permission taken",
      },
      "2025-07-30": {
        status: "present",
        checkIn: "08:12 AM",
        checkOut: "03:30 PM",
      },
      "2025-07-31": {
        status: "absent",
        reason: "Sick Leave",
        note: "Fever - Medical certificate provided",
      },
    },
    // Summary for quick access
    recentAttendance: [
      { date: "2025-07-31", status: "absent", reason: "Sick Leave" },
      { date: "2025-07-30", status: "present", checkIn: "08:12 AM" },
      { date: "2025-07-29", status: "absent", reason: "Family Emergency" },
      { date: "2025-07-28", status: "present", checkIn: "08:20 AM" },
      { date: "2025-07-27", status: "present", checkIn: "08:15 AM" },
    ],
  };

  // Sport Attendance Data
  const sportAttendance = {
    month: "2025-07",
    studentId: "STU123",
    studentName: "John Doe",
    grade: "Grade 10",
    type: "sport",
    totalSportDays: 12,
    presentDays: 10,
    absentDays: 2,
    holidayDays: 9,
    weekendDays: 0,
    attendancePercentage: 83.3,
    // Sport-specific attendance record
    dailyAttendance: {
      "2025-07-02": {
        status: "present",
        activity: "Basketball Practice",
        checkIn: "04:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-03": {
        status: "present",
        activity: "Football Training",
        checkIn: "04:15 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-04": { status: "weekend", reason: "Saturday" },
      "2025-07-05": { status: "weekend", reason: "Sunday" },
      "2025-07-09": {
        status: "present",
        activity: "Swimming Practice",
        checkIn: "04:00 PM",
        checkOut: "05:30 PM",
      },
      "2025-07-10": {
        status: "absent",
        activity: "Basketball Practice",
        reason: "Injury",
        note: "Ankle sprain - Medical certificate provided",
      },
      "2025-07-16": {
        status: "present",
        activity: "Football Match",
        checkIn: "03:00 PM",
        checkOut: "05:00 PM",
      },
      "2025-07-17": {
        status: "present",
        activity: "Athletics Training",
        checkIn: "04:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-20": {
        status: "present",
        activity: "Basketball Championship",
        checkIn: "04:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-23": {
        status: "present",
        activity: "Swimming Competition",
        checkIn: "03:30 PM",
        checkOut: "05:30 PM",
      },
      "2025-07-24": {
        status: "present",
        activity: "Football Practice",
        checkIn: "04:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-30": {
        status: "present",
        activity: "Athletics Meet",
        checkIn: "03:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-31": {
        status: "absent",
        activity: "Basketball Practice",
        reason: "Family Event",
        note: "Prior permission taken",
      },
    },
    recentAttendance: [
      {
        date: "2025-07-31",
        status: "absent",
        reason: "Family Event",
        activity: "Basketball Practice",
      },
      {
        date: "2025-07-30",
        status: "present",
        checkIn: "03:00 PM",
        activity: "Athletics Meet",
      },
      {
        date: "2025-07-24",
        status: "present",
        checkIn: "04:00 PM",
        activity: "Football Practice",
      },
      {
        date: "2025-07-23",
        status: "present",
        checkIn: "03:30 PM",
        activity: "Swimming Competition",
      },
      {
        date: "2025-07-20",
        status: "present",
        checkIn: "04:00 PM",
        activity: "Basketball Championship",
      },
    ],
  };

  // Event Attendance Data
  const eventAttendance = {
    month: "2025-07",
    studentId: "STU123",
    studentName: "John Doe",
    grade: "Grade 10",
    type: "event",
    totalEventDays: 8,
    presentDays: 7,
    absentDays: 1,
    holidayDays: 9,
    weekendDays: 0,
    attendancePercentage: 87.5,
    // Event-specific attendance record
    dailyAttendance: {
      "2025-07-03": {
        status: "present",
        event: "Republic Day Celebration",
        checkIn: "08:00 AM",
        checkOut: "12:00 PM",
      },
      "2025-07-04": {
        status: "present",
        event: "Drama Club Performance",
        checkIn: "07:00 PM",
        checkOut: "09:00 PM",
      },
      "2025-07-05": {
        status: "present",
        event: "Art Exhibition",
        checkIn: "03:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-12": {
        status: "present",
        event: "Music Concert",
        checkIn: "06:00 PM",
        checkOut: "08:00 PM",
      },
      "2025-07-18": {
        status: "present",
        event: "Science Fair",
        checkIn: "02:00 PM",
        checkOut: "06:00 PM",
      },
      "2025-07-22": {
        status: "present",
        event: "Parent-Teacher Conference",
        checkIn: "04:00 PM",
        checkOut: "08:00 PM",
      },
      "2025-07-25": {
        status: "absent",
        event: "Cultural Program",
        reason: "Sick Leave",
        note: "Fever - Medical certificate provided",
      },
      "2025-07-28": {
        status: "present",
        event: "Awards Ceremony",
        checkIn: "10:00 AM",
        checkOut: "12:00 PM",
      },
    },
    recentAttendance: [
      {
        date: "2025-07-28",
        status: "present",
        checkIn: "10:00 AM",
        event: "Awards Ceremony",
      },
      {
        date: "2025-07-25",
        status: "absent",
        reason: "Sick Leave",
        event: "Cultural Program",
      },
      {
        date: "2025-07-22",
        status: "present",
        checkIn: "04:00 PM",
        event: "Parent-Teacher Conference",
      },
      {
        date: "2025-07-18",
        status: "present",
        checkIn: "02:00 PM",
        event: "Science Fair",
      },
      {
        date: "2025-07-12",
        status: "present",
        checkIn: "06:00 PM",
        event: "Music Concert",
      },
    ],
  };

  // Get current attendance data based on active tab
  const getCurrentAttendanceData = () => {
    switch (activeAttendanceTab) {
      case "academic":
        return academicAttendance;
      case "sport":
        return sportAttendance;
      case "event":
        return eventAttendance;
      default:
        return academicAttendance;
    }
  };

  // Create marked dates for school events calendar
  const getSchoolEventsMarkedDates = () => {
    const marked = {};

    // Mark school event dates
    schoolEvents.forEach((event) => {
      marked[event.date] = {
        marked: true,
        dotColor: getEventTypeColor(event.type),
        activeOpacity: 0.7,
      };
    });

    // Mark selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
        selectedTextColor: "#FFFFFF",
      };
    }

    return marked;
  };

  // Create marked dates for student attendance calendar
  const getAttendanceMarkedDates = () => {
    const marked = {};
    const currentAttendance = getCurrentAttendanceData();

    // Mark attendance dates with color coding
    Object.keys(currentAttendance.dailyAttendance).forEach((date) => {
      const record = currentAttendance.dailyAttendance[date];
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor:
              record.status === "present"
                ? "#E8F5E8" // Light green for present
                : record.status === "absent"
                  ? "#FFE8E8" // Light red for absent
                  : record.status === "holiday"
                    ? "#FFF3E0" // Light orange for holidays
                    : record.status === "weekend"
                      ? "#F5F5F5" // Gray for weekends
                      : "#F0F0F0", // Default gray
            borderRadius: 20, // Changed from 8 to 20 to make it circular
            width: 40, // Set fixed width for perfect circle
            height: 40, // Set fixed height for perfect circle
            borderWidth: record.status === "present" ? 2 : 1,
            borderColor:
              record.status === "present"
                ? "#4CAF50"
                : record.status === "absent"
                  ? "#FF5722"
                  : record.status === "holiday"
                    ? "#FF9800"
                    : record.status === "weekend"
                      ? "#9E9E9E"
                      : "#E0E0E0",
            justifyContent: "center", // Center the text vertically
            alignItems: "center", // Center the text horizontally
          },
          text: {
            color: record.status === "weekend" ? "#9E9E9E" : "#333",
            fontWeight: record.status === "present" ? "bold" : "normal",
          },
        },
      };
    });

    // Mark selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
        selectedTextColor: "#FFFFFF",
      };
    }

    return marked;
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "exam":
        return "#FF5722"; // Red for exams
      case "event":
        return "#4CAF50"; // Green for general events
      case "meeting":
        return "#2196F3"; // Blue for meetings
      case "activity":
        return "#FF9800"; // Orange for activities
      case "sports":
        return "#E91E63"; // Pink for sports
      case "cultural":
        return "#9C27B0"; // Purple for cultural events
      case "holiday":
        return "#795548"; // Brown for holidays
      default:
        return theme.colors.primary;
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "exam":
        return "quiz";
      case "event":
        return "event";
      case "meeting":
        return "people";
      case "activity":
        return "directions-run";
      case "sports":
        return "sports";
      case "cultural":
        return "theater-comedy";
      case "holiday":
        return "beach-access";
      default:
        return "event";
    }
  };

  // Get school events for selected date
  const getSchoolEventsForDate = (date) => {
    return schoolEvents.filter((event) => event.date === date);
  };

  // Get attendance for selected date
  const getAttendanceForDate = (date) => {
    const currentAttendance = getCurrentAttendanceData();
    return currentAttendance.dailyAttendance[date] || null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Convert school events to agenda format
  const getAgendaItems = () => {
    const agendaItems = {};

    schoolEvents.forEach((event) => {
      const dateKey = event.date;
      if (!agendaItems[dateKey]) {
        agendaItems[dateKey] = [];
      }

      agendaItems[dateKey].push({
        name: event.title,
        height: event.description ? 120 : 100, // Dynamic height based on content
        day: dateKey,
        ...event,
      });
    });

    // Sort events by time for each date
    Object.keys(agendaItems).forEach((date) => {
      agendaItems[date].sort((a, b) => {
        const timeA = a.time.split(" ")[0];
        const timeB = b.time.split(" ")[0];
        return timeA.localeCompare(timeB);
      });
    });

    // Add some empty dates to ensure agenda shows properly
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Add empty dates for the current month to ensure agenda displays
    for (let i = 1; i <= 31; i++) {
      const date = new Date(currentYear, currentMonth, i);
      if (date.getMonth() === currentMonth) {
        const dateKey = date.toISOString().split("T")[0];
        if (!agendaItems[dateKey]) {
          agendaItems[dateKey] = [];
        }
      }
    }

    console.log("Agenda Items:", agendaItems); // Debug log
    return agendaItems;
  };

  // Render agenda item
  const renderAgendaItem = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.agendaItem,
          { borderLeftColor: getEventTypeColor(item.type) },
        ]}
        onPress={() => handleEventPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.agendaItemHeader}>
          <View style={styles.agendaItemTitleRow}>
            <Text style={styles.agendaItemTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View
              style={[
                styles.agendaItemTypeBadge,
                { backgroundColor: getEventTypeColor(item.type) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.agendaItemTypeText,
                  { color: getEventTypeColor(item.type) },
                ]}
              >
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.agendaItemTime}>{item.time}</Text>
          {item.description && (
            <Text style={styles.agendaItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>

        <View style={styles.agendaItemDetails}>
          <View style={styles.agendaItemDetailRow}>
            <MaterialIcons name="person" size={14} color="#666" />
            <Text style={styles.agendaItemDetailText} numberOfLines={1}>
              {item.teacher}
            </Text>
          </View>
          <View style={styles.agendaItemDetailRow}>
            <MaterialIcons name="location-on" size={14} color="#666" />
            <Text style={styles.agendaItemDetailText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.agendaItemDetailRow}>
            <MaterialIcons name="school" size={14} color="#666" />
            <Text style={styles.agendaItemDetailText} numberOfLines={1}>
              {item.grade}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty agenda date
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <MaterialIcons name="event-available" size={24} color="#CCCCCC" />
        <Text style={styles.emptyDateText}>No events scheduled</Text>
        <Text style={styles.emptyDateSubtext}>This day is free</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>📅 School Events Calendar</Text>
          <Text style={styles.headerSubtitle}>
            Stay organized with school events and track attendance
          </Text>
        </View>

        {/* School Events Calendar */}
        <View style={styles.calendarSection}>
          {/* Calendar or Agenda View */}
          <View style={styles.calendarContainer}>
            {calendarViewMode === "calendar" ? (
              <Calendar
                current={selectedDate}
                onDayPress={handleDayPress}
                markedDates={getSchoolEventsMarkedDates()}
                markingType={"dot"}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: theme.colors.text,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.text,
                  textDisabledColor: "#d9e1e8",
                  dotColor: theme.colors.primary,
                  selectedDotColor: "#ffffff",
                  arrowColor: theme.colors.primary,
                  disabledArrowColor: "#d9e1e8",
                  monthTextColor: theme.colors.text,
                  indicatorColor: theme.colors.primary,
                  textDayFontFamily: theme.fonts.regular,
                  textMonthFontFamily: theme.fonts.bold,
                  textDayHeaderFontFamily: theme.fonts.medium,
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
            ) : (
              <Agenda
                items={getAgendaItems()}
                selected={selectedDate}
                renderItem={renderAgendaItem}
                renderEmptyDate={renderEmptyDate}
                rowHasChanged={(r1, r2) => r1.name !== r2.name}
                showClosingKnob={true}
                pastScrollRange={50}
                futureScrollRange={50}
                onDayPress={handleDayPress}
                refreshControl={null}
                refreshing={false}
                loadItemsForMonth={(month) => {
                  console.log("Loading items for month:", month);
                }}
                renderKnob={() => (
                  <View style={styles.agendaKnob}>
                    <View style={styles.agendaKnobLine} />
                  </View>
                )}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: theme.colors.text,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.text,
                  textDisabledColor: "#d9e1e8",
                  arrowColor: theme.colors.primary,
                  disabledArrowColor: "#d9e1e8",
                  monthTextColor: theme.colors.text,
                  indicatorColor: theme.colors.primary,
                  textDayFontFamily: theme.fonts.regular,
                  textMonthFontFamily: theme.fonts.bold,
                  textDayHeaderFontFamily: theme.fonts.medium,
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                  agendaDayTextColor: theme.colors.text,
                  agendaDayNumColor: theme.colors.primary,
                  agendaTodayColor: theme.colors.primary,
                  agendaKnobColor: theme.colors.primary,
                  reservationsBackgroundColor: "#F8F9FA",
                  dotColor: theme.colors.primary,
                  selectedDotColor: "#ffffff",
                }}
                style={styles.agenda}
              />
            )}
          </View>
        </View>

        {/* Selected Date Info */}
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateTitle}>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            {/* School Events for selected date - Agenda Style */}
            {getSchoolEventsForDate(selectedDate).length > 0 ? (
              <View style={styles.selectedDateEvents}>
                <Text style={styles.selectedDateEventsTitle}>
                  📅 Events for this day:
                </Text>
                <View style={styles.selectedDateAgendaList}>
                  {getSchoolEventsForDate(selectedDate).map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      style={[
                        styles.selectedDateAgendaItem,
                        { borderLeftColor: getEventTypeColor(event.type) },
                      ]}
                      onPress={() => handleEventPress(event)}
                    >
                      <View style={styles.agendaItemHeader}>
                        <View style={styles.agendaItemTitleRow}>
                          <Text style={styles.selectedDateEventTitle}>
                            {event.title}
                          </Text>
                          <View
                            style={[
                              styles.selectedDateEventTypeBadge,
                              {
                                backgroundColor:
                                  getEventTypeColor(event.type) + "20",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.selectedDateEventTypeText,
                                { color: getEventTypeColor(event.type) },
                              ]}
                            >
                              {event.type.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.selectedDateEventTime}>
                          {event.time}
                        </Text>
                      </View>

                      <View style={styles.selectedDateEventDetails}>
                        <View style={styles.selectedDateEventDetailRow}>
                          <MaterialIcons name="person" size={14} color="#666" />
                          <Text style={styles.selectedDateEventDetailText}>
                            {event.teacher}
                          </Text>
                        </View>
                        <View style={styles.selectedDateEventDetailRow}>
                          <MaterialIcons
                            name="location-on"
                            size={14}
                            color="#666"
                          />
                          <Text style={styles.selectedDateEventDetailText}>
                            {event.location}
                          </Text>
                        </View>
                        <View style={styles.selectedDateEventDetailRow}>
                          <MaterialIcons name="school" size={14} color="#666" />
                          <Text style={styles.selectedDateEventDetailText}>
                            {event.grade}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.selectedDateEvents}>
                <Text style={styles.selectedDateEventsTitle}>
                  📅 Events for this day:
                </Text>
                <View style={styles.noEventsContainer}>
                  <MaterialIcons name="event-busy" size={48} color="#E0E0E0" />
                  <Text style={styles.noEventsText}>No events scheduled</Text>
                  <Text style={styles.noEventsSubtext}>
                    This day is free from school events
                  </Text>
                </View>
              </View>
            )}

            {/* Upcoming School Events */}

            {/* Attendance for selected date */}
            {getAttendanceForDate(selectedDate) && (
              <View style={styles.selectedDateAttendance}>
                <Text style={styles.selectedDateAttendanceTitle}>
                  📊 Attendance Status:
                </Text>
                <View style={styles.selectedDateAttendanceStatus}>
                  <View
                    style={[
                      styles.attendanceStatusDot,
                      {
                        backgroundColor:
                          getAttendanceForDate(selectedDate).status ===
                          "present"
                            ? "#4CAF50"
                            : getAttendanceForDate(selectedDate).status ===
                                "absent"
                              ? "#FF5722"
                              : getAttendanceForDate(selectedDate).status ===
                                  "holiday"
                                ? "#FF9800"
                                : getAttendanceForDate(selectedDate).status ===
                                    "weekend"
                                  ? "#9E9E9E"
                                  : "#666",
                      },
                    ]}
                  />
                  <View style={styles.attendanceStatusInfo}>
                    <Text style={styles.selectedDateAttendanceText}>
                      {getAttendanceForDate(selectedDate)
                        .status.charAt(0)
                        .toUpperCase() +
                        getAttendanceForDate(selectedDate).status.slice(1)}
                    </Text>
                    {getAttendanceForDate(selectedDate).checkIn && (
                      <Text style={styles.attendanceTimeText}>
                        Check-in: {getAttendanceForDate(selectedDate).checkIn}
                      </Text>
                    )}
                    {getAttendanceForDate(selectedDate).reason && (
                      <Text style={styles.attendanceReasonText}>
                        Reason: {getAttendanceForDate(selectedDate).reason}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Student Attendance Calendar */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarSectionHeaderSimple}>
            <Text style={styles.calendarSectionTitle}>
              📊 Student Attendance Calendar
            </Text>
            <Text style={styles.calendarSectionSubtitle}>
              Track daily attendance with color-coded status indicators
            </Text>
          </View>

          {/* Attendance Type Tabs */}
          <View style={styles.attendanceTabsContainer}>
            <View style={styles.attendanceTabs}>
              <TouchableOpacity
                style={[
                  styles.attendanceTab,
                  activeAttendanceTab === "academic" &&
                    styles.activeAttendanceTab,
                ]}
                onPress={() => setActiveAttendanceTab("academic")}
              >
                <Text
                  style={[
                    styles.attendanceTabText,
                    activeAttendanceTab === "academic" &&
                      styles.activeAttendanceTabText,
                  ]}
                >
                  Academic
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attendanceTab,
                  activeAttendanceTab === "sport" && styles.activeAttendanceTab,
                ]}
                onPress={() => setActiveAttendanceTab("sport")}
              >
                <Text
                  style={[
                    styles.attendanceTabText,
                    activeAttendanceTab === "sport" &&
                      styles.activeAttendanceTabText,
                  ]}
                >
                  Sport
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attendanceTab,
                  activeAttendanceTab === "event" && styles.activeAttendanceTab,
                ]}
                onPress={() => setActiveAttendanceTab("event")}
              >
                <Text
                  style={[
                    styles.attendanceTabText,
                    activeAttendanceTab === "event" &&
                      styles.activeAttendanceTabText,
                  ]}
                >
                  Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Attendance Legend */}
          <View style={styles.attendanceLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF5722" }]}
              />
              <Text style={styles.legendText}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF9800" }]}
              />
              <Text style={styles.legendText}>Holiday</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#9E9E9E" }]}
              />
              <Text style={styles.legendText}>Weekend</Text>
            </View>
          </View>

          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={handleDayPress}
              markedDates={getAttendanceMarkedDates()}
              markingType={"custom"}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: theme.colors.text,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: "#ffffff",
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.text,
                textDisabledColor: "#d9e1e8",
                arrowColor: theme.colors.primary,
                disabledArrowColor: "#d9e1e8",
                monthTextColor: theme.colors.text,
                indicatorColor: theme.colors.primary,
                textDayFontFamily: theme.fonts.regular,
                textMonthFontFamily: theme.fonts.bold,
                textDayHeaderFontFamily: theme.fonts.medium,
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />
          </View>
        </View>

        {/* Attendance Summary */}
        <View style={styles.attendanceContainer}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.sectionTitle}>
              {activeAttendanceTab.charAt(0).toUpperCase() +
                activeAttendanceTab.slice(1)}{" "}
              Attendance Summary
            </Text>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={handleAttendancePress}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <MaterialIcons
                name="arrow-forward"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.attendanceCard}>
            <View style={styles.attendanceStats}>
              <View style={styles.attendanceStat}>
                <Text style={styles.attendanceNumber}>
                  {getCurrentAttendanceData().presentDays}
                </Text>
                <Text style={styles.attendanceLabel}>Present</Text>
                <View
                  style={[
                    styles.attendanceIndicator,
                    { backgroundColor: "#4CAF50" },
                  ]}
                />
              </View>

              <View style={styles.attendanceStat}>
                <Text style={styles.attendanceNumber}>
                  {getCurrentAttendanceData().absentDays}
                </Text>
                <Text style={styles.attendanceLabel}>Absent</Text>
                <View
                  style={[
                    styles.attendanceIndicator,
                    { backgroundColor: "#FF5722" },
                  ]}
                />
              </View>

              <View style={styles.attendanceStat}>
                <Text style={styles.attendanceNumber}>
                  {getCurrentAttendanceData().attendancePercentage}%
                </Text>
                <Text style={styles.attendanceLabel}>Rate</Text>
                <View
                  style={[
                    styles.attendanceIndicator,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              </View>
            </View>

            <View style={styles.recentAttendanceContainer}>
              <Text style={styles.recentAttendanceTitle}>
                Recent{" "}
                {activeAttendanceTab.charAt(0).toUpperCase() +
                  activeAttendanceTab.slice(1)}{" "}
                Attendance
              </Text>
              <View style={styles.recentAttendanceList}>
                {getCurrentAttendanceData().recentAttendance.map(
                  (record, index) => (
                    <View key={index} style={styles.attendanceRecord}>
                      <View style={styles.attendanceRecordInfo}>
                        <Text style={styles.attendanceDate}>
                          {formatDate(record.date)}
                        </Text>
                        {/* Show activity/event info for sport/event attendance */}
                        {(record.activity || record.event) && (
                          <Text style={styles.attendanceActivity}>
                            {record.activity || record.event}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.attendanceStatus,
                          {
                            backgroundColor:
                              record.status === "present"
                                ? "#4CAF50"
                                : record.status === "absent"
                                  ? "#FF5722"
                                  : record.status === "holiday"
                                    ? "#FF9800"
                                    : "#9E9E9E",
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={
                            record.status === "present"
                              ? "check"
                              : record.status === "absent"
                                ? "close"
                                : record.status === "holiday"
                                  ? "beach-access"
                                  : "help"
                          }
                          size={12}
                          color="#FFFFFF"
                        />
                      </View>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Add Event")}
            >
              <MaterialIcons
                name="add-circle"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Add Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("View Full Calendar")}
            >
              <MaterialIcons
                name="calendar-view-month"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Full Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Attendance Report")}
            >
              <MaterialIcons
                name="assessment"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Attendance Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Event Reminders")}
            >
              <MaterialIcons
                name="notifications"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Reminders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 120,
  },
  headerSection: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  calendarSection: {
    marginBottom: theme.spacing.lg,
  },
  calendarSectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  calendarSectionSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  calendarSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  calendarSectionHeaderSimple: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 2,
  },
  viewToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 6,
    marginHorizontal: 1,
  },
  activeViewToggleButton: {
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  activeViewToggleText: {
    color: "#FFFFFF",
  },
  attendanceLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingVertical: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendar: {
    borderRadius: 12,
    paddingBottom: theme.spacing.md,
  },
  agenda: {
    borderRadius: 12,
    height: 450, // Increased height for better visibility
  },
  agendaKnob: {
    width: 40,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 8,
  },
  agendaKnobLine: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  agendaItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  agendaItemHeader: {
    marginBottom: theme.spacing.sm,
  },
  agendaItemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  agendaItemTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  agendaItemTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  agendaItemTypeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
  },
  agendaItemTime: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
  },
  agendaItemDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    lineHeight: 16,
  },
  agendaItemDetails: {
    gap: 4,
  },
  agendaItemDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  agendaItemDetailText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginLeft: 6,
  },
  emptyDate: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
  },
  emptyDateText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyDateSubtext: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 2,
  },
  selectedDateContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 12,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  selectedDateEvents: {
    marginBottom: theme.spacing.md,
  },
  selectedDateEventsTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  selectedDateAgendaList: {
    gap: theme.spacing.sm,
  },
  selectedDateAgendaItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateEventTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  selectedDateEventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  selectedDateEventTypeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
  },
  selectedDateEventTime: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
  selectedDateEventDetails: {
    marginTop: theme.spacing.sm,
    gap: 4,
  },
  selectedDateEventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedDateEventDetailText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginLeft: 6,
  },
  noEventsContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginTop: theme.spacing.sm,
  },
  noEventsText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: "#999999",
    marginTop: theme.spacing.sm,
  },
  noEventsSubtext: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#CCCCCC",
    marginTop: 4,
    textAlign: "center",
  },
  selectedDateEvent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedDateEventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  selectedDateEventInfo: {
    flex: 1,
  },
  selectedDateEventText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 2,
  },
  selectedDateEventType: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
  },
  selectedDateAttendance: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: theme.spacing.md,
  },
  selectedDateAttendanceTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  selectedDateAttendanceStatus: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  attendanceStatusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  attendanceStatusInfo: {
    flex: 1,
  },
  selectedDateAttendanceText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  attendanceTimeText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  attendanceReasonText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  viewToggleContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  viewToggleButtons: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderRadius: 6,
  },
  activeViewToggleButton: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
  },
  activeViewToggleText: {
    color: theme.colors.primary,
  },
  attendanceContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  attendanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4,
  },
  attendanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attendanceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
  },
  attendanceStat: {
    alignItems: "center",
  },
  attendanceNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.text,
  },
  attendanceLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  attendanceIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginTop: 4,
  },
  recentAttendanceContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: theme.spacing.md,
  },
  recentAttendanceTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  recentAttendanceList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attendanceRecord: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  attendanceDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  attendanceStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  // Upcoming Events Styles
  upcomingEventsContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 16,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  upcomingEventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  upcomingEventsTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "10",
  },
  viewAllText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4,
  },
  upcomingEventsList: {
    gap: 0,
  },
  upcomingEventCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  upcomingEventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  upcomingEventIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  upcomingEventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  upcomingEventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  upcomingEventTypeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
  },
  upcomingEventDateContainer: {
    alignItems: "flex-end",
  },
  upcomingEventDate: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.text,
  },
  upcomingEventTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  upcomingEventContent: {
    marginBottom: theme.spacing.sm,
  },
  upcomingEventTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  upcomingEventSubject: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
  },
  upcomingEventDetails: {
    gap: 4,
    marginBottom: theme.spacing.sm,
  },
  upcomingEventDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  upcomingEventDetailText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  upcomingEventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  upcomingEventGrade: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#888",
  },
  eventsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  eventTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  eventSubject: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
  },
  eventDateTime: {
    alignItems: "flex-end",
  },
  eventDate: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
  },
  eventTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  eventDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventDetailText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  // Attendance Tab Styles
  attendanceTabsContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  attendanceTabs: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  attendanceTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeAttendanceTab: {
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  attendanceTabText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
  },
  activeAttendanceTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  // Enhanced Attendance Record Styles
  attendanceRecordInfo: {
    flex: 1,
  },
  attendanceActivity: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
    fontStyle: "italic",
  },
});

export default CalendarMain;
