import React, { useEffect, useState } from 'react';
import {View,Text,TouchableOpacity,ScrollView,Image,Linking} from 'react-native';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, Video } from 'lucide-react-native';
import styles from '../styles/PlanStyles';

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
    breakfast: { name: string; calories: number; category: string };
    lunch: { name: string; calories: number; category: string };
    dinner: { name: string; calories: number; category: string };
  };
  exercises: Exercise[];
};

const Plan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'meals' | 'exercises'>('plan');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [recommendedMeals, setRecommendedMeals] = useState<Meal[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansResponse = await axios.get('http://192.168.1.19:5000/api/plans');
        const mealsResponse = await axios.get('http://192.168.1.19:5000/api/meals');
        const exercisesResponse = await axios.get('http://192.168.1.19:5000/api/exercises');

        setDailyPlans(plansResponse.data);
        setRecommendedMeals(mealsResponse.data);
        setRecommendedExercises(exercisesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getNextDay = (date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getPrevDay = (date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const selectedPlan = dailyPlans.find(plan => plan.date === selectedDate);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Plan</Text>
        <Calendar color="#333" size={24} />
      </View>

      <View style={styles.tabs}>
        {['plan', 'meals', 'exercises'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab === 'plan' ? 'Plan Diario' : tab === 'meals' ? 'Recetas' : 'Ejercicios'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'plan' && (
        <View>
          <View style={styles.dateNav}>
            <TouchableOpacity onPress={() => setSelectedDate(getPrevDay(selectedDate))}>
              <ChevronLeft size={20} />
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <TouchableOpacity onPress={() => setSelectedDate(getNextDay(selectedDate))}>
              <ChevronRight size={20} />
            </TouchableOpacity>
          </View>

          {selectedPlan ? (
            <View>
              <Text style={styles.sectionTitle}>Comidas</Text>
              {['breakfast', 'lunch', 'dinner'].map(meal => (
                <View key={meal} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.label}>
                      {meal === 'breakfast' ? 'Desayuno' : meal === 'lunch' ? 'Almuerzo' : 'Cena'}
                    </Text>
                    <View style={styles.badgeGroup}>
                      <Text style={styles.badge}>
                        {(selectedPlan.meals as any)[meal].calories} kcal
                      </Text>
                      <Text style={styles.badge}>
                        {(selectedPlan.meals as any)[meal].category}
                      </Text>
                    </View>
                  </View>
                  <Text>{(selectedPlan.meals as any)[meal].name}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Ejercicios</Text>
              {selectedPlan.exercises.map(exercise => (
                <View key={exercise.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.label}>{exercise.name}</Text>
                    <View style={styles.badgeGroup}>
                      <Text style={styles.badge}>{exercise.duration} min</Text>
                      <Text style={styles.badge}>{exercise.category}</Text>
                    </View>
                  </View>
                  <Text>{exercise.description}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noPlanText}>No hay un plan para esta fecha</Text>
          )}
        </View>
      )}

      {activeTab === 'meals' && (
        <View>
          <Text style={styles.sectionTitle}>Recetas recomendadas</Text>
          {recommendedMeals.map(meal => (
            <View key={meal.id} style={styles.card}>
              <Image source={{ uri: meal.imageUrl }} style={styles.image} />
              <Text style={styles.label}>{meal.name}</Text>
              <Text>{meal.description}</Text>
              <View style={styles.badgeGroup}>
                <Text style={styles.badge}>{meal.calories} kcal</Text>
                <Text style={styles.badge}>P: {meal.protein}g</Text>
                <Text style={styles.badge}>C: {meal.carbs}g</Text>
                <Text style={styles.badge}>G: {meal.fat}g</Text>
                <Text style={styles.badge}>{meal.category}</Text>
              </View>
              <Text>Ingredientes:</Text>
              {meal.ingredients.map((i, idx) => (
                <Text key={idx}>- {i}</Text>
              ))}
              <Text>Preparación:</Text>
              {meal.instructions.map((step, idx) => (
                <Text key={idx}>{idx + 1}. {step}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {activeTab === 'exercises' && (
        <View>
          <Text style={styles.sectionTitle}>Ejercicios recomendados</Text>
          {recommendedExercises.map(ex => (
            <View key={ex.id} style={styles.card}>
              <View style={styles.iconCircle}>
                <Video size={24} color="#333" />
              </View>
              <Text style={styles.label}>{ex.name}</Text>
              <View style={styles.badgeGroup}>
                <Text style={styles.badge}>{ex.duration} min</Text>
                <Text style={styles.badge}>{ex.difficulty}</Text>
                <Text style={styles.badge}>~{ex.caloriesBurned} kcal</Text>
                <Text style={styles.badge}>{ex.category}</Text>
              </View>
              <Text>{ex.description}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(ex.videoUrl)}>
                <Text style={styles.linkText}>▶ Ver video</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Plan;