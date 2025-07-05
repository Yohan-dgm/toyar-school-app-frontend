import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import { setIsAuthenticated, setSessionData } from "@/state-store/slices/app-slice";
import { theme } from "@/styles/theme";

export const TestLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestLogin = (userType: "parent" | "educator" | "student") => {
    setIsLoading(true);
    
    // Mock user data for testing
    const mockUsers = {
      parent: {
        id: 1,
        token: "mock-parent-token",
        user_type: 3,
        full_name: "John Doe (Parent)",
        logo_url: null,
        user_role: "parent"
      },
      educator: {
        id: 2,
        token: "mock-educator-token",
        user_type: 1,
        full_name: "Jane Smith (Educator)",
        logo_url: null,
        user_role: "educator"
      },
      student: {
        id: 3,
        token: "mock-student-token",
        user_type: 2,
        full_name: "Alice Johnson (Student)",
        logo_url: null,
        user_role: "student"
      }
    };

    const userData = mockUsers[userType];
    
    // Set authentication state
    dispatch(setIsAuthenticated(true));
    dispatch(setSessionData(userData));
    setUser(userData);

    console.log(`Test login as ${userType}:`, userData);

    // Navigate to appropriate screen
    setTimeout(() => {
      switch (userType) {
        case "parent":
          router.replace("/authenticated/parent");
          break;
        case "educator":
          router.replace("/authenticated/educator");
          break;
        case "student":
          router.replace("/authenticated/student");
          break;
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Login</Text>
      <Text style={styles.subtitle}>Choose a user type to test the authenticated UI</Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.parentButton]} 
        onPress={() => handleTestLogin("parent")}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Login as Parent</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.educatorButton]} 
        onPress={() => handleTestLogin("educator")}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Login as Educator</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.studentButton]} 
        onPress={() => handleTestLogin("student")}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Login as Student</Text>
      </TouchableOpacity>

      {isLoading && <Text style={styles.loadingText}>Logging in...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  parentButton: {
    backgroundColor: theme.colors.primary,
  },
  educatorButton: {
    backgroundColor: theme.colors.secondary,
  },
  studentButton: {
    backgroundColor: theme.colors.accentGreen,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.text,
  },
});
