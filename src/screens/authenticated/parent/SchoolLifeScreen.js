import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleNavigationPress } from "../../../utils/navigationFix";
import { theme } from "../../../styles/theme";
import Header from "../../../components/common/Header";
import BottomNavigation from "../../../components/common/BottomNavigation";
import {
  MainCard,
  CategoryTabs,
  ProductCard,
} from "../../../components/common/MainCard";

const SchoolLifeScreen = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleTabPress = (tabId) => {
    handleNavigationPress(tabId, "SchoolLifeScreen");
  };

  const categories = [
    { id: "all", name: "All" },
    { id: "academic", name: "Academic" },
    { id: "events", name: "Events" },
    { id: "sports", name: "Sports" },
    { id: "activities", name: "Activities" },
  ];

  const schoolItems = [
    {
      id: 1,
      title: "Academic Report",
      subtitle: "Monthly progress",
      image: require("../../../assets/images/sample-profile.png"),
    },
    {
      id: 2,
      title: "School Events",
      subtitle: "Upcoming activities",
      image: require("../../../assets/images/sample-profile.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Feature Card */}
        <MainCard
          title="Academic Overview"
          subtitle="View your child's academic progress, attendance, and upcoming activities."
          buttonText="View Details"
          onPress={() => console.log("View Details pressed")}
          gradientColors={["#F8F9FA", "#E9ECEF"]}
          backgroundImage={require("../../../assets/annoucement/sports.png")}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
        />

        {/* Content Grid */}
        <View style={styles.gridContainer}>
          {schoolItems.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              onPress={() => console.log(`${item.title} pressed`)}
            />
          ))}
        </View>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation activeTab="schoolLife" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.md,
    justifyContent: "space-between",
  },
  bottomSpacing: {
    height: 120, // Space for bottom navigation
  },
});

export default SchoolLifeScreen;
