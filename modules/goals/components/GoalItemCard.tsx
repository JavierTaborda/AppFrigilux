import ProgressBar from "@/components/charts/ProgressBar";
import CustomImage from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { Text, View } from "react-native";
import { Goals } from "../types/Goals";

type Props = {
  item: Goals;
};

export default function GoalItemCard({ item }: Props) {
  const img = `${imageURL}${item.codart?.trim()}.jpg`;
  const disponibles = item.asignado - item.utilizado;
  const disText = disponibles > 1 ? "Disponibles" : "Disponible";
  const usadosText = item.utilizado > 1 ? "usados" : "usado";
  const asignadosText = item.asignado > 1 ? "asignados" : "asignado";
  const progress = item.asignado > 0 ? item.utilizado / item.asignado : 0;
  const perc = (progress * 100).toFixed(0);

  return (
    <View className="mt-3 p-3 bg-white dark:bg-dark-componentbg rounded-2xl shadow-md shadow-black/10">
      <View className="flex-row items-center mb-2">
        <View className="w-20 h-20 rounded-xl bg-bgimages dark:bg-gray-800 justify-center items-center overflow-hidden mr-4 shadow-sm">
          <CustomImage img={img} />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
            {item.codart || "N/A"}
          </Text>
          <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
            {item.artdes || "Sin descripción"}
          </Text>
        </View>

        <View className="ml-3">
          <View className="flex-row items-center bg-tertiary dark:bg-dark-tertiary px-3 py-1.5 rounded-xl">
            <Text className="text-white text-sm font-semibold">
              {disponibles} {disText}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {item.utilizado} {usadosText}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {item.asignado} {asignadosText}
          </Text>
        </View>

        <ProgressBar progress={progress} />

        <View className="flex-row justify-center items-center">
          <Text className="text-sm font-medium text-primary dark:text-dark-primary">
            {perc}%
          </Text>
        </View>
      </View>
    </View>
  );
}
