import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../state-store/store";
import Header from "../common/Header";
import DynamicBottomNavigation from "../navigation/DynamicBottomNavigation";
import useActiveTab from "../../hooks/useActiveTab";
import { handleNavigationPress } from "../../utils/navigationFix";
import { getNavigationConfig } from "../../config/navigationConfig";
import { getUserCategoryName } from "../../constants/userCategories";

interface DynamicUserLayoutProps {
  userCategory: number;
  children: React.ReactNode;
}

const DynamicUserLayout: React.FC<DynamicUserLayoutProps> = ({
  userCategory,
  children,
}) => {
  const currentActiveTab = useActiveTab();
  const navigationConfig = getNavigationConfig(userCategory);
  const userCategoryName = getUserCategoryName(userCategory);

  const handleTabPress = (tabId: string) => {
    handleNavigationPress(tabId, `${userCategoryName}Layout`);
  };

  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <SafeAreaView style={styles.container}>
        {/* Fixed Header */}
        <Header />

        {/* Content Area - This changes based on route */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Dynamic Bottom Navigation */}
        <DynamicBottomNavigation
          navigationConfig={navigationConfig}
          activeTab={currentActiveTab}
          onTabPress={handleTabPress}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});

export default DynamicUserLayout;
