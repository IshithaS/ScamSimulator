import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { 
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF', 
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: isDark ? '#818CF8' : '#6366F1',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="simulate"
        options={{ title: 'Simulate', tabBarIcon: ({ color, size }) => (<Ionicons name="shield-outline" size={size} color={color} />) }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: 'Briefing', tabBarIcon: ({ color, size }) => (<Ionicons name="book-outline" size={size} color={color} />) }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'AI Assist', tabBarIcon: ({ color, size }) => (<Ionicons name="hardware-chip-outline" size={size} color={color} />) }}
      />
      <Tabs.Screen
        name="kit"
        options={{ title: 'Defense', tabBarIcon: ({ color, size }) => (<Ionicons name="medical-outline" size={size} color={color} />) }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Locator', tabBarIcon: ({ color, size }) => (<Ionicons name="business-outline" size={size} color={color} />) }}
      />
    </Tabs>
  );
}