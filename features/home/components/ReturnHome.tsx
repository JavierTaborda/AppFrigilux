import { router } from "expo-router";
import { Text, View } from "react-native";
import { ModuleButton } from "./ModuleButton";

export default function ReturnHome({ name }: { name: string | null }) {
  const displayName = name?.trim() || "Usuario";

  return (
    <View className="px-4 py-3">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-sm text-foreground/70 dark:text-dark-foreground/70">
          Inicio
        </Text>
        <Text className="mt-1 text-2xl font-extrabold text-foreground dark:text-dark-foreground">
          Bienvenido, {displayName}
        </Text>
        <Text className="mt-1 text-sm text-foreground/70 dark:text-dark-foreground/70"></Text>
      </View>

      {/* Card de acciones */}
      <View className="rounded-2xl bg-componentbg dark:bg-dark-componentbg p-4 shadow-sm">
        <Text className="mb-3 text-base font-semibold text-foreground dark:text-dark-foreground">
          Módulos
        </Text>

        <View className="flex-row flex-wrap justify-between">
          <View className="mb-3 w-[49%]">
            <ModuleButton
              label="Reportar Devolución"
              onPress={() => router.push("/(main)/(tabs)/(returnReport)")}
              bgColor="bg-green-600 dark:bg-green-600"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
