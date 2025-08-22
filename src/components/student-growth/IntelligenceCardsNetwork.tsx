import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import OverallRatingCard from "./OverallRatingCard";
import IntelligenceDetailModal from "./IntelligenceDetailModal";
import { overallRatingData, modernColors } from "../../data/studentGrowthData";

interface IntelligenceCardsNetworkProps {
  onCardSelect?: (intelligence: any) => void;
  selectedIntelligenceId?: string;
}

const IntelligenceCardsNetwork: React.FC<IntelligenceCardsNetworkProps> = ({
  onCardSelect,
  selectedIntelligenceId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIntelligenceForModal, setSelectedIntelligenceForModal] =
    useState<any>(null);

  const handleOverallCardPress = useCallback(() => {
    setSelectedIntelligenceForModal(overallRatingData);
    setModalVisible(true);
    onCardSelect?.(overallRatingData);
  }, [onCardSelect]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedIntelligenceForModal(null);
  }, []);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Overall Intelligence Rating</Text>
        {/* <Text style={styles.sectionSubtitle}>
          Comprehensive assessment across all intelligence areas
        </Text> */}
      </View>

      {/* Overall Rating Card - Only component shown */}
      <OverallRatingCard
        id={overallRatingData.id}
        title={overallRatingData.title}
        icon={overallRatingData.icon}
        rating={overallRatingData.rating}
        level={overallRatingData.level}
        color={overallRatingData.color}
        // description={overallRatingData.description}
        onPress={handleOverallCardPress}
      />

      {/* Intelligence Detail Modal */}
      <IntelligenceDetailModal
        visible={modalVisible}
        intelligence={selectedIntelligenceForModal}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: modernColors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 16,
    color: modernColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default React.memo(IntelligenceCardsNetwork);
