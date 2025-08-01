import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Link, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CustomDrawerContent(props: any) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();



  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: isDark ? appColors.dark.background : appColors.background,
      }}
    >
      {/* 🖼️ Encabezado */}
      <View
        style={{
          alignItems: "center",
          paddingVertical: 24,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#444" : "#ccc",
        }}
      >
        <Image
          source={require("@/assets/images/Logo.png")}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 8 }}>Javier</Text>
        <Text style={{ fontSize: 14, color: appColors.mutedForeground }}>Desarrollador</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 12 }}>Navegación</Text>

        <Link href="/(main)/(tabs)/(pays)/authPays" asChild>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderRadius: 8,
              backgroundColor: appColors.componentbg,
              marginBottom: 12,
            }}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={{ marginLeft: 10, color: "#fff", fontWeight: "600" }}>
              Planificación
            </Text>
          </TouchableOpacity>
        </Link>

        
      </View>



    </DrawerContentScrollView>
  );
}