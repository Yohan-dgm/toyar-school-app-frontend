import "react-native-gesture-handler";
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import stateStore from "@/state-store/store";
import { SplashScreen } from "@/components/modules/SplashScreen";
import Toast from "react-native-toast-message";
import { AndroidConfig } from "@/lib/android-config";
import { AuthProvider } from "@/context/AuthContext";
import { DrawerProvider } from "@/context/DrawerContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Platform, LogBox } from "react-native";
import "../../global.css";

// Import test utils for API testing (remove in production)
if (__DEV__) {
  import("../utils/testActivityFeedAPI");
  import("../utils/testCalendarAPI");
}

// Disable LogBox for web to avoid bundling issues
if (Platform.OS === "web") {
  LogBox.ignoreAllLogs();
}

// Create persistor
const persistor = persistStore(stateStore);

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  // Load Inter fonts
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-Bold": Inter_700Bold,
  });

  // Initialize Android configuration
  useEffect(() => {
    AndroidConfig.initialize();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <DrawerProvider>
            <Provider store={stateStore}>
              <PersistGate loading={null} persistor={persistor}>
                <StatusBar style="light" />
                <SplashScreen onAnimationComplete={handleSplashComplete} />
              </PersistGate>
            </Provider>
          </DrawerProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DrawerProvider>
          <Provider store={stateStore}>
            <PersistGate loading={null} persistor={persistor}>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="public" />
                <Stack.Screen name="unauthenticated" />
                <Stack.Screen name="authenticated" />
                <Stack.Screen name="login" />
                <Stack.Screen name="private" />
                <Stack.Screen name="profile" />
              </Stack>
              <Toast />
            </PersistGate>
          </Provider>
        </DrawerProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
