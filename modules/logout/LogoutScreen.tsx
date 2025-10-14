import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { getBiometricEnabled } from "@/utils/biometricFlag";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

export default function LogoutScreen() {
  const { signOut, signOutSoft } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const isEnabled = await getBiometricEnabled();
      isEnabled ? await signOutSoft() : await signOut();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      Alert.alert(
        "¿Cerrar sesión?",
        "¿Estás seguro de que deseas salir?",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => router.push("/(main)/(tabs)/(home)"),
          },
          {
            text: "Sí, salir",
            onPress: () => handleSignOut(),
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    }, [])
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background" />
  );
}
