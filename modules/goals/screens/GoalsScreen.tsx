import ProgressBar from "@/components/charts/ProgressBar";
import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import GoalItemCard from "../components/GoalItemCard";
import { useGoalsResumen } from "../hooks/useGoalsResumen";
import { Goals } from "../types/Goals";

export default function OrderSearchScreen() {
  const { role } = useAuthStore();
  const { isDark } = useThemeStore();

  const [searchText, setSearchText] = useState("");

  const {
    goals,
    loadGoals,
    loading,
    error,
    totalAsignada,
    totalUtilizado,
    totalDisponible,
    totalPercent,
    totalArticles,
    handleRefresh,
    refreshing,
    canRefresh,
    cooldown,
  } = useGoalsResumen(searchText);

  const showPercent = (totalPercent * 100).toFixed(0);
  const hasPermission = role === "1" || role === "2";

  const resumenData = useMemo(
    () => [
      {
        icon: "flag-outline",
        label: "Asignado",
        value: totalAsignada,
      },
      {
        icon: "ribbon-outline",
        label: "Usado",
        value: totalUtilizado,
      },
      {
        icon: "alert-circle-outline",
        label: "Disponible",
        value: totalDisponible,
      },
    ],
    [totalAsignada, totalUtilizado, totalDisponible]
  );

  const renderItem = ({ item }: { item: Goals }) => (
    <GoalItemCard item={item} />
  );

 
  if (error) return <ErrorView error={error} getData={loadGoals} />;

  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Buscar meta por artículo..."
      onFilterPress={() => {}}
      extrafilter={false}
      headerVisible={false}
    >
      {!loading ? (
        <>
          <View className="mx-4 py-1">
            <ScrollView
              className="py-1 pb-4"
              horizontal
              contentContainerClassName="flex-row justify-between items-stretch gap-2 px-1 min-w-full"
              showsHorizontalScrollIndicator={false}
            >
              {resumenData.map((item, index) => (
                <View
                  key={index}
                  className="items-center p-3 bg-componentbg dark:bg-dark-componentbg shadow-sm shadow-black/10 rounded-xl min-w-32"
                >
                  <View className="flex-row items-center gap-1 mb-1">
                    <Ionicons
                      name={item.icon as any}
                      size={14}
                      color={isDark ? "white" : "black"}
                    />
                    <Text className="text-sm text-foreground dark:text-dark-foreground">
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-primary dark:text-dark-primary">
                    {item.value}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View className="mt-2 px-2">
              <ProgressBar progress={totalPercent} />
              <Text className="text-sm font-semibold text-center text-primary dark:text-dark-primary mt-1">
                {showPercent}%
              </Text>
            </View>
          </View>

          <CustomFlatList
            data={goals}
            refreshing={refreshing}
            canRefresh={canRefresh}
            cooldown={cooldown}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.codart}-${index}`}
            handleRefresh={handleRefresh}
            showtitle
            title={`${totalArticles} artículos`}
            ListEmptyComponent={
              <View className="p-10 items-center">
                <Text className="text-foreground dark:text-dark-foreground">
                  No se encontraron metas...
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <Loader />
      )}
    </ScreenSearchLayout>
  );
}
