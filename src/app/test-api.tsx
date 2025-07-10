import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import ActivityFeedAPITest from "../components/test/ActivityFeedAPITest";

export default function TestAPIScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityFeedAPITest />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
