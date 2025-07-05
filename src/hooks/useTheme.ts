import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../constants/theme";

export default function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
