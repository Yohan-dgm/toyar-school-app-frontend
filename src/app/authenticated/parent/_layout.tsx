import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/common/Header";
import BottomNavigation from "../../../components/common/BottomNavigation";
import { useActiveTab } from "../../../hooks/useActiveTab";
import { handleNavigationPress } from "../../../utils/navigationFix";

export default function ParentLayout() {
  const currentActiveTab = useActiveTab();

  const handleTabPress = (tabId: string) => {
    handleNavigationPress(tabId, "ParentLayout");
  };

  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <SafeAreaView style={styles.container}>
        {/* Fixed Header */}
        <Header />

        {/* Content Area - This changes based on route */}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="school-life" />
            <Stack.Screen name="educator-feedback" />
            <Stack.Screen name="calendar" />
            <Stack.Screen name="academic" />
            <Stack.Screen name="performance" />
          </Stack>
        </View>

        {/* Fixed Bottom Navigation */}
        <BottomNavigation
          activeTab={currentActiveTab}
          onTabPress={handleTabPress}
        />
      </SafeAreaView>
    </>
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
