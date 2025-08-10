import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NewsArticle } from "@/api/news-api";

const { width, height } = Dimensions.get("window");

interface NewsModalProps {
  visible: boolean;
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  visible,
  article,
  onClose,
}) => {
  if (!article) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nRead more: ${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };

  const handleReadMore = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>↗</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Hero Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  article.urlToImage ||
                  "https://via.placeholder.com/400x250?text=Education+News",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.imageGradient}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {article.category || "Education"}
              </Text>
            </View>
          </View>

          {/* Article Content */}
          <View style={styles.articleContent}>
            {/* Title */}
            <Text style={styles.title}>{article.title}</Text>

            {/* Meta Information */}
            <View style={styles.metaContainer}>
              <View style={styles.sourceContainer}>
                <Text style={styles.sourceName}>{article.source.name}</Text>
                {article.author && (
                  <Text style={styles.authorName}>by {article.author}</Text>
                )}
              </View>
              <Text style={styles.publishDate}>
                {formatDate(article.publishedAt)}
              </Text>
            </View>

            {/* Description */}
            {article.description && (
              <Text style={styles.description}>{article.description}</Text>
            )}

            {/* Content */}
            {article.content && (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>
                  {article.content.replace(/\[\+\d+ chars\]/, "")}
                </Text>
              </View>
            )}

            {/* Read More Button */}
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={handleReadMore}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#9b0737", "#dc2626"]}
                style={styles.readMoreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.readMoreText}>Read Full Article</Text>
                <Text style={styles.readMoreIcon}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Source Footer */}
            <View style={styles.sourceFooter}>
              <Text style={styles.sourceFooterText}>
                Source: {article.source.name}
              </Text>
              <Text style={styles.disclaimerText}>
                This article is from an external source and may contain
                different viewpoints.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 7, 55, 0.1)",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(155, 7, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#9b0737",
    fontWeight: "600",
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(155, 7, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 18,
    color: "#9b0737",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 250,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(155, 7, 55, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  articleContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    lineHeight: 36,
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 7, 55, 0.1)",
  },
  sourceContainer: {
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9b0737",
  },
  authorName: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  publishDate: {
    fontSize: 14,
    color: "#999999",
  },
  description: {
    fontSize: 18,
    color: "#444444",
    lineHeight: 26,
    marginBottom: 24,
    fontWeight: "500",
  },
  contentContainer: {
    marginBottom: 32,
  },
  contentText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 26,
    textAlign: "justify",
  },
  readMoreButton: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  readMoreGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  readMoreText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  readMoreIcon: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  sourceFooter: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(155, 7, 55, 0.1)",
  },
  sourceFooterText: {
    fontSize: 14,
    color: "#9b0737",
    fontWeight: "600",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#999999",
    lineHeight: 16,
    fontStyle: "italic",
  },
});
