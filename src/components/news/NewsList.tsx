import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NewsCard } from "./NewsCard";
import { NewsArticle, useGetEducationalNewsQuery } from "@/api/news-api";

interface NewsListProps {
  onArticlePress: (article: NewsArticle) => void;
  category?: string;
  variant?: "grid" | "list";
  showHeader?: boolean;
}

export const NewsList: React.FC<NewsListProps> = ({
  onArticlePress,
  category = "education",
  variant = "list",
  showHeader = true,
}) => {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: newsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEducationalNewsQuery({
    category,
    page,
    pageSize: 10,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (newsResponse && newsResponse.articles.length > 0) {
      setPage((prev) => prev + 1);
    }
  };

  const renderArticle = ({
    item,
    index,
  }: {
    item: NewsArticle;
    index: number;
  }) => {
    // Show first article as featured
    if (index === 0 && variant === "list") {
      return (
        <NewsCard article={item} onPress={onArticlePress} variant="featured" />
      );
    }

    // Show compact cards for variant grid or after featured article
    return (
      <NewsCard
        article={item}
        onPress={onArticlePress}
        variant={variant === "grid" ? "compact" : "card"}
      />
    );
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Educational News</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated with the latest in education
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No news articles found</Text>
      <Text style={styles.emptyDescription}>
        Check back later for the latest educational news updates.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorTitle}>Unable to load news</Text>
      <Text style={styles.errorDescription}>
        Please check your connection and try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (isLoading && page > 1) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#9b0737" />
          <Text style={styles.loadingText}>Loading more articles...</Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b0737" />
        <Text style={styles.loadingText}>Loading educational news...</Text>
      </View>
    );
  }

  if (isError) {
    return renderError();
  }

  if (!newsResponse || newsResponse.articles.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={newsResponse.articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id || item.url}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9b0737"]}
            tintColor="#9b0737"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        numColumns={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
    textAlign: "center",
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#9b0737",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
