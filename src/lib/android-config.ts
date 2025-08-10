import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "./constants";

/**
 * Android-specific configuration and initialization
 * Handles edge-to-edge display, navigation bar, and status bar setup
 */
export class AndroidConfig {
  /**
   * Initialize Android-specific configurations
   */
  static async initialize() {
    if (Platform.OS !== "android") return;

    try {
      // Set up navigation bar
      await this.setupNavigationBar();

      // Set up status bar
      await this.setupStatusBar();

      console.log("Android configuration initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Android configuration:", error);
    }
  }

  /**
   * Setup Android navigation bar
   */
  static async setupNavigationBar(theme: "light" | "dark" = "light") {
    if (Platform.OS !== "android") return;

    try {
      // Set navigation bar style
      await NavigationBar.setButtonStyleAsync(
        theme === "dark" ? "light" : "dark",
      );

      // Set navigation bar background color
      await NavigationBar.setBackgroundColorAsync(
        theme === "dark"
          ? NAV_THEME.dark.background
          : NAV_THEME.light.background,
      );

      // Set navigation bar visibility
      await NavigationBar.setVisibilityAsync("visible");

      console.log(`Android navigation bar configured for ${theme} theme`);
    } catch (error) {
      console.error("Failed to setup Android navigation bar:", error);
    }
  }

  /**
   * Setup Android status bar
   */
  static async setupStatusBar(theme: "light" | "dark" = "light") {
    if (Platform.OS !== "android") return;

    try {
      // Configure status bar for Android
      // Note: StatusBar backgroundColor is handled in app.json for Android
      console.log(`Android status bar configured for ${theme} theme`);
    } catch (error) {
      console.error("Failed to setup Android status bar:", error);
    }
  }

  /**
   * Handle Android back button behavior
   */
  static setupBackHandler(callback?: () => boolean) {
    if (Platform.OS !== "android") return;

    const { BackHandler } = require("react-native");

    const backAction = () => {
      if (callback) {
        return callback();
      }
      return false; // Let default behavior handle it
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }

  /**
   * Get Android-specific safe area adjustments
   */
  static getSafeAreaAdjustments() {
    if (Platform.OS !== "android") {
      return { paddingTop: 0, paddingBottom: 0 };
    }

    return {
      paddingTop: 0, // Status bar handled by system
      paddingBottom: 0, // Navigation bar handled by system
    };
  }

  /**
   * Check if device supports edge-to-edge display
   */
  static supportsEdgeToEdge(): boolean {
    if (Platform.OS !== "android") return false;

    // Check Android API level (requires API 21+)
    const { Platform: RNPlatform } = require("react-native");
    return RNPlatform.Version >= 21;
  }

  /**
   * Get Android-specific keyboard behavior
   */
  static getKeyboardBehavior(): "height" | "position" | "padding" {
    return "height"; // Best for Android
  }

  /**
   * Handle Android-specific text input issues
   */
  static getTextInputProps() {
    if (Platform.OS !== "android") return {};

    return {
      underlineColorAndroid: "transparent",
      selectionColor: "#9b0737",
      textAlignVertical: "center" as const,
    };
  }

  /**
   * Get Android-specific button props
   */
  static getButtonProps() {
    if (Platform.OS !== "android") return {};

    return {
      android_ripple: {
        color: "rgba(155, 7, 55, 0.2)",
        borderless: false,
      },
    };
  }

  /**
   * Handle Android-specific font scaling
   */
  static getFontScale(): number {
    if (Platform.OS !== "android") return 1;

    const { PixelRatio } = require("react-native");
    return PixelRatio.getFontScale();
  }

  /**
   * Get Android-specific elevation/shadow props
   */
  static getElevationProps(elevation: number = 4) {
    if (Platform.OS !== "android") return {};

    return {
      elevation,
    };
  }

  /**
   * Handle Android-specific toast messages
   */
  static showToast(message: string, duration: "SHORT" | "LONG" = "SHORT") {
    if (Platform.OS !== "android") return;

    const { ToastAndroid } = require("react-native");
    ToastAndroid.show(message, ToastAndroid[duration]);
  }

  /**
   * Get Android-specific scroll view props
   */
  static getScrollViewProps() {
    if (Platform.OS !== "android") return {};

    return {
      overScrollMode: "never" as const,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
    };
  }

  /**
   * Handle Android-specific image loading
   */
  static getImageProps() {
    if (Platform.OS !== "android") return {};

    return {
      fadeDuration: 300,
      resizeMethod: "resize" as const,
    };
  }
}

/**
 * Android-specific utility functions
 */
export const AndroidUtils = {
  /**
   * Check if running on Android
   */
  isAndroid: () => Platform.OS === "android",

  /**
   * Get Android API level
   */
  getApiLevel: () => {
    if (Platform.OS !== "android") return 0;
    return Platform.Version as number;
  },

  /**
   * Check if device supports specific Android features
   */
  supportsFeature: (
    feature: "edge-to-edge" | "navigation-bar" | "status-bar",
  ) => {
    if (Platform.OS !== "android") return false;

    const apiLevel = AndroidUtils.getApiLevel();

    switch (feature) {
      case "edge-to-edge":
        return apiLevel >= 21;
      case "navigation-bar":
        return apiLevel >= 21;
      case "status-bar":
        return apiLevel >= 21;
      default:
        return false;
    }
  },

  /**
   * Get device-specific adjustments
   */
  getDeviceAdjustments: () => {
    if (Platform.OS !== "android") return {};

    const { Dimensions } = require("react-native");
    const { width, height } = Dimensions.get("window");

    return {
      isTablet: width > 768,
      screenWidth: width,
      screenHeight: height,
      aspectRatio: width / height,
    };
  },
};
