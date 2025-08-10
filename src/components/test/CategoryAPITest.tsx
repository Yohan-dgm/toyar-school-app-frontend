import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useGetCategoryListQuery,
  useLazyGetCategoryListQuery,
} from "../../api/educator-feedback-api";

interface CategoryAPITestProps {
  onClose?: () => void;
}

const CategoryAPITest: React.FC<CategoryAPITestProps> = ({ onClose }) => {
  // Hook for automatic query
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategoryListQuery();

  // Hook for manual/lazy query
  const [
    triggerCategoryQuery,
    {
      data: lazyCategoriesData,
      isLoading: lazyCategoriesLoading,
      error: lazyCategoriesError,
    },
  ] = useLazyGetCategoryListQuery();

  // Log all data changes for debugging
  useEffect(() => {
    console.log("🧪 CategoryAPITest - Data Update:", {
      categoriesData,
      categoriesLoading,
      categoriesError,
      timestamp: new Date().toISOString(),
    });
  }, [categoriesData, categoriesLoading, categoriesError]);

  const handleManualTrigger = () => {
    console.log("🧪 Manual Category API Trigger");
    triggerCategoryQuery();
  };

  const handleRefetch = () => {
    console.log("🧪 Refetch Category API");
    refetchCategories();
  };

  const formatError = (error: any) => {
    if (!error) return "No error";

    if (error.data) {
      return JSON.stringify(error.data, null, 2);
    }

    if (error.message) {
      return error.message;
    }

    return JSON.stringify(error, null, 2);
  };

  const formatData = (data: any) => {
    if (!data) return "No data";
    return JSON.stringify(data, null, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category API Test</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Test Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Controls</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRefetch}
            disabled={categoriesLoading}
          >
            <Text style={styles.buttonText}>Refetch Auto Query</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleManualTrigger}
            disabled={lazyCategoriesLoading}
          >
            <Text style={styles.buttonText}>Manual Trigger</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Automatic Query Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Automatic Query (useGetCategoryListQuery)
        </Text>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Loading:</Text>
          <Text style={[styles.value, categoriesLoading && styles.loading]}>
            {categoriesLoading ? "TRUE" : "FALSE"}
          </Text>
          {categoriesLoading && <ActivityIndicator size="small" />}
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Has Error:</Text>
          <Text style={[styles.value, categoriesError && styles.error]}>
            {categoriesError ? "TRUE" : "FALSE"}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Has Data:</Text>
          <Text style={[styles.value, categoriesData && styles.success]}>
            {categoriesData ? "TRUE" : "FALSE"}
          </Text>
        </View>

        {categoriesError && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Error Details:</Text>
            <Text style={styles.errorText}>{formatError(categoriesError)}</Text>
          </View>
        )}

        {categoriesData && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Response Data:</Text>
            <Text style={styles.dataText}>{formatData(categoriesData)}</Text>
          </View>
        )}
      </View>

      {/* Manual Query Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Manual Query (useLazyGetCategoryListQuery)
        </Text>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Loading:</Text>
          <Text style={[styles.value, lazyCategoriesLoading && styles.loading]}>
            {lazyCategoriesLoading ? "TRUE" : "FALSE"}
          </Text>
          {lazyCategoriesLoading && <ActivityIndicator size="small" />}
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Has Error:</Text>
          <Text style={[styles.value, lazyCategoriesError && styles.error]}>
            {lazyCategoriesError ? "TRUE" : "FALSE"}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Has Data:</Text>
          <Text style={[styles.value, lazyCategoriesData && styles.success]}>
            {lazyCategoriesData ? "TRUE" : "FALSE"}
          </Text>
        </View>

        {lazyCategoriesError && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Error Details:</Text>
            <Text style={styles.errorText}>
              {formatError(lazyCategoriesError)}
            </Text>
          </View>
        )}

        {lazyCategoriesData && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Response Data:</Text>
            <Text style={styles.dataText}>
              {formatData(lazyCategoriesData)}
            </Text>
          </View>
        )}
      </View>

      {/* API Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Information</Text>
        <Text style={styles.infoText}>
          Endpoint: POST /api/educator-feedback-management/category/list
        </Text>
        <Text style={styles.infoText}>
          Request Body:{" "}
          {JSON.stringify(
            {
              page_size: 10,
              page: 1,
              search_phrase: "",
              search_filter_list: [],
            },
            null,
            2,
          )}
        </Text>
        <Text style={styles.infoText}>
          Check console logs for detailed request/response information
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  section: {
    backgroundColor: "#white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    minWidth: 80,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  loading: {
    color: "#FF9500",
  },
  error: {
    color: "#FF3B30",
  },
  success: {
    color: "#34C759",
  },
  dataContainer: {
    marginTop: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 12,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#FF3B30",
    lineHeight: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default CategoryAPITest;
