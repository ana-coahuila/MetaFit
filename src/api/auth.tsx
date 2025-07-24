// api/auth.tsx corregido
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface UserResponse {
  user?: {
    _id: string;
    fullName: string;
    email: string;
    age: number;
    weight: number;
    height: number;
    targetWeight: number;
    createdAt: string;
    updatedAt: string;
  };
  token?: string;
  message?: string;
}

export const loginUser = async (email: string, password: string): Promise<UserResponse> => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, { 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  passwordConfirm: string,
  age: number,
  weight: number,
  height: number,
  targetWeight: number
): Promise<UserResponse> => {
  try {
    const response = await axios.post(`${apiUrl}/auth/register`, {
      fullName,
      email,
      password,
      passwordConfirm,
      age,
      weight,
      height,
      targetWeight
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getUserProfile = async (token: string): Promise<UserResponse> => {
  try {
    const response = await axios.get(`${apiUrl}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  token: string,
  userData: {
    fullName?: string;
    age?: number;
    weight?: number;
    height?: number;
    targetWeight?: number;
  }
): Promise<UserResponse> => {
  try {
    const response = await axios.put(`${apiUrl}/auth/user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};