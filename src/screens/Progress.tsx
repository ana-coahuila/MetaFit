import React, { useEffect, useState } from 'react'; //PRIN 
import {View,Text,TextInput,TouchableOpacity,ScrollView,Alert,} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ProgressStyles';
import components from '../components/Card';

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

  const API_BASE_URL = 'http://192.168.1.195000/api/auth/user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('Token no encontrado');

       const res = await axios.get(API_BASE_URL, {

  headers: {
    'x-auth-token': token,
  },
});


        setUser(res.data);
        setWeightRecords(res.data.weightRecords || []);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        Alert.alert('Error', 'No autorizado o fallo de conexión');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Por favor ingresa un peso válido');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      const res = await axios.post(
        `${API_BASE_URL}/update-weight`,
        { weight: weightValue },
        { headers: { 'x-auth-token': token } }
      );

      setUser(res.data);
      setWeightRecords(res.data.weightRecords);
      setNewWeight('');
      setShowForm(false);
      setError('');
    } catch (err) {
      console.error('Error al guardar peso:', err);
      Alert.alert('Error', 'No se pudo guardar el peso.');
    }
  };

  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const calculateProgress = () => {
    if (!user || sortedRecords.length === 0) return 0;
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

  if (!user) return <Text style={styles.header}>Cargando datos...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hola, {user.fullName.split(' ')[0]}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Progreso hacia tu meta</Text>
        <Text>Meta: {user.targetWeight} kg</Text>
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
        <Text style={styles.title}>Estadísticas</Text>
        <Text>Peso inicial: {sortedRecords[0]?.weight ?? user.weight} kg</Text>
        <Text>Peso actual: {user.weight} kg</Text>
        <Text>Objetivo de Peso: {user.targetWeight} kg</Text>
        <Text>IMC: {user.bmi.toFixed(1)}</Text>
        <Text>Categoría: {user.bmiCategory}</Text>
      </View>
    </ScrollView>
  );
};

export default Progress;