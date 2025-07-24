import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, getTextStyle()]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: '#A0DFF7',
  },
  secondary: {
    backgroundColor: '#e2e8f0',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#334155',
  },
  outlineText: {
    color: '#3b82f6',
  },
});

export default Button;