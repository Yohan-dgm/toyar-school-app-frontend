// Student Growth Dummy Data - 13 Intelligence Categories
export const studentGrowthMetrics = [
  {
    id: "intrapersonal",
    title: "Intrapersonal Intelligence",
    icon: "psychology",
    rating: 4.2,
    level: "Good",
    color: "#8B5CF6",
    description: "Self-awareness and understanding of one's own emotions",
    trend: [3.8, 4.0, 4.1, 4.2],
    classAverage: 3.9,
  },
  {
    id: "interpersonal",
    title: "Interpersonal Intelligence",
    icon: "groups",
    rating: 4.0,
    level: "Good",
    color: "#3B82F6",
    description: "Understanding and interacting effectively with others",
    trend: [3.5, 3.8, 3.9, 4.0],
    classAverage: 3.7,
  },
  {
    id: "music",
    title: "Music Intelligence",
    icon: "music-note",
    rating: 3.8,
    level: "Good",
    color: "#06B6D4",
    description: "Sensitivity to rhythm, pitch, and musical patterns",
    trend: [3.2, 3.5, 3.7, 3.8],
    classAverage: 3.6,
  },
  {
    id: "bodily_kinesthetic",
    title: "Bodily Kinesthetic Intelligence",
    icon: "directions-run",
    rating: 4.3,
    level: "Good",
    color: "#10B981",
    description: "Physical movement and body coordination skills",
    trend: [3.8, 4.0, 4.1, 4.3],
    classAverage: 3.8,
  },
  {
    id: "linguistic",
    title: "Linguistic Intelligence",
    icon: "record-voice-over",
    rating: 4.1,
    level: "Good",
    color: "#F59E0B",
    description: "Language skills and verbal communication",
    trend: [3.7, 3.9, 4.0, 4.1],
    classAverage: 3.8,
  },
  {
    id: "mathematical_logical",
    title: "Mathematical / Logical Intelligence",
    icon: "calculate",
    rating: 4.5,
    level: "Excellent",
    color: "#EF4444",
    description: "Mathematical reasoning and logical thinking",
    trend: [4.0, 4.2, 4.3, 4.5],
    classAverage: 4.0,
  },
  {
    id: "existential",
    title: "Existential Intelligence",
    icon: "quiz",
    rating: 3.7,
    level: "Good",
    color: "#EC4899",
    description: "Understanding of existence and philosophical thinking",
    trend: [3.2, 3.4, 3.6, 3.7],
    classAverage: 3.4,
  },
  {
    id: "spatial",
    title: "Spatial Intelligence",
    icon: "3d-rotation",
    rating: 4.0,
    level: "Good",
    color: "#8B5A3C",
    description: "Visual-spatial processing and artistic abilities",
    trend: [3.6, 3.8, 3.9, 4.0],
    classAverage: 3.7,
  },
  {
    id: "naturalistic",
    title: "Naturalistic Intelligence",
    icon: "nature",
    rating: 3.9,
    level: "Good",
    color: "#059669",
    description: "Understanding of nature and environmental awareness",
    trend: [3.4, 3.6, 3.8, 3.9],
    classAverage: 3.5,
  },
  {
    id: "school_community",
    title: "Contribution to School Community",
    icon: "school",
    rating: 4.1,
    level: "Good",
    color: "#7C3AED",
    description: "Active participation in school activities and community",
    trend: [3.7, 3.9, 4.0, 4.1],
    classAverage: 3.8,
  },
  {
    id: "society",
    title: "Contribution to Society",
    icon: "public",
    rating: 3.8,
    level: "Good",
    color: "#DB2777",
    description: "Social responsibility and community service",
    trend: [3.2, 3.5, 3.7, 3.8],
    classAverage: 3.6,
  },
  {
    id: "attendance",
    title: "Attendance and Punctuality",
    icon: "schedule",
    rating: 4.8,
    level: "Excellent",
    color: "#0891B2",
    description: "Regular attendance and punctuality to school",
    trend: [4.5, 4.6, 4.7, 4.8],
    classAverage: 4.2,
  },
  {
    id: "lifeskills",
    title: "Life Skills Development",
    icon: "build",
    rating: 3.5,
    level: "Good",
    color: "#DC2626",
    description: "Development of practical life skills and independence",
    trend: [3.0, 3.2, 3.4, 3.5],
    classAverage: 3.3,
  },
];

// Calculate overall rating from all intelligence metrics
const calculateOverallRating = () => {
  const total = studentGrowthMetrics.reduce(
    (sum, metric) => sum + metric.rating,
    0,
  );
  return total / studentGrowthMetrics.length;
};

