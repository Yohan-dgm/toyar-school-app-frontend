import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { isValidTimeFormat } from "../../api/attendance-api";

interface TimePickerInputProps {
  label: string;
  value: string;
  onTimeChange: (time: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  label,
  value,
  onTimeChange,
  placeholder = "HH:MM",
  required = false,
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempTime, setTempTime] = useState(value);
  const [validationError, setValidationError] = useState<string>("");

  // Parse time string to get hours and minutes
  const parseTime = (timeString: string) => {
    if (!timeString) return { hours: "07", minutes: "30" };
    const parts = timeString.split(":");
    return {
      hours: parts[0] || "07",
      minutes: parts[1] || "30",
    };
  };

  const formatTime = (hours: string, minutes: string): string => {
    const h = hours.padStart(2, "0");
    const m = minutes.padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleTimeChange = (newTime: string) => {
    setTempTime(newTime);
    setValidationError("");

    // Validate time format
    if (newTime && !isValidTimeFormat(newTime)) {
      setValidationError("Invalid time format. Use HH:MM");
      return;
    }

    // Additional validation for reasonable times
    if (newTime) {
      const [hours, minutes] = newTime.split(":").map(Number);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        setValidationError("Time must be between 00:00 and 23:59");
        return;
      }
    }
  };

  const handleSave = () => {
    if (validationError) return;

    if (tempTime && !isValidTimeFormat(tempTime)) {
      setValidationError("Invalid time format. Use HH:MM");
      return;
    }

    onTimeChange(tempTime);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setTempTime(value);
    setValidationError("");
    setIsModalVisible(false);
  };

  const { hours, minutes } = parseTime(value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[
          styles.timeButton,
          error ? styles.errorBorder : {},
          !value ? styles.placeholderState : {},
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="access-time" size={20} color="#666" />
        <Text style={[styles.timeText, !value ? styles.placeholderText : {}]}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Time Picker Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputSection}>
                <Text style={styles.timeInputLabel}>Time (24-hour format)</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    validationError ? styles.errorBorder : {},
                  ]}
                  value={tempTime}
                  onChangeText={handleTimeChange}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {validationError ? (
                  <Text style={styles.errorText}>{validationError}</Text>
                ) : null}
              </View>

              <View style={styles.presetTimes}>
                <Text style={styles.presetLabel}>Quick Select:</Text>
                <View style={styles.presetButtonsRow}>
                  {[
                    { label: "7:30 AM", value: "07:30" },
                    { label: "8:00 AM", value: "08:00" },
                    { label: "9:00 AM", value: "09:00" },
                    { label: "1:00 PM", value: "13:00" },
                  ].map((preset) => (
                    <TouchableOpacity
                      key={preset.value}
                      style={[
                        styles.presetButton,
                        tempTime === preset.value
                          ? styles.presetButtonActive
                          : {},
                      ]}
                      onPress={() => handleTimeChange(preset.value)}
                    >
                      <Text
                        style={[
                          styles.presetButtonText,
                          tempTime === preset.value
                            ? styles.presetButtonTextActive
                            : {},
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  validationError ? styles.disabledButton : {},
                ]}
                onPress={handleSave}
                disabled={!!validationError}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  required: {
    color: "#F44336",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 10,
  },
  timeText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  placeholderState: {
    borderColor: "#E0E0E0",
  },
  errorBorder: {
    borderColor: "#F44336",
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 4,
  },
  timeInputContainer: {
    padding: 20,
  },
  timeInputSection: {
    marginBottom: 20,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  presetTimes: {
    marginTop: 16,
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  presetButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  presetButtonActive: {
    backgroundColor: "#920734",
    borderColor: "#920734",
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  presetButtonTextActive: {
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#920734",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
});

export default TimePickerInput;
