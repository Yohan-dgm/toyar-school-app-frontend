import React from "react";
import { View, StyleSheet } from "react-native";

const CustomSkeleton = ({ layout = [], containerStyle = {} }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {layout.map((item, index) => (
        <View
          key={item.key || index}
          style={[
            styles.skeletonItem,
            {
              width: item.width,
              height: item.height,
              marginBottom: item.marginBottom || 0,
              borderRadius: item.borderRadius || 4,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  skeletonItem: {
    backgroundColor: "#E1E9EE",
    opacity: 0.7,
  },
});

export default CustomSkeleton;
