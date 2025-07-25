import CustomDrawerContent from '@/components/drawer/CustomDrawerContent';
import { useThemeStore } from '@/stores/useThemeStore';
import { appColors } from '@/utils/colors';

import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {

  const { theme } = useThemeStore()


  return (
    <>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: appColors.primary.DEFAULT },
          swipeEdgeWidth: 60,
          headerTintColor: appColors.muted,
          headerLeft: (props) =>
            route.name?.includes('(auth)')
              ? null
              : <DrawerToggleButton {...props} />,


        })}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: true }} />
        <Drawer.Screen
          name="(auth)"
          options={{
            drawerItemStyle: { display: 'none' },
            swipeEnabled: false,
          }}
        />

      </Drawer>
    </>
  );
}