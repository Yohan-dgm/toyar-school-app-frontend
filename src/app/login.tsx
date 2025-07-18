import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TButton } from "@/components/TButton";
import { TInput } from "@/components/TInput";
import { TOtpInput } from "@/components/TOtpInput";

import { authApi } from "@/api/auth-api";
import {
  setIsAuthenticated,
  setSessionData,
} from "@/state-store/slices/app-slice";
import { useAuth } from "@/context/AuthContext";
import { Settings, LogIn } from "@/lib/icons";

// Enhanced login form validation schema
const loginSchema = z.object({
  username_or_email: z
    .string()
    .min(1, "Username or email is required")
    .refine((val) => {
      // Check if it's a valid email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
      return emailRegex.test(val) || usernameRegex.test(val);
    }, "Please enter a valid email or username"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
    .refine((val) => val.trim().length > 0, "Password cannot be empty"),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 characters")
    .max(6, "PIN must be at most 6 characters")
    .regex(/^[A-Z0-9]+$/, "PIN must contain only letters and numbers")
    .refine((val) => {
      // Check for common weak PINs (both numeric and alphanumeric)
      const weakPins = [
        "0000",
        "1111",
        "2222",
        "3333",
        "4444",
        "5555",
        "6666",
        "7777",
        "8888",
        "9999",
        "1234",
        "4321",
        "0123",
        "AAAA",
        "BBBB",
        "CCCC",
        "ABCD",
        "QWER",
        "ASDF",
        "ZXCV",
      ];
      return !weakPins.includes(val.toUpperCase());
    }, "Please use a more secure PIN (avoid sequential or repeated characters)"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setUser } = useAuth();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // RTK Query mutation using trigger pattern
  const [loginUserTrigger, loginUserState] =
    authApi.endpoints.loginUser.useMutation();

  // Form setup with enhanced validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on change for real-time feedback
    reValidateMode: "onChange",
    defaultValues: {
      username_or_email: "",
      password: "",
      pin: "",
    },
  });

  // Watch form values for real-time validation feedback
  const watchedValues = watch();

  // Validate PIN in real-time
  const validatePinRealTime = (pinValue: string) => {
    if (pinValue.length >= 4) {
      trigger("pin"); // Trigger validation when PIN has minimum length
    }
  };

  // Enhanced login submission with validation and error handling using trigger pattern
  const onSubmit = async (data: LoginFormData) => {
    // Pre-submission validation
    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Validation Error ⚠️",
        text2: "Please fix all errors before submitting.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);
    console.log("Submitting login data:", {
      username_or_email: data.username_or_email,
      password: "****",
      pin: data.pin, // Show actual PIN value for debugging
      pin_length: data.pin.length,
    });

    // Use loginUserTrigger pattern as requested
    loginUserTrigger({
      pin: data.pin,
      username_or_email: data.username_or_email,
      password: data.password,
    })
      .unwrap()
      .then((fulfilled) => {
        console.log("Login successful:", fulfilled);

        // Set authentication state
        dispatch(setIsAuthenticated(true));
        dispatch(setSessionData(fulfilled));

        // Extract user information from API response
        // Handle the actual API response structure
        const userData = fulfilled.data || fulfilled;
        const userTypeList = userData.user_type_list || [];

        // Determine user role from user_type_list
        let userRole = "parent"; // default
        if (userTypeList.some((type: any) => type.name === "Educator")) {
          userRole = "educator";
        } else if (userTypeList.some((type: any) => type.name === "Student")) {
          userRole = "student";
        } else if (userTypeList.some((type: any) => type.name === "Parent")) {
          userRole = "parent";
        }

        const userName =
          userData.full_name || userData.username || data.username_or_email;
        const userId = userData.id || 1;
        const userType =
          userRole === "parent"
            ? 3
            : userRole === "educator"
              ? 1
              : userRole === "student"
                ? 2
                : 3;

        // Set user data in our AuthContext
        const userContextData = {
          id: userId,
          token:
            userData.token ||
            fulfilled.access_token ||
            fulfilled.token ||
            "mock-token",
          user_type: userType,
          full_name: userName,
          logo_url: fulfilled.logo_url || null,
        };

        setUser(userContextData);
        console.log("User data set in AuthContext:", userContextData);

        Toast.show({
          type: "success",
          text1: "Login Successful! 🎉",
          text2: "Welcome back to SchoolSnap",
          position: "top",
          visibilityTime: 3000,
        });

        console.log("User role detected:", userRole);

        // Add a small delay for better UX
        setTimeout(() => {
          switch (userRole) {
            case "parent":
              router.replace("/authenticated/parent");
              break;
            case "educator":
              router.replace("/authenticated/educator");
              break;
            case "student":
              router.replace("/authenticated/student");
              break;
            default:
              router.replace("/authenticated/parent"); // Default fallback
          }
        }, 500);
      })
      .catch((rejected) => {
        console.error("Login error:", rejected);
        dispatch(setIsAuthenticated(false));
        setUser(null); // Clear user from AuthContext on error

        // Enhanced error handling
        let errorMessage = "Login failed. Please try again.";

        if (rejected?.data?.message) {
          errorMessage = rejected.data.message;
        } else if (rejected?.message) {
          errorMessage = rejected.message;
        } else if (rejected?.status === 401) {
          errorMessage =
            "Invalid credentials or PIN. Please check your information.";
        } else if (rejected?.status === 429) {
          errorMessage =
            "Too many login attempts. Please wait before trying again.";
        } else if (rejected?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }

        Alert.alert("Login Failed", errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Effects */}
      <View style={styles.backgroundEffects}>
        <View style={styles.gradientCircle1} />
        <View style={styles.gradientCircle2} />
        <View style={styles.patternOverlay} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Image
            source={require("@/assets/SchooSnap_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username or Email</Text>
            <Controller
              control={control}
              name="username_or_email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TInput
                    placeholder="Enter your username or email"
                    value={value}
                    onChangeText={(text: string) => {
                      onChange(text);
                      // Trigger validation after user stops typing
                      setTimeout(() => trigger("username_or_email"), 300);
                    }}
                    onBlur={onBlur}
                    error={errors.username_or_email?.message}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {/* Real-time validation feedback */}
                  {touchedFields.username_or_email &&
                    !errors.username_or_email &&
                    value.length > 0 && (
                      <Text style={styles.validationSuccess}>
                        ✅ Valid input
                      </Text>
                    )}
                </View>
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.passwordContainer}>
                    <TInput
                      placeholder="Enter your password"
                      value={value}
                      onChangeText={(text: string) => {
                        onChange(text);
                        // Trigger validation after user stops typing
                        setTimeout(() => trigger("password"), 300);
                      }}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      error={errors.password?.message}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Settings size={20} color="#666666" />
                    </TouchableOpacity>
                  </View>
                  {/* Password strength indicator */}
                  {value.length > 0 && (
                    <View style={styles.passwordStrength}>
                      <Text style={styles.passwordStrengthLabel}>
                        Password strength:
                      </Text>
                      <View style={styles.passwordStrengthBar}>
                        <View
                          style={[
                            styles.passwordStrengthFill,
                            {
                              width: `${Math.min((value.length / 8) * 100, 100)}%`,
                              backgroundColor:
                                value.length < 6
                                  ? "#FF3B30"
                                  : value.length < 8
                                    ? "#FF9800"
                                    : "#4CAF50",
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.passwordStrengthText}>
                        {value.length < 6
                          ? "Weak"
                          : value.length < 8
                            ? "Good"
                            : "Strong"}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          {/* Separator */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Security PIN Required</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* PIN Entry Section */}
          <View style={styles.pinSection}>
            <View style={styles.pinHeader}>
              <View style={styles.pinIconContainer}>
                <LogIn size={24} color="#8B45FF" />
              </View>
              <Text style={styles.pinTitle}>Security PIN</Text>
              <Text style={styles.pinSubtitle}>
                Enter your 4-6 digit security PIN to complete login
              </Text>
            </View>

            <Controller
              control={control}
              name="pin"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pinInputContainer}>
                  <TOtpInput
                    value={value}
                    onChange={(newValue) => {
                      // Allow alphanumeric input (letters and numbers)
                      const alphanumericValue = newValue
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .toUpperCase();
                      onChange(alphanumericValue);
                      validatePinRealTime(alphanumericValue);
                    }}
                    length={6}
                    style={styles.otpInput}
                  />

                  {/* PIN validation feedback */}
                  <View style={styles.pinFeedback}>
                    {errors.pin && (
                      <Text style={styles.pinError}>
                        ❌ {errors.pin.message}
                      </Text>
                    )}
                    {!errors.pin && value.length >= 4 && (
                      <Text style={styles.pinSuccess}>✅ PIN looks good!</Text>
                    )}
                    {value.length > 0 && value.length < 4 && (
                      <Text style={styles.pinWarning}>
                        ⚠️ PIN must be at least 4 characters
                      </Text>
                    )}
                  </View>

                  {/* PIN strength indicator */}
                  <View style={styles.pinStrengthContainer}>
                    <Text style={styles.pinStrengthLabel}>PIN Length:</Text>
                    <View style={styles.pinStrengthBar}>
                      {[...Array(6)].map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.pinStrengthDot,
                            {
                              backgroundColor:
                                index < value.length
                                  ? value.length >= 4
                                    ? "#4CAF50"
                                    : "#FF9800"
                                  : "#E0E0E0",
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.pinStrengthText}>{value.length}/6</Text>
                  </View>
                </View>
              )}
            />

            <Text style={styles.pinHint}>
              💡 Your PIN can contain letters and numbers (4-6 characters)
            </Text>
          </View>

          {/* Form validation summary */}
          <View style={styles.validationSummary}>
            <Text style={styles.validationSummaryTitle}>Form Status:</Text>
            <View style={styles.validationItems}>
              <Text
                style={[
                  styles.validationItem,
                  {
                    color:
                      !errors.username_or_email &&
                      watchedValues.username_or_email
                        ? "#4CAF50"
                        : "#999",
                  },
                ]}
              >
                {!errors.username_or_email && watchedValues.username_or_email
                  ? "✅"
                  : "⭕"}{" "}
                Username/Email
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  {
                    color:
                      !errors.password && watchedValues.password
                        ? "#4CAF50"
                        : "#999",
                  },
                ]}
              >
                {!errors.password && watchedValues.password ? "✅" : "⭕"}{" "}
                Password
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  {
                    color:
                      !errors.pin &&
                      watchedValues.pin &&
                      watchedValues.pin.length >= 4
                        ? "#4CAF50"
                        : "#999",
                  },
                ]}
              >
                {!errors.pin &&
                watchedValues.pin &&
                watchedValues.pin.length >= 4
                  ? "✅"
                  : "⭕"}{" "}
                Security PIN
              </Text>
            </View>
          </View>

          <TButton
            title={
              isLoading
                ? "🔐 Signing In..."
                : isValid
                  ? "🔐 Sign In Securely"
                  : "⚠️ Complete Form to Continue"
            }
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading || !isValid}
            style={[
              styles.loginButton,
              {
                backgroundColor: isValid ? "#8B45FF" : "#CCCCCC",
                opacity: isValid ? 1 : 0.7,
              },
            ]}
            textStyle={styles.buttonText}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble? Contact your school administrator for assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  backgroundEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradientCircle1: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(139, 69, 255, 0.12)",
  },
  gradientCircle2: {
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 107, 107, 0.08)",
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 0,
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: "#8B45FF",
    fontWeight: "500",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    paddingVertical: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    marginHorizontal: -10,
    paddingHorizontal: 30,
    shadowColor: "#8B45FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    padding: 5,
  },

  loginButton: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#9b0737",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  pinSection: {
    backgroundColor: "rgba(155, 7, 55, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.1)",
  },
  pinHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  pinIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(139, 69, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pinTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  pinSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  pinInputContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  otpInput: {
    marginBottom: 8,
  },
  pinError: {
    color: "#FF3B30",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  pinFeedback: {
    marginTop: 8,
    marginBottom: 12,
    minHeight: 20,
  },
  pinSuccess: {
    color: "#4CAF50",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  pinWarning: {
    color: "#FF9800",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  pinStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  pinStrengthLabel: {
    fontSize: 11,
    color: "#666666",
    marginRight: 8,
  },
  pinStrengthBar: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  pinStrengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  pinStrengthText: {
    fontSize: 11,
    color: "#666666",
    marginLeft: 8,
  },
  validationSuccess: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  passwordStrength: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  passwordStrengthLabel: {
    fontSize: 11,
    color: "#666666",
    marginRight: 8,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 11,
    fontWeight: "500",
    minWidth: 40,
  },
  validationSummary: {
    backgroundColor: "rgba(155, 7, 55, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.1)",
  },
  validationSummaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  validationItems: {
    gap: 4,
  },
  validationItem: {
    fontSize: 12,
    fontWeight: "500",
  },
  pinHint: {
    fontSize: 12,
    color: "#9b0737",
    textAlign: "center",
    fontStyle: "italic",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(139, 69, 255, 0.2)",
  },
  separatorText: {
    marginHorizontal: 15,
    fontSize: 12,
    color: "#8B45FF",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    lineHeight: 20,
  },
});
