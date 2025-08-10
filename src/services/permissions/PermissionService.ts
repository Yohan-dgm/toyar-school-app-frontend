import {
  USER_CATEGORIES,
  getUserCategoryName,
} from "../../constants/userCategories";

// Permission categories
export enum PermissionCategory {
  ACADEMIC = "academic",
  ATTENDANCE = "attendance",
  CALENDAR = "calendar",
  COMMUNICATION = "communication",
  FINANCE = "finance",
  REPORTS = "reports",
  USER_MANAGEMENT = "user_management",
  SYSTEM = "system",
  NOTIFICATIONS = "notifications",
  SETTINGS = "settings",
}

// Specific permissions
export enum Permission {
  // Academic permissions
  VIEW_GRADES = "academic.view_grades",
  EDIT_GRADES = "academic.edit_grades",
  VIEW_ASSIGNMENTS = "academic.view_assignments",
  CREATE_ASSIGNMENTS = "academic.create_assignments",
  VIEW_CURRICULUM = "academic.view_curriculum",
  EDIT_CURRICULUM = "academic.edit_curriculum",

  // Attendance permissions
  VIEW_ATTENDANCE = "attendance.view",
  MARK_ATTENDANCE = "attendance.mark",
  EDIT_ATTENDANCE = "attendance.edit",
  VIEW_ATTENDANCE_REPORTS = "attendance.view_reports",

  // Calendar permissions
  VIEW_CALENDAR = "calendar.view",
  CREATE_EVENTS = "calendar.create_events",
  EDIT_EVENTS = "calendar.edit_events",
  DELETE_EVENTS = "calendar.delete_events",
  MANAGE_SCHOOL_CALENDAR = "calendar.manage_school",

  // Communication permissions
  SEND_MESSAGES = "communication.send_messages",
  SEND_ANNOUNCEMENTS = "communication.send_announcements",
  SEND_NOTIFICATIONS = "communication.send_notifications",
  VIEW_MESSAGES = "communication.view_messages",
  MODERATE_MESSAGES = "communication.moderate_messages",

  // Finance permissions
  VIEW_PAYMENTS = "finance.view_payments",
  PROCESS_PAYMENTS = "finance.process_payments",
  VIEW_FINANCIAL_REPORTS = "finance.view_reports",
  MANAGE_FEES = "finance.manage_fees",

  // Reports permissions
  VIEW_STUDENT_REPORTS = "reports.view_student",
  VIEW_CLASS_REPORTS = "reports.view_class",
  VIEW_SCHOOL_REPORTS = "reports.view_school",
  GENERATE_REPORTS = "reports.generate",
  EXPORT_REPORTS = "reports.export",

  // User management permissions
  VIEW_USERS = "users.view",
  CREATE_USERS = "users.create",
  EDIT_USERS = "users.edit",
  DELETE_USERS = "users.delete",
  MANAGE_ROLES = "users.manage_roles",
  VIEW_USER_ANALYTICS = "users.view_analytics",

  // System permissions
  MANAGE_SYSTEM_SETTINGS = "system.manage_settings",
  VIEW_SYSTEM_LOGS = "system.view_logs",
  MANAGE_INTEGRATIONS = "system.manage_integrations",
  SYSTEM_BACKUP = "system.backup",

  // Notification permissions
  SEND_PUSH_NOTIFICATIONS = "notifications.send_push",
  MANAGE_NOTIFICATION_SETTINGS = "notifications.manage_settings",
  VIEW_NOTIFICATION_ANALYTICS = "notifications.view_analytics",

  // Settings permissions
  MANAGE_PROFILE = "settings.manage_profile",
  MANAGE_PREFERENCES = "settings.manage_preferences",
  MANAGE_PRIVACY = "settings.manage_privacy",
}

