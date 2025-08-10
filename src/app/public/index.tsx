import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { AndroidConfig } from "@/lib/android-config";

const { width } = Dimensions.get("window");

export default function PublicHomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showNoResults, setShowNoResults] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      setShowNoResults(true);
    } else {
      setShowNoResults(false);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setShowNoResults(false);
  };

  const userCategories = [
    {
      id: "students",
      title: "Students",
      description: "Access assignments, grades, and school updates",
      image:
        "https://us.123rf.com/450wm/stockimagesbank/stockimagesbank1907/stockimagesbank190700076/132235776-group-of-schoolboys-and-schoolgirls-at-school-campus.jpg?ver=6",
      color: "#3B82F6",
    },
    {
      id: "parents",
      title: "Parents",
      description: "Monitor your child's progress and activities",
      image:
        "https://image.freepik.com/free-photo/close-up-parents-kid-with-laptop_23-2148920118.jpg",
      color: "#10B981",
    },
    {
      id: "educators",
      title: "Educators",
      description: "Manage classes and student engagement",
      image:
        "https://media.istockphoto.com/id/2160438109/photo/primary-multiethnic-pupils-working-on-digital-tablet-with-teacher.jpg?s=612x612&w=0&k=20&c=JVN-yMR73hsXUMdKCxCsPxfsUVkBpxIbduo3Xhk6dCA=",
      color: "#9B0737",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            <Image
              source={require("@/assets/SchooSnap_logo.png")}
              style={styles.appLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Welcome to School App</Text>
              <Text style={styles.userName}>Your smart education platform</Text>
            </View>
          </View>
          {/* <View style={styles.userSection}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              }}
              style={styles.userAvatar}
            />
          </View> */}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses, teachers..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#999999"
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        {...AndroidConfig.getScrollViewProps()}
      >
        {/* Search Results */}
        {showNoResults && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsTitle}>No Records Found</Text>
            <Text style={styles.searchResultsText}>
              We couldn&apos;t find any results for &quot;{searchText}&quot;.
              Try different keywords or browse our categories below.
            </Text>
            <TouchableOpacity style={styles.backButton} onPress={clearSearch}>
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={["darkred", "red"]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Connect & Learn</Text>
                <Text style={styles.heroDiscount}>Together</Text>
                <Text style={styles.heroSubtitle}>
                  Parents track progress • Educators manage classes • Students
                  stay engaged
                </Text>
                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => router.push("/public/login")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.heroImageContainer}>
                <Image
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEU1BYhWNJAZrs7SLipj_r6Mrwd3nJqH3TKQ&shttps://communityclothing.co.uk/cdn/shop/files/Commmmunity-Clothing-Kids-Plastic-Free-T-shirts-Group-square_1600x.jpg?v=1745516179",
                  }}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Categories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {userCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push("/public/login")}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.categoryIndicator,
                    { backgroundColor: category.color },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/public/login")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>📚</Text>
                </View>
                <Text style={styles.featureTitle}>Courses</Text>
                <Text style={styles.featureCount}>120+ Available</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/public/login")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>👨‍🏫</Text>
                </View>
                <Text style={styles.featureTitle}>Teachers</Text>
                <Text style={styles.featureCount}>50+ Experts</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/public/login")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#A8EDEA", "#74C3F1"]}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>📊</Text>
                </View>
                <Text style={styles.featureTitle}>Reports</Text>
                <Text style={styles.featureCount}>Live Analytics</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/public/login")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FAD961", "#F76B1C"]}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>💬</Text>
                </View>
                <Text style={styles.featureTitle}>Messages</Text>
                <Text style={styles.featureCount}>Stay Connected</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login CTA */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Start Learning?</Text>
            <Text style={styles.ctaDescription}>
              Join thousands of students and teachers already using School App
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/public/login")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#9B0737", "#DC2626"]}
                style={styles.ctaButtonGradient}
              >
                <Text style={styles.ctaButtonText}>Login to Dashboard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Toyar Pvt. Ltd.</Text>
          <Text style={styles.footerVersion}>Version 2.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header Styles
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Changed to center the logo and text
    marginBottom: 20,
  },
  logoSection: {
    flexDirection: "row", // Keep logo and text in a row
    alignItems: "center",
    marginRight: 4, // Space between logo section and other elements
  },
  appLogo: {
    width: 40,
    height: 40,
    marginRight: 2,
  },
  welcomeText: {
    // Removed flex: 1 to prevent stretching
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  userSection: {
    alignItems: "center",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 16,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Search Results
  searchResults: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchResultsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  searchResultsText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#9B0737",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Hero Banner
  heroBanner: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroGradient: {
    padding: 24,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroDiscount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    fontWeight: "500",
  },
  heroButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  heroImageContainer: {
    marginLeft: 10,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },

  // Sections
  categoriesSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  viewAllText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },

  // Categories
  categoriesScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    width: width * 0.75,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: 120,
  },
  categoryInfo: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    fontWeight: "500",
  },
  categoryIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Features
  featuresSection: {
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  featureCard: {
    flex: 1,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  featureGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  featureCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    textAlign: "center",
  },

  // CTA Section
  ctaSection: {
    marginBottom: 30,
  },
  ctaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: "500",
  },
  ctaButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#9B0737",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 4,
    fontWeight: "500",
  },
  footerVersion: {
    fontSize: 12,
    color: "#CCCCCC",
    fontWeight: "600",
  },
});
