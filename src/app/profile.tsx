import { View, ScrollView } from "react-native";
import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";
import { TButton } from "@/components/TButton";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";

export default function Profile() {
  const router = useRouter();
  const sessionData = useSelector((state: RootState) => state.app.sessionData);
  const user = useSelector((state: RootState) => state.app.user);

  // Debug logging to check what data is available
  console.log(
    "🔍 Profile - sessionData:",
    JSON.stringify(sessionData, null, 2),
  );
  console.log("🔍 Profile - user:", JSON.stringify(user, null, 2));

  // Try multiple data sources for user name and email
  const userName =
    sessionData?.data?.full_name ||
    sessionData?.full_name ||
    user?.full_name ||
    sessionData?.data?.username ||
    sessionData?.username ||
    user?.username ||
    "No data";

  const userEmail =
    sessionData?.data?.email || sessionData?.email || user?.email || "No data";

  // Additional debug info
  console.log("🔍 Profile - Resolved userName:", userName);
  console.log("🔍 Profile - Resolved userEmail:", userEmail);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <AppText size="heading" bold center>
            Profile
          </AppText>
        </View>

        {/* User Information */}
        <View className="space-y-6">
          {/* Full Name */}
          <View className="p-4 bg-gray-50 rounded-lg">
            <AppText size="small" color="secondary" bold>
              Full Name
            </AppText>
            <AppText size="medium">{userName}</AppText>
          </View>

          {/* Email */}
          <View className="p-4 bg-gray-50 rounded-lg">
            <AppText size="small" color="secondary" bold>
              Email
            </AppText>
            <AppText size="medium">{userEmail}</AppText>
          </View>

          {/* Phone Number */}
          <View className="p-4 bg-gray-50 rounded-lg">
            <AppText size="small" color="secondary" bold>
              Phone Number
            </AppText>
            <AppText size="medium" color="tertiary">
              No data
            </AppText>
          </View>

          {/* Address */}
          <View className="p-4 bg-gray-50 rounded-lg">
            <AppText size="small" color="secondary" bold>
              Address
            </AppText>
            <AppText size="medium" color="tertiary">
              No data
            </AppText>
          </View>
        </View>

        {/* Back Button */}
        <View className="mt-8">
          <TButton
            onPress={() => {
              router.back();
            }}
          >
            Back
          </TButton>
        </View>
      </View>
    </ScrollView>
  );
}
