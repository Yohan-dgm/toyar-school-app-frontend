import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import PermissionService, {
  Permission,
  PermissionCategory,
} from "../services/permissions/PermissionService";
import type { RootState } from "../state-store/store";

export interface UsePermissionsReturn {
  // Permission checking
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccess: (feature: string) => boolean;

  // User role checks
  isAdmin: () => boolean;
  isEducator: () => boolean;
  isParent: () => boolean;
  isStudent: () => boolean;
  isManagement: () => boolean;

  // Permission data
  userPermissions: Permission[];
  availableCategories: PermissionCategory[];
  userCategory: number | null;

  // Utility functions
  getPermissionsByCategory: (category: PermissionCategory) => Permission[];
  getPermissionDescription: (permission: Permission) => string;

  // Loading state
  isInitialized: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [availableCategories, setAvailableCategories] = useState<
    PermissionCategory[]
  >([]);
  const [userCategory, setUserCategory] = useState<number | null>(null);

  // Get user data from Redux
  const { sessionData, user } = useSelector((state: RootState) => state.app);
  const currentUserCategory =
    sessionData?.user_category ||
    sessionData?.data?.user_category ||
    user?.userCategory;

  // Initialize permissions when user data changes
  useEffect(() => {
    if (currentUserCategory && !isInitialized) {
      console.log(
        "🔐 Initializing permissions for user category:",
        currentUserCategory,
      );

      // Set permissions in service
      PermissionService.setUserPermissions(currentUserCategory);

      // Update local state
      setUserCategory(currentUserCategory);
      setUserPermissions(PermissionService.getUserPermissions());
      setAvailableCategories(PermissionService.getAvailableCategories());
      setIsInitialized(true);

      console.log("✅ Permissions initialized:", {
        category: currentUserCategory,
        permissionsCount: PermissionService.getUserPermissions().length,
      });
    }
  }, [currentUserCategory, isInitialized]);

  // Clear permissions when user logs out
  useEffect(() => {
    if (!currentUserCategory && isInitialized) {
      console.log("🔐 Clearing permissions on logout");
      PermissionService.clearPermissions();
      setUserCategory(null);
      setUserPermissions([]);
      setAvailableCategories([]);
      setIsInitialized(false);
    }
  }, [currentUserCategory, isInitialized]);

  // Permission checking functions
  const hasPermission = useCallback((permission: Permission): boolean => {
    return PermissionService.hasPermission(permission);
  }, []);

  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    return PermissionService.hasAnyPermission(permissions);
  }, []);

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return PermissionService.hasAllPermissions(permissions);
    },
    [],
  );

  const canAccess = useCallback((feature: string): boolean => {
    return PermissionService.canAccess(feature);
  }, []);

  // Role checking functions
  const isAdmin = useCallback((): boolean => {
    return PermissionService.isAdmin();
  }, []);

  const isEducator = useCallback((): boolean => {
    return PermissionService.isEducator();
  }, []);

  const isParent = useCallback((): boolean => {
    return PermissionService.isParent();
  }, []);

  const isStudent = useCallback((): boolean => {
    return PermissionService.isStudent();
  }, []);

  const isManagement = useCallback((): boolean => {
    return PermissionService.isManagement();
  }, []);

  // Utility functions
  const getPermissionsByCategory = useCallback(
    (category: PermissionCategory): Permission[] => {
      return PermissionService.getPermissionsByCategory(category);
    },
    [],
  );

  const getPermissionDescription = useCallback(
    (permission: Permission): string => {
      return PermissionService.getPermissionDescription(permission);
    },
    [],
  );

  return {
    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,

    // User role checks
    isAdmin,
    isEducator,
    isParent,
    isStudent,
    isManagement,

    // Permission data
    userPermissions,
    availableCategories,
    userCategory,

    // Utility functions
    getPermissionsByCategory,
    getPermissionDescription,

    // Loading state
    isInitialized,
  };
};
