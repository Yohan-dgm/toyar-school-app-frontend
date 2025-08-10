import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../api/ApiService";
import { DeviceFingerprint } from "../../utils/security";

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
  schoolPin: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  userCategory: number;
  userCategoryName: string;
  avatar?: string;
  permissions: string[];
  preferences: UserPreferences;
  lastLoginAt: string;
  isActive: boolean;
  schoolId: string;
  schoolName: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface LoginResponse {
  success: boolean;
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  tokens: AuthTokens;
  message?: string;
}

export interface BiometricLoginData {
  userId: string;
  biometricHash: string;
  deviceId: string;
}

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  BIOMETRIC_DATA: "biometric_data",
  DEVICE_ID: "device_id",
  LAST_LOGIN: "last_login",
  AUTO_LOGIN: "auto_login",
} as const;

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;
  private tokenExpiryTime: number | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize auth service
  async initialize(): Promise<void> {
    try {
      console.log("🔐 Initializing auth service...");

      // Load stored tokens and user data
      await this.loadStoredAuth();

      // Check if tokens are valid
      if (this.accessToken && this.refreshToken) {
        const isValid = await this.validateToken();
        if (!isValid) {
          console.log("🔐 Stored tokens invalid, clearing auth");
          await this.logout();
        } else {
          console.log("✅ Auth service initialized with valid tokens");
        }
      }
    } catch (error) {
      console.error("❌ Failed to initialize auth service:", error);
      await this.logout();
    }
  }

  // Login with credentials
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("🔐 Attempting login for user:", credentials.username);

      // Generate device fingerprint
      const deviceId = await DeviceFingerprint.generate();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Device-ID": deviceId,
          },
          body: JSON.stringify({
            ...credentials,
            deviceId,
          }),
        },
      );

      const data: LoginResponse = await response.json();

      if (data.success && data.tokens) {
        // Store tokens and user data
        await this.storeAuthData(data.tokens, data.user);

        console.log("✅ Login successful for user:", data.user.username);
        return data;
      } else {
        console.log("❌ Login failed:", data.message);
        return data;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        user: {} as User,
        tokens: {} as AuthTokens,
        message: "Network error. Please check your connection.",
      };
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;

    return result;
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        console.log("❌ No refresh token available");
        return false;
      }

      console.log("🔄 Refreshing access token...");

      const deviceId = await DeviceFingerprint.generate();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Device-ID": deviceId,
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
            deviceId,
          }),
        },
      );

      const data: RefreshTokenResponse = await response.json();

      if (data.success && data.tokens) {
        // Update stored tokens
        await this.updateTokens(data.tokens);
        console.log("✅ Token refresh successful");
        return true;
      } else {
        console.log("❌ Token refresh failed:", data.message);
        await this.logout();
        return false;
      }
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      await this.logout();
      return false;
    }
  }

  // Validate current token
  private async validateToken(): Promise<boolean> {
    if (!this.accessToken) return false;

    // Check if token is expired (with 5-minute buffer)
    if (
      this.tokenExpiryTime &&
      Date.now() > this.tokenExpiryTime - 5 * 60 * 1000
    ) {
      console.log("🔄 Token expired, attempting refresh...");
      return await this.refreshAccessToken();
    }

    return true;
  }

  // Get current access token (with auto-refresh)
  async getAccessToken(): Promise<string | null> {
    if (!this.accessToken) return null;

    const isValid = await this.validateToken();
    if (!isValid) return null;

    return this.accessToken;
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.user;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      console.log("🔐 Logging out...");

      // Call logout endpoint if token exists
      if (this.accessToken) {
        try {
          await fetch(
            `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/auth/logout`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
              },
            },
          );
        } catch (error) {
          console.warn("⚠️ Failed to call logout endpoint:", error);
        }
      }

      // Clear stored data
      await this.clearAuthData();

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  }

  // Store authentication data
  private async storeAuthData(tokens: AuthTokens, user: User): Promise<void> {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.user = user;
    this.tokenExpiryTime = Date.now() + tokens.expiresIn * 1000;

    // Store in AsyncStorage
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, Date.now().toString()),
    ]);
  }

  // Update tokens only
  private async updateTokens(tokens: AuthTokens): Promise<void> {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.tokenExpiryTime = Date.now() + tokens.expiresIn * 1000;

    // Update stored tokens
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
    ]);
  }

  // Load stored authentication data
  private async loadStoredAuth(): Promise<void> {
    try {
      const [accessToken, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (accessToken && refreshToken && userData) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = JSON.parse(userData);

        console.log("🔐 Loaded stored auth for user:", this.user?.username);
      }
    } catch (error) {
      console.error("❌ Failed to load stored auth:", error);
    }
  }

  // Clear all authentication data
  private async clearAuthData(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiryTime = null;

    // Clear AsyncStorage
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_DATA),
    ]);
  }

  // Biometric authentication
  async enableBiometricLogin(biometricHash: string): Promise<boolean> {
    try {
      if (!this.user) return false;

      const deviceId = await DeviceFingerprint.generate();
      const biometricData: BiometricLoginData = {
        userId: this.user.id,
        biometricHash,
        deviceId,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.BIOMETRIC_DATA,
        JSON.stringify(biometricData),
      );
      console.log("✅ Biometric login enabled");
      return true;
    } catch (error) {
      console.error("❌ Failed to enable biometric login:", error);
      return false;
    }
  }

  async disableBiometricLogin(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_DATA);
    console.log("✅ Biometric login disabled");
  }

  async isBiometricLoginEnabled(): Promise<boolean> {
    try {
      const biometricData = await AsyncStorage.getItem(
        STORAGE_KEYS.BIOMETRIC_DATA,
      );
      return !!biometricData;
    } catch {
      return false;
    }
  }

  async loginWithBiometric(biometricHash: string): Promise<LoginResponse> {
    try {
      const storedData = await AsyncStorage.getItem(
        STORAGE_KEYS.BIOMETRIC_DATA,
      );
      if (!storedData) {
        return {
          success: false,
          user: {} as User,
          tokens: {} as AuthTokens,
          message: "Biometric login not enabled",
        };
      }

      const biometricData: BiometricLoginData = JSON.parse(storedData);
      const deviceId = await DeviceFingerprint.generate();

      if (
        biometricData.biometricHash !== biometricHash ||
        biometricData.deviceId !== deviceId
      ) {
        return {
          success: false,
          user: {} as User,
          tokens: {} as AuthTokens,
          message: "Biometric verification failed",
        };
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/auth/biometric`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Device-ID": deviceId,
          },
          body: JSON.stringify({
            userId: biometricData.userId,
            biometricHash,
            deviceId,
          }),
        },
      );

      const data: LoginResponse = await response.json();

      if (data.success && data.tokens) {
        await this.storeAuthData(data.tokens, data.user);
        console.log("✅ Biometric login successful");
      }

      return data;
    } catch (error) {
      console.error("❌ Biometric login error:", error);
      return {
        success: false,
        user: {} as User,
        tokens: {} as AuthTokens,
        message: "Biometric login failed",
      };
    }
  }

  // Auto-login functionality
  async enableAutoLogin(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTO_LOGIN, "true");
  }

  async disableAutoLogin(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTO_LOGIN);
  }

  async isAutoLoginEnabled(): Promise<boolean> {
    try {
      const autoLogin = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_LOGIN);
      return autoLogin === "true";
    } catch {
      return false;
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return { success: false, message: "Not authenticated" };
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/auth/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Change password error:", error);
      return { success: false, message: "Failed to change password" };
    }
  }

  // Forgot password
  async forgotPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      return { success: false, message: "Failed to send reset email" };
    }
  }
}

export default AuthService.getInstance();
