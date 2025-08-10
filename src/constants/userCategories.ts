// User Category Constants - Updated to match new requirements
export const USER_CATEGORIES = {
  PARENT: 1,
  EDUCATOR: 2,
  SENIOR_MANAGEMENT: 3,
  PRINCIPAL: 4,
  MANAGEMENT: 5,
  ADMIN: 6,
  SPORT_COACH: 7,
  COUNSELOR: 8,
  STUDENT: 9,
  TOYAR_TEAM: 10,
  SECURITY: 11,
  CANTEEN: 12,
} as const;

// User Category Names - File/Route friendly names
export const USER_CATEGORY_NAMES = {
  [USER_CATEGORIES.PARENT]: "parent",
  [USER_CATEGORIES.EDUCATOR]: "educator",
  [USER_CATEGORIES.SENIOR_MANAGEMENT]: "senior_management",
  [USER_CATEGORIES.PRINCIPAL]: "principal",
  [USER_CATEGORIES.MANAGEMENT]: "management",
  [USER_CATEGORIES.ADMIN]: "admin",
  [USER_CATEGORIES.SPORT_COACH]: "sport_coach",
  [USER_CATEGORIES.COUNSELOR]: "counselor",
  [USER_CATEGORIES.STUDENT]: "student",
  [USER_CATEGORIES.TOYAR_TEAM]: "toyar_team",
  [USER_CATEGORIES.SECURITY]: "security",
  [USER_CATEGORIES.CANTEEN]: "canteen",
} as const;

// User Category Display Names - Human readable names
export const USER_CATEGORY_DISPLAY_NAMES = {
  [USER_CATEGORIES.PARENT]: "Parent",
  [USER_CATEGORIES.EDUCATOR]: "Educator",
  [USER_CATEGORIES.SENIOR_MANAGEMENT]: "Senior Management",
  [USER_CATEGORIES.PRINCIPAL]: "Principal/Deputy Principal",
  [USER_CATEGORIES.MANAGEMENT]: "Management",
  [USER_CATEGORIES.ADMIN]: "Admin",
  [USER_CATEGORIES.SPORT_COACH]: "Sport Coach",
  [USER_CATEGORIES.COUNSELOR]: "Counselor",
  [USER_CATEGORIES.STUDENT]: "Student",
  [USER_CATEGORIES.TOYAR_TEAM]: "Toyar Team",
  [USER_CATEGORIES.SECURITY]: "Security",
  [USER_CATEGORIES.CANTEEN]: "Canteen",
} as const;

// Helper function to get user category name
export const getUserCategoryName = (categoryId: number): string => {
  return (
    USER_CATEGORY_NAMES[categoryId as keyof typeof USER_CATEGORY_NAMES] ||
    "parent"
  );
};

// Helper function to get user category display name
export const getUserCategoryDisplayName = (categoryId: number): string => {
  return (
    USER_CATEGORY_DISPLAY_NAMES[
      categoryId as keyof typeof USER_CATEGORY_DISPLAY_NAMES
    ] || "Parent"
  );
};

// Helper function to get user category ID from name
export const getUserCategoryId = (categoryName: string): number => {
  const entry = Object.entries(USER_CATEGORY_NAMES).find(
    ([_, name]) => name === categoryName,
  );
  return entry ? parseInt(entry[0]) : USER_CATEGORIES.PARENT;
};

export type UserCategoryId =
  (typeof USER_CATEGORIES)[keyof typeof USER_CATEGORIES];
export type UserCategoryName =
  (typeof USER_CATEGORY_NAMES)[keyof typeof USER_CATEGORY_NAMES];
