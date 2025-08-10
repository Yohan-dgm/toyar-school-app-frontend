import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface CompanyBannersProps {
  userRole: "parent" | "educator" | "student";
}

export const CompanyBanners: React.FC<CompanyBannersProps> = ({ userRole }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock data - replace with actual API call
  const getMockBanners = (): Banner[] => {
    const baseBanners = [
      {
        id: "1",
        title: "Welcome to School App",
        subtitle: "Your complete school management solution",
        backgroundColor: "#9b0737",
        textColor: "#ffffff",
        action: {
          label: "Learn More",
          onPress: () => console.log("Learn more pressed"),
        },
      },
      {
        id: "2",
        title: "New Features Available",
        subtitle: "Check out our latest updates and improvements",
        backgroundColor: "#4ECDC4",
        textColor: "#ffffff",
        action: {
          label: "Explore",
          onPress: () => console.log("Explore pressed"),
        },
      },
    ];

    // Add role-specific banners
    if (userRole === "parent") {
      baseBanners.push({
        id: "parent-1",
        title: "Track Your Child's Progress",
        subtitle: "Real-time updates on grades and attendance",
        backgroundColor: "#FF6B6B",
        textColor: "#ffffff",
        action: {
          label: "View Progress",
          onPress: () => console.log("View progress pressed"),
        },
      });
    }

    if (userRole === "educator") {
      baseBanners.push({
        id: "edu-1",
        title: "Manage Your Classes",
        subtitle: "Streamline your teaching workflow",
        backgroundColor: "#FFD93D",
        textColor: "#1a1a1a",
        action: {
          label: "Go to Classes",
          onPress: () => console.log("Go to classes pressed"),
        },
      });
    }

    if (userRole === "student") {
      baseBanners.push({
        id: "stu-1",
        title: "Your Assignments",
        subtitle: "Stay on top of your homework and projects",
        backgroundColor: "#6BCF7F",
        textColor: "#ffffff",
        action: {
          label: "View Assignments",
          onPress: () => console.log("View assignments pressed"),
        },
      });
    }

    return baseBanners;
  };

  const banners = getMockBanners();

  const renderBanner = ({ item }: { item: Banner }) => (
    <View
      style={[
        styles.bannerContainer,
        { backgroundColor: item.backgroundColor },
      ]}
    >
      <View style={styles.bannerContent}>
        <View style={styles.textContainer}>
          <Text style={[styles.bannerTitle, { color: item.textColor }]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.bannerSubtitle,
              { color: item.textColor, opacity: 0.9 },
            ]}
          >
            {item.subtitle}
          </Text>
        </View>

        {item.action && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  item.textColor === "#ffffff"
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.1)",
                borderColor: item.textColor,
              },
            ]}
            onPress={item.action.onPress}
          >
            <Text style={[styles.actionText, { color: item.textColor }]}>
              {item.action.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeContainer}>
        <View
          style={[
            styles.decorativeCircle,
            { backgroundColor: `${item.textColor}20` },
          ]}
        />
        <View
          style={[
            styles.decorativeCircle2,
            { backgroundColor: `${item.textColor}15` },
          ]}
        />
      </View>
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const renderPaginationDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.paginationDot,
        index === currentIndex && styles.activePaginationDot,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => renderPaginationDot(index))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  bannerContainer: {
    width: width,
    height: 160,
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "relative",
    overflow: "hidden",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "space-between",
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 28,
  },
  bannerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  decorativeCircle: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -60,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: "#8B45FF",
    width: 20,
  },
});

export default CompanyBanners;
