import { useThemeStore } from '@/stores/useThemeStore';
import { appColors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';


// Icon mapping based on tab route name
function getTabIcon(routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case '(home)/index':
      return focused ? 'home' : 'home-outline';
    case '(profile)/index':
      return focused ? 'person' : 'person-outline';
    default:
      return 'ellipse';
  }
}

export default function TabLayout() {
  const { theme } = useThemeStore();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        animationEnabled: true,

        //  Tab icon rendering based on route and focus
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={getTabIcon(route.name, focused)} size={size} color={color} />
        ),

        // Tab bar visual styling
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          height: 70,
          backgroundColor: theme === 'dark' ? appColors.dark.background : appColors.background,
          borderTopWidth: 1,
          borderTopColor: theme === 'dark' ? appColors.dark.separator : appColors.separator,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 10,
        },

        tabBarActiveTintColor: appColors.primary.DEFAULT,
        tabBarInactiveTintColor: appColors.mutedForeground,

        //  Tab label style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        //  Tab item style 
        tabBarItemStyle: {
          borderRightWidth: 0,
        },

        // Header configuration
        headerShown: true,
        headerLeft: () => <DrawerToggleButton tintColor={theme === 'dark' ? appColors.dark.foreground : appColors.background} />,
        headerStyle: {
          backgroundColor: theme === 'dark'
            ? appColors.dark.primary.DEFAULT
            : appColors.primary.DEFAULT,
          borderBottomWidth: 0,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,

        },
        headerTintColor: theme === 'dark'
          ? appColors.dark.foreground
          : appColors.background,



      })}
    >
      {/*Home tab */}
      <Tabs.Screen
        name="(home)/index"
        options={{ title: 'Inicio' }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="(profile)/index"
        options={{ title: 'Perfil' }}
      />

      {/*  not shown in tab bar */}
      <Tabs.Screen
        name="(pays)/authPays"
        options={{
          href: null,          // makes route invisible in tabs
          headerShown: true,
          title: 'Autorización de Pagos'
        }}
      />
    </Tabs>
  );
}