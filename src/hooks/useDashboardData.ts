import { useMemo } from "react";
import { useGetStudentListDataQuery } from "../api/educator-feedback-api";
import { useGetAllTeachersWithPaginationQuery } from "../api/teacher-api";

export interface DashboardData {
  totalStudents: number;
  totalEducators: number;
  activeClasses: number;
  averageAttendance: number;
  notifications: number;
  droppedOutStudents: number;
  incompleteStudents: number;
  houseStudents: {
    vulcan: number;
    tellus: number;
    eurus: number;
    calypso: number;
  };
  gradeDistribution: {
    id: number;
    name: string;
    studentCount: number;
  }[];
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardData = (): DashboardState => {
  // Fetch student data
  const {
    data: studentResponse,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useGetStudentListDataQuery({
    page: 1,
    page_size: 1,
    search_phrase: "",
    search_filter_list: [],
  });

  // Fetch educator data
  const {
    data: educatorResponse,
    isLoading: educatorsLoading,
    error: educatorsError,
    refetch: refetchEducators,
  } = useGetAllTeachersWithPaginationQuery({
    page: 1,
    page_size: 1,
    search_phrase: "",
    search_filter_list: [],
  });

  const transformedData = useMemo((): DashboardData | null => {
    // Debug logging
    console.log("🔍 Student API Response:", studentResponse);
    console.log("🔍 Educator API Response:", educatorResponse);

    // Check if we have student response data
    if (!studentResponse?.data) {
      console.log("❌ No student response data found");
      return null;
    }

    // Try to get raw data from the expected structure
    const rawData = studentResponse.data.raw_data || studentResponse.data;
    console.log("📊 Raw student data for dashboard:", rawData);

    // Get educator count from educator API
    const educatorCount =
      educatorResponse?.data?.educator_count ||
      educatorResponse?.data?.total_count ||
      0;
    console.log("👩‍🏫 Educator count from API:", educatorCount);

    // Transform school house data
    const houseStudents = {
      vulcan: 0,
      tellus: 0,
      eurus: 0,
      calypso: 0,
    };

    if (rawData.school_house_student_count) {
      rawData.school_house_student_count.forEach((house: any) => {
        const houseName = house.name.toLowerCase();
        if (houseName === "vulcan") {
          houseStudents.vulcan = house.student_list_count || 0;
        } else if (houseName === "tellus") {
          houseStudents.tellus = house.student_list_count || 0;
        } else if (houseName === "eurus") {
          houseStudents.eurus = house.student_list_count || 0;
        } else if (houseName === "calypso") {
          houseStudents.calypso = house.student_list_count || 0;
        }
      });
    }

    // Transform grade distribution
    const gradeDistribution =
      rawData.grade_level_student_count?.map((grade: any) => ({
        id: grade.id,
        name: grade.name,
        studentCount: grade.student_list_count || 0,
      })) || [];

    // Calculate total educators (estimate based on student-teacher ratio)
    const totalStudents = rawData.student_count || 0;
    const estimatedEducators = Math.ceil(totalStudents / 15); // Assuming 15:1 ratio

    // Calculate active classes (estimate based on grades with students)
    const activeClasses = gradeDistribution.filter(
      (grade) => grade.studentCount > 0,
    ).length;

    return {
      totalStudents: totalStudents, // Real API data
      totalEducators: educatorCount, // Real API data
      activeClasses: 12, // Dummy data
      averageAttendance: 0, // Dummy data
      notifications: 0, // Dummy data
      droppedOutStudents: 8, // Dummy data
      incompleteStudents: 15, // Dummy data
      houseStudents, // Real API data
      gradeDistribution, // Real API data
    };
  }, [studentResponse, educatorResponse]);

  const combinedLoading = studentsLoading || educatorsLoading;
  const combinedError = studentsError || educatorsError;

  const refetch = () => {
    refetchStudents();
    refetchEducators();
  };

  return {
    data: transformedData,
    isLoading: combinedLoading,
    error: combinedError ? "Failed to load dashboard data" : null,
    refetch,
  };
};
