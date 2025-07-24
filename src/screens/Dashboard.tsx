import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart } from 'react-native-chart-kit';
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
        // Fetch user weight records
        const weightResponse = await axios.get(`${apiUrl}/plans/weight`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setPesoRecords(weightResponse.data);

        // Fetch daily plans
        const plansResponse = await axios.get(`${apiUrl}/plans`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setDailyPlans(plansResponse.data);

        // Fetch meals
        const mealsResponse = await axios.get(`${apiUrl}/meals`, {
          headers: { Authorization: `Bearer ${authUser?.token}` }
        });
        setMeals(mealsResponse.data);

        // Fetch exercises
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

      {/* Tarjeta de progreso */}
      <View style={styles.card}>
        <Text style={styles.title}>Tu progreso</Text>
        <Text style={styles.percent}>{progress.toFixed(1)}%</Text>
        <Text style={{ color: '#4B5563' }}>{getWeightDifference()}</Text>

        {pesoRecords.length > 0 ? (
          <LineChart
            data={{
              labels: pesoRecords.map((p) => p.date.slice(5)),
              datasets: [{ data: pesoRecords.map((p) => p.peso) }],
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            yAxisSuffix="kg"
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: '#f3f4f6',
              backgroundGradientTo: '#f3f4f6',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(21, 128, 61, ${opacity})`,
              labelColor: () => '#4B5563',
              style: { borderRadius: 8 },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#1E3A8A',
              },
            }}
            bezier
            style={{
              marginVertical: 16,
              borderRadius: 8,
            }}
          />
        ) : (
          <Text style={{ marginVertical: 16 }}>No hay datos de peso registrados</Text>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Progress' as never)}
        >
          <Text style={styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
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
                  �‍♀️ {e.name} ({e.duration} min)
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