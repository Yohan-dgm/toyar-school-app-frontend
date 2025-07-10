import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

const SettingsSection = ({ onClose, onNavigateToSubSection }) => {
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      academicUpdates: true,
      eventReminders: true,
      attendanceAlerts: true,
    },
    privacy: {
      profileVisibility: true,
      shareAcademicInfo: false,
      allowDataCollection: true,
    },
    app: {
      darkMode: false,
      autoSync: true,
      offlineMode: false,
      biometricLogin: false,
    },
  });

  const toggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            setSettings({
              notifications: {
                pushNotifications: true,
                emailNotifications: true,
                smsNotifications: false,
                academicUpdates: true,
                eventReminders: true,
                attendanceAlerts: true,
              },
              privacy: {
                profileVisibility: true,
                shareAcademicInfo: false,
                allowDataCollection: true,
              },
              app: {
                darkMode: false,
                autoSync: true,
                offlineMode: false,
                biometricLogin: false,
              },
            });
            Alert.alert("Success", "Settings have been reset to default values.");
          }
        }
      ]
    );
  };

  const SettingItem = ({ title, description, value, onToggle, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E0E0E0", true: theme.colors.primary + "40" }}
        thumbColor={value ? theme.colors.primary : "#FFFFFF"}
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );

  const NavigationItem = ({ title, description, icon, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.navigationItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
          <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <NavigationItem
            title="Change Password"
            description="Update your account password"
            icon="lock"
            onPress={() => onNavigateToSubSection('change-password')}
          />
          
          <NavigationItem
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            icon="security"
            onPress={() => onNavigateToSubSection('two-factor')}
          />
          
          <NavigationItem
            title="Linked Accounts"
            description="Manage connected social accounts"
            icon="link"
            onPress={() => onNavigateToSubSection('linked-accounts')}
          />
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            title="Push Notifications"
            description="Receive notifications on your device"
            value={settings.notifications.pushNotifications}
            onToggle={() => toggleSetting('notifications', 'pushNotifications')}
            icon="notifications"
          />
          
          <SettingItem
            title="Email Notifications"
            description="Receive updates via email"
            value={settings.notifications.emailNotifications}
            onToggle={() => toggleSetting('notifications', 'emailNotifications')}
            icon="email"
          />
          
          <SettingItem
            title="SMS Notifications"
            description="Receive text message alerts"
            value={settings.notifications.smsNotifications}
            onToggle={() => toggleSetting('notifications', 'smsNotifications')}
            icon="sms"
          />
          
          <SettingItem
            title="Academic Updates"
            description="Notifications about grades and assignments"
            value={settings.notifications.academicUpdates}
            onToggle={() => toggleSetting('notifications', 'academicUpdates')}
            icon="school"
          />
          
          <SettingItem
            title="Event Reminders"
            description="Reminders for upcoming school events"
            value={settings.notifications.eventReminders}
            onToggle={() => toggleSetting('notifications', 'eventReminders')}
            icon="event"
          />
          
          <SettingItem
            title="Attendance Alerts"
            description="Notifications about attendance status"
            value={settings.notifications.attendanceAlerts}
            onToggle={() => toggleSetting('notifications', 'attendanceAlerts')}
            icon="how-to-reg"
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <SettingItem
            title="Profile Visibility"
            description="Allow others to see your profile"
            value={settings.privacy.profileVisibility}
            onToggle={() => toggleSetting('privacy', 'profileVisibility')}
            icon="visibility"
          />
          
          <SettingItem
            title="Share Academic Info"
            description="Share academic achievements publicly"
            value={settings.privacy.shareAcademicInfo}
            onToggle={() => toggleSetting('privacy', 'shareAcademicInfo')}
            icon="share"
          />
          
          <SettingItem
            title="Data Collection"
            description="Allow app usage analytics"
            value={settings.privacy.allowDataCollection}
            onToggle={() => toggleSetting('privacy', 'allowDataCollection')}
            icon="analytics"
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <SettingItem
            title="Dark Mode"
            description="Use dark theme throughout the app"
            value={settings.app.darkMode}
            onToggle={() => toggleSetting('app', 'darkMode')}
            icon="dark-mode"
          />
          
          <SettingItem
            title="Auto Sync"
            description="Automatically sync data when connected"
            value={settings.app.autoSync}
            onToggle={() => toggleSetting('app', 'autoSync')}
            icon="sync"
          />
          
          <SettingItem
            title="Offline Mode"
            description="Enable offline functionality"
            value={settings.app.offlineMode}
            onToggle={() => toggleSetting('app', 'offlineMode')}
            icon="offline-bolt"
          />
          
          <SettingItem
            title="Biometric Login"
            description="Use fingerprint or face recognition"
            value={settings.app.biometricLogin}
            onToggle={() => toggleSetting('app', 'biometricLogin')}
            icon="fingerprint"
          />
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          
          <NavigationItem
            title="Help Center"
            description="Get help and support"
            icon="help"
            onPress={() => onNavigateToSubSection('help-center')}
          />
          
          <NavigationItem
            title="Contact Support"
            description="Reach out to our support team"
            icon="support-agent"
            onPress={() => onNavigateToSubSection('contact-support')}
          />
          
          <NavigationItem
            title="App Information"
            description="Version, licenses, and credits"
            icon="info"
            onPress={() => onNavigateToSubSection('app-info')}
          />
          
          <NavigationItem
            title="Rate This App"
            description="Share your feedback on the app store"
            icon="star-rate"
            onPress={() => onNavigateToSubSection('rate-app')}
          />
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          
          <NavigationItem
            title="Clear Cache"
            description="Clear app cache and temporary files"
            icon="clear-all"
            onPress={() => onNavigateToSubSection('clear-cache')}
            showArrow={false}
          />
          
          <NavigationItem
            title="Delete Account"
            description="Permanently delete your account"
            icon="delete-forever"
            onPress={() => onNavigateToSubSection('delete-account')}
            showArrow={false}
          />
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
  resetButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  navigationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    marginTop: 2,
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: "#FFE5E5",
    backgroundColor: "#FFFAFA",
  },
  dangerTitle: {
    color: "#D32F2F",
    backgroundColor: "#FFE5E5",
  },
});

export default SettingsSection;
