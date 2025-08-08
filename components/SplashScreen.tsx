import { Text, View } from "react-native";
import Loader from "./ui/Loader";

export default function SplashScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
      <Text className="text-xl text-primary font-bold mb-4">Cargando app...</Text>
      <Loader />
    </View>
  );
}