// Permission sets for each user category
const PERMISSION_MATRIX: Record<number, Permission[]> = {
  [USER_CATEGORIES.PARENT]: [
    Permission.VIEW_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_STUDENT_REPORTS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.EDUCATOR]: [
    Permission.VIEW_GRADES,
    Permission.EDIT_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.CREATE_ASSIGNMENTS,
    Permission.VIEW_CURRICULUM,
    Permission.VIEW_ATTENDANCE,
    Permission.MARK_ATTENDANCE,
    Permission.EDIT_ATTENDANCE,
    Permission.VIEW_CALENDAR,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.SEND_MESSAGES,
    Permission.SEND_ANNOUNCEMENTS,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_STUDENT_REPORTS,
    Permission.VIEW_CLASS_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.STUDENT]: [
    Permission.VIEW_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.PRINCIPAL]: [
    Permission.VIEW_GRADES,
    Permission.EDIT_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.CREATE_ASSIGNMENTS,
    Permission.VIEW_CURRICULUM,
    Permission.EDIT_CURRICULUM,
    Permission.VIEW_ATTENDANCE,
    Permission.MARK_ATTENDANCE,
    Permission.EDIT_ATTENDANCE,
    Permission.VIEW_ATTENDANCE_REPORTS,
    Permission.VIEW_CALENDAR,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.DELETE_EVENTS,
    Permission.MANAGE_SCHOOL_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.SEND_ANNOUNCEMENTS,
    Permission.SEND_NOTIFICATIONS,
    Permission.VIEW_MESSAGES,
    Permission.MODERATE_MESSAGES,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_STUDENT_REPORTS,
    Permission.VIEW_CLASS_REPORTS,
    Permission.VIEW_SCHOOL_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_USERS,
    Permission.EDIT_USERS,
    Permission.VIEW_USER_ANALYTICS,
    Permission.SEND_PUSH_NOTIFICATIONS,
    Permission.MANAGE_NOTIFICATION_SETTINGS,
    Permission.VIEW_NOTIFICATION_ANALYTICS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.ADMIN]: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],

  [USER_CATEGORIES.MANAGEMENT]: [
    Permission.VIEW_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_CURRICULUM,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_ATTENDANCE_REPORTS,
    Permission.VIEW_CALENDAR,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.MANAGE_SCHOOL_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.SEND_ANNOUNCEMENTS,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_PAYMENTS,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.MANAGE_FEES,
    Permission.VIEW_STUDENT_REPORTS,
    Permission.VIEW_CLASS_REPORTS,
    Permission.VIEW_SCHOOL_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.VIEW_USER_ANALYTICS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.SENIOR_MANAGEMENT]: [
    // Senior management has most permissions except system-level ones
    ...Object.values(Permission).filter(
      (p) =>
        !p.startsWith("system.") &&
        p !== Permission.DELETE_USERS &&
        p !== Permission.MANAGE_ROLES,
    ),
  ],

  [USER_CATEGORIES.SPORT_COACH]: [
    Permission.VIEW_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_ATTENDANCE,
    Permission.MARK_ATTENDANCE,
    Permission.VIEW_CALENDAR,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_STUDENT_REPORTS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.COUNSELOR]: [
    Permission.VIEW_GRADES,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_CALENDAR,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_STUDENT_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.TOYAR_TEAM]: [
    // Technical team has system permissions
    Permission.VIEW_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_SCHOOL_REPORTS,
    Permission.MANAGE_SYSTEM_SETTINGS,
    Permission.VIEW_SYSTEM_LOGS,
    Permission.MANAGE_INTEGRATIONS,
    Permission.SYSTEM_BACKUP,
    Permission.SEND_PUSH_NOTIFICATIONS,
    Permission.MANAGE_NOTIFICATION_SETTINGS,
    Permission.VIEW_NOTIFICATION_ANALYTICS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.SECURITY]: [
    Permission.VIEW_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_USERS,
    Permission.VIEW_USER_ANALYTICS,
    Permission.VIEW_SYSTEM_LOGS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],

  [USER_CATEGORIES.CANTEEN]: [
    Permission.VIEW_CALENDAR,
    Permission.SEND_MESSAGES,
    Permission.VIEW_MESSAGES,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_USERS,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_PREFERENCES,
    Permission.MANAGE_PRIVACY,
  ],
};

