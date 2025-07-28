import CustomDrawerContent from '@/components/drawer/CustomDrawerContent';
import { useThemeStore } from '@/stores/useThemeStore';

import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {

  const { theme } = useThemeStore()


  return (
    <>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      </Drawer>

    </>
  );
}