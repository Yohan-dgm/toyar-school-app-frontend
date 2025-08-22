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
  useGetNotificationTypesQuery,
  useCreateNotificationMutation,
} from "../../api/communication-management-api";
import {
  CreateNotificationFormData,
  NOTIFICATION_PRIORITIES,
  TARGET_TYPES,
  NotificationType,
} from "../../types/communication-management";
import {
  USER_CATEGORIES,
  getUserCategoryDisplayName,
} from "../../constants/userCategories";

interface CreateNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateNotificationModal({
  visible,
  onClose,
  onSuccess,
}: CreateNotificationModalProps) {
  const { data: notificationTypes = [] } = useGetNotificationTypesQuery();
  const [createNotification, { isLoading }] = useCreateNotificationMutation();

  const [formData, setFormData] = useState<CreateNotificationFormData>({
    notification_type_id: 0,
    title: "",
    message: "",
    priority: "normal",
    target_type: "broadcast",
    action_url: "",
    action_text: "",
    image_url: "",
    is_scheduled: false,
    scheduled_at: undefined,
    expires_at: undefined,
  });

  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    if (notificationTypes.length > 0 && formData.notification_type_id === 0) {
      setFormData((prev) => ({
        ...prev,
        notification_type_id: notificationTypes[0].id,
      }));
    }
  }, [notificationTypes, formData.notification_type_id]);

  const resetForm = () => {
    setFormData({
      notification_type_id:
        notificationTypes.length > 0 ? notificationTypes[0].id : 0,
      title: "",
      message: "",
      priority: "normal",
      target_type: "broadcast",
      action_url: "",
      action_text: "",
      image_url: "",
      is_scheduled: false,
      scheduled_at: undefined,
      expires_at: undefined,
    });
    setSelectedRoles([]);
    setSelectedUsers([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.notification_type_id === 0) {
      Alert.alert("Error", "Please select a notification type");
      return;
    }

    try {
      const targetData: any = {};

      if (formData.target_type === "role" && selectedRoles.length > 0) {
        targetData.roles = selectedRoles;
      } else if (formData.target_type === "user" && selectedUsers.length > 0) {
        targetData.user_ids = selectedUsers;
      }

      const notificationData = {
        notification_type_id: formData.notification_type_id,
        title: formData.title.trim(),
        message: formData.message.trim(),
        priority: formData.priority,
        target_type: formData.target_type,
        target_data:
          Object.keys(targetData).length > 0 ? targetData : undefined,
        action_url: formData.action_url.trim() || undefined,
        action_text: formData.action_text.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
        is_scheduled: formData.is_scheduled,
        scheduled_at: formData.scheduled_at
          ? new Date(formData.scheduled_at).toISOString()
          : undefined,
        expires_at: formData.expires_at
          ? new Date(formData.expires_at).toISOString()
          : undefined,
      };

      await createNotification(notificationData).unwrap();

      Alert.alert("Success", "Notification created successfully!");
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to create notification",
      );
    }
  };

  const renderTypeSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notification Type *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.typeContainer}>
          {notificationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                {
                  borderColor: type.color,
                  backgroundColor:
                    formData.notification_type_id === type.id
                      ? type.color + "20"
                      : "#f9fafb",
                },
              ]}
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  notification_type_id: type.id,
                }))
              }
            >
              <MaterialIcons
                name={type.icon as any}
                size={20}
                color={type.color}
              />
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      formData.notification_type_id === type.id
                        ? type.color
                        : "#6b7280",
                  },
                ]}
              >
                {type.name}
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
        <Text style={styles.sectionTitle}>Title *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter notification title"
          value={formData.title}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, title: text }))
          }
          maxLength={500}
        />
        <Text style={styles.charCount}>{formData.title.length}/500</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Message *</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Enter notification message"
          value={formData.message}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, message: text }))
          }
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </>
  );

  const renderPrioritySelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Priority *</Text>
      <View style={styles.priorityContainer}>
        {Object.entries(NOTIFICATION_PRIORITIES).map(([key, value]) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.priorityButton,
              formData.priority === value && styles.selectedPriorityButton,
            ]}
            onPress={() =>
              setFormData((prev) => ({ ...prev, priority: value as any }))
            }
          >
            <MaterialIcons
              name={
                value === "urgent"
                  ? "warning"
                  : value === "high"
                    ? "priority-high"
                    : "notifications"
              }
              size={16}
              color={formData.priority === value ? "#ffffff" : "#6b7280"}
            />
            <Text
              style={[
                styles.priorityText,
                formData.priority === value && styles.selectedPriorityText,
              ]}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTargetSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Target Audience *</Text>
      <View style={styles.targetContainer}>
        {Object.entries(TARGET_TYPES).map(([key, value]) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.targetButton,
              formData.target_type === value && styles.selectedTargetButton,
            ]}
            onPress={() =>
              setFormData((prev) => ({ ...prev, target_type: value as any }))
            }
          >
            <Text
              style={[
                styles.targetText,
                formData.target_type === value && styles.selectedTargetText,
              ]}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Role Selection */}
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

  const renderActionSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Action Button (Optional)</Text>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.inputLabel}>Button Text</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., View Details"
            value={formData.action_text}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, action_text: text }))
            }
            maxLength={100}
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.inputLabel}>Action URL</Text>
          <TextInput
            style={styles.textInput}
            placeholder="https://..."
            value={formData.action_url}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, action_url: text }))
            }
            maxLength={500}
            keyboardType="url"
          />
        </View>
      </View>
    </View>
  );

  const renderSchedulingSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Scheduling (Optional)</Text>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() =>
          setFormData((prev) => ({ ...prev, is_scheduled: !prev.is_scheduled }))
        }
      >
        <View
          style={[
            styles.checkbox,
            formData.is_scheduled && styles.checkedCheckbox,
          ]}
        >
          {formData.is_scheduled && (
            <MaterialIcons name="check" size={16} color="#ffffff" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>Schedule for later</Text>
      </TouchableOpacity>

      {formData.is_scheduled && (
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowSchedulePicker(true)}
        >
          <MaterialIcons name="schedule" size={20} color="#3b82f6" />
          <Text style={styles.dateButtonText}>
            {formData.scheduled_at
              ? new Date(formData.scheduled_at).toLocaleString()
              : "Select schedule time"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowExpiryPicker(true)}
      >
        <MaterialIcons name="event-busy" size={20} color="#6b7280" />
        <Text style={styles.dateButtonText}>
          {formData.expires_at
            ? `Expires: ${new Date(formData.expires_at).toLocaleString()}`
            : "Set expiration (optional)"}
        </Text>
      </TouchableOpacity>
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
            <MaterialIcons name="send" size={16} color="#ffffff" />
            <Text style={styles.createButtonText}>Create Notification</Text>
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
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Notification</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderTypeSelection()}
          {renderBasicInfo()}
          {renderPrioritySelection()}
          {renderTargetSelection()}
          {renderActionSettings()}
          {renderSchedulingSettings()}
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
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  multilineInput: {
    height: 80,
  },
  charCount: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    gap: 6,
  },
  selectedPriorityButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  selectedPriorityText: {
    color: "#ffffff",
  },
  targetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  targetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  selectedTargetButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  targetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  selectedTargetText: {
    color: "#ffffff",
  },
  roleSelection: {
    marginTop: 12,
  },
  roleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedRoleButton: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  selectedRoleText: {
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 8,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  createButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
