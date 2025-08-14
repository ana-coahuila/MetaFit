import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TouchableOpacity, Alert,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/AuthStyles';

const Register: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const navigation = useNavigation();
  const { register, error: authError, clearError } = useAuth();
  
  const [fullName, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setConfirmPassword] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [localError, setLocalError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNextStep = (): void => {
    clearError();
    setLocalError('');

    if (!fullName || !email || !password || !passwordConfirm) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setLocalError('Por favor ingresa un email válido');
      return;
    }

    if (password !== passwordConfirm) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setStep(2);
  };

  const handleRegister = async (): Promise<void> => {
    clearError();
    setLocalError('');

    if (!age || !weight || !height || !targetWeight) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }

    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const targetWeightNum = parseFloat(targetWeight);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || isNaN(targetWeightNum)) {
      setLocalError('Por favor ingresa valores numéricos válidos');
      return;
    }

    if (targetWeightNum < 30 || targetWeightNum > 300) {
      setLocalError('El peso objetivo debe estar entre 30 y 300 kg');
      return;
    }

    setIsLoading(true);

    try {
      await register(
        fullName,
        email,
        password,
        ageNum,
        weightNum,
        heightNum,
        targetWeightNum
      );

      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never ),
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const error = localError || authError;

  return (
    <LinearGradient
      colors={['#A0EACF', '#6BCBDF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
        <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/registro.jpg')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

          <Text style={styles.title}>
            {step === 1 ? 'Crear una cuenta' : 'Información adicional'}
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <ScrollView>
            {step === 1 ? (
              <>
                <Input
                  id="name"
                  label="Nombre completo"
                  value={fullName}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  autoCapitalize="words"
                  required
                />
                <Input
                  id="email"
                  label="Correo Electrónico"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />
                <Input
                  id="password"
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  secureTextEntry
                  required
                />
                <Input
                  id="confirmPassword"
                  label="Confirmar Contraseña"
                  value={passwordConfirm}
                  onChangeText={setConfirmPassword}
                  placeholder="Repite tu contraseña"
                  secureTextEntry
                  required
                />
              </>
            ) : (
              <>
                <Input
                  id="age"
                  label="Edad"
                  value={age}
                  onChangeText={setAge}
                  placeholder="Ej. 28"
                  keyboardType="numeric"
                  required
                />
                <Input
                  id="weight"
                  label="Peso actual (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Ej. 70"
                  keyboardType="numeric"
                  required
                />
                <Input
                  id="height"
                  label="Altura (cm)"
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Ej. 175"
                  keyboardType="numeric"
                  required
                />
                <Input
                  id="goalWeight"
                  label="Peso objetivo (kg)"
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  placeholder="Ej. 65"
                  keyboardType="numeric"
                  required
                />
              </>
            )}
          </ScrollView>

          <View style={styles.form}>
            {step === 1 ? (
              <Button onPress={handleNextStep} variant="primary" fullWidth>
                Siguiente
              </Button>
            ) : (
              <Button
                onPress={handleRegister}
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Completar Registro'}
              </Button>
            )}
          </View>

          {step === 2 && (
            <Pressable
              onPress={() => {
                clearError();
                setStep(1);
              }}
              style={styles.buttonContainer}
            >
              <Text style={styles.linkText}>Volver</Text>
            </Pressable>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿Ya tienes una cuenta?{' '}
              <TouchableOpacity 
                onPress={() => {
                  clearError();
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.switchButton}>Iniciar sesión</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
    </LinearGradient>
  );
};

export default Register;