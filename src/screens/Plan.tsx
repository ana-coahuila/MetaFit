import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coffee, Sun, Moon, Dumbbell, Clock, Flame, Play } from 'lucide-react-native';
import axios from 'axios';
import styles from '../styles/PlanStyles';
import { useAuth } from '../context/AuthContext';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const MealCard = ({ type, name, calories, category, icon: Icon, color }: any) => (
  <TouchableOpacity style={[styles.mealCard, { borderLeftColor: color }]}>
    <View style={styles.mealCardContent}>
      <View style={styles.mealCardHeader}>
        <Icon size={20} color={color} />
        <Text style={[styles.mealType, { color }]}>{type}</Text>
      </View>
      <Text style={styles.mealName}>{name}</Text>
      <View style={styles.mealDetails}>
        <Text style={styles.mealCalories}>{calories} kcal</Text>
        <View style={[styles.mealCategory, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.mealCategoryText, { color }]}>{category}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const ExerciseCard = ({ name, duration, difficulty, calories, description }: any) => (
  <TouchableOpacity style={styles.exerciseCard}>
    <View style={styles.exerciseIcon}>
      <Dumbbell size={24} color="#3B82F6" />
    </View>
    <View style={styles.exerciseContent}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{name}</Text>
        <TouchableOpacity style={styles.playButton}>
          <Play size={20} color="#3B82F6" fill="#3B82F6" />
        </TouchableOpacity>
      </View>
      <Text style={styles.exerciseDescription}>{description}</Text>
      <View style={styles.exerciseDetails}>
        <View style={styles.exerciseDetail}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.exerciseDetailText}>{duration} min</Text>
        </View>
        <View style={styles.exerciseDetail}>
          <Flame size={14} color="#6B7280" />
          <Text style={styles.exerciseDetailText}>{calories} kcal</Text>
        </View>
        <View style={[styles.exerciseDifficulty, {
          backgroundColor: difficulty === 'Principiante' ? '#D1FAE5' :
            difficulty === 'Intermedio' ? '#FEF3C7' : '#FEE2E2'
        }]}>
          <Text style={[styles.exerciseDifficultyText, {
            color: difficulty === 'Principiante' ? '#065F46' :
              difficulty === 'Intermedio' ? '#92400E' : '#991B1B'
          }]}>{difficulty}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const Plan = () => {
  const { token } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanAndExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Obtener o generar el plan nutricional
      const planResponse = await axios.get(`${apiUrl}/plans/me`, {
        headers: { 'x-auth-token': token },
      });

      // 2. Obtener ejercicios recomendados
      const exercisesResponse = await axios.get(`${apiUrl}/exercises/generate`, {
        headers: { 'x-auth-token': token },
      });

      setPlan(planResponse.data);
      setExercises(exercisesResponse.data.exercises || []);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('No se pudieron cargar los datos. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/plans/generate`, {}, {
        headers: { 'x-auth-token': token },
      });
      setPlan(response.data);
      await fetchPlanAndExercises();
    } catch (err) {
      console.error('Error al generar nuevo plan:', err);
      setError('Error al generar nuevo plan');
    }
  };

  useEffect(() => {
    if (token) fetchPlanAndExercises();
  }, [token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#EF4444', fontSize: 16 }}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPlanAndExercises}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#00C9FF', '#92FE9D']}
        style={styles.header}
      >
        <View style={styles.row}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18265/18265431.png' }} 
            style={styles.icon} 
          />
          <Text style={styles.title}>Plan Diario</Text>
        </View>
        <Text style={styles.date}>Hoy, {new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comidas del Día</Text>
            <TouchableOpacity onPress={generateNewPlan}>
              <Text style={styles.refreshText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
          
          {plan?.meals ? (
            <>
              <MealCard
                type="Desayuno"
                name={plan.meals.breakfast.name}
                calories={plan.meals.breakfast.calories}
                category={plan.meals.breakfast.category}
                icon={Coffee}
                color="#F59E0B"
              />
              <MealCard
                type="Almuerzo"
                name={plan.meals.lunch.name}
                calories={plan.meals.lunch.calories}
                category={plan.meals.lunch.category}
                icon={Sun}
                color="#10B981"
              />
              <MealCard
                type="Cena"
                name={plan.meals.dinner.name}
                calories={plan.meals.dinner.calories}
                category={plan.meals.dinner.category}
                icon={Moon}
                color="#8B5CF6"
              />
            </>
          ) : (
            <Text style={styles.noDataText}>No hay plan nutricional disponible</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicios del Día</Text>
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <ExerciseCard 
                key={exercise._id}
                name={exercise.name}
                duration={exercise.duration}
                difficulty={exercise.difficulty}
                calories={exercise.caloriesBurned}
                description={exercise.description}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No hay ejercicios asignados para hoy</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Plan;