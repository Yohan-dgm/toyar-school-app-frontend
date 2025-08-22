import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useCreateAnnouncementMutation,
  useGetAnnouncementCategoriesQuery,
  CreateAnnouncementRequest,
} from "../../api/announcements-api";
import {
  ANNOUNCEMENT_CATEGORIES,
  PRIORITY_LEVELS,
  ANNOUNCEMENT_STATUS_OPTIONS,
  TARGET_TYPES,
  getCategoryById,
  getPriorityLevel,
} from "../../constants/announcementCategories";
import {
  USER_CATEGORIES,
  getUserCategoryDisplayName,
} from "../../constants/userCategories";

interface CreateAnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAnnouncementModal({
  visible,
  onClose,
  onSuccess,
}: CreateAnnouncementModalProps) {
  const { data: categoriesResponse } = useGetAnnouncementCategoriesQuery(
    undefined,
    {
      // Skip the API call and use fallback categories to avoid 404 errors
      skip: true,
    },
  );
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  // Use fallback categories if API fails
  const categories = categoriesResponse?.data || ANNOUNCEMENT_CATEGORIES;

  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: "",
    content: "",
    excerpt: "",
    category_id: 1,
    priority_level: 1,
    status: "published",
    target_type: "broadcast",
    target_data: {},
    image_url: "",
    attachment_urls: [],
    is_featured: false,
    is_pinned: false,
    scheduled_at: undefined,
    expires_at: undefined,
    tags: "",
    meta_data: {},
  });

  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    if (categories.length > 0 && formData.category_id === 0) {
      setFormData((prev) => ({
        ...prev,
        category_id: categories[0].id,
      }));
    }
  }, [categories, formData.category_id]);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category_id: categories.length > 0 ? categories[0].id : 1,
      priority_level: 1,
      status: "published",
      target_type: "broadcast",
      target_data: {},
      image_url: "",
      attachment_urls: [],
      is_featured: false,
      is_pinned: false,
      scheduled_at: undefined,
      expires_at: undefined,
      tags: "",
      meta_data: {},
    });
    setSelectedRoles([]);
    setSelectedUsers([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Title and Content)",
      );
      return;
    }

    if (formData.status === "scheduled" && !formData.scheduled_at) {
      Alert.alert(
        "Error",
        "Please select a schedule time for scheduled announcements",
      );
      return;
    }

    try {
      const targetData: any = {};

      if (formData.target_type === "role" && selectedRoles.length > 0) {
        targetData.roles = selectedRoles;
      } else if (formData.target_type === "user" && selectedUsers.length > 0) {
        targetData.user_ids = selectedUsers;
      }

      const announcementData: CreateAnnouncementRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        category_id: formData.category_id,
        priority_level: formData.priority_level,
        status: formData.status,
        target_type: formData.target_type,
        target_data:
          Object.keys(targetData).length > 0 ? targetData : undefined,
        image_url: formData.image_url.trim() || undefined,
        attachment_urls: formData.attachment_urls?.length
          ? formData.attachment_urls
          : undefined,
        is_featured: formData.is_featured,
        is_pinned: formData.is_pinned,
        scheduled_at: formData.scheduled_at
          ? new Date(formData.scheduled_at).toISOString()
          : undefined,
        expires_at: formData.expires_at
          ? new Date(formData.expires_at).toISOString()
          : undefined,
        tags: formData.tags.trim() || undefined,
        meta_data: formData.meta_data,
      };

      await createAnnouncement(announcementData).unwrap();

      Alert.alert("Success", "Announcement created successfully!");
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to create announcement",
      );
    }
  };

  const renderCategorySelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="category" size={18} color="#7c2d3e" />
        <Text style={styles.sectionTitle}>Category *</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  borderColor: category.color,
                  backgroundColor:
                    formData.category_id === category.id
                      ? category.color + "20"
                      : "#f9fafb",
                },
              ]}
              onPress={() =>
                setFormData((prev) => ({ ...prev, category_id: category.id }))
              }
            >
              <MaterialIcons
                name={category.icon as any}
                size={16}
                color={category.color}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      formData.category_id === category.id
                        ? category.color
                        : "#6b7280",
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderBasicInfo = () => (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="title" size={18} color="#7c2d3e" />
          <Text style={styles.sectionTitle}>Title *</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter announcement title"
          value={formData.title}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, title: text }))
          }
          maxLength={500}
        />
        <Text style={styles.charCount}>{formData.title.length}/500</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="description" size={18} color="#7c2d3e" />
          <Text style={styles.sectionTitle}>Content *</Text>
        </View>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Enter announcement content (HTML supported)"
          value={formData.content}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, content: text }))
          }
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Excerpt (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Brief summary (auto-generated if empty)"
          value={formData.excerpt}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, excerpt: text }))
          }
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          maxLength={1000}
        />
        <Text style={styles.charCount}>
          {(formData.excerpt || "").length}/1000
        </Text>
      </View> */}
    </>
  );

  const renderPriorityAndStatus = () => (
    <View style={styles.row}>
      <View style={styles.flex1}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="priority-high" size={18} color="#7c2d3e" />
          <Text style={styles.sectionTitle}>Priority *</Text>
        </View>
        <View style={styles.priorityContainer}>
          {PRIORITY_LEVELS.map((priority) => (
            <TouchableOpacity
              key={priority.value}
              style={[
                styles.priorityButton,
                {
                  backgroundColor:
                    formData.priority_level === priority.value
                      ? priority.color
                      : "#f9fafb",
                  borderColor:
                    formData.priority_level === priority.value
                      ? priority.color
                      : "#d1d5db",
                },
              ]}
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  priority_level: priority.value,
                }))
              }
            >
              <MaterialIcons
                name={
                  priority.value === 3
                    ? "priority-high"
                    : priority.value === 2
                      ? "notifications-active"
                      : "notifications"
                }
                size={14}
                color={
                  formData.priority_level === priority.value
                    ? "#ffffff"
                    : "#8d5a5e"
                }
              />
              <Text
                style={[
                  styles.priorityText,
                  {
                    color:
                      formData.priority_level === priority.value
                        ? "#ffffff"
                        : "#6b7280",
                  },
                ]}
              >
                {priority.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.flex1}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="publish" size={18} color="#7c2d3e" />
          <Text style={styles.sectionTitle}>Status *</Text>
        </View>
        <View style={styles.statusContainer}>
          {ANNOUNCEMENT_STATUS_OPTIONS.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[
                styles.statusButton,
                formData.status === status.value && styles.selectedStatusButton,
              ]}
              onPress={() =>
                setFormData((prev) => ({ ...prev, status: status.value }))
              }
            >
              <MaterialIcons
                name={
                  status.value === "published"
                    ? "publish"
                    : status.value === "scheduled"
                      ? "schedule"
                      : "drafts"
                }
                size={14}
                color={formData.status === status.value ? "#ffffff" : "#8d5a5e"}
              />
              <Text
                style={[
                  styles.statusText,
                  formData.status === status.value && styles.selectedStatusText,
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTargetSelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="group" size={18} color="#7c2d3e" />
        <Text style={styles.sectionTitle}>Target Audience</Text>
      </View>
      <View style={styles.targetContainer}>
        {TARGET_TYPES.map((target) => (
          <TouchableOpacity
            key={target.value}
            style={[
              styles.targetButton,
              formData.target_type === target.value &&
                styles.selectedTargetButton,
            ]}
            onPress={() =>
              setFormData((prev) => ({ ...prev, target_type: target.value }))
            }
          >
            <View style={styles.targetTextContainer}>
              <Text
                style={[
                  styles.targetText,
                  formData.target_type === target.value &&
                    styles.selectedTargetText,
                ]}
              >
                {target.label}
              </Text>
              <Text
                style={[
                  styles.targetDescription,
                  formData.target_type === target.value &&
                    styles.selectedTargetDescription,
                ]}
              >
                {target.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {formData.target_type === "role" && (
        <View style={styles.roleSelection}>
          <Text style={styles.subSectionTitle}>Select Roles</Text>
          <View style={styles.roleContainer}>
            {Object.entries(USER_CATEGORIES).map(([key, value]) => {
              const roleName = getUserCategoryDisplayName(value);
              const isSelected = selectedRoles.includes(key.toLowerCase());

              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.roleButton,
                    isSelected && styles.selectedRoleButton,
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedRoles((prev) =>
                        prev.filter((r) => r !== key.toLowerCase()),
                      );
                    } else {
                      setSelectedRoles((prev) => [...prev, key.toLowerCase()]);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.roleText,
                      isSelected && styles.selectedRoleText,
                    ]}
                  >
                    {roleName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  const renderFeatureOptions = () => (
    <View style={styles.section}>
      {/* <Text style={styles.sectionTitle}>Feature Options</Text> */}

      <View style={styles.featureContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            setFormData((prev) => ({ ...prev, is_featured: !prev.is_featured }))
          }
        >
          {/* <View
            style={[
              styles.checkbox,
              formData.is_featured && styles.checkedCheckbox,
            ]}
          >
            {formData.is_featured && (
              <MaterialIcons name="star" size={16} color="#ffffff" />
            )}
          </View>
          <View style={styles.checkboxLabelContainer}>
            <Text style={styles.checkboxLabel}>Featured Announcement</Text>
            <Text style={styles.checkboxDescription}>
              Show prominently in feed
            </Text>
          </View> */}
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            setFormData((prev) => ({ ...prev, is_pinned: !prev.is_pinned }))
          }
        > */}
        {/* <View
            style={[
              styles.checkbox,
              formData.is_pinned && styles.checkedCheckbox,
            ]}
          >
            {formData.is_pinned && (
              <MaterialIcons name="push-pin" size={16} color="#ffffff" />
            )}
          </View> */}
        {/* <View style={styles.checkboxLabelContainer}>
            <Text style={styles.checkboxLabel}>Pin to Top</Text>
            <Text style={styles.checkboxDescription}>
              Keep at top of announcements
            </Text>
          </View> */}
        {/* </TouchableOpacity> */}
      </View>
    </View>
  );

  const renderMediaAndTags = () => (
    <View style={styles.section}>
      {/* <Text style={styles.sectionTitle}>Media & Tags</Text> */}

      {/* <View style={styles.mediaContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Featured Image URL</Text>
          <TextInput
            style={styles.textInput}
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChangeText={(text) => setFormData(prev => ({ ...prev, image_url: text }))}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tags (comma-separated)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., important, academic, urgent"
            value={formData.tags}
            onChangeText={(text) => setFormData(prev => ({ ...prev, tags: text }))}
          />
        </View>
      </View> */}
    </View>
  );

  const renderSchedulingSettings = () => (
    <View style={styles.section}>
      {/* <Text style={styles.sectionTitle}>Scheduling</Text> */}

      {formData.status === "scheduled" && (
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowSchedulePicker(true)}
        >
          {/* <MaterialIcons name="schedule" size={20} color="#3b82f6" />
          <Text style={styles.dateButtonText}>
            {formData.scheduled_at
              ? new Date(formData.scheduled_at).toLocaleString()
              : "Select schedule time"}
          </Text> */}
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowExpiryPicker(true)}
      > */}
      {/* <MaterialIcons name="event-busy" size={20} color="#6b7280" />
        <Text style={styles.dateButtonText}>
          {formData.expires_at
            ? `Expires: ${new Date(formData.expires_at).toLocaleString()}`
            : "Set expiration (optional)"}
        </Text> */}
      {/* </TouchableOpacity> */}
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleClose}
        disabled={isLoading}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.createButton, isLoading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.createButtonText}>Creating...</Text>
        ) : (
          <>
            <MaterialIcons name="publish" size={16} color="#ffffff" />
            <Text style={styles.createButtonText}>Create Announcement</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Announcement</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCategorySelection()}
          {renderBasicInfo()}
          {renderPriorityAndStatus()}
          {renderTargetSelection()}
          {/* Hidden sections for now */}
          {/* {renderFeatureOptions()} */}
          {/* {renderMediaAndTags()} */}
          {/* {renderSchedulingSettings()} */}
        </ScrollView>

        {renderActions()}

        {/* Date Pickers */}
        {showSchedulePicker && (
          <DateTimePicker
            value={
              formData.scheduled_at
                ? new Date(formData.scheduled_at)
                : new Date()
            }
            mode="datetime"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowSchedulePicker(false);
              if (selectedDate) {
                setFormData((prev) => ({
                  ...prev,
                  scheduled_at: selectedDate,
                }));
              }
            }}
          />
        )}

        {showExpiryPicker && (
          <DateTimePicker
            value={
              formData.expires_at ? new Date(formData.expires_at) : new Date()
            }
            mode="datetime"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowExpiryPicker(false);
              if (selectedDate) {
                setFormData((prev) => ({ ...prev, expires_at: selectedDate }));
              }
            }}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf7f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#7c2d3e",
    borderBottomWidth: 1,
    borderBottomColor: "#5c1f2e",
  },
  closeButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#7c2d3e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d3e",
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5c1f2e",
    marginBottom: 8,
    marginTop: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
  },
  categoryButton: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
    minWidth: 80,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e5d3d6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2c1810",
    backgroundColor: "#fefefd",
    borderStyle: "solid",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: "#7c2d3e",
    textAlign: "right",
    marginTop: 4,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  flex1: {
    flex: 1,
  },
  priorityContainer: {
    gap: 8,
  },
  priorityButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusContainer: {
    gap: 8,
  },
  statusButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5d3d6",
    backgroundColor: "#fefefd",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  selectedStatusButton: {
    backgroundColor: "#7c2d3e",
    borderColor: "#7c2d3e",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5c1f2e",
  },
  selectedStatusText: {
    color: "#ffffff",
  },
  targetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  targetButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fefefd",
    borderWidth: 1,
    borderColor: "#e5d3d6",
    flex: 1,
    minWidth: "48%",
  },
  selectedTargetButton: {
    backgroundColor: "#7c2d3e",
    borderColor: "#7c2d3e",
  },
  targetTextContainer: {
    alignItems: "center",
  },
  targetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5c1f2e",
    textAlign: "center",
  },
  selectedTargetText: {
    color: "#ffffff",
  },
  targetDescription: {
    fontSize: 11,
    color: "#8d5a5e",
    marginTop: 2,
    textAlign: "center",
  },
  selectedTargetDescription: {
    color: "#f3e8ea",
  },
  roleSelection: {
    marginTop: 12,
  },
  roleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  roleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f8f4f5",
    borderWidth: 1,
    borderColor: "#e5d3d6",
  },
  selectedRoleButton: {
    backgroundColor: "#7c2d3e",
    borderColor: "#7c2d3e",
  },
  roleText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#5c1f2e",
  },
  selectedRoleText: {
    color: "#ffffff",
  },
  featureContainer: {
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#e5d3d6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    backgroundColor: "#fefefd",
  },
  checkedCheckbox: {
    backgroundColor: "#7c2d3e",
    borderColor: "#7c2d3e",
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5c1f2e",
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 11,
    color: "#8d5a5e",
  },
  mediaContainer: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5c1f2e",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefefd",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5d3d6",
    marginBottom: 8,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 13,
    color: "#5c1f2e",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5d3d6",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#f8f4f5",
    borderWidth: 1,
    borderColor: "#e5d3d6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8d5a5e",
  },
  createButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#7c2d3e",
    gap: 8,
    shadowColor: "#7c2d3e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#a8888c",
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
