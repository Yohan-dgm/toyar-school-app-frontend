// Navigation utility for Expo Router
import { router } from "expo-router";
import { getUserCategoryName } from "../constants/userCategories";

export const handleNavigationPress = (
  tabId,
  currentScreen = "unknown",
  userCategory = null,
) => {
  console.log(
    `🚀 NAVIGATING: ${currentScreen} -> ${tabId} (userCategory: ${userCategory})`,
  );

  // Determine the base route based on user category
  const userCategoryName = userCategory
    ? getUserCategoryName(userCategory)
    : "parent";
  const baseRoute = `/authenticated/${userCategoryName}`;

  console.log(`🔄 Base route determined: ${baseRoute}`);

  try {
    switch (tabId) {
      // Parent-specific navigation
      case "activityFeed":
        console.log("✅ Navigate to Activity Feed");
        console.log(`🔄 Calling router.push('${baseRoute}/')`);
        router.push(`${baseRoute}/`);
        break;
      case "studentGrowth":
        console.log("✅ Navigate to Student Growth");
        console.log(`🔄 Calling router.push('${baseRoute}/student-growth')`);
        router.push(`${baseRoute}/student-growth`);
        break;
      case "studentProfile":
        console.log("✅ Navigate to Student Profile");
        console.log(`🔄 Calling router.push('${baseRoute}/student-profile')`);
        router.push(`${baseRoute}/student-profile`);
        break;

      // Educator-specific navigation
      case "home":
        console.log("✅ Navigate to Educator Home");
        console.log(`🔄 Calling router.push('${baseRoute}/')`);
        router.push(`${baseRoute}/`);
        break;
      case "userActions":
        console.log("✅ Navigate to User Actions");
        console.log(`🔄 Calling router.push('${baseRoute}/user-actions')`);
        router.push(`${baseRoute}/user-actions`);
        break;

      // Common navigation (works for both parent and educator)
      case "schoolCalendar":
        console.log("✅ Navigate to School Calendar");
        console.log(`🔄 Calling router.push('${baseRoute}/school-calendar')`);
        router.push(`${baseRoute}/school-calendar`);
        break;
      case "notifications":
        console.log("✅ Navigate to Notifications");
        console.log(`🔄 Calling router.push('${baseRoute}/notifications')`);
        router.push(`${baseRoute}/notifications`);
        break;

      // Principal-specific navigation
      case "dashboard":
        console.log("✅ Navigate to Dashboard");
        console.log(`🔄 Calling router.push('${baseRoute}/dashboard')`);
        router.push(`${baseRoute}/dashboard`);
        break;
      case "schoolAnalysis":
        console.log("✅ Navigate to School Analysis");
        console.log(`🔄 Calling router.push('${baseRoute}/school-analysis')`);
        router.push(`${baseRoute}/school-analysis`);
        break;
      // Legacy routes for backward compatibility (parent-specific)
      case "schoolLife":
        console.log("✅ Navigate to School Life (Legacy)");
        console.log(`🔄 Calling router.push('${baseRoute}/school-life')`);
        router.push(`${baseRoute}/school-life`);
        break;
      case "feedback":
        console.log("✅ Navigate to Educator Feedback (Legacy)");
        console.log(`🔄 Calling router.push('${baseRoute}/educator-feedback')`);
        router.push(`${baseRoute}/educator-feedback`);
        break;
      case "calendar":
        console.log("✅ Navigate to Calendar (Legacy)");
        console.log(`🔄 Calling router.push('${baseRoute}/calendar')`);
        router.push(`${baseRoute}/calendar`);
        break;
      case "academic":
        console.log("✅ Navigate to Academic Performance (Legacy)");
        console.log(`🔄 Calling router.push('${baseRoute}/academic')`);
        router.push(`${baseRoute}/academic`);
        break;
      case "performance":
        console.log("✅ Navigate to Student Performance (Legacy)");
        console.log(`🔄 Calling router.push('${baseRoute}/performance')`);
        router.push(`${baseRoute}/performance`);
        break;
      default:
        console.log(`❓ Unknown navigation target: ${tabId}`);
        console.log(
          `🔄 Available user category: ${userCategory}, base route: ${baseRoute}`,
        );
        break;
    }
  } catch (error) {
    console.error("❌ Navigation error:", error);
  }
};

// Dynamic navigation mapping based on user category
export const getNavigationRoutes = (userCategory = null) => {
  const userCategoryName = userCategory
    ? getUserCategoryName(userCategory)
    : "parent";
  const baseRoute = `/authenticated/${userCategoryName}`;

  return {
    // Parent routes
    activityFeed: `${baseRoute}/`,
    studentGrowth: `${baseRoute}/student-growth`,
    studentProfile: `${baseRoute}/student-profile`,

    // Educator routes
    home: `${baseRoute}/`,
    userActions: `${baseRoute}/user-actions`,

    // Common routes
    schoolCalendar: `${baseRoute}/school-calendar`,
    notifications: `${baseRoute}/notifications`,

    // Principal routes
    dashboard: `${baseRoute}/dashboard`,
    schoolAnalysis: `${baseRoute}/school-analysis`,

    // Legacy routes for backward compatibility
    schoolLife: `${baseRoute}/school-life`,
    feedback: `${baseRoute}/educator-feedback`,
    calendar: `${baseRoute}/calendar`,
    academic: `${baseRoute}/academic`,
    performance: `${baseRoute}/performance`,
  };
};

// Legacy export for backward compatibility
export const navigationRoutes = getNavigationRoutes();

export default handleNavigationPress;
