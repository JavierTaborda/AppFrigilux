import { useThemeStore } from '@/stores/useThemeStore';
import { appColors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function getTabIcon(routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case '(home)/index':
      return focused ? 'home' : 'home-outline';
    case '(profile)/index':
      return focused ? 'person' : 'person-outline';
    case '(settings)/index':
      return focused ? 'settings-sharp' : 'settings-outline';
    default:
      return 'ellipse';
  }
}

export default function TabLayout() {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        animationEnabled: true,

        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={getTabIcon(route.name, focused)} size={size} color={color} />
        ),
        //Button styles of tab
        tabBarButton: (props: BottomTabBarButtonProps) => {
          const { onPress, onLongPress, accessibilityState, accessibilityLabel, testID, children } = props;
          const focused = accessibilityState?.selected ?? false;

          //Color  ripple 
          const rippleColor = focused
            ? appColors.primary.DEFAULT
            : theme === 'dark'
              ? 'rgba(255,255,255,0.15)'
              : 'rgba(0,0,0,0.08)';
          return (
            <Pressable
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              android_ripple={{
                color: rippleColor,
                borderless: false,
                radius: 60,
              }}

            >
              <View
                style={{
                  borderRadius: 40,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {children}
              </View>
            </Pressable>
          );
        },
        // Tab bar visual styling
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor:
            theme === 'dark'
              ? appColors.dark.background
              : appColors.background,
          borderTopWidth: 1,
          borderTopColor:
            theme === 'dark'
              ? appColors.dark.separator
              : appColors.separator,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 10,
        },

        tabBarActiveTintColor: appColors.primary.DEFAULT,
        tabBarInactiveTintColor: appColors.mutedForeground,
        //  Tab item style 
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        // Header configuration
        headerShown: true,
        headerLeft: () => (
          <DrawerToggleButton
            tintColor={
              theme === 'dark'
                ? appColors.dark.foreground
                : appColors.background
            }
          />
        ),
        headerStyle: {
          backgroundColor:
            theme === 'dark'
              ? appColors.dark.primary.DEFAULT
              : appColors.primary.DEFAULT,
          borderBottomWidth: 0,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
        },
        headerTintColor:
          theme === 'dark'
            ? appColors.dark.foreground
            : appColors.background,
      })}
    >
   
      <Tabs.Screen
        name="(home)/index"
        options={{ title: 'Inicio' }}
      />  
       <Tabs.Screen
        name="(profile)/index"
        options={{ title: 'Perfil' }}
      />
      <Tabs.Screen
        name="(settings)/index"
        options={{ title: 'Ajustes' }}
      />


      {/*  not shown in tab bar */}
      <Tabs.Screen
        name="(pays)/authPays"
        options={{
          href: null,// makes route invisible in tabs
          headerShown: true,
          title: 'Autorización de Pagos',
        }}
      />
      <Tabs.Screen
        name="(orders)/orderApproval"
        options={{
          href: null,// makes route invisible in tabs
          headerShown: true,
          title: 'Aprobación de Pedidos',
        }}
      />
    </Tabs>
  );
}
