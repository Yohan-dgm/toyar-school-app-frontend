// Navigation utility for Expo Router
import { router } from "expo-router";

export const handleNavigationPress = (tabId, currentScreen = "unknown") => {
  console.log(`🚀 NAVIGATING: ${currentScreen} -> ${tabId}`);

  try {
    switch (tabId) {
      case "schoolLife":
        console.log("✅ Navigate to School Life");
        console.log(
          "🔄 Calling router.push('/authenticated/parent/school-life')"
        );
        router.push("/authenticated/parent/school-life");
        break;
      case "feedback":
        console.log("✅ Navigate to Educator Feedback");
        console.log(
          "🔄 Calling router.push('/authenticated/parent/educator-feedback')"
        );
        router.push("/authenticated/parent/educator-feedback");
        break;
      case "calendar":
        console.log("✅ Navigate to Calendar");
        console.log("🔄 Calling router.push('/authenticated/parent/calendar')");
        router.push("/authenticated/parent/calendar");
        break;
      case "academic":
        console.log("✅ Navigate to Academic Performance");
        console.log("🔄 Calling router.push('/authenticated/parent/academic')");
        router.push("/authenticated/parent/academic");
        break;
      case "performance":
        console.log("✅ Navigate to Student Performance");
        console.log(
          "🔄 Calling router.push('/authenticated/parent/performance')"
        );
        router.push("/authenticated/parent/performance");
        break;
      default:
        console.log(`❓ Unknown navigation target: ${tabId}`);
        break;
    }
  } catch (error) {
    console.error("❌ Navigation error:", error);
  }
};

// Navigation mapping for future implementation
export const navigationRoutes = {
  schoolLife: "/authenticated/parent/school-life",
  feedback: "/authenticated/parent/educator-feedback",
  calendar: "/authenticated/parent/calendar",
  academic: "/authenticated/parent/academic",
  performance: "/authenticated/parent/performance",
};

export default handleNavigationPress;
