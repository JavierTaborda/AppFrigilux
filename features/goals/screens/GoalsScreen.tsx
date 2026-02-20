import ProgressBar from "@/components/charts/ProgressBar";
import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import FastFilters from "../components/FastFilters";
import GoalItemCard from "../components/GoalItemCard";
import GoalsResumen from "../components/GoalResumen";
import GoalsFilterModal from "../components/GoalsFilterModal";
import { useGoalsResumen } from "../hooks/useGoalsResumen";
import { Goals } from "../types/Goals";
export default function GoalsScreen() {
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
    totalFilters,
    // filters
    loadingFilters,
    notUsed,
    setNotUsed,
    sortByUsed,
    setSortByUsed,
    sortByAssigned,
    setSortByAssigned,
    sellers,
    selectedSellers,
    setSelectedSellers,
    category,
    selectedCategory,
    setSelectedCategory,
    setSelectedUsedValue,
    selectedUsedValue,
    usedValues,
  } = useGoalsResumen(searchText);

  const showPercent = (totalPercent * 100).toFixed(0);
  const hasPermission = role === "1" || role === "2";
  const [headerVisible, setHeaderVisible] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSearchText("");
    }, []),
  );

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
    [totalAsignada, totalUtilizado, totalDisponible],
  );

  const renderItem = useCallback(
    ({ item }: { item: Goals }) => (
      <GoalItemCard item={item} hasPermission={hasPermission} />
    ),
    [hasPermission],
  );
  const extraFilters = useMemo(
    () => (
      <FastFilters
        notUsed={notUsed}
        setNotUsed={setNotUsed}
        sortByUsed={sortByUsed}
        setSortByUsed={setSortByUsed}
        sortByAssigned={sortByAssigned}
        setSortByAssigned={setSortByAssigned}
      />
    ),
    [notUsed, sortByUsed, sortByAssigned],
  );

  if (error) return <ErrorView error={error} getData={loadGoals} />;

  return (
    <>
      <ScreenSearchLayout
        searchText={searchText}
        setSearchText={setSearchText}
        placeholder="Buscar meta por artículo..."
        onFilterPress={() => setFilterVisible(true)}
        extrafilter={true}
        headerVisible={headerVisible}
        filterCount={totalFilters}
        extraFiltersComponent={extraFilters}
      >
        {!loading ? (
          <>
            <View className="mx-4 pb-0.5">
              <GoalsResumen data={resumenData} isDark={isDark} />

              <View className="mt-1 px-2">
                <ProgressBar progress={totalPercent} />
                <Text className="text-sm font-semibold text-center text-primary dark:text-dark-primary">
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
              onHeaderVisibleChange={setHeaderVisible}
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

      {filterVisible && (
        <GoalsFilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(selected, seletedCategery, selectedUsed) => {
            setSelectedSellers(selected);
            setSelectedCategory(seletedCategery);
            setSelectedUsedValue(selectedUsed);
            setFilterVisible(false);
          }}
          hasPermission={hasPermission}
          sellers={sellers}
          selectedSellers={selectedSellers}
          category={category}
          selectedCategory={selectedCategory}
          usedValues={usedValues}
          seletedUsedValue={selectedUsedValue}
          loading={loadingFilters}
        />
      )}
    </>
  );
}
