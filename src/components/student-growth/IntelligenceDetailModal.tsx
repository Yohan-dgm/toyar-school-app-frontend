import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { modernColors } from "../../data/studentGrowthData";

interface IntelligenceDetailModalProps {
  visible: boolean;
  intelligence: any;
  onClose: () => void;
}

const IntelligenceDetailModal: React.FC<IntelligenceDetailModalProps> = ({
  visible,
  intelligence,
  onClose,
}) => {
  const [modalOpacity] = useState(new Animated.Value(0));
  const [modalScale] = useState(new Animated.Value(0.8));
  const [backdropOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Smooth spring animations for opening
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Smooth animations for closing
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(modalScale, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    // Animate out before closing
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!intelligence) return null;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(intelligence.rating);
    const hasHalfStar = intelligence.rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <MaterialIcons key={i} name="star" size={24} color="#FFD700" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <MaterialIcons key={i} name="star-half" size={24} color="#FFD700" />,
        );
      } else {
        stars.push(
          <MaterialIcons
            key={i}
            name="star-border"
            size={24}
            color="#E0E0E0"
          />,
        );
      }
    }
    return stars;
  };

  const renderTrendChart = () => {
    const maxValue = Math.max(...intelligence.trend);
    return (
      <View style={styles.trendChart}>
        {intelligence.trend.map((value: number, index: number) => (
          <View key={index} style={styles.trendBarContainer}>
            <View
              style={[
                styles.trendBar,
                {
                  height: `${(value / maxValue) * 100}%`,
                  backgroundColor: intelligence.color,
                },
              ]}
            />
            <Text style={styles.trendLabel}>T{index + 1}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Animated backdrop with blur effect */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Animated modal container */}
      <Animated.View
        style={[
          styles.modalWrapper,
          {
            opacity: modalOpacity,
            transform: [{ scale: modalScale }],
          },
        ]}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <LinearGradient
            colors={[
              intelligence.color + "20",
              intelligence.color + "05",
              "transparent",
            ]}
            style={styles.header}
          >
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <MaterialIcons name="close" size={24} color={modernColors.text} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: intelligence.color + "20" },
                ]}
              >
                <MaterialIcons
                  name={intelligence.icon}
                  size={32}
                  color={intelligence.color}
                />
              </View>

              <Text style={styles.modalTitle}>{intelligence.title}</Text>
              <Text style={styles.modalSubtitle}>
                {intelligence.description}
              </Text>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>Current Performance</Text>

              <View style={styles.ratingDisplay}>
                <View style={styles.starsContainer}>{renderStars()}</View>
                <Text style={styles.ratingValue}>
                  {intelligence.rating.toFixed(1)} / 5.0
                </Text>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: intelligence.color + "20" },
                  ]}
                >
                  <Text
                    style={[styles.levelText, { color: intelligence.color }]}
                  >
                    {intelligence.level}
                  </Text>
                </View>
              </View>
            </View>

            {/* Progress Trend */}
            <View style={styles.trendSection}>
              <Text style={styles.sectionTitle}>Progress Over Time</Text>
              <View style={styles.trendContainer}>
                {renderTrendChart()}
                <View style={styles.trendStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Improvement</Text>
                    <Text
                      style={[
                        styles.statValue,
                        { color: modernColors.success },
                      ]}
                    >
                      +
                      {(
                        ((intelligence.trend[intelligence.trend.length - 1] -
                          intelligence.trend[0]) *
                          100) /
                        intelligence.trend[0]
                      ).toFixed(1)}
                      %
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Class Average</Text>
                    <Text style={styles.statValue}>
                      {intelligence.classAverage.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Insights */}
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>Key Insights</Text>

              <View style={styles.insightCard}>
                <MaterialIcons
                  name="trending-up"
                  size={24}
                  color={modernColors.success}
                />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Strength Area</Text>
                  <Text style={styles.insightDescription}>
                    Performance is{" "}
                    {intelligence.rating > intelligence.classAverage
                      ? "above"
                      : "below"}{" "}
                    class average by{" "}
                    {Math.abs(
                      intelligence.rating - intelligence.classAverage,
                    ).toFixed(1)}{" "}
                    points
                  </Text>
                </View>
              </View>

              <View style={styles.insightCard}>
                <MaterialIcons
                  name="psychology"
                  size={24}
                  color={modernColors.primary}
                />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Development Focus</Text>
                  <Text style={styles.insightDescription}>
                    Continue building on this intelligence through targeted
                    activities and practice
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: intelligence.color },
                ]}
              >
                <MaterialIcons name="assignment" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>View Activities</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
              >
                <MaterialIcons
                  name="share"
                  size={20}
                  color={intelligence.color}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: intelligence.color },
                  ]}
                >
                  Share Progress
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(10px)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    backgroundColor: modernColors.backgroundSolid,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: "hidden",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: modernColors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: modernColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ratingSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: modernColors.text,
    marginBottom: 16,
  },
  ratingDisplay: {
    alignItems: "center",
    padding: 24,
    backgroundColor: modernColors.surface,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: "800",
    color: modernColors.text,
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  trendSection: {
    marginBottom: 30,
  },
  trendContainer: {
    backgroundColor: modernColors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    justifyContent: "space-around",
    marginBottom: 20,
  },
  trendBarContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  trendBar: {
    width: 20,
    borderRadius: 10,
    minHeight: 20,
    marginBottom: 8,
  },
  trendLabel: {
    fontSize: 12,
    color: modernColors.textSecondary,
    fontWeight: "600",
  },
  trendStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: modernColors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: modernColors.text,
  },
  insightsSection: {
    marginBottom: 30,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: modernColors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: modernColors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: modernColors.surface,
    borderWidth: 2,
    borderColor: modernColors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

export default React.memo(IntelligenceDetailModal);
