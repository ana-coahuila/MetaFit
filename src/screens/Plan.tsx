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
          <Text style={styles.exerciseDetailText}>{duration}</Text>
        </View>
        <View style={styles.exerciseDetail}>
          <Flame size={14} color="#6B7280" />
          <Text style={styles.exerciseDetailText}>{calories} kcal</Text>
        </View>
        <View style={[styles.exerciseDifficulty, {
          backgroundColor: difficulty === 'Bajo' ? '#D1FAE5' :
            difficulty === 'Medio' ? '#FEF3C7' : '#FEE2E2'
        }]}>
          <Text style={[styles.exerciseDifficultyText, {
            color: difficulty === 'Bajo' ? '#065F46' :
              difficulty === 'Medio' ? '#92400E' : '#991B1B'
          }]}>{difficulty}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const Plan = () => {
  const { token } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
  try {
    const res = await axios.get(`${apiUrl}/plans`, {
      headers: { 'x-auth-token': token },
    });

    if (res.data.length === 0) {
      // No hay plan aún, lo creamos
      const newPlanRes = await axios.post(`${apiUrl}/plans`, {}, {
        headers: { 'x-auth-token': token },
      });
      setPlan(newPlanRes.data);
    } else {
      setPlan(res.data[0]);
    }
  } catch (err) {
    console.error('Error al obtener/crear el plan:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (token) fetchPlan();
  }, [token]);

  const getIconColor = (mealType: string) => {
    switch (mealType) {
      
      case 'Desayuno': return ['#F59E0B', Coffee];
      case 'Almuerzo': return ['#10B981', Sun];
      case 'Cena': return ['#8B5CF6', Moon];
      default: return ['#6B7280', Coffee];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#00C9FF', '#92FE9D']}
        style={styles.header}
      >
      <View style={styles.row}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18265/18265431.png' }} 
          style={styles.icon} />
        <Text style={styles.title}>Plan Diario</Text></View>
        <Text style={styles.date}>Hoy, {new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</Text>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comidas del Día</Text>
            {plan?.meals && (
              <>
                {Object.entries(plan.meals).map(([typeKey, data]: any) => {
                  const typeName =
                    typeKey === 'breakfast' ? 'Desayuno' :
                      typeKey === 'lunch' ? 'Almuerzo' : 'Cena';
                  const [color, Icon] = getIconColor(typeName);
                  return (
                    <MealCard
                      key={typeKey}
                      type={typeName}
                      name={data.name}
                      calories={data.calories}
                      category={data.category}
                      icon={Icon}
                      color={color}
                    />
                  );
                })}
              </>
            )}
          </View>

          {/* Esto es solo mock por ahora, puedes eliminarlo si los ejercicios también vienen del backend */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ejercicios del Día</Text>
            {[{
              id: 1,
              name: 'Cardio HIIT',
              duration: '20 min',
              difficulty: 'Alto',
              calories: 250,
              description: 'Entrenamiento de alta intensidad con intervalos',
            }].map((exercise) => (
              <ExerciseCard key={exercise.id} {...exercise} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Plan;