const calculateOverallTrend = () => {
  const termCount = studentGrowthMetrics[0].trend.length;
  const overallTrend = [];

  for (let termIndex = 0; termIndex < termCount; termIndex++) {
    const termTotal = studentGrowthMetrics.reduce(
      (sum, metric) => sum + metric.trend[termIndex],
      0,
    );
    overallTrend.push(termTotal / studentGrowthMetrics.length);
  }

  return overallTrend;
};

const calculateOverallClassAverage = () => {
  const total = studentGrowthMetrics.reduce(
    (sum, metric) => sum + metric.classAverage,
    0,
  );
  return total / studentGrowthMetrics.length;
};

// Overall rating card data
export const overallRatingData = {
  id: "overall",
  title: "Overall Intelligence Rating",
  icon: "analytics",
  rating: calculateOverallRating(),
  level:
    calculateOverallRating() >= 4.5
      ? "Excellent"
      : calculateOverallRating() >= 3.5
        ? "Good"
        : "Needs Attention",
  color: "#6366F1",
  description: "Comprehensive assessment across all intelligence areas",
  trend: calculateOverallTrend(),
  classAverage: calculateOverallClassAverage(),
};

// Combined data with overall rating at the beginning
export const allIntelligenceData = [overallRatingData, ...studentGrowthMetrics];

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

// Modern UI Colors - Premium Purple/Blue gradient theme
export const modernColors = {
  primary: "#8B5CF6",
  secondary: "#3B82F6",
  accent: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
  backgroundSolid: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceGlass: "rgba(255, 255, 255, 0.25)",
  text: "#1E293B",
  textSecondary: "#64748B",
  shadow: "rgba(139, 92, 246, 0.1)",
  border: "rgba(255, 255, 255, 0.2)",
  premium: {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    platinum: "#E5E4E2",
  },
};

// Maroon Color Theme for Grid View
export const maroonTheme = {
  primary: "#800000",
  secondary: "#A52A2A",
  accent: "#B22222",
  light: "#CD5C5C",
  dark: "#8B0000",
  gradient: {
    start: "#800000",
    middle: "#A52A2A",
    end: "#B22222",
  },
  background: {
    main: "rgba(128, 0, 0, 0.1)",
    secondary: "rgba(139, 0, 0, 0.05)",
    glass: "rgba(128, 0, 0, 0.15)",
  },
  border: "rgba(128, 0, 0, 0.3)",
  shadow: "rgba(128, 0, 0, 0.15)",
};

// Modern Feedback Card Theme - White, Black, Maroon
export const feedbackCardTheme = {
  // Primary Colors
  primary: "#800000", // Maroon
  primaryLight: "#A52A2A", // Light Maroon
  primaryDark: "#5D0000", // Dark Maroon

  // Neutral Colors
  white: "#FFFFFF", // Pure White
  black: "#000000", // Pure Black
  grayDark: "#2C2C2C", // Dark Gray for text
  grayMedium: "#666666", // Medium Gray for secondary text
  grayLight: "#F5F5F5", // Light Gray for backgrounds

  // Surface Colors
  surface: "#FFFFFF", // Card background
  surfaceElevated: "#FFFFFF", // Elevated surfaces
  background: "#F8F9FA", // Screen background

  // Status Colors (Maroon variants)
  success: "#4A7C59", // Dark Green with maroon undertone
  warning: "#B8860B", // Dark Gold
  error: "#CD5C5C", // Light maroon for errors
  info: "#800080", // Purple with maroon undertone

  // Interactive States
  hover: "rgba(128, 0, 0, 0.08)",
  pressed: "rgba(128, 0, 0, 0.12)",
  focus: "rgba(128, 0, 0, 0.16)",

  // Shadows & Borders
  shadow: {
    small: "rgba(0, 0, 0, 0.08)",
    medium: "rgba(0, 0, 0, 0.12)",
    large: "rgba(0, 0, 0, 0.16)",
  },
  border: {
    light: "rgba(128, 0, 0, 0.12)",
    medium: "rgba(128, 0, 0, 0.24)",
    dark: "rgba(128, 0, 0, 0.36)",
  },

  // Gradients
  gradient: {
    primary: "linear-gradient(135deg, #800000 0%, #A52A2A 100%)",
    surface: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
    subtle:
      "linear-gradient(135deg, rgba(128, 0, 0, 0.02) 0%, rgba(128, 0, 0, 0.06) 100%)",
  },

  // Animation Colors
  animation: {
    fadeIn: "rgba(128, 0, 0, 0.0)",
    fadeOut: "rgba(128, 0, 0, 0.24)",
    pulse: "rgba(128, 0, 0, 0.16)",
  },
};

