import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  value,
  onChangeText,
  placeholder = '',
  required = false,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
}) => {
  return (
    <View style={styles.container} testID={`input-${id}`}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={`${label} input`}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    fontWeight: '500',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;