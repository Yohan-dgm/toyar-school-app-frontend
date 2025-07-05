import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import LoginScreen from "../screens/unauthenticated/LoginScreen";
import ParentHomeScreen from "../screens/authenticated/parent/ParentHomeScreen";
import SchoolLifeScreen from "../screens/authenticated/parent/SchoolLifeScreen";
import EmployeeHomeScreen from "../screens/authenticated/employee/EmployeeHomeScreen";
import StudentHomeScreen from "../screens/authenticated/student/StudentHomeScreen";
import ProfileScreen from "../screens/authenticated/drawer/ProfileScreen";
import PrivacyPolicyScreen from "../screens/authenticated/drawer/PrivacyPolicyScreen";
import TermsConditionsScreen from "../screens/authenticated/drawer/TermsConditionsScreen";
import SettingsScreen from "../screens/authenticated/drawer/SettingsScreen";
import DrawerContent from "../components/drawer/DrawerContent";
import { theme } from "../styles/theme";
import { Text } from "react-native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthenticatedTabNavigator = ({ user }) => {
  const HomeScreen = () => {
    switch (user.user_type) {
      case 1:
        return <EmployeeHomeScreen />;
      case 2:
        return <StudentHomeScreen />;
      case 3:
        return <ParentHomeScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.xs,
          height: 60,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={32} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SchoolLife"
        component={SchoolLifeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={32} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Performance"
        component={() => <Text>Placeholder for Performance</Text>}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" size={32} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Feedback"
        component={() => <Text>Placeholder for Feedback</Text>}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat" size={32} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Academic"
        component={() => <Text>Placeholder for Academic</Text>}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="book" size={32} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AuthenticatedDrawerNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.colors.card,
          width: 250,
        },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={() => <AuthenticatedTabNavigator user={user} />}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Drawer.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Authenticated"
            component={AuthenticatedDrawerNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
