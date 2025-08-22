/**
 * Student Growth API Type Definitions
 *
 * Types for the student intelligence ratings API response
 * and component data structures
 */

// ===== API RESPONSE TYPES =====

export interface StudentInfo {
  id: number;
  full_name: string;
  student_calling_name: string;
  admission_number: string;
  grade_level: {
    id: number;
    name: string;
  };
}

export interface GrowthSummary {
  total_records: number;
  average_overall: number;
  filtered_period: string;
  status_filter: number;
  categories_with_data: number;
  categories_total: number;
}

export interface CategoryRating {
  category_id: number;
  category_name: string;
  average_rating: number;
  record_count: number;
}

export interface StudentGrowthApiResponse {
  success: boolean;
  data: {
    student_info: StudentInfo;
    summary: GrowthSummary;
    categories: CategoryRating[];
  };
  message: string;
}

// ===== API REQUEST TYPES =====

export interface StudentRatingsRequest {
  student_id: number;
  year?: number; // e.g., 2025 for year filter
  month?: number; // e.g., 8 for month filter (1-12)
}

// ===== COMPONENT DATA TYPES =====

export interface IntelligenceCardData {
  id: string;
  title: string;
  icon: string;
  rating: number;
  level: string;
  color: string;
  description: string;
  trend: number[];
  classAverage: number;
  recordCount?: number;
}

export interface OverallRatingData {
  id: string;
  title: string;
  icon: string;
  rating: number;
  level: string;
  color: string;
  description: string;
  trend: number[];
  classAverage: number;
  totalRecords: number;
  filteredPeriod: string;
}

// ===== CATEGORY MAPPING TYPES =====

export interface CategoryMapping {
  [key: string]: {
    id: string;
    icon: string;
    color: string;
    description: string;
  };
}

// ===== FILTER TYPES =====

export type FilterPeriod = "all" | "current-year" | "current-month";

export interface FilterState {
  selectedFilter: FilterPeriod;
  currentYear: number;
  currentMonth: string;
}
