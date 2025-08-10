import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService, {
  LoginCredentials,
  LoginResponse,
  User,
} from "../services/auth/AuthService";
import { setToken, setUser, clearAuth } from "../state-store/slices/app-slice";
import type { RootState } from "../state-store/store";

export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message: string }>;

  // Biometric auth
  enableBiometricLogin: (biometricHash: string) => Promise<boolean>;
  disableBiometricLogin: () => Promise<void>;
  isBiometricLoginEnabled: () => Promise<boolean>;
  loginWithBiometric: (biometricHash: string) => Promise<LoginResponse>;

  // Auto-login
  enableAutoLogin: () => Promise<void>;
  disableAutoLogin: () => Promise<void>;
  isAutoLoginEnabled: () => Promise<boolean>;

  // Utilities
  clearError: () => void;
  getAccessToken: () => Promise<string | null>;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();
  const { token, sessionData } = useSelector((state: RootState) => state.app);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth service
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        await AuthService.initialize();

        // Sync with Redux store
        const user = AuthService.getUser();
        const accessToken = await AuthService.getAccessToken();

        if (user && accessToken) {
          dispatch(setUser(user));
          dispatch(setToken(accessToken));
          console.log("✅ Auth hook initialized with user:", user.username);
        }

        setInitialized(true);
      } catch (error) {
        console.error("❌ Failed to initialize auth hook:", error);
        setError("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialized) {
      initializeAuth();
    }
  }, [dispatch, initialized]);

  // Login
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await AuthService.login(credentials);

        if (response.success) {
          // Update Redux store
          dispatch(setUser(response.user));
          dispatch(setToken(response.tokens.accessToken));

          console.log("✅ Login successful in hook");
        } else {
          setError(response.message || "Login failed");
        }

        return response;
      } catch (error) {
        const errorMessage = "Login failed. Please try again.";
        setError(errorMessage);
        console.error("❌ Login error in hook:", error);

        return {
          success: false,
          user: {} as User,
          tokens: {} as any,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await AuthService.logout();

      // Clear Redux store
      dispatch(clearAuth());

      console.log("✅ Logout successful in hook");
    } catch (error) {
      console.error("❌ Logout error in hook:", error);
      setError("Logout failed");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Refresh token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const success = await AuthService.refreshAccessToken();

      if (success) {
        const newToken = await AuthService.getAccessToken();
        if (newToken) {
          dispatch(setToken(newToken));
        }
        console.log("✅ Token refresh successful in hook");
      } else {
        console.log("❌ Token refresh failed in hook");
        await logout();
      }

      return success;
    } catch (error) {
      console.error("❌ Token refresh error in hook:", error);
      await logout();
      return false;
    }
  }, [dispatch, logout]);

  // Change password
  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<{ success: boolean; message: string }> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await AuthService.changePassword(
          currentPassword,
          newPassword,
        );

        if (!result.success) {
          setError(result.message);
        }

        return result;
      } catch (error) {
        const errorMessage = "Failed to change password";
        setError(errorMessage);
        console.error("❌ Change password error in hook:", error);

        return { success: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Forgot password
  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean; message: string }> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await AuthService.forgotPassword(email);

        if (!result.success) {
          setError(result.message);
        }

        return result;
      } catch (error) {
        const errorMessage = "Failed to send reset email";
        setError(errorMessage);
        console.error("❌ Forgot password error in hook:", error);

        return { success: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Biometric authentication methods
  const enableBiometricLogin = useCallback(
    async (biometricHash: string): Promise<boolean> => {
      try {
        const result = await AuthService.enableBiometricLogin(biometricHash);
        if (!result) {
          setError("Failed to enable biometric login");
        }
        return result;
      } catch (error) {
        console.error("❌ Enable biometric login error in hook:", error);
        setError("Failed to enable biometric login");
        return false;
      }
    },
    [],
  );

  const disableBiometricLogin = useCallback(async (): Promise<void> => {
    try {
      await AuthService.disableBiometricLogin();
    } catch (error) {
      console.error("❌ Disable biometric login error in hook:", error);
      setError("Failed to disable biometric login");
    }
  }, []);

  const isBiometricLoginEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await AuthService.isBiometricLoginEnabled();
    } catch (error) {
      console.error("❌ Check biometric login error in hook:", error);
      return false;
    }
  }, []);

  const loginWithBiometric = useCallback(
    async (biometricHash: string): Promise<LoginResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await AuthService.loginWithBiometric(biometricHash);

        if (response.success) {
          // Update Redux store
          dispatch(setUser(response.user));
          dispatch(setToken(response.tokens.accessToken));

          console.log("✅ Biometric login successful in hook");
        } else {
          setError(response.message || "Biometric login failed");
        }

        return response;
      } catch (error) {
        const errorMessage = "Biometric login failed";
        setError(errorMessage);
        console.error("❌ Biometric login error in hook:", error);

        return {
          success: false,
          user: {} as User,
          tokens: {} as any,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  // Auto-login methods
  const enableAutoLogin = useCallback(async (): Promise<void> => {
    try {
      await AuthService.enableAutoLogin();
    } catch (error) {
      console.error("❌ Enable auto-login error in hook:", error);
      setError("Failed to enable auto-login");
    }
  }, []);

  const disableAutoLogin = useCallback(async (): Promise<void> => {
    try {
      await AuthService.disableAutoLogin();
    } catch (error) {
      console.error("❌ Disable auto-login error in hook:", error);
      setError("Failed to disable auto-login");
    }
  }, []);

  const isAutoLoginEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await AuthService.isAutoLoginEnabled();
    } catch (error) {
      console.error("❌ Check auto-login error in hook:", error);
      return false;
    }
  }, []);

  // Utility methods
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      return await AuthService.getAccessToken();
    } catch (error) {
      console.error("❌ Get access token error in hook:", error);
      return null;
    }
  }, []);

  // Compute derived state
  const user = AuthService.getUser();
  const isAuthenticated = AuthService.isAuthenticated();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    logout,
    refreshToken,
    changePassword,
    forgotPassword,

    // Biometric auth
    enableBiometricLogin,
    disableBiometricLogin,
    isBiometricLoginEnabled,
    loginWithBiometric,

    // Auto-login
    enableAutoLogin,
    disableAutoLogin,
    isAutoLoginEnabled,

    // Utilities
    clearError,
    getAccessToken,
  };
};
