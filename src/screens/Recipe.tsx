import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity, Image,FlatList,ScrollView,ActivityIndicator} from 'react-native';
import { Search, Filter, Clock, Zap, ChefHat, Mic, MicOff } from 'lucide-react-native';
import styles from '../styles/RecipeStyles';
import axios from 'axios';
import { Recipe } from '../types/types';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get<Recipe[]>(`${apiUrl}/meals`);
        setRecipes(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Error al cargar las recetas');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    if (!recipe || !recipe.name || !recipe.ingredients) return false;

    const matchesSearch = 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' ||
      recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'normal', label: 'Normal' },
    { value: 'sobrepeso', label: 'Sobrepeso' },
    { value: 'obesidadI', label: 'Obesidad I' },
    { value: 'obesidadII', label: 'Obesidad II' },
    { value: 'obesidadIII', label: 'Obesidad III' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'normal': return styles.normalBadge;
      case 'sobrepeso': return styles.sobrepesoBadge;
      case 'obesidadI': return styles.obesidadIBadge;
      case 'obesidadII': return styles.obesidadIIBadge;
      case 'obesidadIII': return styles.obesidadIIIBadge;
      default: return styles.defaultBadge;
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeCard}>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.recipeContent}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <ChefHat size={20} color="#6b7280" />
        </View>

        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.metaText}>15 min</Text>
          </View>
          <View style={styles.metaItem}>
            <Zap size={16} color="#6b7280" />
            <Text style={styles.metaText}>{item.calories} cal</Text>
          </View>
        </View>

        <View style={styles.badgeContainer}>
          <Text style={[styles.badge, getCategoryColor(item.category)]}>
            {categories.find(c => c.value === item.category)?.label || 'Sin categoría'}
          </Text>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsTitle}>Ingredientes:</Text>
          <Text style={styles.ingredientsText}>{item.ingredients.join(', ')}</Text>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instrucciones:</Text>
          {item.instructions.map((step, index) => (
            <Text key={index} style={styles.instructionStep}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await axios.get<Recipe[]>(`${apiUrl}/meals`);
              setRecipes(response.data || []);
              setLoading(false);
            } catch (err) {
              console.error('Error fetching recipes:', err);
              setError('Error al cargar las recetas');
              setLoading(false);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Search size={24} color="#7c3aed" />
          <Text style={styles.headerText}>Buscador de Recetas</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar por nombre o ingredientes..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.searchInput}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TouchableOpacity
              onPress={() => setIsListening(!isListening)}
              style={[
                styles.voiceButton,
                isListening ? styles.voiceButtonActive : styles.voiceButtonInactive
              ]}
            >
              {isListening ? (
                <MicOff size={20} color="white" />
              ) : (
                <Mic size={20} color="#7c3aed" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.filtersContainer}>
            <View style={styles.filterLabel}>
              <Filter size={20} color="#4b5563" />
              <Text style={styles.filterLabelText}>Filtros:</Text>
            </View>

            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Categoría:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.select}
              >
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    onPress={() => setSelectedCategory(category.value)}
                    style={[
                      styles.selectOption,
                      selectedCategory === category.value && styles.selectOptionActive
                    ]}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      selectedCategory === category.value && styles.selectOptionTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {filteredRecipes.length > 0 ? (
          <FlatList
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item._id ?? Math.random().toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.recipesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Search size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>No se encontraron recetas</Text>
            <Text style={styles.emptyStateText}>Intenta con otros términos de búsqueda o filtros</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RecipeSearch;
