import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";
import { TButton } from "@/components/TButton";

export default function Profile() {
  const router = useRouter();

  return (
    <View className="justify-center flex-1 p-4">
      <AppText center>Profile</AppText>
      <TButton
        onPress={() => {
          router.back();
        }}
      >
        Profile
      </TButton>
    </View>
  );
}
