import React, { ReactNode } from "react";
import { usePermissions } from "../../hooks/usePermissions";
import { Permission } from "../../services/permissions/PermissionService";

interface PermissionGateProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  feature?: string;
  userCategory?: number | number[];
  fallback?: ReactNode;
  inverse?: boolean;
}

/**
 * PermissionGate component for conditional rendering based on user permissions
 *
 * @param children - Content to render if permission check passes
 * @param permission - Single permission to check
 * @param permissions - Array of permissions to check
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @param feature - Feature name to check access for
 * @param userCategory - User category(s) to check against
 * @param fallback - Content to render if permission check fails
 * @param inverse - If true, renders children when permission check fails
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  feature,
  userCategory,
  fallback = null,
  inverse = false,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    userCategory: currentUserCategory,
    isInitialized,
  } = usePermissions();

  // Don't render anything until permissions are initialized
  if (!isInitialized) {
    return null;
  }

  let hasAccess = false;

  // Check by user category first
  if (userCategory !== undefined) {
    const categoriesToCheck = Array.isArray(userCategory)
      ? userCategory
      : [userCategory];
    hasAccess = categoriesToCheck.includes(currentUserCategory || 0);
  }
  // Check by feature
  else if (feature) {
    hasAccess = canAccess(feature);
  }
  // Check by single permission
  else if (permission) {
    hasAccess = hasPermission(permission);
  }
  // Check by multiple permissions
  else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  // If no criteria provided, deny access
  else {
    hasAccess = false;
  }

  // Apply inverse logic if specified
  const shouldRender = inverse ? !hasAccess : hasAccess;

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};

// Convenience components for common permission checks

interface AdminGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminGate: React.FC<AdminGateProps> = ({
  children,
  fallback = null,
}) => {
  const { isAdmin, isInitialized } = usePermissions();

  if (!isInitialized) return null;

  return isAdmin() ? <>{children}</> : <>{fallback}</>;
};

interface EducatorGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const EducatorGate: React.FC<EducatorGateProps> = ({
  children,
  fallback = null,
}) => {
  const { isEducator, isInitialized } = usePermissions();

  if (!isInitialized) return null;

  return isEducator() ? <>{children}</> : <>{fallback}</>;
};

interface ParentGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ParentGate: React.FC<ParentGateProps> = ({
  children,
  fallback = null,
}) => {
  const { isParent, isInitialized } = usePermissions();

  if (!isInitialized) return null;

  return isParent() ? <>{children}</> : <>{fallback}</>;
};

interface StudentGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const StudentGate: React.FC<StudentGateProps> = ({
  children,
  fallback = null,
}) => {
  const { isStudent, isInitialized } = usePermissions();

  if (!isInitialized) return null;

  return isStudent() ? <>{children}</> : <>{fallback}</>;
};

interface ManagementGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ManagementGate: React.FC<ManagementGateProps> = ({
  children,
  fallback = null,
}) => {
  const { isManagement, isInitialized } = usePermissions();

  if (!isInitialized) return null;

  return isManagement() ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;
