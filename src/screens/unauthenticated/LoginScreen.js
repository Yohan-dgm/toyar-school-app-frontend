import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import { globalStyles } from "../../styles/globalStyles";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [schoolPin, setSchoolPin] = useState("");
  const { setUser } = useAuth();

  const handleLogin = () => {
    // Simple validation
    if (!username || !password || !schoolPin) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Mock login - in real app, this would call your API
    const mockUser = {
      id: 1,
      token: "mock-token-123",
      user_type: 3, // Parent
      full_name: username,
      logo_url: null,
    };

    setUser(mockUser);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username/Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="School PIN"
        value={schoolPin}
        onChangeText={setSchoolPin}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
});

export default LoginScreen;
