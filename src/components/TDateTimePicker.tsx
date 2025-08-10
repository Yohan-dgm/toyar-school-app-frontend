import React, { useState } from "react";
import { View, Platform, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BaseComponentProps } from "./types";

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
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={style} {...props}>
      <Button title={`Pick ${mode}`} onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={value}
          mode={mode === "datetime" ? "date" : mode}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};
