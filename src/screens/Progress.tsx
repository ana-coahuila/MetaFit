import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ProgressStyles';
import axios from 'axios';

const Progress = () => {
  const [progressRecords, setProgressRecords] = useState([]);
  const [userData, setUserData] = useState({
    fullName: '',
    weight: 0,
    height: 0,
    targetWeight: 0,
    bmi: 0,
    bmiCategory: ''
  });
  const [newProgress, setNewProgress] = useState({
    weight: '',
    height: '',
    targetWeight: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        // Obtener datos del usuario
        const userResponse = await axios.get(`${apiUrl}/auth/user`, {
          headers: { 'x-auth-token': token }
        });
        
        // Obtener historial de progreso
        const progressResponse = await axios.get(`${apiUrl}/progress`, {
          headers: { 'x-auth-token': token }
        });

        setUserData({
          fullName: userResponse.data.fullName,
          weight: userResponse.data.weight,
          height: userResponse.data.height,
          targetWeight: userResponse.data.targetWeight,
          bmi: userResponse.data.bmi,
          bmiCategory: userResponse.data.bmiCategory
        });

        setProgressRecords(progressResponse.data);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        Alert.alert('Error', 'No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!newProgress.weight || !newProgress.height || !newProgress.targetWeight) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.post(`${apiUrl}/progress`, {
        weight: parseFloat(newProgress.weight),
        height: parseFloat(newProgress.height),
        targetWeight: parseFloat(newProgress.targetWeight)
      }, {
        headers: { 'x-auth-token': token }
      });

      // Actualizar el estado con los nuevos datos
      setUserData({
        ...userData,
        weight: response.data.user.weight,
        height: response.data.user.height,
        targetWeight: response.data.user.targetWeight,
        bmi: response.data.user.bmi,
        bmiCategory: response.data.user.bmiCategory
      });

      // Agregar el nuevo registro al historial
      setProgressRecords([response.data.progress, ...progressRecords]);
      
      setNewProgress({ weight: '', height: '', targetWeight: '' });
      setShowForm(false);
      setError('');
      
      if (response.data.message.includes('nuevo plan')) {
        Alert.alert('Éxito', 'Se ha generado un nuevo plan adaptado a tu progreso');
      } else {
        Alert.alert('Éxito', 'Progreso registrado correctamente');
      }
    } catch (err) {
      console.error('Error al registrar progreso:', err);
      Alert.alert('Error', 'No se pudo registrar el progreso');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (progressRecords.length === 0) return 0;
    
    const initialWeight = progressRecords[progressRecords.length - 1].weight;
    const currentWeight = userData.weight;
    const targetWeight = userData.targetWeight;

    if (targetWeight < initialWeight) {
      return currentWeight <= targetWeight
        ? 100
        : currentWeight >= initialWeight
        ? 0
        : ((initialWeight - currentWeight) / (initialWeight - targetWeight)) * 100;
    }
    
    if (targetWeight > initialWeight) {
      return currentWeight >= targetWeight
        ? 100
        : currentWeight <= initialWeight
        ? 0
        : ((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100;
    }
    
    return 100;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hola, {userData.fullName.split(' ')[0]}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Progreso hacia tu meta</Text>
        <Text>Meta: {userData.targetWeight} kg</Text>
        <Text>Peso Actual: {userData.weight} kg</Text>
        <Text style={styles.percent}>{calculateProgress().toFixed(1)}%</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${calculateProgress()}%` }]} />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setShowForm(!showForm)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrar progreso</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            placeholder="Peso actual (kg)"
            keyboardType="numeric"
            value={newProgress.weight}
            onChangeText={(text) => setNewProgress({...newProgress, weight: text})}
            style={styles.input}
          />
          <TextInput
            placeholder="Altura (m)"
            keyboardType="numeric"
            value={newProgress.height}
            onChangeText={(text) => setNewProgress({...newProgress, height: text})}
            style={styles.input}
          />
          <TextInput
            placeholder="Peso objetivo (kg)"
            keyboardType="numeric"
            value={newProgress.targetWeight}
            onChangeText={(text) => setNewProgress({...newProgress, targetWeight: text})}
            style={styles.input}
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <View style={styles.formRow}>
            <TouchableOpacity 
              onPress={() => setShowForm(false)} 
              style={styles.cancelBtn}
              disabled={loading}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSubmit} 
              style={styles.saveBtn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff' }}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Registros</Text>
        {progressRecords.length === 0 ? (
          <Text>No hay registros de progreso</Text>
        ) : (
          progressRecords.map((record, index) => {
            const prevRecord = progressRecords[index + 1];
            const diff = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : null;
            const isLoss = diff && parseFloat(diff) < 0;
            
            return (
              <View key={record._id} style={styles.recordRow}>
                <Text>{formatDate(record.createdAt)}</Text>
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
        
        <View style={[styles.section, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}> <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18265/18265431.png' }} 
          style={styles.icon} 
        /> Estadísticas</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Peso inicial:</Text>
          <Text style={styles.mealName}>
            {progressRecords.length > 0 ? progressRecords[progressRecords.length - 1].weight : userData.weight} kg
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Peso actual:</Text>
          <Text style={styles.mealName}>{userData.weight} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Objetivo de peso:</Text>
          <Text style={styles.mealName}>{userData.targetWeight} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Altura:</Text>
          <Text style={styles.mealName}>{userData.height} m</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>IMC:</Text>
          <Text style={styles.mealName}>{userData.bmi.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.mealCalories}>Categoría:</Text>
          <Text style={styles.mealName}>{userData.bmiCategory}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Progress;