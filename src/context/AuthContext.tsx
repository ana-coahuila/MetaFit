import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {User} from "../types/types";


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    age: number,
    weight: number,
    height: number,
    targetWeight: number
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configurar headers de axios
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Cargar usuario al iniciar
  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      setAuthToken(storedToken);
      setToken(storedToken);

      const response = await axios.get(`${apiUrl}/auth/user`);
      setUser(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token inválido o expirado
        await logout();
      } else {
        console.error("Error loading user:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario
  const register = async (
    fullName: string,
    email: string,
    password: string,
    age: number,
    weight: number,
    height: number,
    targetWeight: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Validación de peso objetivo como en tu API
      if (targetWeight < 30 || targetWeight > 300) {
        throw new Error('El peso objetivo debe estar entre 30 y 300 kg');
      }

      const response = await axios.post(`${apiUrl}/auth/register`, {
        fullName,
        email,
        password,
        age,
        weight,
        height,
        targetWeight
      });

      await AsyncStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      setToken(response.data.token);
      await loadUser(); // Cargar los datos del usuario después del registro
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error en el registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login de usuario
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password
      });

      await AsyncStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      setToken(response.data.token);
      await loadUser(); // Cargar los datos del usuario después del login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setAuthToken(null);
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Actualizar información del usuario
  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones como en tu API
      if (userData.age && (userData.age < 18 || userData.age > 30)) {
        throw new Error('La edad debe estar entre 18 y 30 años');
      }
      if (userData.weight && (userData.weight < 30 || userData.weight > 300)) {
        throw new Error('El peso debe estar entre 30 y 300 kg');
      }
      if (userData.targetWeight && (userData.targetWeight < 30 || userData.targetWeight > 300)) {
        throw new Error('El peso objetivo debe estar entre 30 y 300 kg');
      }

      const response = await axios.put(`${apiUrl}/auth/user`, userData);
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar errores
  const clearError = () => setError(null);

  // Cargar usuario al montar el componente
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
        loading,
        error,
        clearError,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};