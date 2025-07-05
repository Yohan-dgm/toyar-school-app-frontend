export interface BaseComponentProps {
  testID?: string;
  style?: any;
  disabled?: boolean;
}

export interface TButtonProps extends BaseComponentProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "icon" | "loading";
  onPress: () => void;
  icon?: string;
  loading?: boolean;
  rippleEffect?: boolean;
}

export interface TInputFieldProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: "default" | "password" | "floating";
  error?: string;
  success?: boolean;
  secureTextEntry?: boolean;
}

export interface TRadioButtonProps extends BaseComponentProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
}

export interface TCheckboxProps extends BaseComponentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export interface TProgressBarProps extends BaseComponentProps {
  progress: number; // 0 to 1
  color?: string;
}

export interface TCardProps extends BaseComponentProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "glassmorphism";
}

export interface TAvatarProps extends BaseComponentProps {
  source: { uri: string } | number;
  size?: number;
}

export interface TToastProps extends BaseComponentProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface TSelectDropdownProps extends BaseComponentProps {
  options: { label: string; value: any }[];
  value?: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
}

export interface TBadgeProps extends BaseComponentProps {
  value?: number | string;
  color?: string;
}

export interface TListProps<T> extends BaseComponentProps {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export interface TListItemProps extends BaseComponentProps {
  label: string;
  onPress?: () => void;
}

export interface TModalProps extends BaseComponentProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  variant?: "center" | "bottom";
}

export interface TLoaderProps extends BaseComponentProps {
  variant?: "spinner" | "bar";
}

export interface TStepperProps extends BaseComponentProps {
  steps: number;
  currentStep: number;
}

export interface TSkeletonLoaderProps extends BaseComponentProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export interface TAccordionSection {
  title: string;
  content: React.ReactNode;
}
export interface TAccordionProps extends BaseComponentProps {
  sections: TAccordionSection[];
}

export interface TTabsProps extends BaseComponentProps {
  tabs: { label: string }[];
  currentTab: number;
  onTabChange: (index: number) => void;
}

// ... Continue for all component types as needed
