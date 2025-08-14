import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,Alert,ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User as IconUser, Settings, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/ProfileStyles';

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser, logout, loading: authLoading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    weight: '',
    height: '',
    targetWeight: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        age: user.age?.toString() || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        targetWeight: user.targetWeight?.toString() || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Nombre requerido';
    if (!formData.age || isNaN(Number(formData.age))) newErrors.age = 'Edad inválida';
    if (!formData.weight || isNaN(Number(formData.weight))) newErrors.weight = 'Peso inválido';
    if (!formData.height || isNaN(Number(formData.height))) newErrors.height = 'Altura inválida';
    if (!formData.targetWeight || isNaN(Number(formData.targetWeight))) newErrors.targetWeight = 'Peso objetivo inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await updateUser({
        fullName: formData.fullName,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        targetWeight: Number(formData.targetWeight)
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        age: user.age?.toString() || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        targetWeight: user.targetWeight?.toString() || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (!user?.weight || !user?.height) return null;
    return (user.weight / ((user.height / 100) ** 2)).toFixed(2);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Bajo peso'; 
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidad I';
  if (bmi < 40) return 'Obesidad II';
  return 'Obesidad III';
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : 'N/A';

  if (authLoading || !user) {
    return (
      <LinearGradient colors={['#00C9FF', '#92FE9D']} style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login' as never); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <LinearGradient colors={['#00C9FF', '#92FE9D']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        
        <View style={styles.header}>
          <Text style={styles.title}>Tu Perfil</Text>
          <View style={styles.iconContainer}>
            <IconUser size={24} color="#1F2937" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.fullName}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity 
                onPress={() => setIsEditing(true)} 
                style={styles.editButton}
                disabled={isSubmitting}
              >
                <Settings size={16} color="#1F2937" />
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre completo</Text>
                <TextInput 
                  value={formData.fullName} 
                  onChangeText={(text) => handleInputChange('fullName', text)} 
                  style={[styles.input, errors.fullName ? styles.inputError : null]} 
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput 
                  value={formData.age} 
                  onChangeText={(text) => handleInputChange('age', text)} 
                  style={[styles.input, errors.age ? styles.inputError : null]} 
                  keyboardType="numeric"
                />
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Peso actual (kg)</Text>
                <TextInput 
                  value={formData.weight} 
                  onChangeText={(text) => handleInputChange('weight', text)} 
                  style={[styles.input, errors.weight ? styles.inputError : null]} 
                  keyboardType="numeric"
                />
                {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Altura (cm)</Text>
                <TextInput 
                  value={formData.height} 
                  onChangeText={(text) => handleInputChange('height', text)} 
                  style={[styles.input, errors.height ? styles.inputError : null]} 
                  keyboardType="numeric"
                />
                {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Objetivo de peso (kg)</Text>
                <TextInput 
                  value={formData.targetWeight} 
                  onChangeText={(text) => handleInputChange('targetWeight', text)} 
                  style={[styles.input, errors.targetWeight ? styles.inputError : null]} 
                  keyboardType="numeric"
                />
                {errors.targetWeight && <Text style={styles.errorText}>{errors.targetWeight}</Text>}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.cancelButton, isSubmitting && styles.disabledButton]} 
                  onPress={handleCancel}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, isSubmitting && styles.disabledButton]} 
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.saveText}>Guardar cambios</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>{user.age} años</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Altura</Text>
                <Text style={styles.infoValue}>{user.height} cm</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Peso actual</Text>
                <Text style={styles.infoValue}>{user.weight} kg</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Objetivo de peso</Text>
                <Text style={styles.infoValue}>{user.targetWeight} kg</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>IMC</Text>
                <Text style={styles.infoValue}>{bmi}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Clasificación</Text>
                <Text style={styles.infoValue}>{bmiCategory}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configuración de la cuenta</Text>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}  
            disabled={isSubmitting}
          >
            <LogOut size={16} color="#DC2626" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Profile;