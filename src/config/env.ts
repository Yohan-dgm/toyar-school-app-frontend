// Environment configuration using Expo's built-in environment variables
// This approach is more reliable than react-native-dotenv

export const ENV_CONFIG = {
  // OpenRouter API Configuration (for DeepSeek model)
  OPENROUTER_API_KEY:
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ||
    "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",
  OPENROUTER_BASE_URL:
    process.env.EXPO_PUBLIC_OPENROUTER_BASE_URL ||
    "https://openrouter.ai/api/v1",
  DEEPSEEK_MODEL:
    process.env.EXPO_PUBLIC_DEEPSEEK_MODEL || "deepseek/deepseek-r1-0528",
  SITE_URL: process.env.EXPO_PUBLIC_SITE_URL || "https://schoolsnap.app",
  SITE_NAME: process.env.EXPO_PUBLIC_SITE_NAME || "SchoolSnap SnapBot",

  // Security Configuration
  APP_SECRET:
    process.env.EXPO_PUBLIC_APP_SECRET ||
    "SnapBot2024SecureKey!@#$%^&*()_+1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  RATE_LIMIT_REQUESTS: parseInt(
    process.env.EXPO_PUBLIC_RATE_LIMIT_REQUESTS || "10"
  ),
  RATE_LIMIT_WINDOW: parseInt(
    process.env.EXPO_PUBLIC_RATE_LIMIT_WINDOW || "60000"
  ),

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Base URL for existing API
  BASE_URL_API_SERVER:
    process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 || "http://192.168.1.14:9999",
};

// Type definitions for better TypeScript support
export type EnvConfig = typeof ENV_CONFIG;

// Validation function to ensure required environment variables are set
export const validateEnvConfig = (): void => {
  const requiredVars = [
    "OPENROUTER_API_KEY",
    "OPENROUTER_BASE_URL",
    "DEEPSEEK_MODEL",
    "APP_SECRET",
  ];

  const missingVars = requiredVars.filter((varName) => {
    const value = ENV_CONFIG[varName as keyof typeof ENV_CONFIG];
    return !value || value === "";
  });

  if (missingVars.length > 0) {
    console.warn("Missing required environment variables:", missingVars);
    if (__DEV__) {
      console.warn(
        "Using default values for development. Please set proper values for production."
      );
    }
  }
};

// Initialize validation
validateEnvConfig();
