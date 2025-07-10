import React, { useState, useEffect, useRef } from "react";
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
import { VideoView } from "expo-video";
import { Audio } from "expo-av";
import { WebView } from "react-native-webview";
import Icon from "@expo/vector-icons/MaterialIcons";
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
  const [audioInitialized, setAudioInitialized] = useState(false);
  const videoRef = useRef(null);

  // Initialize audio session for the app
  const initializeAudio = async () => {
    if (audioInitialized) return;

    try {
      // Temporarily disable audio initialization to avoid errors during migration
      // TODO: Re-enable after completing expo-av to expo-audio migration
      setAudioInitialized(true);
      console.log("🔊 Audio session initialization skipped during migration");
    } catch (error) {
      console.log("❌ Audio initialization error:", error);
    }
  };

  // Initialize audio when component mounts
  useEffect(() => {
    initializeAudio();
  }, []);

  // Media handlers
  const handleImagePress = (mediaData, index = 0) => {
    setSelectedMedia(mediaData);
    setCurrentImageIndex(index);
    setImageModalVisible(true);
    if (onPress) onPress(mediaData, "image");
  };

  const handleVideoPress = async (mediaData) => {
    console.log("🎬 Opening video modal for:", mediaData.uri);

    // Initialize audio session before playing video
    await initializeAudio();

    setSelectedMedia(mediaData);
    setVideoModalVisible(true);
    if (onPress) onPress(mediaData, "video");
  };

  const handlePdfPress = (mediaData) => {
    setSelectedMedia(mediaData);
    setPdfModalVisible(true);
    if (onPress) onPress(mediaData, "pdf");
  };

  // Close video modal with audio cleanup
  const closeVideoModal = async () => {
    try {
      // Temporarily disable audio cleanup during migration
      // TODO: Re-enable after completing expo-av to expo-audio migration
      console.log("🔊 Audio cleanup skipped during migration");
    } catch (error) {
      console.log("❌ Audio cleanup error:", error);
    }

    setVideoModalVisible(false);
    setSelectedMedia(null);
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
                  ? { uri: mediaItem.uri }
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
                    source={typeof image === "string" ? { uri: image } : image}
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
                    ? { uri: mediaItem.thumbnail }
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
              <Icon name="download" size={24} color="#65676B" />
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
                    source={typeof item === "string" ? { uri: item } : item}
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
              <Image
                source={
                  typeof selectedMedia?.uri === "string"
                    ? { uri: selectedMedia.uri }
                    : selectedMedia?.uri
                }
                style={styles.fullScreenImage}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  // Video Modal Component
  const renderVideoModal = () => (
    <Modal
      visible={videoModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeVideoModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeVideoModal}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.videoContainer}>
            {selectedMedia?.uri && (
              <VideoView
                ref={videoRef}
                source={{ uri: selectedMedia.uri }}
                style={styles.fullScreenVideo}
                useNativeControls={showControls}
                contentFit="contain"
                shouldPlay={true}
                isLooping={false}
                isMuted={false}
                volume={1.0}
                onLoad={() => {
                  console.log("🎵 Video loaded successfully");
                  console.log("📊 Video URI:", selectedMedia?.uri);
                }}
                onError={(error) => {
                  console.log("❌ Video error:", error);
                  console.log("❌ Video error details:", {
                    error,
                    uri: selectedMedia?.uri,
                    source: selectedMedia,
                  });
                }}
              />
            )}
          </View>
        </View>
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
                  uri: `https://docs.google.com/gview?embedded=true&toolbar=0&navpanes=0&scrollbar=0&url=${encodeURIComponent(
                    selectedMedia?.uri ||
                      "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"
                  )}`,
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
                  console.log("PDF WebView Error:", error);
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

  // Video Modal
  videoContainer: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.6,
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  fullScreenVideo: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.6,
    borderRadius: 12,
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
});

export default MediaViewer;
