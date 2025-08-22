import Constants from "expo-constants";

// Get API base URL from environment
const API_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL_API_SERVER_1 ||
  process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;

/**
 * Get MIME type based on file extension
 */
const getMimeType = (filename: string): string => {
  if (!filename) return "application/octet-stream";

  const extension = filename.toLowerCase().split(".").pop();

  switch (extension) {
    // Image types
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";

    // Video types
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "avi":
      return "video/avi";
    case "mov":
      return "video/quicktime";
    case "wmv":
      return "video/x-ms-wmv";

    // PDF
    case "pdf":
      return "application/pdf";

    // Default
    default:
      return "application/octet-stream";
  }
};

/**
 * Build proper media URL for activity feed media
 * Format: https://school-app.toyar.lk/get-activity-feed-media?url=/path/to/media&filename=file.ext&mime_type=type/subtype
 */
export const buildActivityFeedMediaUrl = (
  mediaPath: string,
  filename: string,
): string => {
  if (!mediaPath || !filename) {
    console.warn(
      "⚠️ buildActivityFeedMediaUrl: Missing mediaPath or filename",
      {
        mediaPath,
        filename,
      },
    );
    return "";
  }

  // Ensure base URL doesn't end with slash
  const baseUrl = API_BASE_URL?.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  if (!baseUrl) {
    console.error("❌ buildActivityFeedMediaUrl: No API base URL configured");
    return "";
  }

  // Clean up the media path to match expected format
  let cleanPath = mediaPath;

  // Remove /storage prefix if present
  if (cleanPath.startsWith("/storage/")) {
    cleanPath = cleanPath.replace("/storage/", "/");
  }

  // Remove filename from path if it's included (path should be directory only)
  if (cleanPath.includes(filename)) {
    cleanPath = cleanPath.replace("/" + filename, "");
  }

  // Remove any trailing slashes
  cleanPath = cleanPath.replace(/\/$/, "");

  // Get MIME type from filename
  const mimeType = getMimeType(filename);

  // Build the proper media URL with query parameters
  // Note: Do not URL encode the path in the url parameter, only filename and mime_type
  const mediaUrl = `${baseUrl}/get-activity-feed-media?url=${cleanPath}&filename=${encodeURIComponent(filename)}&mime_type=${encodeURIComponent(mimeType)}`;

  console.log("🔗 Built media URL:", {
    originalPath: mediaPath,
    cleanedPath: cleanPath,
    filename,
    mimeType,
    finalUrl: mediaUrl,
  });

  return mediaUrl;
};

/**
 * Build thumbnail URL for video media
 * Some video endpoints might have specific thumbnail endpoints
 */
export const buildVideoThumbnailUrl = (
  thumbnailPath: string,
  filename: string,
): string => {
  if (!thumbnailPath || !filename) {
    console.warn(
      "⚠️ buildVideoThumbnailUrl: Missing thumbnailPath or filename",
      {
        thumbnailPath,
        filename,
      },
    );
    return "";
  }

  // For now, use the same media endpoint for thumbnails
  // If backend has a separate thumbnail endpoint, modify this function
  return buildActivityFeedMediaUrl(thumbnailPath, filename);
};

/**
 * Validate if a URL is a proper media URL
 */
export const isValidMediaUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return (
      urlObj.pathname.includes("get-activity-feed-media") ||
      urlObj.href.startsWith("http://") ||
      urlObj.href.startsWith("https://")
    );
  } catch {
    return false;
  }
};

export default {
  buildActivityFeedMediaUrl,
  buildVideoThumbnailUrl,
  isValidMediaUrl,
  getMimeType,
};
