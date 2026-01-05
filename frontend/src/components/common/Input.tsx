import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { colors, spacing, textStyles, useThemedColors } from "../../theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) => {
  const themedColors = useThemedColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[containerStyle]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themedColors.surface,
            borderColor: themedColors.border,
            color: themedColors.textPrimary,
          },
          isFocused && [
            styles.inputFocused,
            {
              borderColor: colors.primary,
              backgroundColor: themedColors.background,
            },
          ],
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={themedColors.textSecondary}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    fontSize: 15,
    fontFamily: "RobotoMono-Regular",
    borderWidth: 2,
    height: 56,
  },
  inputFocused: {
    // Dynamic colors applied inline
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
