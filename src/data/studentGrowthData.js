// Student Growth Dummy Data
export const studentGrowthMetrics = [
  {
    id: "overall",
    title: "Overall",
    icon: "star",
    rating: 4.2,
    level: "Good",
    color: "#920734",
    description: "Overall student performance across all areas",
    trend: [3.8, 4.0, 4.1, 4.2],
    classAverage: 3.9,
  },
  {
    id: "attendance",
    title: "Attendance & Punctuality",
    icon: "schedule",
    rating: 4.8,
    level: "Excellent",
    color: "#00C4B4",
    description: "Regular attendance and punctuality to school",
    trend: [4.5, 4.6, 4.7, 4.8],
    classAverage: 4.2,
  },
  {
    id: "behaviour",
    title: "Behaviour & Discipline",
    icon: "psychology",
    rating: 4.0,
    level: "Good",
    color: "#A100FF",
    description: "Classroom behavior and following school rules",
    trend: [3.5, 3.8, 3.9, 4.0],
    classAverage: 3.7,
  },
  {
    id: "emotional",
    title: "Emotional & Social Skills",
    icon: "favorite",
    rating: 3.8,
    level: "Good",
    color: "#FF6B6B",
    description: "Emotional intelligence and social interactions",
    trend: [3.2, 3.5, 3.7, 3.8],
    classAverage: 3.6,
  },
  {
    id: "academic",
    title: "Academic Performance",
    icon: "school",
    rating: 4.5,
    level: "Excellent",
    color: "#0057FF",
    description: "Performance in academic subjects and assessments",
    trend: [4.0, 4.2, 4.3, 4.5],
    classAverage: 4.0,
  },
  {
    id: "lifeskills",
    title: "Life Skill Development",
    icon: "build",
    rating: 3.5,
    level: "Good",
    color: "#FFC107",
    description: "Development of practical life skills and independence",
    trend: [3.0, 3.2, 3.4, 3.5],
    classAverage: 3.3,
  },
  {
    id: "extracurricular",
    title: "Extra Curricular Activities",
    icon: "sports",
    rating: 4.3,
    level: "Good",
    color: "#4CAF50",
    description: "Participation and performance in sports and activities",
    trend: [3.8, 4.0, 4.1, 4.3],
    classAverage: 3.8,
  },
];

// Level mapping function
export const getLevelFromRating = (rating) => {
  if (rating >= 4.5) return { level: "Excellent", color: "#4CAF50" };
  if (rating >= 3.5) return { level: "Good", color: "#2196F3" };
  if (rating >= 2.5) return { level: "Needs Attention", color: "#FF9800" };
  return { level: "At-Risk Level", color: "#F44336" };
};

// Educator Feedback Data
export const educatorFeedback = [
  {
    id: 1,
    educatorName: "Ms. Sarah Johnson",
    educatorRole: "Class Teacher",
    subject: "Mathematics",
    rating: 4,
    category: "Academic Performance",
    subCategory: "Problem Solving",
    comment:
      "Emma has shown excellent progress in mathematical problem-solving. Her analytical thinking has improved significantly this term.",
    timestamp: "2024-07-15T14:30:00Z",
    isRecent: true,
    approved_by: "Principal Mr. Asanka",
    metadata: {
      educator: "Ms. Sarah Johnson",
      class_teacher: "Ms. Sarah Johnson",
      principal: "Mr. Asanka",
    },
  },
  {
    id: 2,
    educatorName: "Mr. David Chen",
    educatorRole: "PE Teacher",
    subject: "Physical Education",
    rating: 5,
    category: "Extra Curricular",
    subCategory: "Team Sports",
    comment:
      "Outstanding performance in team sports. Shows great leadership qualities and sportsmanship during games.",
    timestamp: "2024-07-14T10:15:00Z",
    isRecent: true,
    approved_by: "Principal Mr. Asanka",
    metadata: {
      educator: "Mr. David Chen",
      class_teacher: "Ms. Sarah Johnson",
      principal: "Mr. Asanka",
    },
  },
  {
    id: 3,
    educatorName: "Ms. Lisa Wong",
    educatorRole: "Art Teacher",
    subject: "Creative Arts",
    rating: 4,
    category: "Life Skills",
    subCategory: "Creativity",
    comment:
      "Emma demonstrates exceptional creativity in her artwork. Her attention to detail and artistic expression continue to develop beautifully.",
    timestamp: "2024-07-12T16:45:00Z",
    isRecent: false,
    approved_by: "Principal Mr. Asanka",
    metadata: {
      educator: "Ms. Lisa Wong",
      class_teacher: "Ms. Sarah Johnson",
      principal: "Mr. Asanka",
    },
  },
  {
    id: 4,
    educatorName: "Dr. Michael Roberts",
    educatorRole: "Science Teacher",
    subject: "Science",
    rating: 3,
    category: "Academic Performance",
    subCategory: "Laboratory Work",
    comment:
      "Good understanding of scientific concepts but needs to improve laboratory safety procedures and attention to detail during experiments.",
    timestamp: "2024-07-10T11:20:00Z",
    isRecent: false,
    approved_by: "Principal Mr. Asanka",
    metadata: {
      educator: "Dr. Michael Roberts",
      class_teacher: "Ms. Sarah Johnson",
      principal: "Mr. Asanka",
    },
  },
];

// Attendance Data
export const attendanceData = {
  totalDays: 180,
  presentDays: 172,
  absentDays: 8,
  lateDays: 5,
  attendancePercentage: 95.6,
  weeklyData: [
    {
      week: "Week 1",
      days: [
        { date: "2024-07-15", status: "present", time: "08:00" },
        { date: "2024-07-16", status: "present", time: "08:05" },
        { date: "2024-07-17", status: "late", time: "08:15" },
        { date: "2024-07-18", status: "present", time: "07:55" },
        { date: "2024-07-19", status: "present", time: "08:00" },
      ],
    },
    {
      week: "Week 2",
      days: [
        { date: "2024-07-22", status: "present", time: "08:00" },
        { date: "2024-07-23", status: "absent", time: null },
        { date: "2024-07-24", status: "present", time: "08:10" },
        { date: "2024-07-25", status: "present", time: "07:58" },
        { date: "2024-07-26", status: "present", time: "08:02" },
      ],
    },
  ],
  monthlyStats: {
    july: { present: 20, absent: 2, late: 1, percentage: 95.2 },
    june: { present: 22, absent: 1, late: 2, percentage: 96.0 },
    may: { present: 21, absent: 2, late: 1, percentage: 95.5 },
  },
};

// Chart data for different metrics
export const getChartDataForMetric = (metricId) => {
  const metric = studentGrowthMetrics.find((m) => m.id === metricId);
  if (!metric) return null;

  return {
    barData: metric.trend.map((value, index) => ({
      value: value,
      label: `Term ${index + 1}`,
      frontColor: metric.color,
    })),
    lineData: metric.trend.map((value, index) => ({
      value: value,
      dataPointText: value.toString(),
    })),
    classAverageData: metric.trend.map(() => metric.classAverage),
  };
};
