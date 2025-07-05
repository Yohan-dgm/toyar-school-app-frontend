import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import type { RootState } from "@/state-store/store";
import { PostFeed } from "./PostFeed";
import { Announcements } from "./Announcements";
import { CompanyBanners } from "./CompanyBanners";
import { Navbar } from "./Navbar";
import { SnapBot } from "./SnapBot";
import { SnapBotButton } from "./SnapBotButton";
import { AndroidConfig } from "@/lib/android-config";
import { useAuth } from "@/context/AuthContext";
import { getUserListData } from "@/api/userApi";
import { theme } from "@/styles/theme";
import GroupCard from "@/components/parent/GroupCard";
import EventCard from "@/components/parent/EventCard";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  userRole: "parent" | "educator" | "student";
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userRole }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isSnapBotVisible, setIsSnapBotVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { sessionData } = useSelector((state: RootState) => state.app);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && userRole === "parent") {
        const result = await getUserListData(user.id, user.token);
        setUserData(result);
      }
    };
    fetchUserData();
  }, [user, userRole]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSnapBotOpen = () => {
    console.log("SnapBot button pressed, opening popup");
    setIsSnapBotVisible(true);
  };

  const handleSnapBotClose = () => {
    console.log("SnapBot close requested");
    setIsSnapBotVisible(false);
  };

  const getUserName = () => {
    return (
      (sessionData as any)?.user_name || (sessionData as any)?.name || "User"
    );
  };

  const getWelcomeMessage = () => {
    const name = getUserName();
    switch (userRole) {
      case "parent":
        return `Welcome back, ${name}`;
      case "educator":
        return `Good day, ${name}`;
      case "student":
        return `Hello, ${name}`;
      default:
        return `Welcome, ${name}`;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Navbar userRole={userRole} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(40, insets.bottom + 20) },
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          {...AndroidConfig.getScrollViewProps()}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>{getWelcomeMessage()}</Text>
            <Text style={styles.subheaderText}>
              {userRole === "parent" &&
                "Stay updated with your child's progress"}
              {userRole === "educator" && "Manage your classes and students"}
              {userRole === "student" &&
                "Check your latest updates and assignments"}
            </Text>
          </View>

          <View style={styles.bannerSection}>
            <CompanyBanners userRole={userRole} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📢 Announcements</Text>
            <Announcements userRole={userRole} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📰 Latest Updates</Text>
            <PostFeed userRole={userRole} />
          </View>

          {userRole === "parent" && userData && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>👥 Your Groups</Text>
                {userData.students[0]?.groups?.map((group: any) => (
                  <GroupCard
                    key={group.id}
                    name={group.name}
                    role={group.role}
                    memberCount={group.member_count}
                    actionText={group.updates}
                    actionColor={
                      group.id === 1
                        ? theme.colors.accentGreen
                        : theme.colors.accentPurple
                    }
                  />
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 Upcoming Events</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {userData.students[0]?.events?.map((event: any) => (
                    <EventCard
                      key={event.id}
                      date={event.date}
                      time={event.time}
                      title={event.title}
                      note={event.note}
                      backgroundColor={
                        event.id === 1
                          ? theme.colors.accentGreen
                          : theme.colors.accentYellow
                      }
                    />
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>

        <SnapBotButton onPress={handleSnapBotOpen} />
      </SafeAreaView>

      <SnapBot isVisible={isSnapBotVisible} onClose={handleSnapBotClose} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subheaderText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  bannerSection: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  bottomSpacing: {
    height: 80,
  },
});

export default HomeScreen;
