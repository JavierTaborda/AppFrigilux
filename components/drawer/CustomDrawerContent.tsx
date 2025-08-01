import { useAuthStore } from "@/stores/useAuthStore";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSegments } from "expo-router";
import { Image, Text, View } from "react-native";
import { DrawerItem } from "./DrawerItem"; // este archivo lo creamos abajo

export default function CustomDrawerContent(props: any) {
  const { session } = useAuthStore();
  const segments = useSegments();
  const currentPath = "/" + segments.join("/");

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle="flex-1 px-5 bg-background dark:bg-dark-background"
    >
      {/* Header*/}
      <View className="items-center py-3 border-b border-b-slate-300 dark:border-b-slate-800">
        <Image
          source={require("@/assets/images/Logo.png")}
          className="w-20 h-20 rounded-full"
        />
        <Text className="text-base font-bold text-foreground dark:text-dark-foreground mt-1">
         {session?.user.email}
        </Text>
        <Text className="text-xs font-semibold text-foreground dark:text-dark-foreground">
          Rol
        </Text>
      </View>

      {/* rutes */}
      <View className="mt-2 gap-2">
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mt-1 mb-1">
          Planificación Pagos
        </Text>

        <DrawerItem
          href="/(main)/(tabs)/(pays)/authPays"
          icon="checkmark"
          label="Autorización Pagos"
          currentPath={currentPath}
        />
         <DrawerItem
          href="/(main)/(tabs)/(pays)/authPays"
          icon="checkmark"
          label="Autorización Pagos"
          currentPath={currentPath}
        />
      </View>

      
    </DrawerContentScrollView>
  );
}