class PermissionService {
  private static instance: PermissionService;
  private userPermissions: Permission[] = [];
  private userCategory: number | null = null;

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  // Initialize permissions for a user
  setUserPermissions(
    userCategory: number,
    customPermissions?: Permission[],
  ): void {
    this.userCategory = userCategory;

    // Use custom permissions if provided, otherwise use default matrix
    this.userPermissions =
      customPermissions || PERMISSION_MATRIX[userCategory] || [];

    console.log(
      `🔐 Permissions set for ${getUserCategoryName(userCategory)}:`,
      this.userPermissions.length,
    );
  }

  // Check if user has a specific permission
  hasPermission(permission: Permission): boolean {
    return this.userPermissions.includes(permission);
  }

  // Check if user has any of the provided permissions
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  // Check if user has all of the provided permissions
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  // Get all permissions for current user
  getUserPermissions(): Permission[] {
    return [...this.userPermissions];
  }

  // Get permissions by category
  getPermissionsByCategory(category: PermissionCategory): Permission[] {
    return this.userPermissions.filter((permission) =>
      permission.startsWith(category + "."),
    );
  }

  // Check if user can access a specific feature
  canAccess(feature: string): boolean {
    const featurePermissions = this.getFeaturePermissions(feature);
    return this.hasAnyPermission(featurePermissions);
  }

  // Define feature-to-permission mappings
  private getFeaturePermissions(feature: string): Permission[] {
    const featureMap: Record<string, Permission[]> = {
      grades: [Permission.VIEW_GRADES, Permission.EDIT_GRADES],
      assignments: [Permission.VIEW_ASSIGNMENTS, Permission.CREATE_ASSIGNMENTS],
      attendance: [Permission.VIEW_ATTENDANCE, Permission.MARK_ATTENDANCE],
      calendar: [Permission.VIEW_CALENDAR, Permission.CREATE_EVENTS],
      messages: [Permission.SEND_MESSAGES, Permission.VIEW_MESSAGES],
      announcements: [Permission.SEND_ANNOUNCEMENTS],
      payments: [Permission.VIEW_PAYMENTS, Permission.PROCESS_PAYMENTS],
      reports: [
        Permission.VIEW_STUDENT_REPORTS,
        Permission.VIEW_CLASS_REPORTS,
        Permission.VIEW_SCHOOL_REPORTS,
      ],
      users: [
        Permission.VIEW_USERS,
        Permission.CREATE_USERS,
        Permission.EDIT_USERS,
      ],
      notifications: [
        Permission.SEND_PUSH_NOTIFICATIONS,
        Permission.MANAGE_NOTIFICATION_SETTINGS,
      ],
      system: [Permission.MANAGE_SYSTEM_SETTINGS, Permission.VIEW_SYSTEM_LOGS],
    };

    return featureMap[feature] || [];
  }

  // Get all available permissions for a user category
  static getPermissionsForCategory(userCategory: number): Permission[] {
    return PERMISSION_MATRIX[userCategory] || [];
  }

  // Check if a permission exists in a category
  static isValidPermission(
    permission: Permission,
    userCategory: number,
  ): boolean {
    const categoryPermissions = PERMISSION_MATRIX[userCategory] || [];
    return categoryPermissions.includes(permission);
  }

  // Get permission categories available to user
  getAvailableCategories(): PermissionCategory[] {
    const categories = new Set<PermissionCategory>();

    this.userPermissions.forEach((permission) => {
      const category = permission.split(".")[0] as PermissionCategory;
      categories.add(category);
    });

    return Array.from(categories);
  }

  // Clear all permissions (for logout)
  clearPermissions(): void {
    this.userPermissions = [];
    this.userCategory = null;
    console.log("🔐 Permissions cleared");
  }

  // Get current user category
  getUserCategory(): number | null {
    return this.userCategory;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.userCategory === USER_CATEGORIES.ADMIN;
  }

  // Check if user is educator
  isEducator(): boolean {
    return this.userCategory === USER_CATEGORIES.EDUCATOR;
  }

  // Check if user is parent
  isParent(): boolean {
    return this.userCategory === USER_CATEGORIES.PARENT;
  }

  // Check if user is student
  isStudent(): boolean {
    return this.userCategory === USER_CATEGORIES.STUDENT;
  }

