import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSegments } from "expo-router";
import { Image, Text, View } from "react-native";
import { DrawerItem } from "./DrawerItem";

export default function CustomDrawerContent(props: any) {
  const { session } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
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
          {session?.user.role}
        </Text>
      </View>

      <View className="mt-2 gap-2">
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mt-1 mb-1">
        </Text>
        {/* <Link href="/(main)/(tabs)/(pays)/authPays" asChild>
          <TouchableOpacity
            className={`flex-row items-center py-3 px-3 rounded-2xl ${currentPath === '/(main)/(tabs)/(pays)/authPays' ? "bg-primary-light dark:bg-dark-primary" : "bg-componentbg dark:bg-dark-componentbg"}`}          >
            <Ionicons name="calendar-outline" size={20} color={isDark ? "white" : "black"} />
            <Text className="ms-2 font-medium text-sm text-foreground dark:text-dark-foreground">
              Planificación Pagos
            </Text>
          </TouchableOpacity>
        </Link> */}
 
          <DrawerItem
            icon="calendar-outline"
            label="Planificacion Pagos"
            href="/(main)/(tabs)/(pays)/authPays"
            currentPath={currentPath}

          />
   


      </View>
    </DrawerContentScrollView >
  );

}
