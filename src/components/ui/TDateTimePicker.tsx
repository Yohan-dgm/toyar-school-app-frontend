import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, StyleSheet } from "react-native";
import { BaseComponentProps } from "../types";

export interface TDateTimePickerProps extends BaseComponentProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
}

export const TDateTimePicker: React.FC<TDateTimePickerProps> = ({
  value,
  onChange,
  mode = "date",
  style,
  ...props
}) => (
  <View style={style} {...props}>
    <DateTimePicker
      value={value}
      mode={mode}
      onChange={(event, selectedDate) => {
        if (selectedDate) {
          onChange(selectedDate);
        }
      }}
    />
  </View>
);
