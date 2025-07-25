import React, { useState, useRef } from "react";

// ===== CONSTANTS =====
// Define grades as a constant outside the component to prevent re-initialization issues
const FRONTEND_GRADES = [
  { id: 1, name: "Grade 1", active: true },
  { id: 2, name: "Grade 2", active: true },
  { id: 3, name: "Grade 3", active: true },
  { id: 4, name: "Grade 4", active: true },
  { id: 5, name: "Grade 5", active: true },
  { id: 6, name: "Grade 6", active: true },
  { id: 7, name: "Grade 7", active: true },
  { id: 8, name: "Grade 8", active: true },
  { id: 9, name: "Grade 9", active: true },
  { id: 10, name: "Grade 10", active: true },
  { id: 11, name: "Grade 11", active: true },
  { id: 12, name: "Grade 12", active: true },
  { id: 13, name: "EY1", active: true },
  { id: 14, name: "EY2", active: true },
  { id: 15, name: "EY3", active: true },
] as const;
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import FullScreenModal from "../components/FullScreenModal";

// API imports (students and feedback submission)
import {
  useGetStudentsByGradeQuery,
  useSubmitEducatorFeedbackMutation,
  useCreateFeedbackCategoryMutation,
} from "@/api/educator-feedback-api";

// Utils imports
import {
  getStudentProfilePicture,
  getDefaultStudentProfileImage,
  getLocalFallbackProfileImage,
} from "@/utils/studentProfileUtils";

// Component imports
import AddCategoryPopup from "../../../../../components/educator-feedback/AddCategoryPopup";

interface EducatorFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FeedbackItem {
  id: string;
  student: {
    name: string;
    admissionNumber: string;
    grade: string;
    profileImage?: string;
  };
  description: string;
  createdBy: string;
  date: string;
  rating: number;
  categories: string[];
  primaryCategory: string;
}

