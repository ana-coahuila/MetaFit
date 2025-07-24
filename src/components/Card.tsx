// components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CardProps {
  title: string;
  icon: string;
  value: string;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ title, icon, value, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <MaterialIcons name={icon} size={20} color="#fff" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%', // Para que quepan 2 en una fila
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3498db',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default Card;