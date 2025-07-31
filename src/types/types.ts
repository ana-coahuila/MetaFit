// Interface Usuario
export type User  = {
  _id: string;
  fullName: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  createdAt?: string;
  updatedAt?: string;
};

// Props para componente de comida
export type Recipe = {
  _id?: string;
  name: string;
  description: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  category: 'normal' | 'sobrepeso' | 'obesidadI' | 'obesidadII' | 'obesidadIII';
};

// Props para componente de ejercicio
export type Exercise = {
  name: string;
  duration: number;
  caloriesBurned: number;
  description?: string;
};
