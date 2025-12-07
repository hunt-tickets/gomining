import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme } from '@/theme';
import { Icon, IconPresets } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TAB LAYOUT
// ═══════════════════════════════════════════════════════════════════

export default function TabLayout() {
  const { tokens } = useTheme();
  const { tabBar } = tokens.components;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabBar.activeColor,
        tabBarInactiveTintColor: tabBar.inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBar.background,
          borderTopColor: tabBar.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          height: Platform.OS === 'ios' ? 88 : 68,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? IconPresets.dashboardFilled : IconPresets.dashboard}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="farm"
        options={{
          title: 'My Farm',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? IconPresets.farmFilled : IconPresets.farm}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="advisor"
        options={{
          title: 'AI Advisor',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? IconPresets.advisorFilled : IconPresets.advisor}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? IconPresets.settingsFilled : IconPresets.settings}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
