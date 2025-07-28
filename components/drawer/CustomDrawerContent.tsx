import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
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
                backgroundColor: isDark ? appColors.dark.background : appColors.background,
                paddingTop: 0,
            }}
        >
            {/* Header */}
            <View className="items-center py-6 border-b border-gray-200 dark:border-gray-700">
                <Image
                    source={require("@/assets/images/Logo.png")}
                    style={{ width: 100, height: 80, resizeMode: "contain" }}
                />
            </View>

            <Text >Planificacion de Pagos</Text>
            <Link href="/(main)/(tabs)/[hidden]/pays" asChild>
                <TouchableOpacity className="w-10/12 bg-primary">
                    <Text>Planificacion</Text>
                </TouchableOpacity>
            </Link>

        </DrawerContentScrollView>

    );
}
