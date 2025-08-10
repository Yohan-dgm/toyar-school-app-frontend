import { SplashUtils } from "./splash-utils";

/**
 * Debug utilities for splash screen development
 * These functions help test the splash screen behavior
 */
export class SplashDebug {
  /**
   * Reset splash and reload app to test first-time experience
   * Call this from React Native Debugger console or dev tools
   */
  static async testFirstLaunch() {
    console.log(
      "🧪 [SplashDebug] Resetting splash state to test first launch...",
    );
    await SplashUtils.resetSplashState();

    const debugInfo = await SplashUtils.getDebugInfo();
    console.log("🧪 [SplashDebug] Current state after reset:", debugInfo);

    console.log("🧪 [SplashDebug] Reload the app to see splash screen");
  }

  /**
   * Mark splash as shown to test subsequent launches
   */
  static async testSubsequentLaunch() {
    console.log(
      "🧪 [SplashDebug] Marking splash as shown to test subsequent launch...",
    );
    await SplashUtils.markSplashAsShown();

    const debugInfo = await SplashUtils.getDebugInfo();
    console.log("🧪 [SplashDebug] Current state after marking:", debugInfo);

    console.log(
      "🧪 [SplashDebug] Reload the app - it should go directly to main app",
    );
  }

  /**
   * Show current splash state and all relevant debug info
   */
  static async showDebugInfo() {
    console.log("🧪 [SplashDebug] Current splash debug information:");

    const debugInfo = await SplashUtils.getDebugInfo();
    console.table(debugInfo);

    await SplashUtils.debugAllStorageKeys();
  }

  /**
   * Test the complete splash flow
   */
  static async testCompleteFlow() {
    console.log("🧪 [SplashDebug] Testing complete splash flow...");

    // Step 1: Reset and show first launch state
    await SplashUtils.resetSplashState();
    const firstState = await SplashUtils.hasShownSplash();
    console.log("🧪 Step 1 - First launch check:", {
      shouldShowSplash: !firstState,
    });

    // Step 2: Mark as shown
    await SplashUtils.markSplashAsShown();

    // Step 3: Check subsequent launch state
    const secondState = await SplashUtils.hasShownSplash();
    console.log("🧪 Step 3 - Subsequent launch check:", {
      shouldShowSplash: !secondState,
    });

    console.log(
      "🧪 [SplashDebug] Test complete. Expected: first=true, second=false",
    );
  }
}

// Make it available globally in development
if (__DEV__) {
  (global as any).SplashDebug = SplashDebug;
  console.log("🧪 SplashDebug utilities available globally:");
  console.log("   SplashDebug.testFirstLaunch()");
  console.log("   SplashDebug.testSubsequentLaunch()");
  console.log("   SplashDebug.showDebugInfo()");
  console.log("   SplashDebug.testCompleteFlow()");
}
