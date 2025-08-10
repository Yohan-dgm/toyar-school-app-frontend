import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { SCHOOL_HOUSES } from "../../../../../constants/schoolHouses";
import { useDashboardData } from "../../../../../hooks/useDashboardData";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: [string, string];
  accentColor: string;
  delay?: number;
  onPress?: () => void;
  isLoading?: boolean;
}

interface HouseCardProps {
  house: (typeof SCHOOL_HOUSES)[0];
  studentCount: number;
  delay?: number;
  isLoading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colors,
  accentColor,
  delay = 0,
  onPress,
  isLoading = false,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const timer = setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.summaryCard, animatedStyle]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        <LinearGradient
          colors={[`${colors[0]}25`, `${colors[1]}15`]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${accentColor}20` },
                ]}
              >
                <MaterialIcons name={icon} size={24} color={accentColor} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                {subtitle && (
                  <Text style={styles.cardSubtitle}>{subtitle}</Text>
                )}
              </View>
            </View>
            <View style={styles.valueContainer}>
              {isLoading ? (
                <View
                  style={[
                    styles.loadingSkeleton,
                    { backgroundColor: `${accentColor}20` },
                  ]}
                />
              ) : (
                <Text style={[styles.cardValue, { color: accentColor }]}>
                  {value}
                </Text>
              )}
            </View>
          </View>
          <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HouseCard: React.FC<HouseCardProps> = ({
  house,
  studentCount,
  delay = 0,
  isLoading = false,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 600 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.houseCard, animatedStyle]}>
      <LinearGradient
        colors={house.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.houseGradient}
      >
        <View style={styles.houseContent}>
          <MaterialIcons
            name={house.icon as keyof typeof MaterialIcons.glyphMap}
            size={20}
            color="white"
          />
          <Text style={styles.houseName}>{house.name}</Text>
          {isLoading ? (
            <View style={styles.houseLoadingSkeleton} />
          ) : (
            <Text style={styles.houseCount}>{studentCount}</Text>
          )}
          <Text style={styles.houseLabel}>Students</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const SummaryDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error, refetch } = useDashboardData();

  // Fallback data in case API fails
  const fallbackData = {
    totalStudents: 250, // Dummy data for loading state
    totalEducators: 45,
    activeClasses: 12,
    averageAttendance: 0,
    notifications: 3,
    houseStudents: {
      vulcan: 65,
      tellus: 58,
      eurus: 72,
      calypso: 55,
    },
  };

  const displayData = dashboardData || fallbackData;

  // Show error message if API fails
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Unable to Load Dashboard Data</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Overview</Text>
        <Text style={styles.headerSubtitle}>Principal Summary</Text>
      </View> */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <SummaryCard
          title="Total Students"
          value={isLoading ? "---" : displayData.totalStudents.toLocaleString()}
          subtitle="Active enrollment"
          icon="school"
          colors={["#4F46E5", "#7C3AED"]}
          accentColor="#4F46E5"
          delay={0}
          isLoading={isLoading}
        />

        <SummaryCard
          title="Educators"
          value={isLoading ? "---" : displayData.totalEducators}
          subtitle="Active staff"
          icon="people"
          colors={["#059669", "#10B981"]}
          accentColor="#059669"
          delay={100}
          isLoading={isLoading}
        />

        <SummaryCard
          title="Active Classes"
          value={isLoading ? "---" : displayData.activeClasses}
          subtitle="This semester"
          icon="class"
          colors={["#DC2626", "#EF4444"]}
          accentColor="#DC2626"
          delay={200}
          isLoading={isLoading}
        />

        <SummaryCard
          title="Attendance"
          value={isLoading ? "---" : `${displayData.averageAttendance}%`}
          subtitle="This month"
          icon="trending-up"
          colors={["#7C3AED", "#A855F7"]}
          accentColor="#7C3AED"
          delay={300}
          isLoading={isLoading}
        />

        <SummaryCard
          title="Notifications"
          value={isLoading ? "---" : displayData.notifications}
          subtitle="Pending review"
          icon="notifications"
          colors={["#EA580C", "#FB923C"]}
          accentColor="#EA580C"
          delay={400}
          isLoading={isLoading}
        />

        {dashboardData?.droppedOutStudents !== undefined && (
          <SummaryCard
            title="Dropped Out"
            value={isLoading ? "---" : dashboardData.droppedOutStudents}
            subtitle="Students"
            icon="person-remove"
            colors={["#F59E0B", "#FBBF24"]}
            accentColor="#F59E0B"
            delay={500}
            isLoading={isLoading}
          />
        )}
      </ScrollView>

      <View style={styles.housesSection}>
        <Text style={styles.sectionTitle}>School Houses</Text>
        <View style={styles.housesGrid}>
          {SCHOOL_HOUSES.map((house, index) => (
            <HouseCard
              key={house.id}
              house={house}
              studentCount={
                displayData.houseStudents[
                  house.id as keyof typeof displayData.houseStudents
                ]
              }
              delay={500 + index * 100}
              isLoading={isLoading}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    marginBottom: 24,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  summaryCard: {
    width: 170,
    height: 130,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  cardContent: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 14,
  },
  cardSubtitle: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  valueContainer: {
    alignItems: "flex-start",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  housesSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  housesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  houseCard: {
    width: (width - 64) / 4,
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 8,
  },
  houseGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  houseContent: {
    alignItems: "center",
  },
  houseName: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 2,
  },
  houseCount: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 20,
  },
  houseLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2,
  },
  loadingSkeleton: {
    height: 28,
    width: 80,
    borderRadius: 6,
    opacity: 0.6,
  },
  houseLoadingSkeleton: {
    height: 20,
    width: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC2626",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SummaryDashboard;
