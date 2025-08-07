import { useAuthStore } from "@/stores/useAuthStore";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSegments } from "expo-router";
import { Image, Text, View } from "react-native";
import { DrawerItem } from "./DrawerItem";

export default function CustomDrawerContent(props: any) {
  const { session, role } = useAuthStore();
  const segments = useSegments();
  const currentPath = "/" + segments.join("/");


  return (

    <DrawerContentScrollView
      {...props}
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
          {role ? `${role}` : "Sin Perfil Asignado"}
        </Text>
      </View>

      <View className="mt-2 gap-2">
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mt-1 mb-1">
          Pagos
        </Text>

        <DrawerItem
          icon="calendar-outline"
          label="Planificacion Pagos"
          href="/(main)/(tabs)/(pays)/authPays"
          currentPath={currentPath}
        />
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mt-1 mb-1">
          Pedidos
        </Text>
        <DrawerItem
          icon="bag-check"
          label="Aprobación Pedidos"
          href="/(main)/(tabs)/(orders)/orderApproval"
          currentPath={currentPath}
        />



      </View>

    </DrawerContentScrollView >
  );

}
