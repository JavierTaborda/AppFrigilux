import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";

import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  const { theme } = useThemeStore();

  return (
    <>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerType: "front",
          drawerStyle: {
            backgroundColor: theme === "dark"
              ? appColors.dark.background
              : appColors.background,
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      </Drawer>
    </>
  );
}
