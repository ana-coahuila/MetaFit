import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/AuthStyles';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigation = useNavigation();
  const { login, error: authError, clearError } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleLogin = async () => {
    clearError();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Por favor ingresa tus credenciales.");
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setLocalError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      
      Alert.alert(
        "Inicio de sesión exitoso", 
        "¡Bienvenido de nuevo!",
        [{
          text: "OK",
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }]
      );
    } catch (error: any) {
      // Si el error es 401, mostrar mensaje específico
      if (error.response?.status === 401) {
        setLocalError("Credenciales inválidas. Por favor intente nuevamente.");
      } else {
        setLocalError(error.message || "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const error = localError || authError;

  return (
    <LinearGradient
      colors={['#00C9FF', '#92FE9D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Activity size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Bienvenido a METAFIT</Text>
        <Text style={styles.subtitle}>Inicia Sesión para continuar</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            id="email"
            label="Correo Electrónico"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setLocalError("");
              clearError();
            }}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <Input
            id="password"
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setLocalError("");
              clearError();
            }}
            placeholder="••••••••"
            secureTextEntry
            required
          />

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleLogin}
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes una cuenta?{' '}
            <TouchableOpacity 
              onPress={() => {
                clearError();
                navigation.navigate("Register");
              }}
            >
              <Text style={styles.switchButton}>Regístrate</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;