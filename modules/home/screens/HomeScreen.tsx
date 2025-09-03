import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import { totalVenezuela } from "@/utils/moneyFormat";
import { router } from "expo-router";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useHomeScreen } from "../hooks/useHomeScreen";

export default function HomeScreen() {
  const { session } = useAuthStore();
  const { isDark } = useThemeStore();
  const { loading, totalsByDate, totalPedidos, totalNeto } = useHomeScreen();

  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: totalsByDate.map((t) => t.dayLabel),
    datasets: [{ data: totalsByDate.map((t) => t.y) }],
  };

  const chartConfig = {
    padding: 0,
    backgroundColor: isDark ? appColors.dark.background : appColors.background,
    backgroundGradientFrom: isDark
      ? appColors.dark.background
      : appColors.background,
    backgroundGradientTo: isDark
      ? appColors.dark.background
      : appColors.background,
    decimalPlaces: 0,
    color: () =>
      isDark ? appColors.primary.DEFAULT : appColors.primary.DEFAULT,
    labelColor: () =>
      isDark ? appColors.dark.foreground : appColors.foreground || "#000",
    barPercentage: 1,
    propsForDots: {
      r: "3",
      strokeWidth: "4",
      stroke: isDark ? appColors.primary.DEFAULT : appColors.primary.DEFAULT,
    },
  };

  // Skeleton mientras carga
  if (loading) {
    return (
      <View className="flex-1 p-4 bg-background dark:bg-dark-background">
        <View className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 h-20 rounded-lg p-4 mr-2 bg-gray-300 dark:bg-gray-700 animate-pulse" />
          <View className="flex-1 h-20 rounded-lg p-4 ml-2 bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </View>
        <View className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="h-[250px] w-[300px] bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-background dark:bg-dark-background">
      <Text className="text-black dark:text-white text-xl mb-4">
        Bienvenido {session?.user.email}
      </Text>

      {/* Cards principales */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 h-20 rounded-lg p-4 mr-2 bg-primary dark:bg-dark-primary">
          <Text className="text-white font-bold">Total Pedidos</Text>
          <Text className="text-white text-xl font-semibold">
            {totalPedidos}
          </Text>
        </View>
        <View className="flex-1 h-20 rounded-lg p-4 ml-2 bg-secondary dark:bg-dark-secondary">
          <Text className="text-white font-bold">Total Neto</Text>
          <Text className="text-white text-xl font-semibold">
            {totalVenezuela(totalNeto)}
          </Text>
        </View>
      </View>

      {/* Gráfica */}
      <Text className="text-xl text-foreground dark:text-dark-foreground font-semibold mb-2">
        📈 Pedidos del mes actual
      </Text>

      {totalsByDate.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <LineChart
            data={data}
            width={Math.max(totalsByDate.length * 25, screenWidth)}
            height={250}
            verticalLabelRotation={0}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            formatYLabel={(y) => y}
            renderDotContent={({ x, y, index }) => (
              <Text
                key={index}
                style={{ position: "absolute", top: y - 20, left: x - 15 }}
                className="text-xs font-bold text-secondary dark:text-dark-secondary"
              >
                {totalsByDate[index].label}
              </Text>
            )}
            chartConfig={chartConfig}
            style={{ borderRadius: 8, paddingVertical: 2, marginTop: 5 }}
            bezier
          />
        </ScrollView>
      ) : (
        <Text className="text-foreground dark:text-dark-foreground">
          No hay datos para mostrar.
        </Text>
      )}

      {/* Módulos principales */}
      <Text className="text-xl text-foreground dark:text-dark-foreground font-semibold pt-1 mb-2">
        Módulos principales
      </Text>
      <View className="flex-row justify-between">
        <Pressable
          onPress={() => router.push("/(main)/(tabs)/(orders)/orderApproval")}
          className="flex-1 h-32 rounded-lg mr-2 items-center justify-center bg-primary dark:bg-dark-primary"
        >
          <Text className="text-white text-center text-lg font-bold">
            Aprobación Pedidos
          </Text>
        </Pressable>
        <View className="flex-1 h-32 rounded-lg ml-2 items-center justify-center bg-gray-300 dark:bg-gray-700">
          <Text className="text-white text-lg font-bold">Crear Pedido</Text>
        </View>
      </View>
    </ScrollView>
  );
}
