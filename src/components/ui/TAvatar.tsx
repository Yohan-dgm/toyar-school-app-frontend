import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { TAvatarProps } from "../types";
import { theme } from "../styles/theme";

export const TAvatar: React.FC<TAvatarProps> = ({
  source,
  size = 40,
  style,
  ...props
}) => (
  <View
    style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2 },
      style,
    ]}
    {...props}
  >
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
