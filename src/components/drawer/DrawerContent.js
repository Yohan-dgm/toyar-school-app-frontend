import React, { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";

const DrawerContent = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    setUser(null);
    navigation.navigate("Login");
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/sample-profile.png")}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user?.full_name || "John Doe"}</Text>
      </View>
      <DrawerItem
        label="Profile"
        labelStyle={styles.label}
        icon={() => (
          <MaterialIcons name="person" size={24} color={theme.colors.primary} />
        )}
        onPress={() => navigation.navigate("Profile")}
      />
      <DrawerItem
        label="Privacy and Policy"
        labelStyle={styles.label}
        icon={() => (
          <MaterialIcons name="policy" size={24} color={theme.colors.primary} />
        )}
        onPress={() => navigation.navigate("PrivacyPolicy")}
      />
      <DrawerItem
        label="Terms and Conditions"
        labelStyle={styles.label}
        icon={() => (
          <MaterialIcons
            name="description"
            size={24}
            color={theme.colors.primary}
          />
        )}
        onPress={() => navigation.navigate("TermsConditions")}
      />
      <DrawerItem
        label="Settings"
        labelStyle={styles.label}
        icon={() => (
          <MaterialIcons
            name="settings"
            size={24}
            color={theme.colors.primary}
          />
        )}
        onPress={() => navigation.navigate("Settings")}
      />
      <DrawerItem
        label="Logout"
        labelStyle={styles.label}
        icon={() => (
          <MaterialIcons name="logout" size={24} color={theme.colors.primary} />
        )}
        onPress={handleLogout}
      />
      <View style={styles.footer}>
        <Text style={styles.appVersion}>App Version: 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
    marginTop: "auto",
  },
  appVersion: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
  },
});

export default DrawerContent;
