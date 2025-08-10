import React from "react";
import { View } from "react-native";
import { TListProps } from "../types";

export function TList<T>({ data, renderItem, style, ...props }: TListProps<T>) {
  return (
    <View style={style} {...props}>
      {data.map((item, idx) => renderItem(item, idx))}
    </View>
  );
}