const EducatorFeedbackModal: React.FC<EducatorFeedbackModalProps> = ({
  visible = false,
  onClose,
}) => {
  // ===== PROP VALIDATION =====
  // Add safety checks for props
  if (typeof visible !== "boolean") {
    console.warn(
      "⚠️ EducatorFeedbackModal: 'visible' prop should be boolean, received:",
      typeof visible,
      visible
    );
  }
  if (typeof onClose !== "function") {
    console.warn(
      "⚠️ EducatorFeedbackModal: 'onClose' prop should be function, received:",
      typeof onClose,
      onClose
    );
  }

  // ===== COMPONENT LOGIC =====
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [selectedEducator, setSelectedEducator] = useState("All");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null
  );

  // Add Feedback Modal States
  const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false);
  const [selectedGradeForStudent, setSelectedGradeForStudent] =
    useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [feedbackRating, setFeedbackRating] = useState(0);

  // Add Category Modal State
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  
  // API Hooks for category management
  const [createFeedbackCategory, { isLoading: isCreatingCategory }] = useCreateFeedbackCategoryMutation();
  const [customCategories, setCustomCategories] = useState<
    Array<{
      id: string;
      title: string;
      questions: Array<{
        id: number;
        text: string;
        answerType: string;
        mcqOptions?: Array<{ id: number; text: string; marks: number }>;
        marks: number;
      }>;
    }>
  >([]);

  // Debug state changes
  React.useEffect(() => {
    console.log(
      "🔍 showAddCategoryPopup state changed to:",
      showAddCategoryPopup
    );
  }, [showAddCategoryPopup]);

  // Questionnaire States (inline display)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<{
    [key: string]: any;
  }>({});

  // Refs for input focus
  const descriptionInputRef = useRef<TextInput>(null);

  // ===== FRONTEND GRADES DEFINITION =====
  // Use the constant grades defined outside the component for maximum safety
  const frontendGrades = FRONTEND_GRADES;

  // ===== EARLY SAFETY CHECK =====
  // Ensure frontendGrades is properly initialized before proceeding
  if (
    !frontendGrades ||
    !Array.isArray(frontendGrades) ||
    frontendGrades.length === 0
  ) {
    console.error(
      "❌ Frontend grades not properly initialized:",
      frontendGrades
    );
    return null; // Don't render if grades aren't ready
  }

  // ===== API HOOKS =====

  // Get student list data (includes grades and student counts) - only when modal is visible
  // Remove the student list API call since we're using frontend grades
  // const {
  //   data: studentListData,
  //   isLoading: studentListLoading,
  //   error: studentListError,
  //   isSuccess: studentListSuccess,
  //   isError: studentListIsError
  // } = useGetStudentListDataQuery(undefined, {
  //   skip: !visible, // Only fetch when modal is visible
  //   // Add retry and error handling
  //   pollingInterval: 0, // Disable polling
  //   refetchOnFocus: false,
  //   refetchOnReconnect: false,
  // });

  // Since we're using frontend grades, set these to appropriate values
  const studentListData = null;
  const studentListLoading = false;
  const studentListError = null;
  const studentListSuccess = true;
  const studentListIsError = false;

  // Categories will use dummy data for now (commented out API call)
  // const {
  //   data: categoriesData,
  //   isLoading: categoriesLoading,
  //   error: categoriesError
  // } = useGetFeedbackCategoriesWithQuestionsQuery();

  // Get students by selected grade - use frontend grades to get ID (with safety check)
  const selectedGradeId = React.useMemo(() => {
    if (
      !frontendGrades ||
      !Array.isArray(frontendGrades) ||
      !selectedGradeForStudent
    ) {
      return undefined;
    }
    return frontendGrades.find((g: any) => g?.name === selectedGradeForStudent)
      ?.id;
  }, [frontendGrades, selectedGradeForStudent]);

  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudentsByGradeQuery(
    {
      grade_level_id: selectedGradeId,
      search: "", // Add search functionality later
    },
    {
      skip: !visible || !selectedGradeId, // Only fetch when modal is visible and grade ID is available
    }
  );

  // Feedback submission mutation
  const [submitFeedback, { isLoading: isSubmitting }] =
    useSubmitEducatorFeedbackMutation();

  const itemsPerPage = 10;

  // ===== DATA PROCESSING =====

  // Use frontend grades instead of API grades
  const gradesFromAPI = frontendGrades;
  // console.log("🎓 Frontend Grades (length):", gradesFromAPI?.length);
  // console.log("🎓 Frontend Grades defined:", !!gradesFromAPI);
  // console.log("🎯 Selected Grade:", selectedGradeForStudent);
  // console.log("🔢 Selected Grade ID:", selectedGradeId);
  // console.log("🔍 Students Loading:", studentsLoading);
  // console.log("❌ Students Error:", studentsError);
  if (studentsError) {
    console.log(
      "❌ Students Error Details:",
      JSON.stringify(studentsError, null, 2)
    );
  }
  console.log("👥 Students Data:", studentsData);
  if (studentsData?.data?.students) {
    console.log(
      `📊 Students Found: ${studentsData.data.students.length} students for grade ${selectedGradeForStudent}`
    );
  }

  // Process students data with profile images - add comprehensive safety checks
  const processedStudentsList = (studentsData?.data?.students || [])
    .filter((student: any) => {
      // More comprehensive validation
      if (!student) {
        console.warn("⚠️ Null/undefined student found, filtering out");
        return false;
      }
      if (!student.id && student.id !== 0) {
        console.warn("⚠️ Student without valid ID found:", student);
        return false;
      }
      return true;
    })
    .map((student: any) => {
      try {
        const profileImageSource = getStudentProfilePicture(student);

        // Ensure all text fields are valid strings
        const name = String(
          student.name || student.full_name || `Student ${student.id}`
        );
        const admissionNumber = String(student.admission_number || "N/A");
        const grade = String(student.grade || "Unknown Grade");

        return {
          id: student.id,
          name: name,
          admissionNumber: admissionNumber,
          grade: grade,
          profileImage: profileImageSource?.uri || null,
          profileImageHeaders: profileImageSource?.headers,
          // Keep original student data but ensure safe conversion
          ...student,
          // Override with safe values
          name: name,
          admissionNumber: admissionNumber,
          grade: grade,
        };
      } catch (error) {
        console.error("❌ Error processing student:", student, error);
        // Return completely safe fallback object
        return {
          id: student?.id || Math.random().toString(),
          name: "Error Loading Student",
          admissionNumber: "N/A",
          grade: "Unknown Grade",
          profileImage: null,
          profileImageHeaders: undefined,
          // Add other required safe fields
          full_name: "Error Loading Student",
          admission_number: "N/A",
        };
      }
    });

  console.log(
    "👥 Processed Students:",
    processedStudentsList.length,
    "students"
  );

  // Use grades from API instead of hardcoded list - add safety checks
  const availableGrades = (gradesFromAPI || [])
    .filter((grade: any) => {
      if (!grade) {
        console.warn("⚠️ Null/undefined grade found, filtering out");
        return false;
      }
      if (!grade.name && grade.name !== "") {
        console.warn("⚠️ Grade without valid name found:", grade);
        return false;
      }
      return true;
    })
    .map((grade: any) =>
      String(grade.name || `Grade ${grade.id || "Unknown"}`)
    );

  // Filter students based on selected grade (already filtered by API, but keep for consistency)
  const filteredStudentsList = processedStudentsList || [];

  // Use dummy categories data for now (will be replaced with API later)
  // const mainCategoriesFromAPI = categoriesData?.data || [];
  // const selectedCategoryData = mainCategoriesFromAPI.find((cat: any) => cat.name === mainCategory);
  // const questionnaireData = selectedCategoryData?.questions || [];
  // const subcategoriesFromAPI = selectedCategoryData?.subcategories || [];

  // Answer types
  const ANSWER_TYPES = {
    SCALE: "scale", // 1-5 range with labels
    PREDEFINED: "predefined", // List of answers with marks
    CUSTOM: "custom", // Text input, no marks
  };

  // Scale labels for 1-5 rating
  const SCALE_LABELS = {
    1: "Very Low",
    2: "Low",
    3: "Average",
    4: "High",
    5: "Very High",
  };

  // Questionnaire for main categories with answer types
  const questionnaireData: {
    [key: string]: Array<{
      id: string;
      question: string;
      answerType: string;
      options?: Array<{ text: string; marks: number }>;
    }>;
  } = {
    "Academic Performance": [
      {
        id: "academic_1",
        question: "How well does the student grasp new academic concepts?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "academic_2",
        question:
          "Does the student demonstrate critical thinking in academic work?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Excellent critical analysis and reasoning", marks: 5 },
          { text: "Good analytical thinking with minor gaps", marks: 4 },
          { text: "Basic critical thinking skills", marks: 3 },
          { text: "Limited analytical approach", marks: 2 },
          { text: "Struggles with critical analysis", marks: 1 },
        ],
      },
      {
        id: "academic_3",
        question:
          "Describe the student's problem-solving approach and methodology:",
        answerType: ANSWER_TYPES.CUSTOM,
      },
      {
        id: "academic_4",
        question: "Does the student show consistent effort in academic tasks?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "academic_5",
        question: "How well does the student apply learned concepts?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Applies concepts fluently in new situations", marks: 5 },
          { text: "Good application with occasional guidance", marks: 4 },
          { text: "Applies concepts in familiar contexts", marks: 3 },
          { text: "Needs support to apply concepts", marks: 2 },
          { text: "Struggles to apply learned material", marks: 1 },
        ],
      },
    ],
    "Behavioral Development": [
      {
        id: "behavior_1",
        question:
          "How well does the student follow classroom rules and procedures?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "behavior_2",
        question: "Does the student show respect for teachers and peers?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Always respectful and courteous", marks: 5 },
          { text: "Generally respectful with occasional lapses", marks: 4 },
          { text: "Shows basic respect most of the time", marks: 3 },
          { text: "Sometimes disrespectful or rude", marks: 2 },
          { text: "Frequently shows disrespect", marks: 1 },
        ],
      },
      {
        id: "behavior_3",
        question: "Describe any specific behavioral observations or incidents:",
        answerType: ANSWER_TYPES.CUSTOM,
      },
      {
        id: "behavior_4",
        question: "How is the student's self-discipline and self-control?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "behavior_5",
        question: "Does the student take responsibility for their actions?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Always takes full responsibility", marks: 5 },
          { text: "Usually accepts responsibility", marks: 4 },
          { text: "Takes responsibility when prompted", marks: 3 },
          { text: "Reluctant to accept responsibility", marks: 2 },
          { text: "Avoids or denies responsibility", marks: 1 },
        ],
      },
    ],
    "Social Skills": [
      {
        id: "social_1",
        question: "How effectively does the student communicate with others?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "social_2",
        question: "Does the student work well in group settings?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Excellent team player and collaborator", marks: 5 },
          { text: "Works well with most group members", marks: 4 },
          { text: "Participates adequately in group work", marks: 3 },
          { text: "Sometimes struggles in group settings", marks: 2 },
          { text: "Prefers to work alone or causes conflicts", marks: 1 },
        ],
      },
      {
        id: "social_3",
        question:
          "Describe the student's peer relationships and social interactions:",
        answerType: ANSWER_TYPES.CUSTOM,
      },
      {
        id: "social_4",
        question: "How does the student handle disagreements or conflicts?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "social_5",
        question:
          "Does the student show empathy and understanding toward others?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Highly empathetic and understanding", marks: 5 },
          { text: "Shows good empathy in most situations", marks: 4 },
          { text: "Demonstrates basic empathy", marks: 3 },
          { text: "Limited empathy or understanding", marks: 2 },
          { text: "Lacks empathy or concern for others", marks: 1 },
        ],
      },
    ],
    "Creative Arts": [
      {
        id: "creative_1",
        question: "How does the student express creativity in artistic work?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "creative_2",
        question: "Does the student show originality and innovation?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Highly original and innovative ideas", marks: 5 },
          { text: "Shows good creativity with unique touches", marks: 4 },
          { text: "Demonstrates basic creative thinking", marks: 3 },
          { text: "Limited originality in creative work", marks: 2 },
          { text: "Relies heavily on copying or templates", marks: 1 },
        ],
      },
      {
        id: "creative_3",
        question:
          "Describe specific examples of the student's creative achievements:",
        answerType: ANSWER_TYPES.CUSTOM,
      },
      {
        id: "creative_4",
        question:
          "How willing is the student to experiment with new techniques?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "creative_5",
        question: "Does the student appreciate and critique artistic works?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Excellent aesthetic judgment and criticism", marks: 5 },
          { text: "Good appreciation with thoughtful comments", marks: 4 },
          { text: "Basic appreciation and understanding", marks: 3 },
          { text: "Limited interest in critiquing art", marks: 2 },
          { text: "Shows little appreciation for artistic works", marks: 1 },
        ],
      },
    ],
    "Physical Development": [
      {
        id: "physical_1",
        question:
          "How well does the student participate in physical activities?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "physical_2",
        question: "Does the student show coordination and motor skills?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Excellent coordination and motor control", marks: 5 },
          { text: "Good physical coordination", marks: 4 },
          { text: "Average motor skills for age group", marks: 3 },
          { text: "Some coordination challenges", marks: 2 },
          { text: "Significant motor skill difficulties", marks: 1 },
        ],
      },
      {
        id: "physical_3",
        question:
          "Describe the student's physical strengths and areas for improvement:",
        answerType: ANSWER_TYPES.CUSTOM,
      },
      {
        id: "physical_4",
        question: "How is the student's stamina and endurance?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "physical_5",
        question: "Does the student demonstrate sportsmanship and fair play?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Excellent sportsmanship and fair play", marks: 5 },
          { text: "Generally good sporting behavior", marks: 4 },
          { text: "Shows basic fairness in games", marks: 3 },
          { text: "Occasionally unsporting behavior", marks: 2 },
          { text: "Poor sportsmanship or unfair play", marks: 1 },
        ],
      },
    ],
    "Leadership Qualities": [
      {
        id: "leadership_1",
        question:
          "How well does the student take initiative in group situations?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "leadership_2",
        question: "Does the student inspire or motivate others?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Natural leader who inspires others", marks: 5 },
          { text: "Good motivational skills with peers", marks: 4 },
          { text: "Shows some leadership potential", marks: 3 },
          { text: "Limited leadership or motivational ability", marks: 2 },
          { text: "Rarely shows leadership qualities", marks: 1 },
        ],
      },
      {
        id: "leadership_3",
        question:
          "Describe specific leadership situations and the student's response:",
        answerType: ANSWER_TYPES.CUSTOM,
      },
      {
        id: "leadership_4",
        question:
          "How effectively does the student communicate ideas and vision?",
        answerType: ANSWER_TYPES.SCALE,
      },
      {
        id: "leadership_5",
        question: "How well does the student handle leadership challenges?",
        answerType: ANSWER_TYPES.PREDEFINED,
        options: [
          { text: "Handles challenges with confidence and grace", marks: 5 },
          { text: "Generally manages leadership challenges well", marks: 4 },
          { text: "Copes adequately with leadership pressure", marks: 3 },
          { text: "Struggles with leadership responsibilities", marks: 2 },
          { text: "Avoids or fails in leadership challenges", marks: 1 },
        ],
      },
    ],
  };

  // Dummy data
  const feedbackData: FeedbackItem[] = [
    {
      id: "1",
      student: {
        name: "John Smith",
        admissionNumber: "ADM001",
        grade: "Grade 10",
        profileImage: "https://via.placeholder.com/50",
      },
      description:
        "Excellent performance in mathematics and shows great problem-solving skills. Very attentive in class and helps other students.",
      createdBy: "Ms. Sarah Johnson",
      date: "2025-01-20",
      rating: 5,
      categories: ["Mathematics", "Leadership", "Collaboration"],
      primaryCategory: "Mathematics",
    },
    {
      id: "2",
      student: {
        name: "Emma Davis",
        admissionNumber: "ADM002",
        grade: "Grade 9",
        profileImage: "https://via.placeholder.com/50",
      },
      description:
        "Shows consistent improvement in English literature. Creative writing skills are developing well.",
      createdBy: "Mr. David Wilson",
      date: "2025-01-19",
      rating: 4,
      categories: ["English", "Creativity", "Writing"],
      primaryCategory: "English",
    },
    {
      id: "3",
      student: {
        name: "Michael Brown",
        admissionNumber: "ADM003",
        grade: "Grade 11",
        profileImage: "https://via.placeholder.com/50",
      },
      description:
        "Outstanding participation in science experiments. Shows curiosity and analytical thinking.",
      createdBy: "Dr. Lisa Anderson",
      date: "2025-01-18",
      rating: 5,
      categories: ["Science", "Research", "Critical Thinking"],
      primaryCategory: "Science",
    },
    {
      id: "4",
      student: {
        name: "Sophia Wilson",
        admissionNumber: "ADM004",
        grade: "Grade 8",
        profileImage: "https://via.placeholder.com/50",
      },
      description:
        "Good progress in art and design. Shows creativity and attention to detail in projects.",
      createdBy: "Ms. Rachel Green",
      date: "2025-01-17",
      rating: 4,
      categories: ["Art", "Design", "Creativity"],
      primaryCategory: "Art",
    },
    {
      id: "5",
      student: {
        name: "James Taylor",
        admissionNumber: "ADM005",
        grade: "Grade 12",
        profileImage: "https://via.placeholder.com/50",
      },
      description:
        "Excellent leadership skills demonstrated in group projects. Mentors younger students effectively.",
      createdBy: "Mr. Robert Clark",
      date: "2025-01-16",
      rating: 5,
      categories: ["Leadership", "Mentoring", "Communication"],
      primaryCategory: "Leadership",
    },
    {
      id: "6",
      student: {
        name: "Olivia Martinez",
        admissionNumber: "ADM006",
        grade: "Grade 10",
        profileImage: "https://via.placeholder.com/50",
      },
      description:
        "Strong performance in history and social studies. Shows great analytical skills.",
      createdBy: "Ms. Jennifer Lee",
      date: "2025-01-15",
      rating: 4,
      categories: ["History", "Analysis", "Research"],
      primaryCategory: "History",
    },
    // Add more dummy data to demonstrate pagination
    ...Array.from({ length: 20 }, (_, index) => ({
      id: `${index + 7}`,
      student: {
        name: `Student ${index + 7}`,
        admissionNumber: `ADM${String(index + 7).padStart(3, "0")}`,
        grade: `Grade ${8 + (index % 5)}`,
        profileImage: "https://via.placeholder.com/50",
      },
      description: `Sample feedback description for student ${index + 7}. This shows various aspects of the student's performance.`,
      createdBy: `Teacher ${(index % 3) + 1}`,
      date: `2025-01-${String(14 - (index % 14)).padStart(2, "0")}`,
      rating: (index % 5) + 1,
      categories: ["Category A", "Category B", "Category C"],
      primaryCategory: "Category A",
    })),
  ];

  const grades = [
    "All",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
    "EY1",
    "EY2",
    "EY3",
  ];
  const baseCategories = [
    "All",
    "Mathematics",
    "English",
    "Science",
    "Art",
    "History",
    "Leadership",
    "Creativity",
    "Writing",
    "Research",
    "Critical Thinking",
    "Design",
    "Mentoring",
    "Communication",
    "Analysis",
  ];

  // Combine base categories with custom categories
  const categories = [
    ...baseCategories,
    ...customCategories.map((cat) => cat.title),
  ];
  const ratings = ["All", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"];
  const educators = [
    "All",
    "Ms. Sarah Johnson",
    "Mr. David Wilson",
    "Dr. Lisa Anderson",
    "Ms. Rachel Green",
    "Mr. Robert Clark",
    "Ms. Jennifer Lee",
    "Teacher 1",
    "Teacher 2",
    "Teacher 3",
  ];

  // Main Categories and their Subcategories (dummy data for now)
  const baseMainCategories = [
    "Academic Performance",
    "Behavioral Development",
    "Social Skills",
    "Creative Arts",
    "Physical Development",
    "Leadership Qualities",
  ];

  // Combine base main categories with custom categories
  const mainCategories = [
    ...baseMainCategories,
    ...customCategories.map((cat) => cat.title),
  ];

  // Create dynamic subcategories including custom categories
  const baseSubcategoriesByMainCategory: { [key: string]: string[] } = {
    "Academic Performance": [
      "Mathematics",
      "English Language",
      "Science",
      "History",
      "Geography",
      "Problem Solving",
      "Critical Thinking",
      "Research Skills",
    ],
    "Behavioral Development": [
      "Classroom Behavior",
      "Attendance & Punctuality",
      "Following Instructions",
      "Responsibility",
      "Self-Discipline",
      "Respect for Others",
      "Honesty & Integrity",
    ],
    "Social Skills": [
      "Communication",
      "Teamwork",
      "Collaboration",
      "Peer Interaction",
      "Conflict Resolution",
      "Empathy",
      "Cultural Awareness",
    ],
    "Creative Arts": [
      "Visual Arts",
      "Music",
      "Drama & Theater",
      "Creative Writing",
      "Design Thinking",
      "Innovation",
      "Artistic Expression",
    ],
    "Physical Development": [
      "Sports & Athletics",
      "Physical Fitness",
      "Motor Skills",
      "Health Awareness",
      "Outdoor Activities",
      "Coordination",
      "Stamina & Endurance",
    ],
    "Leadership Qualities": [
      "Initiative Taking",
      "Decision Making",
      "Mentoring Others",
      "Public Speaking",
      "Project Management",
      "Delegation",
      "Motivation & Inspiration",
    ],
  };

  // Add custom categories and their questions as subcategories
  const customSubcategories: { [key: string]: string[] } = {};
  customCategories.forEach((category) => {
    customSubcategories[category.title] = category.questions.map(
      (q) => q.text || `Question ${q.id}`
    );
  });

  const subcategoriesByMainCategory = {
    ...baseSubcategoriesByMainCategory,
    ...customSubcategories,
  };

  // Filter data with comprehensive safety checks
  const filteredData = feedbackData.filter((item) => {
    // Safety check - ensure item exists and has required structure
    if (!item || !item.student) {
      console.warn("⚠️ Invalid feedback item found, filtering out:", item);
      return false;
    }

    try {
      // Safely handle search matching with null checks
      const studentName = String(item.student.name || "");
      const admissionNumber = String(item.student.admissionNumber || "");
      const description = String(item.description || "");

      const matchesSearch =
        searchText === "" ||
        studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        admissionNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        description.toLowerCase().includes(searchText.toLowerCase());

      const matchesGrade =
        selectedGrade === "All" ||
        String(item.student.grade || "") === selectedGrade;

      const matchesCategory =
        selectedCategory === "All" ||
        (Array.isArray(item.categories) &&
          item.categories.includes(selectedCategory));

      const matchesRating =
        selectedRating === "All" ||
        (selectedRating === "5 Stars" && item.rating === 5) ||
        (selectedRating === "4 Stars" && item.rating === 4) ||
        (selectedRating === "3 Stars" && item.rating === 3) ||
        (selectedRating === "2 Stars" && item.rating === 2) ||
        (selectedRating === "1 Star" && item.rating === 1);

      const matchesEducator =
        selectedEducator === "All" ||
        String(item.createdBy || "") === selectedEducator;

      return (
        matchesSearch &&
        matchesGrade &&
        matchesCategory &&
        matchesRating &&
        matchesEducator
      );
    } catch (error) {
      console.error("❌ Error filtering feedback item:", item, error);
      return false; // Exclude problematic items
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleActionPress = (feedbackId: string) => {
    setSelectedFeedbackId(feedbackId);
    setShowActionModal(true);
  };

  const handleAddFeedback = () => {
    setShowAddFeedbackModal(true);
  };

  const handleMainCategorySelect = (category: string) => {
    setMainCategory(category);
    setQuestionnaireAnswers({});
    setSelectedQuestionId(null);
    setFeedbackRating(0);
  };

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestionId(
      selectedQuestionId === questionId ? null : questionId
    );
  };

  const handleQuestionAnswer = (
    questionId: string,
    answer: any,
    marks?: number
  ) => {
    setQuestionnaireAnswers((prev) => ({
      ...prev,
      [questionId]: { answer, marks },
    }));

    // Calculate and update rating after each answer
    const updatedAnswers = {
      ...questionnaireAnswers,
      [questionId]: { answer, marks },
    };
    const answers = Object.values(updatedAnswers);
    const validAnswers = answers.filter(
      (answer) => answer.marks !== undefined && answer.marks > 0
    );

    if (validAnswers.length > 0) {
      const totalMarks = validAnswers.reduce(
        (sum, answer) => sum + answer.marks,
        0
      );
      const averageRating = totalMarks / validAnswers.length;
      setFeedbackRating(Math.round(averageRating * 10) / 10);
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      // Remove subcategory
      setSelectedSubcategories(
        selectedSubcategories.filter((sub) => sub !== subcategory)
      );
    } else {
      // Add subcategory (max 5)
      if (selectedSubcategories.length < 5) {
        setSelectedSubcategories([...selectedSubcategories, subcategory]);
      } else {
        Alert.alert(
          "Maximum Limit",
          "You can select up to 5 subcategories only."
        );
      }
    }
  };

  const handleClearMainCategory = () => {
    Alert.alert(
      "Clear Main Category",
      "This will remove the main category and all selected subcategories. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setMainCategory("");
            setSelectedSubcategories([]);
          },
        },
      ]
    );
  };

  const isFormValid = () => {
    return (
      selectedGradeForStudent &&
      selectedStudent &&
      mainCategory &&
      feedbackDescription.trim()
    );
  };

  const handleDescriptionFocus = () => {
    // Focus the description input and show keyboard
    if (descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  };

  const handleSubmitFeedback = async () => {
    // Validation - only check required fields
    const missingFields = [];

    if (!selectedGradeForStudent) {
      missingFields.push("• Grade selection");
    }

    if (!selectedStudent) {
      missingFields.push("• Student selection");
    }

    if (!mainCategory) {
      missingFields.push("• Main category selection");
    }

    if (!feedbackDescription.trim()) {
      missingFields.push("• Description");
    }

    if (missingFields.length > 0) {
      Alert.alert(
        "Required Fields Missing",
        `Please complete the following required fields:\n\n${missingFields.join("\n")}\n\nNote: Subcategories are optional.`
      );
      return;
    }

    try {
      // Prepare data for API submission
      const feedbackData = {
        student_id: selectedStudent.id,
        grade: selectedGradeForStudent,
        main_category: mainCategory,
        subcategories: selectedSubcategories,
        description: feedbackDescription.trim(),
        rating: feedbackRating || 0,
        questionnaire_answers: questionnaireAnswers,
      };

      console.log("🚀 Submitting feedback to API:", feedbackData);

      // Submit to API
      const result = await submitFeedback(feedbackData).unwrap();

      console.log("✅ Feedback submitted successfully:", result);

      // Reset form on success
      setSelectedGradeForStudent("");
      setSelectedStudent(null);
      setFeedbackDescription("");
      setMainCategory("");
      setSelectedSubcategories([]);
      setFeedbackRating(0);
      setQuestionnaireAnswers({});
      setSelectedQuestionId(null);
      setShowAddFeedbackModal(false);

      Alert.alert("Success", "Feedback submitted successfully!");
    } catch (error) {
      console.error("❌ Failed to submit feedback:", error);

      // Show user-friendly error message
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to submit feedback. Please try again.";
      Alert.alert("Submission Failed", errorMessage);
    }
  };

  const handleAddCategory = (categoryData: any) => {
    console.log("✅ New category added:", categoryData);
    Alert.alert(
      "Category Added",
      `Category "${categoryData.title}" with ${categoryData.questions.length} questions has been added successfully!`
    );
    // Here you would typically save the category to your backend/state
    // For now, we'll just show a success message
  };

  const renderStarRating = (
    rating: number,
    onRatingPress?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => onRatingPress && onRatingPress(index + 1)}
        disabled={!onRatingPress}
      >
        <MaterialIcons
          name={index < rating ? "star" : "star-border"}
          size={onRatingPress ? 24 : 16}
          color={index < rating ? "#FFD700" : "#E0E0E0"}
        />
      </TouchableOpacity>
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <MaterialIcons
        key={index}
        name={index < rating ? "star" : "star-border"}
        size={16}
        color={index < rating ? "#FFD700" : "#E0E0E0"}
      />
    ));
  };

  // Early return if modal is not visible to prevent unnecessary rendering
  if (!visible) {
    return null;
  }

  // Always render the modal - fallback data ensures we have grades to show
  console.log("✅ Rendering main modal interface with data:", {
    hasStudentListData: !!studentListData,
    gradesCount: gradesFromAPI.length,
    isLoading: studentListLoading,
    hasError: !!studentListError,
  });

  return (
    <>
      {/* Add Category Modal - Real Implementation with Backend Integration */}
      <AddCategoryPopup
        visible={showAddCategoryPopup}
        onClose={() => setShowAddCategoryPopup(false)}
        onSubmit={async (categoryData) => {
          console.log("New category being submitted:", categoryData);
          
          try {
            // Call backend API to create the category
            const response = await createFeedbackCategory(categoryData).unwrap();
            console.log("✅ Category created successfully:", response);
            
            // Add the new category to our custom categories state for immediate UI update
            const newCategory = {
              id: response.data?.id || Date.now().toString(),
              title: categoryData.title,
              questions: categoryData.questions
            };
            
            setCustomCategories(prev => [...prev, newCategory]);
            
            Alert.alert(
              "Category Added Successfully!", 
              `Category "${categoryData.title}" with ${categoryData.questions.length} questions has been added successfully!\n\nYou can now use this category when creating feedback.`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    setShowAddCategoryPopup(false);
                  }
                }
              ]
            );
            
          } catch (error: any) {
            console.error("❌ Failed to create category:", error);
            
            // Still add to local state for development/fallback
            const newCategory = {
              id: Date.now().toString(),
              title: categoryData.title,
              questions: categoryData.questions
            };
            
            setCustomCategories(prev => [...prev, newCategory]);
            
            Alert.alert(
              "Category Added (Local Only)", 
              `Category "${categoryData.title}" has been added locally.\n\nNote: Backend integration is in progress. The category will be available for this session.`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    setShowAddCategoryPopup(false);
                  }
                }
              ]
            );
          }
        }}
      />

      <FullScreenModal
        visible={visible}
        onClose={onClose}
        title="Educator Feedback Management"
        backgroundColor="#F5F5F5"
      >
        <View style={styles.container}>
          {/* Top Action Bar */}
          <View style={styles.topBar}>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddFeedback}
              >
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  console.log("🔥 Add Category button clicked!");
                  console.log("🔍 Current state:", showAddCategoryPopup);
                  setShowAddCategoryPopup(true);
                  console.log("🔍 State should now be true");
                  setTimeout(() => {
                    console.log(
                      "🔍 State after timeout:",
                      showAddCategoryPopup
                    );
                  }, 100);
                }}
              >
                <MaterialIcons name="category" size={18} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, admission number, or description..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Horizontal Filter Section */}
          <View style={styles.filterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterScrollContent}
            >
              {/* Grade Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Grade:</Text>
                <View style={styles.filterChipPicker}>
                  <Picker
                    selectedValue={selectedGrade}
                    onValueChange={setSelectedGrade}
                    style={styles.horizontalPicker}
                    mode="dropdown"
                  >
                    {grades.map((grade) => (
                      <Picker.Item key={grade} label={grade} value={grade} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Category Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Category:</Text>
                <View style={styles.filterChipPicker}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                    style={styles.horizontalPicker}
                    mode="dropdown"
                  >
                    {categories.map((category) => (
                      <Picker.Item
                        key={category}
                        label={category}
                        value={category}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Rating Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Rating:</Text>
                <View style={styles.filterChipPicker}>
                  <Picker
                    selectedValue={selectedRating}
                    onValueChange={setSelectedRating}
                    style={styles.horizontalPicker}
                    mode="dropdown"
                  >
                    {ratings.map((rating) => (
                      <Picker.Item key={rating} label={rating} value={rating} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Educator Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Educator:</Text>
                <View style={styles.filterChipPicker}>
                  <Picker
                    selectedValue={selectedEducator}
                    onValueChange={setSelectedEducator}
                    style={styles.horizontalPicker}
                    mode="dropdown"
                  >
                    {educators.map((educator) => (
                      <Picker.Item
                        key={educator}
                        label={educator}
                        value={educator}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Clear Filters Button */}
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSelectedGrade("All");
                  setSelectedCategory("All");
                  setSelectedRating("All");
                  setSelectedEducator("All");
                  setSearchText("");
                  setCurrentPage(1);
                }}
              >
                <MaterialIcons name="clear" size={16} color="#920734" />
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Results Info */}
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} feedback(s)
            </Text>
          </View>

          {/* Feedback List */}
          <ScrollView
            style={styles.feedbackList}
            showsVerticalScrollIndicator={false}
          >
            {paginatedData.map((item) => {
              // Additional safety check for rendering
              if (!item || !item.student) {
                console.warn("⚠️ Skipping invalid item in render:", item);
                return null;
              }

              // Ensure all text values are safe strings
              const studentName = String(
                item.student.name || "Unknown Student"
              );
              const admissionNumber = String(
                item.student.admissionNumber || "N/A"
              );
              const grade = String(item.student.grade || "Unknown Grade");
              const description = String(
                item.description || "No description available"
              );
              const createdBy = String(item.createdBy || "Unknown Educator");
              const primaryCategory = String(item.primaryCategory || "General");
              const profileImage =
                item.student.profileImage || "https://via.placeholder.com/50";
              const rating = typeof item.rating === "number" ? item.rating : 0;
              const date = item.date
                ? new Date(item.date).toLocaleDateString()
                : "Unknown Date";
              const categories = Array.isArray(item.categories)
                ? item.categories
                : [];

              return (
                <View
                  key={item.id || Math.random()}
                  style={styles.feedbackCard}
                >
                  {/* Student Info */}
                  <View style={styles.studentHeader}>
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{studentName}</Text>
                      <Text style={styles.studentDetails}>
                        {admissionNumber} • {grade}
                      </Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <View style={styles.stars}>{renderStars(rating)}</View>
                      <Text style={styles.ratingText}>{rating}.0</Text>
                    </View>
                  </View>

                  {/* Categories */}
                  <View style={styles.categoriesContainer}>
                    <View style={[styles.categoryTag, styles.primaryCategory]}>
                      <MaterialIcons name="star" size={12} color="#920734" />
                      <Text style={styles.primaryCategoryText}>
                        {primaryCategory}
                      </Text>
                    </View>
                    {categories
                      .filter((cat) => cat && cat !== primaryCategory)
                      .map((category, index) => (
                        <View key={index} style={styles.categoryTag}>
                          <Text style={styles.categoryText}>
                            {String(category)}
                          </Text>
                        </View>
                      ))}
                  </View>

                  {/* Description */}
                  <Text style={styles.description}>{description}</Text>

                  {/* Footer */}
                  <View style={styles.feedbackFooter}>
                    <View style={styles.metaInfo}>
                      <Text style={styles.createdBy}>
                        Created by: {createdBy}
                      </Text>
                      <Text style={styles.date}>{date}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        handleActionPress(String(item.id || "unknown"))
                      }
                    >
                      <Text style={styles.actionButtonText}>Actions</Text>
                      <MaterialIcons
                        name="arrow-forward-ios"
                        size={14}
                        color="#920734"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Pagination */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.disabledButton,
              ]}
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={currentPage === 1 ? "#CCC" : "#920734"}
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
              onPress={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
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
                color={currentPage === totalPages ? "#CCC" : "#920734"}
              />
            </TouchableOpacity>
          </View>

          {/* Add Feedback Modal */}
          <Modal
            visible={showAddFeedbackModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAddFeedbackModal(false)}
          >
            <KeyboardAvoidingView
              style={styles.modalOverlay}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
              <View style={styles.addFeedbackModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Feedback</Text>
                  <TouchableOpacity
                    onPress={() => setShowAddFeedbackModal(false)}
                  >
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.addFeedbackContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Form Validation Info */}
                  {/* <View style={styles.validationInfoContainer}>
                  <Text style={styles.validationInfoTitle}>Required Fields:</Text>
                  <View style={styles.validationCheckList}>
                    <View style={styles.validationItem}>
                      <MaterialIcons 
                        name={selectedStudent ? "check-circle" : "radio-button-unchecked"} 
                        size={16} 
                        color={selectedStudent ? "#4CAF50" : "#CCC"} 
                      />
                      <Text style={[styles.validationText, selectedStudent && styles.validationCompleted]}>
                        Student Selection
                      </Text>
                    </View>
                    <View style={styles.validationItem}>
                      <MaterialIcons 
                        name={mainCategory ? "check-circle" : "radio-button-unchecked"} 
                        size={16} 
                        color={mainCategory ? "#4CAF50" : "#CCC"} 
                      />
                      <Text style={[styles.validationText, mainCategory && styles.validationCompleted]}>
                        Main Category
                      </Text>
                    </View>
                    <View style={styles.validationItem}>
                      <MaterialIcons 
                        name={feedbackDescription.trim() ? "check-circle" : "radio-button-unchecked"} 
                        size={16} 
                        color={feedbackDescription.trim() ? "#4CAF50" : "#CCC"} 
                      />
                      <Text style={[styles.validationText, feedbackDescription.trim() && styles.validationCompleted]}>
                        Description
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.validationNote}>
                    Subcategories are optional. Rating will be calculated from questionnaire answers.
                  </Text>
                </View> */}

                  {/* Grade Selection */}
                  <View style={styles.formSection}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        !selectedGradeForStudent && styles.requiredFieldTitle,
                      ]}
                    >
                      Select Grade{" "}
                      <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <Text style={styles.categoryHelpText}>
                      First select the grade to view students from that grade.
                    </Text>

                    {selectedGradeForStudent ? (
                      <View style={styles.selectedGradeCard}>
                        <View style={styles.gradeInfo}>
                          <MaterialIcons
                            name="school"
                            size={20}
                            color="#920734"
                          />
                          <Text style={styles.selectedGradeName}>
                            {selectedGradeForStudent}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedGradeForStudent("");
                            setSelectedStudent(null); // Clear student when grade changes
                          }}
                          style={styles.removeGradeButton}
                        >
                          <MaterialIcons
                            name="close"
                            size={20}
                            color="#FF5252"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : studentListLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#920734" />
                        <Text style={styles.loadingText}>
                          Loading grades...
                        </Text>
                      </View>
                    ) : studentListError &&
                      (gradesFromAPI || []).length === 0 ? (
                      <View style={styles.errorContainer}>
                        <MaterialIcons
                          name="error-outline"
                          size={24}
                          color="#F44336"
                        />
                        <Text style={styles.errorText}>
                          Failed to load grades. Please try again.
                        </Text>
                      </View>
                    ) : (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.gradesList}
                      >
                        {(gradesFromAPI || [])
                          .filter((grade) => grade && grade.name)
                          .map((grade: any) => (
                            <TouchableOpacity
                              key={grade.id || grade.name}
                              style={[
                                styles.gradeCard,
                                selectedGradeForStudent === grade.name &&
                                  styles.selectedGradeCard,
                              ]}
                              onPress={() =>
                                setSelectedGradeForStudent(grade.name)
                              }
                            >
                              <MaterialIcons
                                name="school"
                                size={24}
                                color="#920734"
                              />
                              <Text style={styles.gradeCardName}>
                                {grade.name || "Unknown Grade"}
                              </Text>
                              {/* <Text style={styles.gradeCardStudents}>
                              {grade.students_count || 0} students
                            </Text> */}
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    )}
                  </View>

                  {/* Student Selection */}
                  <View style={styles.formSection}>
                    <View style={styles.studentSectionHeader}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          !selectedStudent && styles.requiredFieldTitle,
                        ]}
                      >
                        Select Student{" "}
                        <Text style={styles.requiredAsterisk}>*</Text>
                      </Text>
                      {selectedGradeForStudent && (
                        <View style={styles.gradeIndicator}>
                          <MaterialIcons
                            name="school"
                            size={14}
                            color="#920734"
                          />
                          <Text style={styles.gradeIndicatorText}>
                            {selectedGradeForStudent}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.categoryHelpText}>
                      {selectedGradeForStudent
                        ? `${filteredStudentsList.length} students available`
                        : "Please select a grade first to view students."}
                    </Text>
                    {selectedStudent ? (
                      <View style={styles.selectedStudentCard}>
                        <Image
                          source={
                            selectedStudent.profileImage
                              ? {
                                  uri: selectedStudent.profileImage,
                                  headers: selectedStudent.profileImageHeaders,
                                }
                              : getLocalFallbackProfileImage()
                          }
                          style={styles.selectedStudentImage}
                          onError={() => {
                            // If profile image fails, use fallback
                            setSelectedStudent({
                              ...selectedStudent,
                              profileImage: null,
                            });
                          }}
                        />
                        <View style={styles.selectedStudentInfo}>
                          <Text style={styles.selectedStudentName}>
                            {selectedStudent.name}
                          </Text>
                          <Text style={styles.selectedStudentDetails}>
                            {selectedStudent.admissionNumber} •{" "}
                            {selectedStudent.grade}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSelectedStudent(null)}
                          style={styles.removeStudentButton}
                        >
                          <MaterialIcons
                            name="close"
                            size={20}
                            color="#FF5252"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : selectedGradeForStudent ? (
                      studentsLoading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color="#920734" />
                          <Text style={styles.loadingText}>
                            Loading students...
                          </Text>
                        </View>
                      ) : studentsError ? (
                        <View style={styles.errorContainer}>
                          <MaterialIcons
                            name="error-outline"
                            size={24}
                            color="#F44336"
                          />
                          <Text style={styles.errorText}>
                            Failed to load students. Please try again.
                          </Text>
                        </View>
                      ) : filteredStudentsList.length > 0 ? (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={styles.studentsList}
                        >
                          {filteredStudentsList
                            .filter(
                              (student) => student && student.id && student.name
                            )
                            .map((student) => (
                              <TouchableOpacity
                                key={student.id}
                                style={[
                                  styles.studentCard,
                                  selectedStudent?.id === student.id &&
                                    styles.selectedStudentCard,
                                ]}
                                onPress={() => setSelectedStudent(student)}
                              >
                                <Image
                                  source={
                                    student.profileImage
                                      ? {
                                          uri: student.profileImage,
                                          headers: student.profileImageHeaders,
                                        }
                                      : getLocalFallbackProfileImage()
                                  }
                                  style={styles.studentCardImage}
                                  onError={(error) => {
                                    console.log(
                                      `Failed to load profile image for student ${student.id}:`,
                                      error
                                    );
                                    // You could update the student object here to mark the image as failed
                                  }}
                                />
                                <Text style={styles.studentCardName}>
                                  {student.name || "Unknown Student"}
                                </Text>
                                <Text style={styles.studentCardDetails}>
                                  {student.admissionNumber || "No ID"}
                                </Text>
                                <Text style={styles.studentCardGrade}>
                                  {student.grade || "Unknown Grade"}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </ScrollView>
                      ) : (
                        <View style={styles.noStudentsContainer}>
                          <MaterialIcons name="info" size={24} color="#999" />
                          <Text style={styles.noStudentsText}>
                            No students found in {selectedGradeForStudent}
                          </Text>
                        </View>
                      )
                    ) : (
                      <View style={styles.selectGradeFirstContainer}>
                        <MaterialIcons
                          name="arrow-upward"
                          size={24}
                          color="#999"
                        />
                        <Text style={styles.selectGradeFirstText}>
                          Please select a grade first to view students
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Rating will be calculated automatically from questionnaire */}

                  {/* Main Category Selection */}
                  <View style={styles.formSection}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        !mainCategory && styles.requiredFieldTitle,
                      ]}
                    >
                      Main Category{" "}
                      <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <Text style={styles.categoryHelpText}>
                      Select the primary focus area for this feedback.
                      Assessment guidelines will be shown to help with
                      evaluation.
                    </Text>

                    {mainCategory ? (
                      <View style={styles.selectedMainCategory}>
                        <View style={styles.mainCategoryBadge}>
                          <MaterialIcons
                            name="stars"
                            size={20}
                            color="#FFD700"
                          />
                          <Text style={styles.mainCategoryTitle}>
                            {mainCategory}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={handleClearMainCategory}
                          style={styles.clearMainCategoryButton}
                        >
                          <MaterialIcons
                            name="close"
                            size={20}
                            color="#FF5252"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.mainCategoriesList}
                      >
                        {mainCategories.map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={styles.mainCategorySelectChip}
                            onPress={() => handleMainCategorySelect(category)}
                          >
                            <MaterialIcons
                              name="category"
                              size={18}
                              color="#920734"
                            />
                            <Text style={styles.mainCategorySelectText}>
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>

                  {/* Assessment Questions Section */}
                  {mainCategory && (
                    <View style={styles.formSection}>
                      <Text style={styles.sectionTitle}>
                        Assessment Questions for {mainCategory}
                      </Text>
                      <Text style={styles.categoryHelpText}>
                        Click on each question to answer. Rating will be
                        calculated automatically.
                      </Text>

                      <View style={styles.questionsList}>
                        {questionnaireData[mainCategory]?.map(
                          (question, index) => (
                            <View key={question.id} style={styles.questionItem}>
                              <TouchableOpacity
                                style={[
                                  styles.questionHeader,
                                  selectedQuestionId === question.id &&
                                    styles.selectedQuestionHeader,
                                  questionnaireAnswers[question.id] &&
                                    styles.answeredQuestionHeader,
                                ]}
                                onPress={() => handleQuestionClick(question.id)}
                              >
                                <View style={styles.questionNumber}>
                                  <Text style={styles.questionNumberText}>
                                    {index + 1}
                                  </Text>
                                </View>
                                <Text style={styles.questionText}>
                                  {question.question}
                                </Text>
                                <View style={styles.questionStatus}>
                                  {questionnaireAnswers[question.id] ? (
                                    <MaterialIcons
                                      name="check-circle"
                                      size={20}
                                      color="#4CAF50"
                                    />
                                  ) : (
                                    <MaterialIcons
                                      name="radio-button-unchecked"
                                      size={20}
                                      color="#CCC"
                                    />
                                  )}
                                </View>
                              </TouchableOpacity>

                              {/* Answer Options - Show when question is selected */}
                              {selectedQuestionId === question.id && (
                                <View style={styles.answerSection}>
                                  {/* Scale Answer Type */}
                                  {question.answerType ===
                                    ANSWER_TYPES.SCALE && (
                                    <View style={styles.scaleAnswerContainer}>
                                      <Text style={styles.answerTypeLabel}>
                                        Select rating:
                                      </Text>
                                      {[1, 2, 3, 4, 5].map((value) => (
                                        <TouchableOpacity
                                          key={value}
                                          style={[
                                            styles.scaleOption,
                                            questionnaireAnswers[question.id]
                                              ?.answer === value &&
                                              styles.selectedScaleOption,
                                          ]}
                                          onPress={() =>
                                            handleQuestionAnswer(
                                              question.id,
                                              value,
                                              value
                                            )
                                          }
                                        >
                                          <View
                                            style={styles.scaleOptionContent}
                                          >
                                            <Text style={styles.scaleValue}>
                                              {value}.0
                                            </Text>
                                            <Text style={styles.scaleLabel}>
                                              {
                                                SCALE_LABELS[
                                                  value as keyof typeof SCALE_LABELS
                                                ]
                                              }
                                            </Text>
                                          </View>
                                          {questionnaireAnswers[question.id]
                                            ?.answer === value && (
                                            <MaterialIcons
                                              name="check-circle"
                                              size={20}
                                              color="#4CAF50"
                                            />
                                          )}
                                        </TouchableOpacity>
                                      ))}
                                    </View>
                                  )}

                                  {/* Predefined Answer Type */}
                                  {question.answerType ===
                                    ANSWER_TYPES.PREDEFINED && (
                                    <View
                                      style={styles.predefinedAnswerContainer}
                                    >
                                      <Text style={styles.answerTypeLabel}>
                                        Select answer:
                                      </Text>
                                      {question.options?.map(
                                        (option, optionIndex) => (
                                          <TouchableOpacity
                                            key={optionIndex}
                                            style={[
                                              styles.predefinedOption,
                                              questionnaireAnswers[question.id]
                                                ?.answer === option.text &&
                                                styles.selectedPredefinedOption,
                                            ]}
                                            onPress={() =>
                                              handleQuestionAnswer(
                                                question.id,
                                                option.text,
                                                option.marks
                                              )
                                            }
                                          >
                                            <View
                                              style={
                                                styles.predefinedOptionContent
                                              }
                                            >
                                              <Text
                                                style={styles.predefinedText}
                                              >
                                                {option.text}
                                              </Text>
                                              <View
                                                style={styles.marksContainer}
                                              >
                                                <Text style={styles.marksText}>
                                                  {option.marks} marks
                                                </Text>
                                              </View>
                                            </View>
                                            {questionnaireAnswers[question.id]
                                              ?.answer === option.text && (
                                              <MaterialIcons
                                                name="check-circle"
                                                size={20}
                                                color="#4CAF50"
                                              />
                                            )}
                                          </TouchableOpacity>
                                        )
                                      )}
                                    </View>
                                  )}

                                  {/* Custom Answer Type */}
                                  {question.answerType ===
                                    ANSWER_TYPES.CUSTOM && (
                                    <View style={styles.customAnswerContainer}>
                                      <Text style={styles.answerTypeLabel}>
                                        Enter your response:
                                      </Text>
                                      <TextInput
                                        style={styles.customAnswerInput}
                                        multiline
                                        numberOfLines={3}
                                        placeholder="Type your detailed response here..."
                                        value={
                                          questionnaireAnswers[question.id]
                                            ?.answer || ""
                                        }
                                        onChangeText={(text) =>
                                          handleQuestionAnswer(
                                            question.id,
                                            text,
                                            0
                                          )
                                        }
                                        textAlignVertical="top"
                                      />
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          )
                        )}
                      </View>

                      {/* Rating Display */}
                      {feedbackRating > 0 && (
                        <View style={styles.calculatedRatingContainer}>
                          <Text style={styles.calculatedRatingLabel}>
                            Calculated Rating:
                          </Text>
                          <View style={styles.ratingDisplay}>
                            <Text style={styles.ratingValue}>
                              {feedbackRating}
                            </Text>
                            <Text style={styles.ratingOutOf}>/5.0</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Subcategories Selection */}
                  {mainCategory && (
                    <View style={styles.formSection}>
                      <Text style={styles.sectionTitle}>
                        Subcategories (Optional) ({selectedSubcategories.length}
                        /5)
                      </Text>
                      <Text style={styles.categoryHelpText}>
                        Optionally select specific areas within {mainCategory}{" "}
                        to focus your feedback on.
                      </Text>

                      {selectedSubcategories.length > 0 && (
                        <View style={styles.selectedSubcategoriesContainer}>
                          {selectedSubcategories.map((subcategory, index) => (
                            <View
                              key={index}
                              style={styles.selectedSubcategoryChip}
                            >
                              <Text style={styles.selectedSubcategoryText}>
                                {subcategory}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  handleSubcategoryToggle(subcategory)
                                }
                                style={styles.removeSubcategoryButton}
                              >
                                <MaterialIcons
                                  name="close"
                                  size={14}
                                  color="#666"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                      <Text style={styles.subcategoryGroupTitle}>
                        Available {mainCategory} Areas:
                      </Text>
                      <ScrollView
                        style={styles.subcategoriesList}
                        showsVerticalScrollIndicator={false}
                      >
                        <View style={styles.subcategoriesGrid}>
                          {subcategoriesByMainCategory[mainCategory]?.map(
                            (subcategory) => (
                              <TouchableOpacity
                                key={subcategory}
                                style={[
                                  styles.subcategorySelectChip,
                                  selectedSubcategories.includes(subcategory) &&
                                    styles.subcategorySelectedChip,
                                ]}
                                onPress={() =>
                                  handleSubcategoryToggle(subcategory)
                                }
                                disabled={
                                  !selectedSubcategories.includes(
                                    subcategory
                                  ) && selectedSubcategories.length >= 5
                                }
                              >
                                <MaterialIcons
                                  name={
                                    selectedSubcategories.includes(subcategory)
                                      ? "check-circle"
                                      : "add-circle-outline"
                                  }
                                  size={16}
                                  color={
                                    selectedSubcategories.includes(subcategory)
                                      ? "#4CAF50"
                                      : "#920734"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.subcategorySelectText,
                                    selectedSubcategories.includes(
                                      subcategory
                                    ) && styles.subcategorySelectedText,
                                    !selectedSubcategories.includes(
                                      subcategory
                                    ) &&
                                      selectedSubcategories.length >= 5 &&
                                      styles.subcategoryDisabledText,
                                  ]}
                                >
                                  {subcategory}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </ScrollView>
                    </View>
                  )}

                  {/* Description */}
                  <View style={styles.formSection}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        !feedbackDescription.trim() &&
                          styles.requiredFieldTitle,
                      ]}
                    >
                      Description <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={handleDescriptionFocus}
                      style={styles.descriptionTouchableContainer}
                    >
                      <TextInput
                        ref={descriptionInputRef}
                        style={styles.descriptionInput}
                        placeholder="Tap here to enter detailed feedback description..."
                        multiline
                        numberOfLines={4}
                        value={feedbackDescription}
                        onChangeText={setFeedbackDescription}
                        textAlignVertical="top"
                        autoFocus={false}
                        blurOnSubmit={false}
                      />
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAddFeedbackModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!isFormValid() || isSubmitting) &&
                        styles.disabledSubmitButton,
                    ]}
                    onPress={handleSubmitFeedback}
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text
                          style={[styles.submitButtonText, { marginLeft: 8 }]}
                        >
                          Submitting...
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.submitButtonText,
                          !isFormValid() && styles.disabledSubmitButtonText,
                        ]}
                      >
                        Submit Feedback
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </FullScreenModal>

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feedback Actions</Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalContent}>
              Action options for feedback ID: {selectedFeedbackId}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#920734",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  searchSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterScrollView: {
    paddingHorizontal: 16,
  },
  filterScrollContent: {
    alignItems: "center",
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minWidth: 120,
  },
  filterChipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
  },
  filterChipPicker: {
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
  },
  horizontalPicker: {
    height: 40,
    fontSize: 12,
    backgroundColor: "transparent",
    color: "#333",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F3",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#920734",
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  feedbackList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  studentDetails: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  ratingContainer: {
    alignItems: "center",
    gap: 4,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  primaryCategory: {
    backgroundColor: "#FFF3F3",
    borderColor: "#920734",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  primaryCategoryText: {
    fontSize: 12,
    color: "#920734",
    fontWeight: "700",
  },
  categoryText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 16,
  },
  feedbackFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  metaInfo: {
    flex: 1,
  },
  createdBy: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#920734",
    fontWeight: "600",
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
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#920734",
    gap: 6,
  },
  disabledButton: {
    borderColor: "#CCC",
    backgroundColor: "#F5F5F5",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },
  actionModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  addFeedbackModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "95%",
    height: "90%",
    maxWidth: 600,
    minHeight: 500,
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  addFeedbackContent: {
    flex: 1,
    padding: 20,
    minHeight: 400,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  requiredFieldTitle: {
    color: "black",
  },
  requiredAsterisk: {
    color: "#FF5252",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryHelpText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
  debugText: {
    fontSize: 10,
    color: "#FF0000",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  studentsList: {
    marginTop: 8,
  },
  studentCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    width: 100,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  studentCardImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  studentCardName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  studentCardDetails: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 2,
  },
  studentCardGrade: {
    fontSize: 10,
    color: "#888",
    textAlign: "center",
  },
  selectedStudentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#920734",
  },
  selectedStudentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  selectedStudentInfo: {
    flex: 1,
  },
  selectedStudentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  selectedStudentDetails: {
    fontSize: 14,
    color: "#666",
  },
  removeStudentButton: {
    padding: 8,
    backgroundColor: "#FFE6E6",
    borderRadius: 20,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  starRatingContainer: {
    flexDirection: "row",
    gap: 4,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  selectedCategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  selectedCategoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    marginBottom: 8,
  },
  mainCategoryChip: {
    backgroundColor: "#920734",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  additionalCategoryChip: {
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#920734",
  },
  mainCategoryIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  mainCategoryLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#920734",
  },
  selectedCategoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  mainCategoryText: {
    color: "#FFFFFF",
  },
  additionalCategoryText: {
    color: "#920734",
  },
  removeCategoryButton: {
    padding: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  // Main Category Styles
  selectedMainCategory: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#920734",
  },
  mainCategoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mainCategoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#920734",
  },
  clearMainCategoryButton: {
    padding: 8,
    backgroundColor: "#FFE6E6",
    borderRadius: 20,
  },
  mainCategoriesList: {
    marginTop: 8,
  },
  mainCategorySelectChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 8,
    minWidth: 150,
  },
  mainCategorySelectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#920734",
    textAlign: "center",
  },
  // Subcategory Styles
  selectedSubcategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  selectedSubcategoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  selectedSubcategoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  removeSubcategoryButton: {
    padding: 2,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  subcategoryGroupTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  subcategoriesList: {
    maxHeight: 200,
  },
  subcategoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subcategorySelectChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 6,
    marginBottom: 8,
  },
  subcategorySelectedChip: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  subcategorySelectText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  subcategorySelectedText: {
    color: "#4CAF50",
  },
  subcategoryDisabledText: {
    color: "#CCC",
  },
  categoriesList: {
    marginTop: 8,
  },
  categorySelectChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 6,
  },
  categorySelectText: {
    color: "#920734",
    fontSize: 12,
    fontWeight: "600",
  },
  descriptionTouchableContainer: {
    width: "100%",
  },
  descriptionInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 12,
    flexShrink: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#920734",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledSubmitButton: {
    backgroundColor: "#CCC",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledSubmitButtonText: {
    color: "#999",
  },
  // Questionnaire Modal Styles
  questionnaireModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "95%",
    maxHeight: "85%",
    maxWidth: 600,
    flexDirection: "column",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  questionnaireContent: {
    flex: 1,
    padding: 20,
  },
  questionProgress: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#920734",
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    lineHeight: 22,
  },
  answerTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 15,
  },
  // Scale Answer Styles
  scaleAnswerContainer: {
    marginBottom: 20,
  },
  scaleOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedScaleOption: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  scaleOptionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  scaleValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#920734",
    marginRight: 15,
    minWidth: 30,
  },
  scaleLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  // Predefined Answer Styles
  predefinedAnswerContainer: {
    marginBottom: 20,
  },
  predefinedOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedPredefinedOption: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  predefinedOptionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  predefinedText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  marksContainer: {
    backgroundColor: "#920734",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  marksText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Custom Answer Styles
  customAnswerContainer: {
    marginBottom: 20,
  },
  customAnswerInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    color: "#333",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  // Navigation Styles
  questionnaireActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 6,
  },
  disabledNavButton: {
    borderColor: "#CCC",
    backgroundColor: "#F5F5F5",
  },
  navButtonText: {
    fontSize: 14,
    color: "#920734",
    fontWeight: "600",
  },
  disabledNavText: {
    color: "#CCC",
  },
  questionIndicator: {
    backgroundColor: "#920734",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  questionIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  completeButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Inline Questionnaire Styles
  questionsList: {
    marginTop: 16,
  },
  questionItem: {
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    overflow: "hidden",
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  selectedQuestionHeader: {
    backgroundColor: "#F0F8FF",
    borderLeftWidth: 4,
    borderLeftColor: "#920734",
  },
  answeredQuestionHeader: {
    backgroundColor: "#F0FFF4",
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#920734",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  questionNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  questionListText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    lineHeight: 20,
  },
  questionStatus: {
    marginLeft: 8,
  },
  answerSection: {
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  // Rating Display
  calculatedRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#920734",
  },
  calculatedRatingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#920734",
    marginRight: 12,
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#920734",
  },
  ratingOutOf: {
    fontSize: 16,
    color: "#666",
    marginLeft: 2,
  },
  // Grade Selection Styles
  selectedGradeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#920734",
  },
  gradeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedGradeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#920734",
  },
  removeGradeButton: {
    padding: 8,
    backgroundColor: "#FFE6E6",
    borderRadius: 20,
  },
  gradesList: {
    marginTop: 8,
  },
  gradeCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#920734",
  },
  gradeCardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#920734",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  gradeCardStudents: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  noStudentsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 8,
  },
  noStudentsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  selectGradeFirstContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 8,
  },
  selectGradeFirstText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  // Student Section Header Styles
  studentSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  gradeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#920734",
    gap: 4,
  },
  gradeIndicatorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#920734",
  },
  // Validation Info Styles
  validationInfoContainer: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#920734",
  },
  validationInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#920734",
    marginBottom: 12,
  },
  validationCheckList: {
    marginBottom: 8,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  validationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  validationCompleted: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  validationNote: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
  // Loading and Error States
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginVertical: 8,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  errorText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#D32F2F",
    textAlign: "center",
    flex: 1,
  },
});

export default EducatorFeedbackModal;
