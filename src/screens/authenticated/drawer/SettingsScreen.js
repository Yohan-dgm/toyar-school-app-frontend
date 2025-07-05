import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { globalStyles } from "../../../styles/globalStyles";
import { theme } from "../../../styles/theme";

const SettingsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Settings</Text>
      <Text style={styles.text}>Placeholder for Settings content.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    marginVertical: theme.spacing.md,
  },
});

export default SettingsScreen;
