import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { globalStyles } from "../../../styles/globalStyles";
import { theme } from "../../../styles/theme";

const TermsConditionsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Terms and Conditions</Text>
      <Text style={styles.text}>
        Placeholder for Terms and Conditions content.
      </Text>
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

export default TermsConditionsScreen;
