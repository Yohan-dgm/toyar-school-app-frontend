import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";
import { TButton } from "@/components/TButton";

export default function Private() {
  const router = useRouter();

  return (
    <View className="justify-center flex-1 p-4">
      <AppText center>Private</AppText>
      <TButton
        onPress={() => {
          router.back();
        }}
      >
        Hello..
      </TButton>
    </View>
  );
}
