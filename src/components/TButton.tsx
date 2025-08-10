import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface TButtonProps {
  title?: string;
  children?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
  size?: "default" | "sm" | "lg" | "icon";
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export function TButton({
  title,
  children,
  variant = "default",
  size = "default",
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}: TButtonProps) {
  return (
    <Button
      variant={variant === "primary" ? "default" : variant}
      size={size}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      <Text style={textStyle}>
        {loading ? "Loading..." : title || children}
      </Text>
    </Button>
  );
}
