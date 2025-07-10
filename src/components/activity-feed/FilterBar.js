import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../../styles/theme";

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  // Date picker states
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState(null); // 'from' or 'to'
  const [showDateSection, setShowDateSection] = useState(false); // Toggle for date section visibility

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showHashtagModal, setShowHashtagModal] = useState(false);

  // UI states
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(80)); // Increased for better layout

  const categories = [
    { value: "all", label: "All Posts", icon: "view-list", color: "#8E8E93" },
    {
      value: "announcement",
      label: "Announcements",
      icon: "campaign",
      color: "#FF9500",
    },
    { value: "event", label: "Events", icon: "event", color: "#007AFF" },
    {
      value: "sports",
      label: "Sports",
      icon: "sports-soccer",
      color: "#34C759",
    },
    { value: "academic", label: "Academic", icon: "school", color: "#5856D6" },
    { value: "news", label: "News", icon: "article", color: "#FF3B30" },
    {
      value: "achievement",
      label: "Achievements",
      icon: "emoji-events",
      color: "#FFD60A",
    },
  ];

  const availableHashtags = [
    {
      value: "ScienceFair",
      label: "#ScienceFair",
      icon: "science",
      color: "#5856D6",
    },
    {
      value: "Achievement",
      label: "#Achievement",
      icon: "emoji-events",
      color: "#FFD60A",
    },
    {
      value: "Football",
      label: "#Football",
      icon: "sports-soccer",
      color: "#34C759",
    },
    {
      value: "Victory",
      label: "#Victory",
      icon: "military-tech",
      color: "#FF9500",
    },
    {
      value: "TeamSpirit",
      label: "#TeamSpirit",
      icon: "groups",
      color: "#007AFF",
    },
    {
      value: "MathTest",
      label: "#MathTest",
      icon: "calculate",
      color: "#5856D6",
    },
    { value: "Grade9", label: "#Grade9", icon: "school", color: "#8E8E93" },
    { value: "Exam", label: "#Exam", icon: "quiz", color: "#FF3B30" },
    {
      value: "Drama",
      label: "#Drama",
      icon: "theater-comedy",
      color: "#AF52DE",
    },
    {
      value: "Theater",
      label: "#Theater",
      icon: "local-movies",
      color: "#AF52DE",
    },
    {
      value: "Performance",
      label: "#Performance",
      icon: "star",
      color: "#FFD60A",
    },
    {
      value: "Basketball",
      label: "#Basketball",
      icon: "sports-basketball",
      color: "#FF9500",
    },
    {
      value: "Tryouts",
      label: "#Tryouts",
      icon: "how-to-reg",
      color: "#34C759",
    },
    {
      value: "ArtExhibition",
      label: "#ArtExhibition",
      icon: "palette",
      color: "#FF2D92",
    },
    {
      value: "StudentArt",
      label: "#StudentArt",
      icon: "brush",
      color: "#FF2D92",
    },
    {
      value: "Creativity",
      label: "#Creativity",
      icon: "lightbulb",
      color: "#FFD60A",
    },
  ];

  // Calculate dynamic height based on active filters
  const calculateHeight = () => {
    let baseHeight = 48; // Collapsed height (reduced to match mainFilterBar height)
    if (!isExpanded) return baseHeight;

    let expandedHeight = 48; // Start with just the main filter bar height

    // Add height for filter chips row
    expandedHeight += 60; // Height for the filter chips

    // Add height for date section if visible
    if (showDateSection) {
      expandedHeight += 200;
    }

    // Calculate active filters dynamically
    const hasActiveFilters =
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.hashtags.length > 0 ||
      filters.category !== "all" ||
      filters.searchTerm.trim() !== "";

    if (hasActiveFilters) {
      expandedHeight += 24; // Header section ("Active Filters" title)
      expandedHeight += 56; // Fixed height for one row of filter chips (they scroll horizontally)
      expandedHeight += 2; // Minimal bottom padding
    }

    return expandedHeight;
  };

  // Animation for expand/collapse
  useEffect(() => {
    const targetHeight = calculateHeight();

    Animated.timing(animatedHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, showDateSection, filters, animatedHeight]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchChange = (text) => {
    onFilterChange({ ...filters, searchTerm: text });
  };

  // Date picker handlers
  const handleFromDateChange = (_, selectedDate) => {
    setShowFromDatePicker(false);
    setDatePickerMode(null);
    if (selectedDate) {
      const newDateRange = { ...filters.dateRange };
      newDateRange.start = selectedDate;
      onFilterChange({ ...filters, dateRange: newDateRange });
    }
  };

  const handleToDateChange = (_, selectedDate) => {
    setShowToDatePicker(false);
    setDatePickerMode(null);
    if (selectedDate) {
      const newDateRange = { ...filters.dateRange };
      newDateRange.end = selectedDate;
      onFilterChange({ ...filters, dateRange: newDateRange });
    }
  };

  // Remove individual date
  const removeFromDate = () => {
    const newDateRange = { ...filters.dateRange };
    newDateRange.start = null;
    onFilterChange({ ...filters, dateRange: newDateRange });
  };

  const removeToDate = () => {
    const newDateRange = { ...filters.dateRange };
    newDateRange.end = null;
    onFilterChange({ ...filters, dateRange: newDateRange });
  };

  // Toggle date section visibility
  const toggleDateSection = () => {
    setShowDateSection(!showDateSection);
  };

  // Remove individual hashtag
  const removeHashtag = (hashtagToRemove) => {
    const newHashtags = filters.hashtags.filter(
      (tag) => tag !== hashtagToRemove
    );
    onFilterChange({ ...filters, hashtags: newHashtags });
  };

  // Clear date range and hide date section
  const clearDateRange = () => {
    onFilterChange({ ...filters, dateRange: { start: null, end: null } });
    setShowDateSection(false);
  };

  // Enhanced clear all filters
  const handleClearAll = () => {
    onClearFilters();
    setShowDateSection(false);
  };

  const handleCategorySelect = (category) => {
    onFilterChange({ ...filters, category });
    setShowCategoryModal(false);
  };

  const handleHashtagSelect = (hashtag) => {
    const newHashtags = filters.hashtags.includes(hashtag)
      ? filters.hashtags.filter((tag) => tag !== hashtag)
      : [...filters.hashtags, hashtag];
    onFilterChange({ ...filters, hashtags: newHashtags });
  };

  const formatDate = (date) => {
    if (!date) return "Select";
    return date.toLocaleDateString();
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.category !== "all" ||
      filters.hashtags.length > 0
    );
  };

  const selectedCategory = categories.find(
    (cat) => cat.value === filters.category
  );

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      {/* Main Filter Bar */}
      <View style={styles.mainFilterBar}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts..."
            value={filters.searchTerm}
            onChangeText={handleSearchChange}
            placeholderTextColor="#8E8E93"
          />
          {filters.searchTerm ? (
            <TouchableOpacity onPress={() => handleSearchChange("")}>
              <Icon name="clear" size={18} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Toggle Button */}
        <TouchableOpacity style={styles.filterToggle} onPress={toggleExpanded}>
          <Icon name="tune" size={20} color={theme.colors.primary} />
          {hasActiveFilters() && <View style={styles.filterIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Expanded Filter Options */}
      {isExpanded && (
        <View style={styles.expandedFilters}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersRow}
          >
            {/* Category Filter */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                filters.category !== "all" && styles.activeFilterChip,
              ]}
              onPress={() => setShowCategoryModal(true)}
            >
              <Icon
                name={selectedCategory?.icon || "view-list"}
                size={16}
                color={
                  filters.category !== "all"
                    ? "#FFFFFF"
                    : selectedCategory?.color || "#8E8E93"
                }
              />
              <Text
                style={[
                  styles.filterChipText,
                  filters.category !== "all" && styles.activeFilterChipText,
                ]}
              >
                {selectedCategory?.label || "Category"}
              </Text>
              <Icon
                name="expand-more"
                size={16}
                color={filters.category !== "all" ? "#FFFFFF" : "#8E8E93"}
              />
            </TouchableOpacity>

            {/* Date Range Filter */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                (showDateSection ||
                  filters.dateRange.start ||
                  filters.dateRange.end) &&
                  styles.activeFilterChip,
              ]}
              onPress={toggleDateSection}
            >
              <Icon
                name="date-range"
                size={16}
                color={
                  showDateSection ||
                  filters.dateRange.start ||
                  filters.dateRange.end
                    ? "#FFFFFF"
                    : "#007AFF"
                }
              />
              <Text
                style={[
                  styles.filterChipText,
                  (showDateSection ||
                    filters.dateRange.start ||
                    filters.dateRange.end) &&
                    styles.activeFilterChipText,
                ]}
              >
                {filters.dateRange.start || filters.dateRange.end
                  ? "Date Set"
                  : "Date Range"}
              </Text>
              {(filters.dateRange.start || filters.dateRange.end) && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    clearDateRange();
                  }}
                  style={styles.clearChipButton}
                >
                  <Icon name="close" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Clear All Filter */}
            {hasActiveFilters() && (
              <TouchableOpacity
                style={styles.clearAllChip}
                onPress={handleClearAll}
              >
                <Icon name="clear-all" size={16} color="#FF3B30" />
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Date Range Section */}
          {showDateSection && (
            <View style={styles.dateRangeSection}>
              <Text style={styles.dateRangeSectionTitle}>
                Select Date Range
              </Text>

              <View style={styles.datePickersRow}>
                {/* From Date */}
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerLabel}>From Date</Text>
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      filters.dateRange.start && styles.datePickerButtonActive,
                    ]}
                    onPress={() => {
                      setDatePickerMode("from");
                      setShowFromDatePicker(true);
                    }}
                  >
                    <Icon
                      name="event"
                      size={16}
                      color={filters.dateRange.start ? "#007AFF" : "#8E8E93"}
                    />
                    <Text
                      style={[
                        styles.datePickerButtonText,
                        filters.dateRange.start &&
                          styles.datePickerButtonTextActive,
                      ]}
                    >
                      {filters.dateRange.start
                        ? formatDate(filters.dateRange.start)
                        : "Select Date"}
                    </Text>
                    {filters.dateRange.start && (
                      <TouchableOpacity
                        onPress={removeFromDate}
                        style={styles.dateRemoveButton}
                      >
                        <Icon name="close" size={14} color="#8E8E93" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </View>

                {/* To Date */}
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerLabel}>To Date</Text>
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      filters.dateRange.end && styles.datePickerButtonActive,
                    ]}
                    onPress={() => {
                      setDatePickerMode("to");
                      setShowToDatePicker(true);
                    }}
                  >
                    <Icon
                      name="event-available"
                      size={16}
                      color={filters.dateRange.end ? "#007AFF" : "#8E8E93"}
                    />
                    <Text
                      style={[
                        styles.datePickerButtonText,
                        filters.dateRange.end &&
                          styles.datePickerButtonTextActive,
                      ]}
                    >
                      {filters.dateRange.end
                        ? formatDate(filters.dateRange.end)
                        : "Select Date"}
                    </Text>
                    {filters.dateRange.end && (
                      <TouchableOpacity
                        onPress={removeToDate}
                        style={styles.dateRemoveButton}
                      >
                        <Icon name="close" size={14} color="#8E8E93" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.dateQuickActions}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => setShowDateSection(false)}
                >
                  <Icon name="keyboard-arrow-up" size={16} color="#8E8E93" />
                  <Text style={styles.quickActionText}>Hide</Text>
                </TouchableOpacity>

                {(filters.dateRange.start || filters.dateRange.end) && (
                  <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={clearDateRange}
                  >
                    <Icon name="clear" size={16} color="#FF3B30" />
                    <Text
                      style={[styles.quickActionText, { color: "#FF3B30" }]}
                    >
                      Clear Dates
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Selected Filters Display */}
          {(filters.dateRange.start ||
            filters.dateRange.end ||
            filters.hashtags.length > 0 ||
            filters.category !== "all" ||
            filters.searchTerm.trim() !== "") && (
            <View style={styles.selectedFiltersSection}>
              <View style={styles.selectedFiltersHeader}>
                <Text style={styles.selectedFiltersTitle}>Active Filters</Text>
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={handleClearAll}
                >
                  <Icon name="clear-all" size={16} color="#FFFFFF" />
                  <Text style={styles.clearAllButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectedFiltersScroll}
              >
                {/* From Date Chip */}
                {filters.dateRange.start && (
                  <View style={styles.selectedFilterChip}>
                    <Icon name="event" size={14} color="#007AFF" />
                    <Text style={styles.selectedFilterText}>
                      From: {formatDate(filters.dateRange.start)}
                    </Text>
                    <TouchableOpacity onPress={removeFromDate}>
                      <Icon name="close" size={14} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* To Date Chip */}
                {filters.dateRange.end && (
                  <View style={styles.selectedFilterChip}>
                    <Icon name="event-available" size={14} color="#007AFF" />
                    <Text style={styles.selectedFilterText}>
                      To: {formatDate(filters.dateRange.end)}
                    </Text>
                    <TouchableOpacity onPress={removeToDate}>
                      <Icon name="close" size={14} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Category Chip */}
                {filters.category !== "all" && (
                  <View style={styles.selectedFilterChip}>
                    <Icon name="category" size={14} color="#FF9500" />
                    <Text style={styles.selectedFilterText}>
                      {
                        categories.find((cat) => cat.value === filters.category)
                          ?.label
                      }
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        onFilterChange({ ...filters, category: "all" })
                      }
                    >
                      <Icon name="close" size={14} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Hashtag Chips */}
                {filters.hashtags.map((hashtag, index) => {
                  return (
                    <View key={index} style={styles.selectedFilterChip}>
                      <Text style={styles.hashtagSymbol}>#</Text>
                      <Text style={styles.selectedFilterText}>{hashtag}</Text>
                      <TouchableOpacity onPress={() => removeHashtag(hashtag)}>
                        <Icon name="close" size={14} color="#8E8E93" />
                      </TouchableOpacity>
                    </View>
                  );
                })}

                {/* Add Hashtag Button */}
                <TouchableOpacity
                  style={styles.addHashtagChip}
                  onPress={() => setShowHashtagModal(true)}
                >
                  <Icon name="tag" size={14} color="#FF2D92" />
                  <Text style={styles.addHashtagText}>Add Tags</Text>
                  <Icon name="add" size={14} color="#FF2D92" />
                </TouchableOpacity>

                {/* Search Term Chip */}
                {filters.searchTerm.trim() !== "" && (
                  <View style={styles.selectedFilterChip}>
                    <Icon name="search" size={14} color="#34C759" />
                    <Text style={styles.selectedFilterText}>
                      "{filters.searchTerm}"
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        onFilterChange({ ...filters, searchTerm: "" })
                      }
                    >
                      <Icon name="close" size={14} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Date Picker Modal */}
      {(showFromDatePicker || showToDatePicker) && (
        <Modal
          visible={showFromDatePicker || showToDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowFromDatePicker(false);
            setShowToDatePicker(false);
            setDatePickerMode(null);
          }}
        >
          <TouchableOpacity
            style={styles.datePickerModalOverlay}
            activeOpacity={1}
            onPress={() => {
              setShowFromDatePicker(false);
              setShowToDatePicker(false);
              setDatePickerMode(null);
            }}
          >
            <View style={styles.datePickerModalContainer}>
              <DateTimePicker
                value={
                  datePickerMode === "from"
                    ? filters.dateRange.start || new Date()
                    : filters.dateRange.end || new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "compact" : "default"}
                onChange={
                  datePickerMode === "from"
                    ? handleFromDateChange
                    : handleToDateChange
                }
                style={styles.datePickerStyle}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Icon name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryOption,
                    filters.category === category.value &&
                      styles.selectedCategoryOption,
                  ]}
                  onPress={() => handleCategorySelect(category.value)}
                >
                  <Icon
                    name={category.icon}
                    size={20}
                    color={
                      filters.category === category.value
                        ? "#FFFFFF"
                        : category.color
                    }
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      filters.category === category.value &&
                        styles.selectedCategoryOptionText,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Hashtag Selection Modal */}
      <Modal
        visible={showHashtagModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHashtagModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Hashtags</Text>
              <TouchableOpacity onPress={() => setShowHashtagModal(false)}>
                <Icon name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.hashtagList}>
              {availableHashtags.map((hashtag) => (
                <TouchableOpacity
                  key={hashtag.value}
                  style={[
                    styles.hashtagOption,
                    filters.hashtags.includes(hashtag.value) &&
                      styles.selectedHashtagOption,
                  ]}
                  onPress={() => handleHashtagSelect(hashtag.value)}
                >
                  <Icon
                    name={hashtag.icon}
                    size={20}
                    color={
                      filters.hashtags.includes(hashtag.value)
                        ? "#FFFFFF"
                        : hashtag.color
                    }
                  />
                  <Text
                    style={[
                      styles.hashtagOptionText,
                      filters.hashtags.includes(hashtag.value) &&
                        styles.selectedHashtagOptionText,
                    ]}
                  >
                    {hashtag.label}
                  </Text>
                  {filters.hashtags.includes(hashtag.value) && (
                    <Icon name="check" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    overflow: "hidden",
  },
  mainFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 48,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 8,
    marginRight: 8,
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  expandedFilters: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  filtersRow: {
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 36,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: "#000000",
    marginHorizontal: 6,
    fontWeight: "500",
  },
  activeFilterChipText: {
    color: "#FFFFFF",
  },
  clearChipButton: {
    marginLeft: 4,
    padding: 2,
  },
  clearAllChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 36,
  },
  clearAllText: {
    fontSize: 14,
    color: "#FF3B30",
    marginLeft: 6,
    fontWeight: "500",
  },
  activeHashtagsRow: {
    marginBottom: 8,
  },
  activeHashtagChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  activeHashtagText: {
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 4,
  },
  removeHashtagButton: {
    marginLeft: 4,
    padding: 2,
  },
  dateRangeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: "#007AFF",
    marginHorizontal: 8,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  selectedCategoryOption: {
    backgroundColor: theme.colors.primary + "20",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
    flex: 1,
  },
  selectedCategoryOptionText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  hashtagList: {
    paddingHorizontal: 20,
  },
  hashtagOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  selectedHashtagOption: {
    backgroundColor: theme.colors.primary + "20",
  },
  hashtagOptionText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
    flex: 1,
  },
  selectedHashtagOptionText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  // Selected Filters Section Styles
  selectedFiltersSection: {
    marginTop: 12,
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  selectedFiltersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedFiltersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
    fontWeight: "600",
  },
  selectedFiltersScroll: {
    flexDirection: "row",
  },
  selectedFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedFilterText: {
    fontSize: 12,
    color: "#1C1C1E",
    marginHorizontal: 4,
    fontWeight: "500",
  },
  hashtagSymbol: {
    fontSize: 12,
    color: "#3b5998",
    fontWeight: "bold",
  },
  addHashtagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FF2D92",
    borderStyle: "dashed",
  },
  addHashtagText: {
    fontSize: 12,
    color: "#FF2D92",
    marginHorizontal: 4,
    fontWeight: "500",
  },
  // Date Range Section Styles
  dateRangeSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  dateRangeSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
    textAlign: "center",
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 6,
    textAlign: "center",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    minHeight: 44,
  },
  datePickerButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  datePickerButtonText: {
    fontSize: 13,
    color: "#8E8E93",
    marginLeft: 8,
    flex: 1,
  },
  datePickerButtonTextActive: {
    color: "#007AFF",
    fontWeight: "500",
  },
  dateRemoveButton: {
    padding: 4,
    marginLeft: 4,
  },
  dateQuickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  quickActionText: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 4,
    fontWeight: "500",
  },
  // Date Picker Modal Styles
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  datePickerModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    padding: 16,
  },
  datePickerStyle: {
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
});

export default FilterBar;
