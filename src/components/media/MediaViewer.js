import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { WebView } from "react-native-webview";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { theme } from "../../styles/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MediaViewer = ({
  media,
  onPress,
  style,
  showControls = true,
  autoPlay = false,
  customStyles = {},
}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [imageLoadError, setImageLoadError] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [useWebViewFallback, setUseWebViewFallback] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const loadingOperationRef = useRef(null);
  const currentVideoUriRef = useRef(null);

  // Get authentication token from Redux store
  const token = useSelector((state) => state.app.token);

  // Create video player without initial source to avoid race conditions
  const videoPlayer = useVideoPlayer(null, (player) => {
    if (player) {
      console.log("🎬 Video player created successfully");
      player.loop = false;
      player.muted = false;
    }
  });

  // Listen to video player events
  const { status, error } = useEvent(videoPlayer, "statusChange", {
    status: videoPlayer?.status || "idle",
    error: null,
  });

  const { isPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer?.playing || false,
  });

  // Log status changes for debugging
  React.useEffect(() => {
    console.log("🎬 Video player status changed:", status);
    if (error) {
      console.log("❌ Video player error:", error);
    }
  }, [status, error]);

  // Handle video player status changes
  useEffect(() => {
    if (selectedMedia?.type === "video") {
      console.log("📹 Video player status:", status);
      if (error) {
        console.log("❌ Video player error:", error);
        setVideoLoadError(true);
      } else if (status === "readyToPlay") {
        console.log("✅ Video ready to play");
        setVideoLoadError(false);
      } else if (status === "loading") {
        console.log("⏳ Video loading...");
        setVideoLoadError(false);
      }
    }
  }, [status, error, selectedMedia?.type]);

  // Load video source function - PRODUCTION VERSION with backend URLs
  const loadVideoSource = async (videoUri) => {
    console.log("🎬 Loading backend video:", videoUri);

    // Prevent race conditions
    if (currentVideoUriRef.current === videoUri) {
      console.log("🎬 Video already loaded:", videoUri);
      return;
    }

    // Cancel any previous loading operation
    if (loadingOperationRef.current) {
      loadingOperationRef.current.cancelled = true;
    }

    // Create new loading operation
    const loadingOperation = { cancelled: false };
    loadingOperationRef.current = loadingOperation;
    currentVideoUriRef.current = videoUri;

    setIsVideoLoading(true);
    setVideoLoadError(false);

    try {
      if (!videoPlayer) {
        throw new Error("Video player not available");
      }

      console.log("🎬 Replacing video source with backend URL...");
      console.log("🎬 Video URI:", videoUri);
      console.log("🎬 Token available:", !!token);

      // Enhanced HTTP video loading strategy

      // Enhanced loading strategy for HTTP videos
      const isHttpVideo = videoUri.startsWith("http://");
      const waitTime = isHttpVideo ? 6000 : 3000; // Longer wait for HTTP videos

      // Try direct URI first (expo-video might not support headers properly)
      try {
        console.log(
          `🎬 Attempting direct URI load (${isHttpVideo ? "HTTP" : "HTTPS"})...`,
        );
        await videoPlayer.replaceAsync(videoUri);

        // Wait longer for HTTP videos to load
        console.log(`🎬 Waiting ${waitTime}ms for video to load...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        // Check if video loaded successfully
        if (videoPlayer.status !== "error" && !loadingOperation.cancelled) {
          console.log("✅ Direct URI load successful");
          setIsVideoLoading(false);
          return;
        } else {
          throw new Error(`Video status: ${videoPlayer.status}`);
        }
      } catch (directError) {
        console.log("❌ Direct URI failed:", directError.message);

        // Try with enhanced headers as fallback
        const videoSource = {
          uri: videoUri,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                Accept: "video/*",
                "Cache-Control": "no-cache",
                "User-Agent": "SchoolApp/1.0 (Mobile)",
                Connection: "keep-alive",
              }
            : {
                Accept: "video/*",
                "Cache-Control": "no-cache",
                "User-Agent": "SchoolApp/1.0 (Mobile)",
                Connection: "keep-alive",
              },
        };

        console.log("🎬 Trying with enhanced headers:", videoSource);
        await videoPlayer.replaceAsync(videoSource);

        // Wait for headers approach
        console.log(`🎬 Waiting ${waitTime}ms for headers approach...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        if (videoPlayer.status !== "error" && !loadingOperation.cancelled) {
          console.log("✅ Enhanced headers approach successful");
        } else {
          throw new Error(
            `Headers approach failed, status: ${videoPlayer.status}`,
          );
        }
      }

      // Check if operation was cancelled
      if (loadingOperation.cancelled) {
        console.log("🎬 Video loading cancelled");
        return;
      }

      console.log("🎬 Backend video loaded successfully");
      setIsVideoLoading(false);

      // Auto-play the video
      try {
        videoPlayer.play();
        console.log("🎬 Backend video started playing");
      } catch (playError) {
        console.log(
          "⚠️ Auto-play failed (this is normal on some devices):",
          playError.message,
        );
      }
    } catch (error) {
      if (!loadingOperation.cancelled) {
        console.log("❌ Final error loading backend video:", error);
        console.log("❌ Video URI that failed:", videoUri);
        console.log("❌ Token available:", !!token);
        console.log("❌ Error details:", error.message);

        // Show error message for HTTP video loading issues
        console.log(
          "❌ Video loading failed - likely due to HTTP URL restrictions",
        );
        setVideoLoadError(true);
        setIsVideoLoading(false);
      }
    }
  };

  // Load video when selectedMedia changes - now using WebView for all videos
  useEffect(() => {
    if (
      selectedMedia?.type === "video" &&
      selectedMedia?.uri &&
      videoModalVisible
    ) {
      console.log("🌐 All videos now use WebView player directly");
      // All videos now use WebView - no need for complex loading logic
      setUseWebViewFallback(true);
      setVideoLoadError(false);
      setIsVideoLoading(false);
    }
  }, [selectedMedia?.uri, selectedMedia?.type, videoModalVisible]);

  // Reset loading state when modal is closed
  useEffect(() => {
    if (!videoModalVisible) {
      setIsVideoLoading(false);
      setVideoLoadError(false);
      setUseWebViewFallback(false);
      // Reset video error state
      currentVideoUriRef.current = null;
      // Cancel any ongoing loading operation
      if (loadingOperationRef.current) {
        loadingOperationRef.current.cancelled = true;
        loadingOperationRef.current = null;
      }
    }
  }, [videoModalVisible]);

  // Add timeout for video loading to prevent stuck loading state
  useEffect(() => {
    let loadingTimeout;

    if (isVideoLoading) {
      loadingTimeout = setTimeout(() => {
        console.log("⏰ Video loading timeout - resetting loading state");
        setIsVideoLoading(false);
        setVideoLoadError(true);
        // Cancel the loading operation
        if (loadingOperationRef.current) {
          loadingOperationRef.current.cancelled = true;
          loadingOperationRef.current = null;
        }
      }, 10000); // 10 second timeout
    }

    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [isVideoLoading]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing loading operation on unmount
      if (loadingOperationRef.current) {
        loadingOperationRef.current.cancelled = true;
        loadingOperationRef.current = null;
      }
    };
  }, []);

  // Media handlers
  const handleImagePress = (mediaData, index = 0) => {
    setSelectedMedia(mediaData);
    setCurrentImageIndex(index);
    setImageLoadError(false); // Reset error state
    setImageModalVisible(true);
    if (onPress) onPress(mediaData, "image");
  };

  const handleVideoPress = async (mediaData) => {
    console.log(
      "🎬 Opening fullscreen WebView video player for:",
      mediaData.uri,
    );
    console.log("🎬 Video media data:", mediaData);

    // Always use fullscreen WebView for all videos - no backdrop or modal overlay
    console.log("🌐 Using fullscreen WebView player directly");
    setSelectedMedia(mediaData);
    setVideoLoadError(false);
    setUseWebViewFallback(true);
    setVideoModalVisible(true); // This will show fullscreen WebView
    if (onPress) onPress(mediaData, "video");
  };

  const handlePdfPress = (mediaData) => {
    console.log("📄 Opening PDF modal for:", mediaData.uri);
    console.log("📄 PDF media data:", mediaData);
    setSelectedMedia(mediaData);
    setPdfModalVisible(true);
    if (onPress) onPress(mediaData, "pdf");
  };

  // Close video modal - Force close completely
  const closeVideoModal = () => {
    console.log("🎬 Force closing video modal completely");
    setVideoModalVisible(false);
    setSelectedMedia(null);
    setVideoLoadError(false);
    setUseWebViewFallback(false);
    setIsVideoLoading(false);
  };

  // Render different media types
  const renderMediaContent = () => {
    if (!media) return null;

    // Handle array of media items
    if (Array.isArray(media)) {
      if (media.length === 0) return null;

      // If multiple items, show them in a horizontal scroll
      if (media.length > 1) {
        return (
          <View style={styles.multipleMediaContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {media.map((item, index) => (
                <View key={index} style={styles.mediaItemWrapper}>
                  {renderSingleMediaItem(item, index)}
                </View>
              ))}
            </ScrollView>
          </View>
        );
      } else {
        // Single item, render directly
        return renderSingleMediaItem(media[0], 0);
      }
    }

    // Handle single media item (legacy support)
    return renderSingleMediaItem(media, 0);
  };

  // Render a single media item
  const renderSingleMediaItem = (mediaItem, index = 0) => {
    if (!mediaItem) return null;

    switch (mediaItem.type) {
      case "image":
        return (
          <TouchableOpacity
            onPress={() => handleImagePress(mediaItem, index)}
            style={style}
          >
            <Image
              source={
                typeof mediaItem.uri === "string"
                  ? {
                      uri: mediaItem.uri,
                      headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                    }
                  : mediaItem.uri
              }
              style={[styles.postImage, customStyles.image]}
            />
          </TouchableOpacity>
        );

      case "multiple_images":
        return (
          <View
            style={[
              styles.multipleImagesContainer,
              customStyles.multipleImages,
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mediaItem.images.map((image, imgIndex) => (
                <TouchableOpacity
                  key={imgIndex}
                  onPress={() => handleImagePress(mediaItem, imgIndex)}
                  style={styles.multipleImageWrapper}
                >
                  <Image
                    source={
                      typeof image === "string"
                        ? {
                            uri: image,
                            headers: token
                              ? { Authorization: `Bearer ${token}` }
                              : {},
                          }
                        : image
                    }
                    style={[styles.multipleImage, customStyles.multipleImage]}
                  />
                  {imgIndex === 0 && mediaItem.images.length > 1 && (
                    <View style={styles.imageCountBadge}>
                      <Text style={styles.imageCountText}>
                        +{mediaItem.images.length - 1}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case "video":
        return (
          <TouchableOpacity
            onPress={() => handleVideoPress(mediaItem)}
            style={style}
          >
            <View style={[styles.videoWrapper, customStyles.video]}>
              <Image
                source={
                  typeof mediaItem.thumbnail === "string"
                    ? {
                        uri: mediaItem.thumbnail,
                        headers: token
                          ? { Authorization: `Bearer ${token}` }
                          : {},
                      }
                    : mediaItem.thumbnail
                }
                style={styles.postImage}
              />
              <View style={styles.videoOverlay}>
                <Icon name="play-circle-filled" size={60} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
        );

      case "pdf":
        return (
          <TouchableOpacity
            onPress={() => handlePdfPress(mediaItem)}
            style={style}
          >
            <View style={[styles.pdfWrapper, customStyles.pdf]}>
              <View style={styles.pdfIcon}>
                <Icon name="picture-as-pdf" size={40} color="#FF5722" />
              </View>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfFileName}>{mediaItem.fileName}</Text>
                <Text style={styles.pdfFileSize}>{mediaItem.fileSize}</Text>
              </View>
              {/* <Icon name="download" size={24} color="#65676B" /> */}
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  // Image Modal Component
  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedMedia?.type === "multiple_images" ? (
            <FlatList
              data={selectedMedia.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={currentImageIndex}
              getItemLayout={(data, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
              renderItem={({ item, index }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      typeof item === "string"
                        ? {
                            uri: item,
                            headers: token
                              ? { Authorization: `Bearer ${token}` }
                              : {},
                          }
                        : item
                    }
                    style={styles.fullScreenImage}
                  />
                  <Text style={styles.imageCounter}>
                    {index + 1} / {selectedMedia.images.length}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={styles.imageContainer}>
              {imageLoadError ? (
                <View style={styles.errorContainer}>
                  <Icon name="broken-image" size={64} color="#666" />
                  <Text style={styles.errorText}>Unable to load image</Text>
                  <Text style={styles.errorSubText}>
                    Authentication required or file not found
                  </Text>
                </View>
              ) : (
                <Image
                  source={
                    typeof selectedMedia?.uri === "string"
                      ? {
                          uri: selectedMedia.uri,
                          headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                        }
                      : selectedMedia?.uri
                  }
                  style={styles.fullScreenImage}
                  onError={() => {
                    console.log("❌ Image load error for:", selectedMedia?.uri);
                    setImageLoadError(true);
                  }}
                  onLoad={() => {
                    console.log(
                      "✅ Image loaded successfully:",
                      selectedMedia?.uri,
                    );
                    setImageLoadError(false);
                  }}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  // Video Modal Component - Fullscreen WebView with Close Button
  const renderVideoModal = () => (
    <Modal
      visible={videoModalVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={closeVideoModal}
      onShow={() => {
        console.log("🎬 Video player is now visible");
        console.log("🎬 Selected media for video:", selectedMedia);
      }}
    >
      <View style={styles.fullscreenVideoContainer}>
        <WebView
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      background: #000;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      position: relative;
                    }
                    video {
                      width: 100%;
                      height: 100vh;
                      object-fit: contain;
                    }

                  </style>
                </head>
                <body>
                  <video controls autoplay style="width: 100%; height: 100vh;">
                    <source src="${selectedMedia?.uri}" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                </body>
              </html>
            `,
          }}
          style={styles.reducedHeightWebView}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          onShouldStartLoadWithRequest={() => true}
          onMessage={(event) => {
            console.log("🎬 WebView message received:", event.nativeEvent.data);
            if (event.nativeEvent.data === "CLOSE_VIDEO") {
              console.log(
                "🎬 WebView close button pressed - closing video player",
              );
              closeVideoModal();
            }
          }}
        />

        {/* React Native Close Button - Positioned above WebView */}
        <TouchableOpacity
          style={styles.videoCloseButton}
          onPress={() => {
            console.log(
              "🎬 React Native close button pressed - closing video player",
            );
            closeVideoModal();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.videoCloseButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // PDF Modal Component
  const renderPdfModal = () => (
    <Modal
      visible={pdfModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setPdfModalVisible(false)}
      onShow={() => {
        console.log("📄 PDF modal is now visible");
        console.log("📄 Selected media for PDF:", selectedMedia);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPdfModalVisible(false)}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.pdfContainer}>
            <View style={styles.pdfHeader}>
              <Icon name="picture-as-pdf" size={32} color="#FF5722" />
              <Text style={styles.pdfTitle}>{selectedMedia?.fileName}</Text>
              <Text style={styles.pdfSize}>{selectedMedia?.fileSize}</Text>
            </View>
            <View style={styles.pdfViewerContainer}>
              <WebView
                source={{
                  uri:
                    selectedMedia?.uri ||
                    "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                }}
                style={styles.pdfWebView}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={() => (
                  <View style={styles.pdfLoadingContainer}>
                    <Icon name="picture-as-pdf" size={48} color="#FF5722" />
                    <Text style={styles.pdfLoadingText}>Loading PDF...</Text>
                  </View>
                )}
                onError={(error) => {
                  console.log("❌ PDF WebView Error:", error);
                  console.log("❌ PDF URI:", selectedMedia?.uri);
                }}
                onLoad={() => {
                  console.log(
                    "✅ PDF loaded successfully:",
                    selectedMedia?.uri,
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View>
      {renderMediaContent()}
      {renderImageModal()}
      {renderVideoModal()}
      {renderPdfModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  // Media Content Styles
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },

  multipleImagesContainer: {
    marginVertical: 8,
  },

  multipleImageWrapper: {
    marginRight: 8,
    position: "relative",
  },

  multipleImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },

  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  imageCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  videoWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },

  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  pdfWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },

  pdfIcon: {
    marginRight: 12,
  },

  pdfInfo: {
    flex: 1,
  },

  pdfFileName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },

  pdfFileSize: {
    fontSize: 14,
    color: "#8E8E93",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },

  // Image Modal
  imageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenImage: {
    width: screenWidth - 40,
    height: screenHeight - 200,
    resizeMode: "contain",
  },

  imageCounter: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "600",
  },

  // Video Modal - Fullscreen WebView
  fullscreenVideoContainer: {
    flex: 1,
    backgroundColor: "#000000",
    position: "relative",
  },

  fullscreenWebView: {
    flex: 1,
    backgroundColor: "#000000",
  },

  // PDF Modal
  pdfContainer: {
    width: screenWidth - 40,
    height: screenHeight - 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },

  pdfHeader: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },

  pdfTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },

  // Multiple media container styles
  multipleMediaContainer: {
    marginVertical: 8,
  },

  mediaItemWrapper: {
    marginRight: 8,
    width: 200, // Fixed width for consistent display
  },

  pdfSize: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },

  pdfViewerContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  pdfWebView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  pdfLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },

  pdfLoadingText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
  },

  // Loading container styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9b0737",
    marginTop: 16,
    textAlign: "center",
  },

  loadingSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },

  // Error container styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },

  errorSubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },

  retryButton: {
    backgroundColor: "#9b0737",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },

  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // Video Controls
  videoControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  controlButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 10,
    marginHorizontal: 10,
  },

  // WebView Fallback Styles
  webViewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  webViewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  webViewHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },

  webViewBadge: {
    backgroundColor: "#9b0737",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  webViewBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  webView: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Reduced height WebView for video player to show React Native close button
  reducedHeightWebView: {
    flex: 1,
    backgroundColor: "#000",
    marginTop: 80, // Leave space for close button
  },

  // Video close button styles
  videoCloseButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },

  videoCloseButtonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MediaViewer;
