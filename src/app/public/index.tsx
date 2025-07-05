import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TButton } from "@/components/TButton";
import { SnapBot } from "../../components/modules/SnapBot";
import { SnapBotButton } from "../../components/modules/SnapBotButton";
import { AndroidConfig } from "@/lib/android-config";

export default function PublicHomeScreen() {
  const router = useRouter();
  const [isSnapBotVisible, setIsSnapBotVisible] = useState(false);

  const handleSnapBotOpen = () => {
    console.log("SnapBot button pressed, opening popup");
    setIsSnapBotVisible(true);
  };

  const handleSnapBotClose = () => {
    console.log("SnapBot close requested");
    setIsSnapBotVisible(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Background Effects */}
        <View style={styles.backgroundEffects}>
          <View style={styles.gradientCircle1} />
          <View style={styles.gradientCircle2} />
          <View style={styles.gradientCircle3} />
          <View style={styles.patternOverlay} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeTitle}>Welcome to SchoolSnap</Text>
              <Text style={styles.headerSubtitle}>
                Your complete school management solution
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Image
                source={require("@/assets/SchooSnap_logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          {...AndroidConfig.getScrollViewProps()}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={{ ...styles.heroTitle, color: "#9b0737" }}>
              Connect. Learn. Grow.
            </Text>
            <Text style={styles.heroText}>
              Experience seamless school management with real-time updates,
              interactive features, and a community-focused approach.
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>What Makes Us Special</Text>

            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <Text style={styles.featureEmoji}>📚</Text>
                <Text style={styles.featureTitle}>For Students</Text>
                <Text style={styles.featureText}>
                  Access assignments, grades, and school announcements
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureEmoji}>👨‍👩‍👧‍👦</Text>
                <Text style={styles.featureTitle}>For Parents</Text>
                <Text style={styles.featureText}>
                  Track your child's progress and stay updated with activities
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureEmoji}>👩‍🏫</Text>
                <Text style={styles.featureTitle}>For Educators</Text>
                <Text style={styles.featureText}>
                  Manage classes, students, and communicate with parents
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to get started?</Text>
            <Text style={styles.ctaText}>
              Login to access your personalized dashboard
            </Text>
            <TButton
              title="Login Now"
              variant="primary"
              onPress={() => router.push("/public/login")}
              style={styles.ctaButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by</Text>
            <Text style={styles.companyName}>Toyar Pvt. Ltd.</Text>
          </View>
        </ScrollView>

        {/* SnapBot Button */}
        <SnapBotButton onPress={handleSnapBotOpen} />
      </SafeAreaView>

      {/* SnapBot Popup - Outside SafeAreaView for better positioning */}
      <SnapBot isVisible={isSnapBotVisible} onClose={handleSnapBotClose} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  backgroundEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradientCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(155, 7, 55, 0.1)",
  },
  gradientCircle2: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255, 107, 107, 0.08)",
  },
  gradientCircle3: {
    position: "absolute",
    top: "40%",
    right: -200,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(76, 205, 196, 0.06)",
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 7, 55, 0.1)",
    zIndex: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 16,
  },
  headerLogo: {
    width: 50,
    height: 50,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, // Account for floating navbar (30px bottom + 55px height + 15px extra spacing)
  },
  heroSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: -20,
    marginTop: 20,
    borderRadius: 20,
    zIndex: 1,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  heroText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  featuresSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.1)",
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    textAlign: "center",
  },
  ctaSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
  },
  ctaButton: {
    paddingHorizontal: 40,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9b0737",
  },
});
