import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePermissions } from "../../hooks/usePermissions";
import {
  Permission,
  PermissionCategory,
} from "../../services/permissions/PermissionService";
import {
  USER_CATEGORIES,
  getUserCategoryDisplayName,
} from "../../constants/userCategories";

interface PermissionDisplayProps {
  showDescriptions?: boolean;
  groupByCategory?: boolean;
  expandable?: boolean;
}

export const PermissionDisplay: React.FC<PermissionDisplayProps> = ({
  showDescriptions = false,
  groupByCategory = true,
  expandable = true,
}) => {
  const {
    userPermissions,
    availableCategories,
    userCategory,
    getPermissionsByCategory,
    getPermissionDescription,
    isInitialized,
  } = usePermissions();

  const [expandedCategories, setExpandedCategories] = useState<
    Set<PermissionCategory>
  >(new Set());

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading permissions...</Text>
      </View>
    );
  }

  const toggleCategory = (category: PermissionCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const renderPermissionList = (permissions: Permission[]) => {
    return permissions.map((permission) => (
      <View key={permission} style={styles.permissionItem}>
        <View style={styles.permissionHeader}>
          <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.permissionName}>{permission}</Text>
        </View>
        {showDescriptions && (
          <Text style={styles.permissionDescription}>
            {getPermissionDescription(permission)}
          </Text>
        )}
      </View>
    ));
  };

  const renderByCategory = () => {
    return availableCategories.map((category) => {
      const categoryPermissions = getPermissionsByCategory(category);
      const isExpanded = expandedCategories.has(category);

      return (
        <View key={category} style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => expandable && toggleCategory(category)}
            disabled={!expandable}
          >
            <View style={styles.categoryTitleRow}>
              <MaterialIcons name="folder" size={20} color="#2196F3" />
              <Text style={styles.categoryTitle}>
                {category.replace("_", " ").toUpperCase()}
              </Text>
              <Text style={styles.categoryCount}>
                ({categoryPermissions.length})
              </Text>
            </View>
            {expandable && (
              <MaterialIcons
                name={isExpanded ? "expand-less" : "expand-more"}
                size={24}
                color="#666"
              />
            )}
          </TouchableOpacity>

          {(!expandable || isExpanded) && (
            <View style={styles.categoryContent}>
              {renderPermissionList(categoryPermissions)}
            </View>
          )}
        </View>
      );
    });
  };

  const renderAsList = () => {
    return (
      <View style={styles.listContainer}>
        {renderPermissionList(userPermissions)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>User Permissions</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userRole}>
            {userCategory
              ? getUserCategoryDisplayName(userCategory)
              : "Unknown Role"}
          </Text>
          <Text style={styles.permissionCount}>
            {userPermissions.length} permissions
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userPermissions.length}</Text>
          <Text style={styles.statLabel}>Total Permissions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{availableCategories.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {
              userPermissions.filter(
                (p) =>
                  p.includes("edit") ||
                  p.includes("create") ||
                  p.includes("delete"),
              ).length
            }
          </Text>
          <Text style={styles.statLabel}>Write Access</Text>
        </View>
      </View>

      {/* Permissions List */}
      {userPermissions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="block" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No permissions assigned</Text>
        </View>
      ) : (
        <View style={styles.permissionsContainer}>
          {groupByCategory ? renderByCategory() : renderAsList()}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userRole: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "500",
  },
  permissionCount: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 8,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  permissionsContainer: {
    marginTop: 8,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
  },
  permissionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  permissionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    fontFamily: "monospace",
  },
  permissionDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginLeft: 24,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
});

export default PermissionDisplay;
