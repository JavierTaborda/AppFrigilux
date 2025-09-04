import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import { emojis } from "@/utils/emojis";
import { totalVenezuela } from "@/utils/moneyFormat";
import { router } from "expo-router";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import HomeSkeleton from "../components/HomeSkeleton";
import { InfoCard } from "../components/InfoCard";
import { ModuleButton } from "../components/ModuleButton";
import { useHomeScreen } from "../hooks/useHomeScreen";

export default function HomeScreen() {
  const { session } = useAuthStore();
  const { isDark } = useThemeStore();
  const { loading, error, totalsByDate, totalPedidos, totalNeto, getData } =
    useHomeScreen();

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

  // Skeleton
  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <View className="flex-1 p-2  bg-background dark:bg-dark-background">
        <View className="items-center mt-20 ">
          <Text className="text-6xl pt-1">{emojis.invalid}</Text>
          <Text className="text-4xl font-extrabold text-red-500 dark:text-red-400 mb-2">
            Ups,
          </Text>
          <Text className="text-red-500 dark:text-red-400 mb-2">{error}</Text>

          <Pressable className="p-4 bg-warning dark:bg-dark-warning rounded-full" onPress={getData}>
            <Text className="text-foreground  font-semibold">Reintentar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-background dark:bg-dark-background">
      <View className="flex-row items-center mt-2 mb-4">
        <Text className="text-black dark:text-white text-xl font-semibold">
          {emojis.user} Bienvenido
        </Text>
        <Text className=" text-xl text-black dark:text-white font-light">
          {" "}
          {session?.user.email}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between gap-4 mb-4">
        <InfoCard
          icon={emojis.package}
          title="Total Pedidos"
          value={totalPedidos}
          bgColor="bg-primary dark:bg-dark-primary"
        />
        <InfoCard
          icon={emojis.money}
          title="Total Neto"
          value={totalVenezuela(totalNeto)}
          bgColor="bg-secondary dark:bg-dark-secondary"
        />
      </View>

      <Text className="text-xl text-foreground dark:text-dark-foreground font-semibold mb-2 mt-2">
        {emojis.chartUp} Pedidos del mes actual
      </Text>
      {/* <View className="flex-row mb-2">
        <View className="flex-row items-center mr-4">
          <View className="w-4 h-4 bg-primary rounded-full mr-2" />
          <Text className="text-foreground dark:text-dark-foreground">
            Pedidos
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-secondary rounded-full mr-2" />
          <Text className="text-foreground dark:text-dark-foreground">
            Ventas
          </Text>
        </View>
      </View> */}

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
            renderDotContent={({ x, y, index }) => {
              if (x == null || y == null) return null;
              return (
                <Text
                  key={`dot-${index}`}
                  style={{
                    position: "absolute",
                    top: y - 20,
                    left: x - 15,
                    zIndex: 10,
                  }}
                  className="text-xs font-bold text-secondary dark:text-dark-secondary"
                >
                  {totalsByDate[index]?.label}
                </Text>
              );
            }}
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
      <Text className="text-xl text-foreground dark:text-dark-foreground font-semibold pt-1 mb-2 mt-2">
        {emojis.search} Módulos principales
      </Text>

      <View className="flex-row justify-between">
        <ModuleButton
          icon={emojis.approved}
          label="Aprobación Pedidos"
          onPress={() => router.push("/(main)/(tabs)/(orders)/orderApproval")}
          bgColor=" bg-primary dark:bg-dark-primary"
        />
        <ModuleButton
          icon={emojis.bags}
          label="Crear Pedido"
          bgColor="bg-gray-300 dark:bg-gray-700"
        />
      </View>
    </ScrollView>
  );
}
