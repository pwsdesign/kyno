import { Tabs } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { colors, fonts, getColors } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { isDark, toggleTheme, theme } = useTheme();
  const c = getColors(isDark);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#35322C' : c.background,
          borderTopColor: c.borderSubtle,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 10,
          paddingBottom: 24,
        },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 9,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{'\u2302'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{'\u25C8'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{'\u25F7'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{'\u25CB'}</Text>
          ),
        }}
      />
    </Tabs>
  );
}
