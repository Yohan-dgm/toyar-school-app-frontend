// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add web compatibility resolver
config.resolver.alias = {
  ...config.resolver.alias,
  "react-native": "react-native-web",
};

config.resolver.platforms = ["web", "ios", "android", "native"];

// Disable LogBox for web to avoid bundling issues
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

module.exports = withNativeWind(config, { input: "./global.css" });
