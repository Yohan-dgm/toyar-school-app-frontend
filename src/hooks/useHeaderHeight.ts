import { use } from "react";

import {
  HeaderShownContext,
  useHeaderHeight as useRNHeaderHeight,
} from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

const ANDROID_DEFAULT_HEADER_HEIGHT = 56;

export const useHeaderHeight = () => {
  const { top } = useSafeAreaInsets();
  const headerHeight = useRNHeaderHeight();

  if (Platform.OS === "android") {
    const parentHeaderShown = use(HeaderShownContext);
    return parentHeaderShown ? ANDROID_DEFAULT_HEADER_HEIGHT + top : 0;
  }

  return headerHeight;
};
