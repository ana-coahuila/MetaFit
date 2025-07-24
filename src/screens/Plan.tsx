import React from 'react';
import { View,Text,ScrollView,TouchableOpacity, SafeAreaView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coffee, Sun, Moon, Dumbbell, Clock, Flame, Play } from 'lucide-react-native';
import styles from '../styles/PlanStyles';

// Types
type DailyPlan = { 
  date: string;
  meals: {
    breakfast: { name: string; calories: number; category: string };
    lunch: { name: string; calories: number; category: string };
    dinner: { name: string; calories: number; category: string };
  };
  exercises: Exercise[];
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

// Components
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

const RecipeCard = ({ name, time, difficulty, calories, image }: any) => (
  <TouchableOpacity style={styles.recipeCard}>
    <View style={styles.recipeImageContainer}>
      <View style={[styles.recipeImage, { backgroundColor: '#E5E7EB' }]} />
    </View>
    <View style={styles.recipeInfo}>
      <Text style={styles.recipeName}>{name}</Text>
      <View style={styles.recipeDetails}>
        <View style={styles.recipeDetail}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.recipeDetailText}>{time}</Text>
        </View>
        <View style={styles.recipeDetail}>
          <Flame size={14} color="#6B7280" />
          <Text style={styles.recipeDetailText}>{calories} kcal</Text>
        </View>
      </View>
      <View style={[styles.recipeDifficulty, { 
        backgroundColor: difficulty === 'Fácil' ? '#D1FAE5' : 
                        difficulty === 'Medio' ? '#FEF3C7' : '#FEE2E2'
      }]}>
        <Text style={[styles.recipeDifficultyText, { 
          color: difficulty === 'Fácil' ? '#065F46' : 
                difficulty === 'Medio' ? '#92400E' : '#991B1B'
        }]}>{difficulty}</Text>
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
  const meals = [
    {
      id: 1,
      type: 'Desayuno',
      name: 'Avena con Frutas',
      calories: 320,
      category: 'Saludable',
      icon: Coffee,
      color: '#F59E0B',
    },
    {
      id: 2,
      type: 'Almuerzo',
      name: 'Ensalada de Pollo',
      calories: 450,
      category: 'Proteína',
      icon: Sun,
      color: '#10B981',
    },
    {
      id: 3,
      type: 'Cena',
      name: 'Salmón con Vegetales',
      calories: 380,
      category: 'Saludable',
      icon: Moon,
      color: '#8B5CF6',
    },
  ];

  const recipes = [
    {
      id: 1,
      name: 'Smoothie Verde Energético',
      time: '5 min',
      difficulty: 'Fácil',
      calories: 180,
      image: 'https://example.com/image1.jpg',
    },
    {
      id: 2,
      name: 'Bowl de Quinoa',
      time: '15 min',
      difficulty: 'Medio',
      calories: 320,
      image: 'https://example.com/image2.jpg',
    },
  ];

  const exercises = [
    {
      id: 1,
      name: 'Cardio HIIT',
      duration: '20 min',
      difficulty: 'Alto',
      calories: 250,
      description: 'Entrenamiento de alta intensidad con intervalos',
      videoUrl: 'https://example.com/video1',
    },
    {
      id: 2,
      name: 'Yoga Matutino',
      duration: '30 min',
      difficulty: 'Bajo',
      calories: 120,
      description: 'Secuencia de yoga para empezar el día',
      videoUrl: 'https://example.com/video2',
    },
    {
      id: 3,
      name: 'Fuerza - Tren Superior',
      duration: '45 min',
      difficulty: 'Medio',
      calories: 300,
      description: 'Rutina de pesas para brazos, hombros y espalda',
      videoUrl: 'https://example.com/video3',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.title}>Plan Diario</Text>
        <Text style={styles.date}>Hoy, {new Date().toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comidas del Día</Text>
          {meals.map((meal) => (
            <MealCard key={meal.id} {...meal} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recetas Recomendadas</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recipesScroll}
          >
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicios del Día</Text>
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} {...exercise} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Plan;