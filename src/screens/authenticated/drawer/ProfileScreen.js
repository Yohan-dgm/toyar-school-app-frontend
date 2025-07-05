import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { globalStyles } from "../../../styles/globalStyles";
import { theme } from "../../../styles/theme";

const ProfileScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Profile</Text>
      <Image
        source={require("../../../assets/images/sample-profile.png")}
        style={styles.profileImage}
      />
      <Text style={styles.text}>Name: John Doe</Text>
      <Text style={styles.text}>Email: john.doe@example.com</Text>
      <Text style={styles.text}>User Type: Parent</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: theme.spacing.md,
  },
  text: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
});

export default ProfileScreen;
