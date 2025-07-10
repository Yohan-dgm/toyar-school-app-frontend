import { USER_CATEGORIES } from '../constants/userCategories';

export interface NavigationTab {
  id: string;
  icon: string;
  iconFamily: 'MaterialIcons' | 'MaterialCommunityIcons';
  title: string;
  route: string;
}

export interface NavigationConfig {
  tabs: NavigationTab[];
  defaultTab: string;
}

// Parent Navigation Configuration
const PARENT_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "schoolLife",
      icon: "home",
      iconFamily: "MaterialIcons",
      title: "School Life",
      route: "index"
    },
    {
      id: "feedback",
      icon: "contacts",
      iconFamily: "MaterialCommunityIcons",
      title: "Educator Feedback",
      route: "educator-feedback"
    },
    {
      id: "calendar",
      icon: "calendar-today",
      iconFamily: "MaterialIcons",
      title: "Calendar",
      route: "calendar"
    },
    {
      id: "academic",
      icon: "school",
      iconFamily: "MaterialIcons",
      title: "Academic Performance",
      route: "academic"
    },
    {
      id: "performance",
      icon: "pie-chart",
      iconFamily: "MaterialIcons",
      title: "Student Performance",
      route: "performance"
    }
  ],
  defaultTab: "schoolLife"
};

// Educator Navigation Configuration
const EDUCATOR_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "dashboard",
      icon: "dashboard",
      iconFamily: "MaterialIcons",
      title: "Dashboard",
      route: "index"
    },
    {
      id: "students",
      icon: "people",
      iconFamily: "MaterialIcons",
      title: "Students",
      route: "students"
    },
    {
      id: "classes",
      icon: "class",
      iconFamily: "MaterialIcons",
      title: "Classes",
      route: "classes"
    },
    {
      id: "assignments",
      icon: "assignment",
      iconFamily: "MaterialIcons",
      title: "Assignments",
      route: "assignments"
    },
    {
      id: "reports",
      icon: "assessment",
      iconFamily: "MaterialIcons",
      title: "Reports",
      route: "reports"
    }
  ],
  defaultTab: "dashboard"
};

// Sport Coach Navigation Configuration
const SPORT_COACH_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "teams",
      icon: "sports",
      iconFamily: "MaterialIcons",
      title: "Teams",
      route: "index"
    },
    {
      id: "training",
      icon: "fitness-center",
      iconFamily: "MaterialIcons",
      title: "Training",
      route: "training"
    },
    {
      id: "matches",
      icon: "event",
      iconFamily: "MaterialIcons",
      title: "Matches",
      route: "matches"
    },
    {
      id: "players",
      icon: "people",
      iconFamily: "MaterialIcons",
      title: "Players",
      route: "players"
    }
  ],
  defaultTab: "teams"
};

// Counselor Navigation Configuration
const COUNSELOR_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "sessions",
      icon: "psychology",
      iconFamily: "MaterialIcons",
      title: "Sessions",
      route: "index"
    },
    {
      id: "students",
      icon: "people",
      iconFamily: "MaterialIcons",
      title: "Students",
      route: "students"
    },
    {
      id: "appointments",
      icon: "schedule",
      iconFamily: "MaterialIcons",
      title: "Appointments",
      route: "appointments"
    },
    {
      id: "resources",
      icon: "library-books",
      iconFamily: "MaterialIcons",
      title: "Resources",
      route: "resources"
    }
  ],
  defaultTab: "sessions"
};

// Admin Navigation Configuration
const ADMIN_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "overview",
      icon: "admin-panel-settings",
      iconFamily: "MaterialIcons",
      title: "Overview",
      route: "index"
    },
    {
      id: "users",
      icon: "people",
      iconFamily: "MaterialIcons",
      title: "Users",
      route: "users"
    },
    {
      id: "settings",
      icon: "settings",
      iconFamily: "MaterialIcons",
      title: "Settings",
      route: "settings"
    },
    {
      id: "reports",
      icon: "assessment",
      iconFamily: "MaterialIcons",
      title: "Reports",
      route: "reports"
    }
  ],
  defaultTab: "overview"
};

// Management Navigation Configuration
const MANAGEMENT_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "analytics",
      icon: "analytics",
      iconFamily: "MaterialIcons",
      title: "Analytics",
      route: "index"
    },
    {
      id: "departments",
      icon: "business",
      iconFamily: "MaterialIcons",
      title: "Departments",
      route: "departments"
    },
    {
      id: "staff",
      icon: "people",
      iconFamily: "MaterialIcons",
      title: "Staff",
      route: "staff"
    },
    {
      id: "finance",
      icon: "account-balance",
      iconFamily: "MaterialIcons",
      title: "Finance",
      route: "finance"
    }
  ],
  defaultTab: "analytics"
};

// Top Management Navigation Configuration
const TOP_MANAGEMENT_NAVIGATION: NavigationConfig = {
  tabs: [
    {
      id: "executive",
      icon: "corporate-fare",
      iconFamily: "MaterialIcons",
      title: "Executive",
      route: "index"
    },
    {
      id: "strategy",
      icon: "trending-up",
      iconFamily: "MaterialIcons",
      title: "Strategy",
      route: "strategy"
    },
    {
      id: "governance",
      icon: "gavel",
      iconFamily: "MaterialIcons",
      title: "Governance",
      route: "governance"
    }
  ],
  defaultTab: "executive"
};

// Navigation Configuration Map
export const NAVIGATION_CONFIGS: Record<number, NavigationConfig> = {
  [USER_CATEGORIES.PARENT]: PARENT_NAVIGATION,
  [USER_CATEGORIES.EDUCATOR]: EDUCATOR_NAVIGATION,
  [USER_CATEGORIES.SPORT_COACH]: SPORT_COACH_NAVIGATION,
  [USER_CATEGORIES.COUNSELOR]: COUNSELOR_NAVIGATION,
  [USER_CATEGORIES.ADMIN]: ADMIN_NAVIGATION,
  [USER_CATEGORIES.MANAGEMENT]: MANAGEMENT_NAVIGATION,
  [USER_CATEGORIES.TOP_MANAGEMENT]: TOP_MANAGEMENT_NAVIGATION,
};

// Helper function to get navigation config for user category
export const getNavigationConfig = (userCategory: number): NavigationConfig => {
  return NAVIGATION_CONFIGS[userCategory] || PARENT_NAVIGATION;
};
