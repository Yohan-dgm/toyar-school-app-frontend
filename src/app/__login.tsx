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
  setUser as setReduxUser,
} from "@/state-store/slices/app-slice";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, LogIn } from "@/lib/icons";
import { getUserCategoryName } from "@/constants/userCategories";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  school_pin: z
    .string()
    .min(1, "School PIN is required")
    .refine((val) => {
      const validPins = ["nesixy", "school2", "school3"];
      return validPins.includes(val.toLowerCase());
    }, "Please check your school pin"),
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
      school_pin: "",
    },
  });

  // Watch form values for real-time validation feedback
  const watchedValues = watch();

  // Map school PIN to database name
  const getDbNameFromPin = (pin: string): string => {
    const pinMapping: Record<string, string> = {
      nesixy: "sms_v1",
      school2: "sms_v2",
      school3: "sms_v3",
    };
    return pinMapping[pin.toLowerCase()] || "";
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
    const dbName = getDbNameFromPin(data.school_pin);

    console.log("Submitting login data:", {
      username_or_email: data.username_or_email,
      password: "****",
      school_pin: data.school_pin,
      database: dbName,
    });

    // Use loginUserTrigger pattern as requested
    loginUserTrigger({
      username_or_email: data.username_or_email,
      password: data.password,
      database: dbName,
    })
      .unwrap()
      .then((fulfilled) => {
        console.log("Login successful:", fulfilled);

        // Extract user information from API response
        // Handle the actual API response structure
        const userData = fulfilled.data || fulfilled;

        // Create enhanced session data that includes user_category at root level
        const enhancedSessionData = {
          ...fulfilled,
          // Flatten user_category and user_role to root level for easy access
          user_category: userData.user_category,
          user_role: userData.user_role,
          // Also keep the original nested structure for backward compatibility
          data: {
            ...userData,
          },
        };

        // Clear any old cached data to ensure fresh backend data
        console.log(
          "🧹 Clearing old cached data before setting fresh session data..."
        );

        // Set authentication state with fresh backend data
        dispatch(setIsAuthenticated(true));
        dispatch(setSessionData(enhancedSessionData));

        // Store login credentials securely for refresh functionality
        const credentialsForRefresh = {
          username_or_email: data.username_or_email,
          password: data.password,
          school_pin: data.school_pin,
          database: dbName,
        };
        AsyncStorage.setItem(
          "loginCredentials",
          JSON.stringify(credentialsForRefresh)
        )
          .then(() => {
            console.log(
              "🔑 Login credentials stored for refresh functionality"
            );
          })
          .catch((error) => {
            console.error("❌ Error storing login credentials:", error);
          });

        console.log("Enhanced session data stored:", enhancedSessionData);
        console.log("🔄 Login - About to redirect after successful login");
        console.log(
          "🔄 Login - user_category in enhancedSessionData:",
          enhancedSessionData.user_category
        );
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

        // User data is automatically stored in Redux by the auth API's onQueryStarted

        // Set user data in our AuthContext (for backward compatibility)
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
        console.log("Full userData:", userData);
        console.log("user_category from userData:", userData.user_category);

        // Add a small delay for better UX
        setTimeout(() => {
          // Check if we have user_category in the response (new system)
          const userCategory = userData.user_category;

          console.log("Checking user_category:", userCategory);

          if (userCategory) {
            // New system: use user_category number to determine route
            const categoryName = getUserCategoryName(userCategory);
            console.log(
              "User category detected:",
              userCategory,
              "->",
              categoryName
            );
            console.log("Redirecting to:", `/authenticated/${categoryName}`);
            router.replace(`/authenticated/${categoryName}`);
          } else {
            console.log(
              "No user_category found, using legacy user_role system"
            );
            // Legacy system: use user_role string
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
          }
        }, 500);
      })
      .catch((rejected) => {
        console.error("Login error:", rejected);
        dispatch(setIsAuthenticated(false));
        setUser(null); // Clear user from AuthContext on error

        // Enhanced error handling with toast only
        let errorMessage = "Login failed. Please check your credentials.";

        if (rejected?.status === 401) {
          errorMessage = "Invalid credentials. Please try again.";
        } else if (rejected?.status === 429) {
          errorMessage = "Too many attempts. Please wait before trying again.";
        } else if (rejected?.status >= 500) {
          // Check for specific database schema issues
          const errorData = rejected?.error?.data || rejected?.data;
          if (
            errorData?.message &&
            errorData.message.includes("relation") &&
            errorData.message.includes("does not exist")
          ) {
            errorMessage =
              "Database setup incomplete. Contact your administrator.";
          } else if (
            errorData?.message &&
            errorData.message.includes("SQLSTATE")
          ) {
            errorMessage = "Database error. Contact your administrator.";
          } else {
            errorMessage = "Server error. Please try again later.";
          }
        } else if (rejected?.data?.message) {
          errorMessage = rejected.data.message;
        }

        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: errorMessage,
          position: "top",
          visibilityTime: 5000,
          topOffset: 60,
          props: {
            style: {
              zIndex: 9999,
            },
          },
        });
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
                      {showPassword ? (
                        <EyeOff size={20} color="#666666" />
                      ) : (
                        <Eye size={20} color="#666666" />
                      )}
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
            <Text style={styles.separatorText}>School PIN Required</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* School PIN Entry Section */}
          <View style={styles.pinSection}>
            <View style={styles.pinHeader}>
              <View style={styles.pinIconContainer}>
                <LogIn size={24} color="#8B45FF" />
              </View>
              <Text style={styles.pinTitle}>School PIN</Text>
              <Text style={styles.pinSubtitle}>
                Enter your school PIN to access your school's system
              </Text>
            </View>

            <Controller
              control={control}
              name="school_pin"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.pinInputContainer}>
                  <TInput
                    placeholder="Enter school PIN (e.g., nesixy)"
                    value={value}
                    onChangeText={(text: string) => {
                      onChange(text.toLowerCase());
                      setTimeout(() => trigger("school_pin"), 300);
                    }}
                    onBlur={onBlur}
                    error={errors.school_pin?.message}
                    style={styles.schoolPinInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {/* PIN validation feedback */}
                  <View style={styles.pinFeedback}>
                    {errors.school_pin && (
                      <Text style={styles.pinError}>
                        ❌ {errors.school_pin.message}
                      </Text>
                    )}
                    {!errors.school_pin && value && getDbNameFromPin(value) && (
                      <Text style={styles.pinSuccess}>
                        ✅ Valid school PIN!
                      </Text>
                    )}
                  </View>
                </View>
              )}
            />

            <Text style={styles.pinHint}>
              💡 Valid school PINs: nesixy, school2, school3
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
                      !errors.school_pin &&
                      watchedValues.school_pin &&
                      getDbNameFromPin(watchedValues.school_pin)
                        ? "#4CAF50"
                        : "#999",
                  },
                ]}
              >
                {!errors.school_pin &&
                watchedValues.school_pin &&
                getDbNameFromPin(watchedValues.school_pin)
                  ? "✅"
                  : "⭕"}{" "}
                School PIN
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

          {/* Debug Button - Only show in development */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => router.push("/debug-session")}
            >
              <Text style={styles.debugButtonText}>🔍 Debug Session Data</Text>
            </TouchableOpacity>
          )}
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
  schoolPinInput: {
    marginBottom: 0,
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

  debugButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  debugButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
