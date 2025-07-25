import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ClassTabWithAPI_Test = ({ userCategory, isConnected, filters }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Class Tab Test Component</Text>
      <Text style={styles.subText}>User Category: {userCategory}</Text>
      <Text style={styles.subText}>Connected: {isConnected ? "Yes" : "No"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
});

export default ClassTabWithAPI_Test;
