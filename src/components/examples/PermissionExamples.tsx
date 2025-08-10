import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  PermissionGate,
  AdminGate,
  EducatorGate,
  ParentGate,
  ManagementGate,
} from "../permissions/PermissionGate";
import PermissionDisplay from "../permissions/PermissionDisplay";
import {
  withPermissions,
  withAdminPermission,
} from "../permissions/withPermissions";
import { usePermissions } from "../../hooks/usePermissions";
import { Permission } from "../../services/permissions/PermissionService";

// Example component protected by HOC
const AdminOnlyComponent: React.FC = () => (
  <View style={styles.protectedBox}>
    <MaterialIcons name="admin-panel-settings" size={24} color="#f44336" />
    <Text style={styles.protectedText}>Admin Only Component</Text>
  </View>
);

const ProtectedAdminComponent = withAdminPermission(AdminOnlyComponent);

// Component with multiple permission checks
const GradeManagementComponent: React.FC = () => {
  const { hasPermission, canAccess } = usePermissions();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Grade Management</Text>

      {/* Basic permission check */}
      <PermissionGate permission={Permission.VIEW_GRADES}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
          <Text style={styles.actionText}>View Grades</Text>
        </TouchableOpacity>
      </PermissionGate>

      {/* Multiple permissions check (any) */}
      <PermissionGate
        permissions={[Permission.EDIT_GRADES, Permission.CREATE_ASSIGNMENTS]}
        requireAll={false}
      >
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="edit" size={20} color="#FF9800" />
          <Text style={styles.actionText}>Manage Grades</Text>
        </TouchableOpacity>
      </PermissionGate>

      {/* Feature-based check */}
      <PermissionGate feature="reports">
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="assessment" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Generate Reports</Text>
        </TouchableOpacity>
      </PermissionGate>

      {/* Hook-based permission check */}
      {hasPermission(Permission.EXPORT_REPORTS) && (
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="download" size={20} color="#9C27B0" />
          <Text style={styles.actionText}>Export Reports</Text>
        </TouchableOpacity>
      )}

      {/* Inverse permission (show when user doesn't have permission) */}
      <PermissionGate permission={Permission.EDIT_GRADES} inverse>
        <View style={styles.warningBox}>
          <MaterialIcons name="warning" size={20} color="#FF5722" />
          <Text style={styles.warningText}>
            You don't have permission to edit grades
          </Text>
        </View>
      </PermissionGate>
    </View>
  );
};

// User role-based components
const RoleBasedComponents: React.FC = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Role-Based Components</Text>

    <AdminGate>
      <View style={[styles.roleBox, { backgroundColor: "#ffebee" }]}>
        <MaterialIcons name="admin-panel-settings" size={24} color="#f44336" />
        <Text style={[styles.roleText, { color: "#f44336" }]}>
          Admin Only Content
        </Text>
      </View>
    </AdminGate>

    <EducatorGate>
      <View style={[styles.roleBox, { backgroundColor: "#e3f2fd" }]}>
        <MaterialIcons name="school" size={24} color="#2196F3" />
        <Text style={[styles.roleText, { color: "#2196F3" }]}>
          Educator Content
        </Text>
      </View>
    </EducatorGate>

    <ParentGate>
      <View style={[styles.roleBox, { backgroundColor: "#e8f5e8" }]}>
        <MaterialIcons name="family-restroom" size={24} color="#4CAF50" />
        <Text style={[styles.roleText, { color: "#4CAF50" }]}>
          Parent Content
        </Text>
      </View>
    </ParentGate>

    <ManagementGate>
      <View style={[styles.roleBox, { backgroundColor: "#fff3e0" }]}>
        <MaterialIcons name="business" size={24} color="#FF9800" />
        <Text style={[styles.roleText, { color: "#FF9800" }]}>
          Management Content
        </Text>
      </View>
    </ManagementGate>
  </View>
);

// Main example component
export const PermissionExamples: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Permission System Examples</Text>
        <Text style={styles.subtitle}>
          Demonstrating role-based access control and permission checking
        </Text>
      </View>

      {/* Permission Display */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User Permissions</Text>
        <PermissionDisplay
          showDescriptions={false}
          groupByCategory={true}
          expandable={true}
        />
      </View>

      {/* Grade Management Examples */}
      <GradeManagementComponent />

      {/* Role-Based Components */}
      <RoleBasedComponents />

      {/* HOC Protected Component */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>HOC Protected Component</Text>
        <ProtectedAdminComponent />
      </View>

      {/* Navigation Examples */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Navigation Examples</Text>

        <PermissionGate feature="users">
          <TouchableOpacity style={styles.navButton}>
            <MaterialIcons name="people" size={24} color="#fff" />
            <Text style={styles.navButtonText}>User Management</Text>
          </TouchableOpacity>
        </PermissionGate>

        <PermissionGate feature="system">
          <TouchableOpacity style={styles.navButton}>
            <MaterialIcons name="settings" size={24} color="#fff" />
            <Text style={styles.navButtonText}>System Settings</Text>
          </TouchableOpacity>
        </PermissionGate>

        <PermissionGate permission={Permission.VIEW_FINANCIAL_REPORTS}>
          <TouchableOpacity style={styles.navButton}>
            <MaterialIcons name="account-balance" size={24} color="#fff" />
            <Text style={styles.navButtonText}>Financial Reports</Text>
          </TouchableOpacity>
        </PermissionGate>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
    maxHeight: 300,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
  },
  warningText: {
    fontSize: 14,
    color: "#FF5722",
    marginLeft: 8,
  },
  roleBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  protectedBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#f44336",
  },
  protectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f44336",
    marginLeft: 12,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 12,
  },
});

export default PermissionExamples;