  // Check if user is management level
  isManagement(): boolean {
    return [
      USER_CATEGORIES.PRINCIPAL,
      USER_CATEGORIES.SENIOR_MANAGEMENT,
      USER_CATEGORIES.MANAGEMENT,
      USER_CATEGORIES.ADMIN,
    ].includes(this.userCategory || 0);
  }

  // Get permission description
  getPermissionDescription(permission: Permission): string {
    const descriptions: Record<Permission, string> = {
      [Permission.VIEW_GRADES]: "View student grades and academic performance",
      [Permission.EDIT_GRADES]: "Edit and update student grades",
      [Permission.VIEW_ASSIGNMENTS]: "View assignments and homework",
      [Permission.CREATE_ASSIGNMENTS]: "Create and manage assignments",
      [Permission.VIEW_CURRICULUM]: "Access curriculum and course materials",
      [Permission.EDIT_CURRICULUM]: "Modify curriculum and course content",
      [Permission.VIEW_ATTENDANCE]: "View attendance records",
      [Permission.MARK_ATTENDANCE]: "Take and update attendance",
      [Permission.EDIT_ATTENDANCE]: "Modify attendance records",
      [Permission.VIEW_ATTENDANCE_REPORTS]:
        "Access attendance reports and analytics",
      [Permission.VIEW_CALENDAR]: "View school calendar and events",
      [Permission.CREATE_EVENTS]: "Create calendar events",
      [Permission.EDIT_EVENTS]: "Modify calendar events",
      [Permission.DELETE_EVENTS]: "Delete calendar events",
      [Permission.MANAGE_SCHOOL_CALENDAR]: "Full calendar management access",
      [Permission.SEND_MESSAGES]: "Send messages to other users",
      [Permission.SEND_ANNOUNCEMENTS]: "Send school-wide announcements",
      [Permission.SEND_NOTIFICATIONS]: "Send push notifications",
      [Permission.VIEW_MESSAGES]: "View and read messages",
      [Permission.MODERATE_MESSAGES]: "Moderate and manage messages",
      [Permission.VIEW_PAYMENTS]: "View payment information",
      [Permission.PROCESS_PAYMENTS]: "Process and manage payments",
      [Permission.VIEW_FINANCIAL_REPORTS]: "Access financial reports",
      [Permission.MANAGE_FEES]: "Manage fee structure and pricing",
      [Permission.VIEW_STUDENT_REPORTS]: "View individual student reports",
      [Permission.VIEW_CLASS_REPORTS]: "View class-level reports",
      [Permission.VIEW_SCHOOL_REPORTS]: "View school-wide reports",
      [Permission.GENERATE_REPORTS]: "Generate custom reports",
      [Permission.EXPORT_REPORTS]: "Export reports to external formats",
      [Permission.VIEW_USERS]: "View user profiles and information",
      [Permission.CREATE_USERS]: "Create new user accounts",
      [Permission.EDIT_USERS]: "Edit user profiles and settings",
      [Permission.DELETE_USERS]: "Delete user accounts",
      [Permission.MANAGE_ROLES]: "Manage user roles and permissions",
      [Permission.VIEW_USER_ANALYTICS]: "View user behavior analytics",
      [Permission.MANAGE_SYSTEM_SETTINGS]: "Manage system configuration",
      [Permission.VIEW_SYSTEM_LOGS]: "Access system logs and diagnostics",
      [Permission.MANAGE_INTEGRATIONS]: "Manage third-party integrations",
      [Permission.SYSTEM_BACKUP]: "Perform system backups and maintenance",
      [Permission.SEND_PUSH_NOTIFICATIONS]:
        "Send push notifications to devices",
      [Permission.MANAGE_NOTIFICATION_SETTINGS]:
        "Configure notification preferences",
      [Permission.VIEW_NOTIFICATION_ANALYTICS]:
        "View notification delivery analytics",
      [Permission.MANAGE_PROFILE]: "Manage personal profile information",
      [Permission.MANAGE_PREFERENCES]: "Configure personal preferences",
      [Permission.MANAGE_PRIVACY]: "Manage privacy settings",
    };

    return descriptions[permission] || "Permission description not available";
  }
}

export default PermissionService.getInstance();
