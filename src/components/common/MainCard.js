import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

const { width } = Dimensions.get("window");

const MainCard = ({
  title,
  subtitle,
  buttonText,
  onPress,
  backgroundImage,
  gradientColors = ["#FF9A8B", "#A8E6CF"],
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.textSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <TouchableOpacity style={styles.button} onPress={onPress}>
              <MaterialIcons name="analytics" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>

          {backgroundImage && (
            <View style={styles.imageSection}>
              <Image source={backgroundImage} style={styles.backgroundImage} />
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const CategoryTabs = ({ categories, activeCategory, onCategoryPress }) => {
  return (
    <View style={styles.tabsContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.tab,
            activeCategory === category.id && styles.activeTab,
          ]}
          onPress={() => onCategoryPress(category.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeCategory === category.id && styles.activeTabText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ProductCard = ({ title, subtitle, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      <Image source={image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  card: {
    borderRadius: 20,
    padding: theme.spacing.lg,
    minHeight: 160,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: theme.spacing.xs,
  },
  imageSection: {
    width: 100,
    height: 100,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  tab: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 25,
    marginRight: theme.spacing.sm,
    backgroundColor: "#F5F5F5",
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
    width: (width - 60) / 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
  },
  productInfo: {
    alignItems: "flex-start",
  },
  productTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  productSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
  },
});

export { MainCard, CategoryTabs, ProductCard };
