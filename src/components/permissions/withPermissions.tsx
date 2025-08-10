import React, { ComponentType } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePermissions } from "../../hooks/usePermissions";
import { Permission } from "../../services/permissions/PermissionService";

interface WithPermissionsOptions {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  feature?: string;
  userCategory?: number | number[];
  fallbackComponent?: ComponentType;
  redirectTo?: string;
  showError?: boolean;
}

/**
 * Higher-order component that wraps a component with permission checking
 */
export function withPermissions<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPermissionsOptions = {},
) {
  const {
    permission,
    permissions = [],
    requireAll = false,
    feature,
    userCategory,
    fallbackComponent: FallbackComponent,
    showError = true,
  } = options;

  const PermissionWrappedComponent: React.FC<P> = (props) => {
    const {
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccess,
      userCategory: currentUserCategory,
      isInitialized,
    } = usePermissions();

    // Show loading state while permissions are being initialized
    if (!isInitialized) {
      return <LoadingComponent />;
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
    // If no criteria provided, allow access (default behavior)
    else {
      hasAccess = true;
    }

    if (!hasAccess) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }

      if (showError) {
        return <AccessDeniedComponent />;
      }

      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  PermissionWrappedComponent.displayName = `withPermissions(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return PermissionWrappedComponent;
}

// Default loading component
const LoadingComponent: React.FC = () => (
  <View style={styles.centerContainer}>
    <MaterialIcons name="hourglass-empty" size={48} color="#ccc" />
    <Text style={styles.centerText}>Loading...</Text>
  </View>
);

// Default access denied component
const AccessDeniedComponent: React.FC = () => (
  <View style={styles.centerContainer}>
    <MaterialIcons name="block" size={64} color="#f44336" />
    <Text style={styles.accessDeniedTitle}>Access Denied</Text>
    <Text style={styles.accessDeniedText}>
      You don't have permission to access this feature.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  centerText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f44336",
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

// Convenience HOCs for common permission checks

export const withAdminPermission = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType,
) =>
  withPermissions(WrappedComponent, {
    userCategory: 6, // ADMIN
    fallbackComponent,
  });

export const withEducatorPermission = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType,
) =>
  withPermissions(WrappedComponent, {
    userCategory: 2, // EDUCATOR
    fallbackComponent,
  });

export const withParentPermission = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType,
) =>
  withPermissions(WrappedComponent, {
    userCategory: 1, // PARENT
    fallbackComponent,
  });

export const withManagementPermission = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType,
) =>
  withPermissions(WrappedComponent, {
    userCategory: [3, 4, 5, 6], // SENIOR_MANAGEMENT, PRINCIPAL, MANAGEMENT, ADMIN
    fallbackComponent,
  });

export default withPermissions;
