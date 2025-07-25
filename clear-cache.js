#!/usr/bin/env node

/**
 * Clear Cache Script
 * This script helps clear various caches that might contain old test data
 */

console.log("🧹 Cache Clearing Instructions");
console.log("==============================");
console.log("");
console.log("To clear all cached data and start fresh:");
console.log("");
console.log("1. 🛑 Stop the development server (Ctrl+C)");
console.log("2. 📦 Clear Metro cache: yarn start --clear");
console.log("3. 📱 Clear app data on your device/simulator:");
console.log("   - iOS Simulator: Device > Erase All Content and Settings");
console.log(
  "   - Android Emulator: Settings > Apps > [Your App] > Storage > Clear Data"
);
console.log("   - Physical device: Uninstall and reinstall the app");
console.log("4. 🔐 Login again with your real backend credentials");
console.log("");
console.log("This will ensure you get fresh data from your backend API.");
console.log("");
console.log(
  "🔧 Alternative: Add this to your login component to clear persisted data:"
);
console.log('   await AsyncStorage.removeItem("persist:root");');
