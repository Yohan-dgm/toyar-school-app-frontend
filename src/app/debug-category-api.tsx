import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Stack } from "expo-router";
import CategoryAPITest from "../components/test/CategoryAPITest";

export default function DebugCategoryAPIScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <Stack.Screen
        options={{
          title: "Debug: Category API",
          headerStyle: { backgroundColor: "#f5f5f5" },
          headerTintColor: "#333",
          headerTitleStyle: { fontWeight: "600" },
        }}
      />
      <View style={styles.content}>
        <CategoryAPITest />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});
