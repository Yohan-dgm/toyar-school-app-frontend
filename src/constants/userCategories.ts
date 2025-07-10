// User Category Constants
export const USER_CATEGORIES = {
  PARENT: 1,
  EDUCATOR: 2,
  SPORT_COACH: 3,
  COUNSELOR: 4,
  ADMIN: 5,
  MANAGEMENT: 6,
  TOP_MANAGEMENT: 7,
  // Add more categories as needed
} as const;

// User Category Names
export const USER_CATEGORY_NAMES = {
  [USER_CATEGORIES.PARENT]: 'parent',
  [USER_CATEGORIES.EDUCATOR]: 'educator',
  [USER_CATEGORIES.SPORT_COACH]: 'sport_coach',
  [USER_CATEGORIES.COUNSELOR]: 'counselor',
  [USER_CATEGORIES.ADMIN]: 'admin',
  [USER_CATEGORIES.MANAGEMENT]: 'management',
  [USER_CATEGORIES.TOP_MANAGEMENT]: 'top_management',
} as const;

// User Category Display Names
export const USER_CATEGORY_DISPLAY_NAMES = {
  [USER_CATEGORIES.PARENT]: 'Parent',
  [USER_CATEGORIES.EDUCATOR]: 'Educator',
  [USER_CATEGORIES.SPORT_COACH]: 'Sport Coach',
  [USER_CATEGORIES.COUNSELOR]: 'Counselor',
  [USER_CATEGORIES.ADMIN]: 'Admin',
  [USER_CATEGORIES.MANAGEMENT]: 'Management',
  [USER_CATEGORIES.TOP_MANAGEMENT]: 'Top Management',
} as const;

// Helper function to get user category name
export const getUserCategoryName = (categoryId: number): string => {
  return USER_CATEGORY_NAMES[categoryId as keyof typeof USER_CATEGORY_NAMES] || 'parent';
};

// Helper function to get user category display name
export const getUserCategoryDisplayName = (categoryId: number): string => {
  return USER_CATEGORY_DISPLAY_NAMES[categoryId as keyof typeof USER_CATEGORY_DISPLAY_NAMES] || 'Parent';
};

// Helper function to get user category ID from name
export const getUserCategoryId = (categoryName: string): number => {
  const entry = Object.entries(USER_CATEGORY_NAMES).find(([_, name]) => name === categoryName);
  return entry ? parseInt(entry[0]) : USER_CATEGORIES.PARENT;
};

export type UserCategoryId = typeof USER_CATEGORIES[keyof typeof USER_CATEGORIES];
export type UserCategoryName = typeof USER_CATEGORY_NAMES[keyof typeof USER_CATEGORY_NAMES];
