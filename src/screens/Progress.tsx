import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ProgressStyles';
import axios from 'axios';

type WeightRecord = {
  date: string;
  weight: number;
};

type User = {
  fullName: string;
  weight: number;
  targetWeight: number;
  bmi: number;
  bmiCategory: string;
  weightRecords: WeightRecord[];
};


const Progress: React.FC = () => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newWeight, setNewWeight] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData: User = response.data;
        setUser(userData);
        setWeightRecords(userData.weightRecords || []);
      } catch (err) {
        console.error('Error al obtener los datos del usuario', err);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = () => {
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Por favor ingresa un peso válido');
      return;
    }

    const today = new Date().toISOString();
    const newRecord: WeightRecord = { date: today, weight: weightValue };
    const updatedRecords = [...weightRecords, newRecord];
    setWeightRecords(updatedRecords);

    if (user) {
      const heightInMeters = 1.7;
      const bmi = weightValue / (heightInMeters * heightInMeters);
      let category = '';
      if (bmi < 18.5) category = 'Bajo peso';
       else if (bmi < 25) category = 'Normal';
      else if (bmi < 25) return 'Normal';
      else if (bmi < 30) return 'Sobrepeso';
      else if (bmi < 35) return 'Obesidad I';
      else if (bmi < 40) return 'Obesidad II';
      else category = 'Obesidad III';

      setUser({
        ...user,
        weight: weightValue,
        bmi,
        bmiCategory: category,
        weightRecords: updatedRecords,
      });
    }

    setNewWeight('');
    setShowForm(false);
    setError('');
  };

  if (loading) return <Text style={styles.header}>Cargando datos...</Text>;
  if (!user) return <Text style={styles.header}>No hay usuario autenticado.</Text>;

  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const calculateProgress = () => {
    if (sortedRecords.length === 0) return 0;
    const initial = sortedRecords[0].weight;
    const current = sortedRecords[sortedRecords.length - 1].weight;
    const goal = user.targetWeight;

    if (goal < initial)
      return current <= goal
        ? 100
        : current >= initial
        ? 0
        : ((initial - current) / (initial - goal)) * 100;
    if (goal > initial)
      return current >= goal
        ? 100
        : current <= initial
        ? 0
        : ((current - initial) / (goal - initial)) * 100;
    return 100;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hola, {user.fullName.split(' ')[0]}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Progreso hacia tu meta</Text>
        <Text>Meta: {user.targetWeight} kg</Text>
        <Text>Peso Actual: {user.weight} kg</Text>
        <Text style={styles.percent}>{calculateProgress().toFixed(1)}%</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${calculateProgress()}%` }]} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>Registrar peso</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            placeholder="Peso actual (kg)"
            keyboardType="numeric"
            value={newWeight}
            onChangeText={setNewWeight}
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.formRow}>
            <TouchableOpacity onPress={() => setShowForm(false)} style={styles.cancelBtn}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
              <Text style={{ color: '#fff' }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Registros</Text>
        {sortedRecords.length === 0 ? (
          <Text>No hay registros de peso</Text>
        ) : (
          sortedRecords
            .slice()
            .reverse()
            .map((record, i, arr) => {
              const prev = arr[i + 1];
              const diff = prev ? (record.weight - prev.weight).toFixed(1) : null;
              const isLoss = diff && parseFloat(diff) < 0;
              return (
                <View key={record.date + i} style={styles.recordRow}>
                  <Text>{formatDate(record.date)}</Text>
                  <Text>{record.weight} kg</Text>
                  {diff && (
                    <Text style={{ color: isLoss ? 'green' : 'red' }}>
                      {parseFloat(diff) > 0 ? '+' : ''}
                      {diff} kg
                    </Text>
                  )}
                </View>
              );
            })
        )}
      </View>

      <View style={styles.card}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18265/18265431.png' }} 
                style={styles.icon} />
      <View style={[styles.section, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Estadísticas</Text></View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Peso inicial:</Text>
          <Text style={styles.mealName}>{sortedRecords[0]?.weight ?? user.weight} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Peso actual:</Text>
          <Text style={styles.mealName}>{user.weight} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Objetivo de peso:</Text>
          <Text style={styles.mealName}>{user.targetWeight} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>IMC:</Text>
          <Text style={styles.mealName}>{user.bmi.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Categoría:</Text>
          <Text style={styles.mealName}>{user.bmiCategory}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Progress;
