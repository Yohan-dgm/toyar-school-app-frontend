import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FilterBarProps,
  NotificationFilters,
  AnnouncementFilters,
  NOTIFICATION_PRIORITIES,
  ANNOUNCEMENT_PRIORITY_LEVELS,
  ANNOUNCEMENT_STATUS,
  NOTIFICATION_FILTERS,
} from "../../types/communication-management";

export default function FilterBar({
  filters,
  onFiltersChange,
  categories = [],
  notificationTypes = [],
  showSearch = true,
  showDateRange = false,
}: FilterBarProps) {
  const [searchText, setSearchText] = useState(
    (filters as any).search || ""
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const isNotificationFilters = (f: any): f is NotificationFilters => {
    return f && typeof f.filter !== "undefined";
  };

  const isAnnouncementFilters = (f: any): f is AnnouncementFilters => {
    return f && typeof f.category_id !== "undefined";
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onFiltersChange({
      ...filters,
      search: text.trim() || undefined,
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = isNotificationFilters(filters)
      ? { filter: "all" as const }
      : {};
    setSearchText("");
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setShowFilterModal(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (isNotificationFilters(filters)) {
      if (filters.filter && filters.filter !== "all") count++;
      if (filters.priority) count++;
      if (filters.type_id) count++;
      if (filters.unread_only) count++;
    } else if (isAnnouncementFilters(filters)) {
      if (filters.category_id) count++;
      if (filters.priority_level) count++;
      if (filters.status) count++;
      if (filters.is_featured) count++;
      if (filters.is_pinned) count++;
    }
    if (searchText.trim()) count++;
    return count;
  };

  const renderSearchBar = () => {
    if (!showSearch) return null;

    return (
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearchChange}
          placeholderTextColor="#9ca3af"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearchChange("")}
            style={styles.clearSearchButton}
          >
            <MaterialIcons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderQuickFilters = () => {
    const activeFilterCount = getActiveFilterCount();

    return (
      <View style={styles.quickFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickFiltersScroll}
          contentContainerStyle={styles.quickFiltersContent}
        >
          {/* Filter Modal Button */}
          <TouchableOpacity
            style={[
              styles.quickFilterButton,
              activeFilterCount > 0 && styles.activeQuickFilterButton,
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <MaterialIcons
              name="tune"
              size={16}
              color={activeFilterCount > 0 ? "#ffffff" : "#6b7280"}
            />
            <Text
              style={[
                styles.quickFilterText,
                activeFilterCount > 0 && styles.activeQuickFilterText,
              ]}
            >
              Filters
            </Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Quick filter buttons for notifications */}
          {isNotificationFilters(filters) && (
            <>
              <TouchableOpacity
                style={[
                  styles.quickFilterButton,
                  filters.unread_only && styles.activeQuickFilterButton,
                ]}
                onPress={() =>
                  onFiltersChange({
                    ...filters,
                    unread_only: !filters.unread_only,
                  })
                }
              >
                <MaterialIcons
                  name="mark-email-unread"
                  size={16}
                  color={filters.unread_only ? "#ffffff" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.quickFilterText,
                    filters.unread_only && styles.activeQuickFilterText,
                  ]}
                >
                  Unread
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickFilterButton,
                  filters.priority === "urgent" && styles.urgentFilterButton,
                ]}
                onPress={() =>
                  onFiltersChange({
                    ...filters,
                    priority:
                      filters.priority === "urgent" ? undefined : "urgent",
                  })
                }
              >
                <MaterialIcons
                  name="warning"
                  size={16}
                  color={filters.priority === "urgent" ? "#ffffff" : "#ef4444"}
                />
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: filters.priority === "urgent" ? "#ffffff" : "#ef4444" },
                  ]}
                >
                  Urgent
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Quick filter buttons for announcements */}
          {isAnnouncementFilters(filters) && (
            <>
              <TouchableOpacity
                style={[
                  styles.quickFilterButton,
                  filters.is_featured && styles.activeQuickFilterButton,
                ]}
                onPress={() =>
                  onFiltersChange({
                    ...filters,
                    is_featured: filters.is_featured ? undefined : true,
                  })
                }
              >
                <MaterialIcons
                  name="star"
                  size={16}
                  color={filters.is_featured ? "#ffffff" : "#f59e0b"}
                />
                <Text
                  style={[
                    styles.quickFilterText,
                    filters.is_featured && styles.activeQuickFilterText,
                  ]}
                >
                  Featured
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickFilterButton,
                  filters.is_pinned && styles.activeQuickFilterButton,
                ]}
                onPress={() =>
                  onFiltersChange({
                    ...filters,
                    is_pinned: filters.is_pinned ? undefined : true,
                  })
                }
              >
                <MaterialIcons
                  name="push-pin"
                  size={16}
                  color={filters.is_pinned ? "#ffffff" : "#6366f1"}
                />
                <Text
                  style={[
                    styles.quickFilterText,
                    filters.is_pinned && styles.activeQuickFilterText,
                  ]}
                >
                  Pinned
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Clear filters button */}
          {activeFilterCount > 0 && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <MaterialIcons name="clear" size={16} color="#ef4444" />
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowFilterModal(false)}
            style={styles.modalCloseButton}
          >
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity
            onPress={applyFilters}
            style={styles.modalApplyButton}
          >
            <Text style={styles.modalApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Notification Filters */}
          {isNotificationFilters(tempFilters) && (
            <>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Status</Text>
                <View style={styles.filterOptions}>
                  {Object.entries(NOTIFICATION_FILTERS).map(([key, value]) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.filterOption,
                        tempFilters.filter === value && styles.selectedFilterOption,
                      ]}
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          filter: value as any,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.filter === value && styles.selectedFilterOptionText,
                        ]}
                      >
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Priority</Text>
                <View style={styles.filterOptions}>
                  {Object.entries(NOTIFICATION_PRIORITIES).map(([key, value]) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.filterOption,
                        tempFilters.priority === value && styles.selectedFilterOption,
                      ]}
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          priority: tempFilters.priority === value ? undefined : value as any,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.priority === value && styles.selectedFilterOptionText,
                        ]}
                      >
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {notificationTypes.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Type</Text>
                  <View style={styles.filterOptions}>
                    {notificationTypes.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.filterOption,
                          tempFilters.type_id === type.id && styles.selectedFilterOption,
                        ]}
                        onPress={() =>
                          setTempFilters({
                            ...tempFilters,
                            type_id: tempFilters.type_id === type.id ? undefined : type.id,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            tempFilters.type_id === type.id && styles.selectedFilterOptionText,
                          ]}
                        >
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}

          {/* Announcement Filters */}
          {isAnnouncementFilters(tempFilters) && (
            <>
              {categories.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Category</Text>
                  <View style={styles.filterOptions}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.filterOption,
                          tempFilters.category_id === category.id && styles.selectedFilterOption,
                        ]}
                        onPress={() =>
                          setTempFilters({
                            ...tempFilters,
                            category_id: tempFilters.category_id === category.id ? undefined : category.id,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            tempFilters.category_id === category.id && styles.selectedFilterOptionText,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Priority Level</Text>
                <View style={styles.filterOptions}>
                  {Object.entries(ANNOUNCEMENT_PRIORITY_LEVELS).map(([key, value]) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.filterOption,
                        tempFilters.priority_level === value && styles.selectedFilterOption,
                      ]}
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          priority_level: tempFilters.priority_level === value ? undefined : value as any,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.priority_level === value && styles.selectedFilterOptionText,
                        ]}
                      >
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Status</Text>
                <View style={styles.filterOptions}>
                  {Object.entries(ANNOUNCEMENT_STATUS).map(([key, value]) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.filterOption,
                        tempFilters.status === value && styles.selectedFilterOption,
                      ]}
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          status: tempFilters.status === value ? undefined : value as any,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.status === value && styles.selectedFilterOptionText,
                        ]}
                      >
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderSearchBar()}
      {renderQuickFilters()}
      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
    marginRight: 8,
  },
  clearSearchButton: {
    padding: 4,
  },
  quickFiltersContainer: {
    paddingHorizontal: 16,
  },
  quickFiltersScroll: {
    flexGrow: 0,
  },
  quickFiltersContent: {
    alignItems: "center",
    gap: 8,
  },
  quickFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 4,
  },
  activeQuickFilterButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  urgentFilterButton: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  quickFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeQuickFilterText: {
    color: "#ffffff",
  },
  filterBadge: {
    backgroundColor: "#ffffff",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3b82f6",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
    gap: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalApplyButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalApplyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedFilterOption: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  selectedFilterOptionText: {
    color: "#ffffff",
  },
});