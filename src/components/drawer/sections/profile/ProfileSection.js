import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../../context/AuthContext";
import { theme } from "../../../../styles/theme";
import { useSelector } from "react-redux";
import {
  getStudentProfilePicture,
  getDefaultStudentProfileImage,
  getLocalFallbackProfileImage,
} from "../../../../utils/studentProfileUtils";

const ProfileSection = ({ onClose }) => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  // Get global state for student profile picture
  const { selectedStudent } = useSelector((state) => state.app);

  // Get profile picture for the selected student
  const profilePictureSource = selectedStudent
    ? getStudentProfilePicture(selectedStudent)
    : null;

  // Fallback to default image if no profile picture
  const profileImage = profilePictureSource || getDefaultStudentProfileImage();
  const [editedUser, setEditedUser] = useState({
    full_name: user?.full_name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+1 234 567 8900",
    address: user?.address || "123 Main Street, City, State",
    grade: user?.grade || "Grade 10",
    student_id: user?.student_id || "STU123456",
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    setUser({ ...user, ...editedUser });
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedUser({
      full_name: user?.full_name || "John Doe",
      email: user?.email || "john.doe@example.com",
      phone: user?.phone || "+1 234 567 8900",
      address: user?.address || "123 Main Street, City, State",
      grade: user?.grade || "Grade 10",
      student_id: user?.student_id || "STU123456",
    });
    setIsEditing(false);
  };

  const ProfileField = ({
    label,
    value,
    field,
    editable = true,
    multiline = false,
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={[styles.fieldInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={(text) =>
            setEditedUser({ ...editedUser, [field]: text })
          }
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <MaterialIcons
            name={isEditing ? "check" : "edit"}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{editedUser.full_name}</Text>
          <Text style={styles.profileRole}>Student</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <ProfileField
            label="Full Name"
            value={editedUser.full_name}
            field="full_name"
          />

          <ProfileField
            label="Email Address"
            value={editedUser.email}
            field="email"
          />

          <ProfileField
            label="Phone Number"
            value={editedUser.phone}
            field="phone"
          />

          <ProfileField
            label="Address"
            value={editedUser.address}
            field="address"
            multiline={true}
          />
        </View>

        {/* Academic Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Academic Information</Text>

          <ProfileField
            label="Student ID"
            value={editedUser.student_id}
            field="student_id"
            editable={false}
          />

          <ProfileField
            label="Grade"
            value={editedUser.grade}
            field="grade"
            editable={false}
          />
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Additional Options */}
        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons
              name="security"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.optionText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.optionText}>Notification Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons name="help" size={24} color={theme.colors.primary} />
            <Text style={styles.optionText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  profileImageSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#666666",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#666666",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  fieldInput: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: "#666666",
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: "#FFFFFF",
  },
  optionsSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginLeft: 15,
  },
});

export default ProfileSection;
