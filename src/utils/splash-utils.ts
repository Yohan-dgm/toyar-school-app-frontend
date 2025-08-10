import AsyncStorage from "@react-native-async-storage/async-storage";

// Use a unique prefix to avoid conflicts with Redux persist and other storage
const SPLASH_SHOWN_KEY = "app_splash_screen_shown";
const DEBUG_SPLASH = __DEV__; // Enable debugging in development

// In development, you can set this to true to always show splash for testing
const FORCE_SPLASH_IN_DEV = false;

/**
 * Utility functions for managing splash screen state
 */
export class SplashUtils {
  /**
   * Check if the splash screen has been shown before
   */
  static async hasShownSplash(): Promise<boolean> {
    try {
      // In development mode, optionally force splash to always show
      if (__DEV__ && FORCE_SPLASH_IN_DEV) {
        if (DEBUG_SPLASH) {
          console.log(
            `[SplashUtils] FORCE_SPLASH_IN_DEV is enabled - showing splash`,
          );
        }
        return false;
      }

      const value = await AsyncStorage.getItem(SPLASH_SHOWN_KEY);
      const hasShown = value === "true";

      if (DEBUG_SPLASH) {
        console.log(`[SplashUtils] Checking splash state:`, {
          key: SPLASH_SHOWN_KEY,
          rawValue: value,
          hasShown,
          isDevMode: __DEV__,
          forceSplashInDev: FORCE_SPLASH_IN_DEV,
        });
      }

      return hasShown;
    } catch (error) {
      console.warn("Error checking splash state:", error);
      return false;
    }
  }

  /**
   * Mark the splash screen as shown
   */
  static async markSplashAsShown(): Promise<void> {
    try {
      await AsyncStorage.setItem(SPLASH_SHOWN_KEY, "true");

      if (DEBUG_SPLASH) {
        console.log(
          `[SplashUtils] Marked splash as shown with key:`,
          SPLASH_SHOWN_KEY,
        );
      }
    } catch (error) {
      console.warn("Error marking splash as shown:", error);
    }
  }

  /**
   * Reset splash state (for testing purposes)
   * This will cause the splash to show again on next launch
   */
  static async resetSplashState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SPLASH_SHOWN_KEY);

      if (DEBUG_SPLASH) {
        console.log(
          `[SplashUtils] Splash state reset - splash will show on next launch`,
        );
      }
    } catch (error) {
      console.warn("Error resetting splash state:", error);
    }
  }

  /**
   * Force splash to show on next launch (for testing)
   */
  static async forceSplashOnNextLaunch(): Promise<void> {
    await this.resetSplashState();
  }

  /**
   * Get debug info about splash state
   */
  static async getDebugInfo(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(SPLASH_SHOWN_KEY);
      return {
        key: SPLASH_SHOWN_KEY,
        rawValue: value,
        hasShown: value === "true",
        isDevelopment: __DEV__,
        debugEnabled: DEBUG_SPLASH,
        forceSplashInDev: FORCE_SPLASH_IN_DEV,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Development utility: Log all AsyncStorage keys to debug conflicts
   */
  static async debugAllStorageKeys(): Promise<void> {
    if (!__DEV__) return;

    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(`[SplashUtils] All AsyncStorage keys:`, keys);

      // Get values for splash-related keys
      const splashKeys = keys.filter((key) => key.includes("splash"));
      if (splashKeys.length > 0) {
        const values = await AsyncStorage.multiGet(splashKeys);
        console.log(`[SplashUtils] Splash-related storage:`, values);
      }
    } catch (error) {
      console.warn("Error debugging storage keys:", error);
    }
  }
}
