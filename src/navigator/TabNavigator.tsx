import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BarChart3, Home, ClipboardList, User } from 'lucide-react-native';
import Dashboard from "../screens/Dashboard";
import Plan from "../screens/Plan";
import Profile from "../screens/Profile";
import Progress from "../screens/Progress";
import Recipe from "../screens/Recipe";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#F0DEC3",
          borderTopColor: "#DBA975",
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: "#BB86F2",
        tabBarInactiveTintColor: "#A0A0A0",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Plan"
        component={Plan}
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
          headerShown: false,
        }}
      />

       <Tab.Screen
        name="Recipe"
        component={Recipe}
        options={{
          title: 'Receta',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Progress"
        component={Progress}
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;