// Pie Chart Data for 12 categories
export const pieChartData = studentGrowthMetrics.map((metric, index) => ({
  key: metric.id,
  value: metric.rating * 2, // Convert rating to percentage-like value
  svg: { fill: metric.color },
  arc: { outerRadius: "100%", padAngle: 0.02 },
  title: metric.title,
  percentage: Math.round(metric.rating * 20), // Convert to percentage
}));

// Multi-line chart data for trends
export const multiLineChartData = [
  {
    data: [65, 68, 72, 74, 78, 82, 85, 88, 92, 89, 91, 94],
    svg: { stroke: modernColors.primary, strokeWidth: 3 },
    key: "overall",
  },
  {
    data: [58, 62, 65, 69, 72, 75, 79, 82, 85, 88, 86, 89],
    svg: { stroke: modernColors.secondary, strokeWidth: 3 },
    key: "academic",
  },
  {
    data: [70, 72, 75, 73, 76, 79, 82, 84, 87, 85, 88, 90],
    svg: { stroke: modernColors.accent, strokeWidth: 3 },
    key: "behaviour",
  },
  {
    data: [62, 65, 68, 71, 74, 77, 80, 83, 86, 84, 87, 89],
    svg: { stroke: modernColors.success, strokeWidth: 3 },
    key: "emotional",
  },
];

// Stacked Area Chart Data for 13 Intelligence Categories
export const stackedAreaData = [
  {
    month: "Jan",
    intrapersonal: 84,
    interpersonal: 80,
    music: 76,
    bodily_kinesthetic: 86,
    linguistic: 82,
    mathematical_logical: 90,
    existential: 74,
    spatial: 80,
    naturalistic: 78,
    school_community: 82,
    society: 76,
    attendance: 96,
    lifeskills: 70,
  },
  {
    month: "Feb",
    intrapersonal: 86,
    interpersonal: 82,
    music: 78,
    bodily_kinesthetic: 88,
    linguistic: 84,
    mathematical_logical: 92,
    existential: 76,
    spatial: 82,
    naturalistic: 80,
    school_community: 84,
    society: 78,
    attendance: 97,
    lifeskills: 72,
  },
  {
    month: "Mar",
    intrapersonal: 88,
    interpersonal: 84,
    music: 80,
    bodily_kinesthetic: 90,
    linguistic: 86,
    mathematical_logical: 94,
    existential: 78,
    spatial: 84,
    naturalistic: 82,
    school_community: 86,
    society: 80,
    attendance: 98,
    lifeskills: 74,
  },
  {
    month: "Apr",
    intrapersonal: 90,
    interpersonal: 86,
    music: 82,
    bodily_kinesthetic: 92,
    linguistic: 88,
    mathematical_logical: 96,
    existential: 80,
    spatial: 86,
    naturalistic: 84,
    school_community: 88,
    society: 82,
    attendance: 99,
    lifeskills: 76,
  },
  {
    month: "May",
    intrapersonal: 92,
    interpersonal: 88,
    music: 84,
    bodily_kinesthetic: 94,
    linguistic: 90,
    mathematical_logical: 98,
    existential: 82,
    spatial: 88,
    naturalistic: 86,
    school_community: 90,
    society: 84,
    attendance: 100,
    lifeskills: 78,
  },
  {
    month: "Jun",
    intrapersonal: 94,
    interpersonal: 90,
    music: 86,
    bodily_kinesthetic: 96,
    linguistic: 92,
    mathematical_logical: 100,
    existential: 84,
    spatial: 90,
    naturalistic: 88,
    school_community: 92,
    society: 86,
    attendance: 100,
    lifeskills: 80,
  },
];

// Time filter options
export const timeFilters = [
  { id: "day", label: "Day", active: false },
  { id: "week", label: "Week", active: true },
  { id: "month", label: "Month", active: false },
  { id: "year", label: "Year", active: false },
  { id: "all", label: "All", active: false },
];

// Intelligence Grid specific filters (Dynamic)
export const getIntelligenceGridFilters = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleDateString("en-US", { month: "short" });

  return [
    { id: "all", label: "All", active: false },
    { id: "current-year", label: currentYear.toString(), active: true }, // Auto-selected
    {
      id: "current-month",
      label: `${currentMonth} ${currentYear}`,
      active: false,
    },
  ];
};

// Legacy static filters for backward compatibility
export const intelligenceGridFilters = getIntelligenceGridFilters();

// Filter logic for intelligence data
export const getFilteredIntelligenceData = (filterId) => {
  // For now, return all data regardless of filter
  // In a real app, this would filter based on time periods
  switch (filterId) {
    case "all":
      return allIntelligenceData.slice(1); // Exclude overall rating
    case "current-year":
      return allIntelligenceData.slice(1); // Show current year data
    case "current-month":
      return allIntelligenceData.slice(1); // Show current month data
    default:
      return allIntelligenceData.slice(1);
  }
};
