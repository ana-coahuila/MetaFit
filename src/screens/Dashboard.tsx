import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../styles/DashboardStyles';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type PesoRecord = {
  date: string;
  peso: number;
};

type Meal = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  category: string;
};

type Exercise = {
  id: string;
  name: string;
  duration: number;
  difficulty: string;
  caloriesBurned: number;
  description: string;
  videoUrl: string;
  category: string;
};

type DailyPlan = {
  date: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  exercises: Exercise[];
};

const Dashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const navigation = useNavigation();
  const [user, setUser] = useState({
    fullName: authUser?.fullName || 'Ana Coahuila',
    peso: 70,
    objetivopeso: 65,
  });

  const [pesoRecords, setPesoRecords] = useState<PesoRecord[]>([]);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weightResponse = await axios.get(`${apiUrl}/plans/weight`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setPesoRecords(weightResponse.data);

        const plansResponse = await axios.get(`${apiUrl}/plans`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setDailyPlans(plansResponse.data);
        

        const mealsResponse = await axios.get(`${apiUrl}/meals`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setMeals(mealsResponse.data);

        const exercisesResponse = await axios.get(`${apiUrl}/exercises`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setExercises(exercisesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser?.token]);

  const calculateProgress = useCallback(() => {
    if (!user) return;

    if (pesoRecords.length > 0 && user.objetivopeso) {
      const sortedRecords = [...pesoRecords].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const initialPeso = sortedRecords[0].peso;
      const currentPeso = sortedRecords[sortedRecords.length - 1].peso;
      const goalPeso = user.objetivopeso;

      let calculatedProgress = 0;

      if (goalPeso < initialPeso) {
        calculatedProgress =
          currentPeso <= goalPeso
            ? 100
            : currentPeso >= initialPeso
            ? 0
            : ((initialPeso - currentPeso) / (initialPeso - goalPeso)) * 100;
      } else if (goalPeso > initialPeso) {
        calculatedProgress =
          currentPeso >= goalPeso
            ? 100
            : currentPeso <= initialPeso
            ? 0
            : ((currentPeso - initialPeso) / (goalPeso - initialPeso)) * 100;
      } else {
        calculatedProgress = 100;
      }

      setProgress(Math.min(Math.max(calculatedProgress, 0), 100));
    }
  }, [user, pesoRecords]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  const todayPlan = dailyPlans.find(
    (plan) => plan.date === new Date().toISOString().split('T')[0]
  );

  const getWeightDifference = () => {
    if (pesoRecords.length > 1) {
      const sortedRecords = [...pesoRecords].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const initialWeight = sortedRecords[0].peso;
      const currentWeight = sortedRecords[sortedRecords.length - 1].peso;
      const difference = currentWeight - initialWeight;

      if (difference < 0) {
        return `Has perdido ${Math.abs(difference).toFixed(1)} kg`;
      } else if (difference > 0) {
        return `Has ganado ${difference.toFixed(1)} kg`;
      }
      return 'Mismo peso que al inicio';
    }
    return 'Comienza tu viaje';
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header1}>
        <Text style={styles.greeting}>Hola, {user.fullName.split(' ')[0]}</Text>
        <View style={styles.iconContainer}>
          <Icon name="activity" size={24} color="#1E3A8A" />
        </View>
      </View>

      {/* Sección informativa de Metafit */}
      <View style={styles.card}>
        <Text style={styles.title}>¿Qué es Metafit?</Text>
        <Text style={{ color: '#4B5563', marginVertical: 8 }}>
          Metafit es una aplicación que te acompaña en tu camino hacia una vida más saludable. 
          Te ofrece recomendaciones personalizadas de comidas, ejercicios y un seguimiento de tu progreso basado en tus objetivos.
        </Text>
        <Text style={{ color: '#4B5563', marginBottom: 8 }}>
          Registra tu peso, recibe planes diarios y mantente motivado con rutinas diseñadas especialmente para ti.
        </Text>
        
        <View style={{ alignItems: 'center', marginTop: 12 }}>

          <View style={styles.card}>
  <Text style={styles.title}>¿Qué es Metafit?</Text>
  <Text style={{ color: '#4B5563', marginVertical: 8 }}>
    Metafit es tu compañero digital en el camino hacia una vida más saludable. Diseñada especialmente para personas con sobrepeso u obesidad, esta aplicación combina inteligencia artificial, rutinas personalizadas y una alimentación guiada para ayudarte a alcanzar tus objetivos físicos.
  </Text>
  <Text style={{ color: '#4B5563', marginBottom: 8 }}>
    Con Metafit puedes registrar tu peso, acceder a dietas y recetas nutritivas, visualizar rutinas en video adaptadas a tu nivel, y recibir recomendaciones basadas en tu edad, peso y estatura. Toda la experiencia es 100% personalizada.
  </Text>
  <Text style={{ color: '#4B5563', marginBottom: 8 }}>
    ¿Tu meta es sentirte mejor, tener más energía o reducir tu peso de forma saludable? Metafit te acompaña paso a paso con planes diarios, consejos de salud, y monitoreo de tu avance. 
  </Text>
  <Text style={{ color: '#4B5563' }}>
    ¡No es solo una app, es tu aliada en el cambio de hábitos y mejora de tu calidad de vida!
  </Text>

  <View style={{ alignItems: 'center', marginTop: 12 }}>
  </View>
</View>

          <Image
            source={{ uri: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg' }} // Reemplaza este link
            style={{ width: '100%', height: 180, borderRadius: 12 }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Tarjetas Plan y Peso */}
      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.title}>Plan de hoy</Text>
          {todayPlan ? (
            <>
              <Text style={{ fontWeight: '600', marginBottom: 8 }}>Comidas</Text>
              <Text>🍽 Desayuno: {todayPlan.meals.breakfast.name}</Text>
              <Text>🍽 Almuerzo: {todayPlan.meals.lunch.name}</Text>
              <Text>🍽 Cena: {todayPlan.meals.dinner.name}</Text>
              <Text style={{ fontWeight: '600', marginTop: 12 }}>Ejercicios</Text>
              {todayPlan.exercises.map((e) => (
                <Text key={e.id}>
                  🏋️ {e.name} ({e.duration} min)
                </Text>
              ))}
              <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Plan' as never)}
              >
                <Text style={styles.buttonText}>Ver plan completo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text>No hay plan hoy</Text>
              <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => alert('Generar plan')}
              >
                <Text style={styles.buttonText}>Generar plan</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Registro de peso</Text>
          <Text>
            Peso actual: {pesoRecords[pesoRecords.length - 1]?.peso ?? user.peso} kg
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 12 }]}
            onPress={() => navigation.navigate('WeightRegister' as never)}
          >
            <Text style={styles.buttonText}>Registrar peso</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
