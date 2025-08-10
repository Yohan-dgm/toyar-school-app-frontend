import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NewsArticle } from "@/api/news-api";

const { width } = Dimensions.get("window");

interface NewsCardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
  variant?: "card" | "featured" | "compact";
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onPress,
  variant = "card",
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (variant === "featured") {
    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => onPress(article)}
        activeOpacity={0.9}
      >
        <View style={styles.featuredImageContainer}>
          <Image
            source={{
              uri:
                article.urlToImage ||
                "https://via.placeholder.com/400x200?text=Education+News",
            }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.featuredGradientOverlay}
          />
          <View style={styles.featuredContent}>
            <View style={styles.featuredCategory}>
              <Text style={styles.featuredCategoryText}>
                {article.category || "Education"}
              </Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.featuredMeta}>
              {article.source.name} • {formatDate(article.publishedAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === "compact") {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => onPress(article)}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri:
              article.urlToImage ||
              "https://via.placeholder.com/80x80?text=News",
          }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.compactMeta}>
            {article.source.name} • {formatDate(article.publishedAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(article)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              article.urlToImage ||
              "https://via.placeholder.com/350x200?text=Education+News",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {article.category || "Education"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(article.description || "", 120)}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.source}>{article.source.name}</Text>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Regular Card Styles
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.05)",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(155, 7, 55, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  source: {
    fontSize: 12,
    color: "#9b0737",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#999999",
  },

  // Featured Card Styles
  featuredCard: {
    width: width - 32,
    height: 280,
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: 16,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  featuredImageContainer: {
    flex: 1,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  featuredContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredCategory: {
    backgroundColor: "rgba(155, 7, 55, 0.9)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  featuredCategoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
    lineHeight: 28,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  featuredMeta: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

  // Compact Card Styles
  compactCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.05)",
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
    lineHeight: 20,
  },
  compactMeta: {
    fontSize: 12,
    color: "#666666",
  },
});
