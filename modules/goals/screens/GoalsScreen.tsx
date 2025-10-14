import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import CustomImage from "@/components/ui/CustomImagen";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { appColors } from "@/utils/colors";
import { imageURL } from "@/utils/imageURL";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { useGoalsResumen } from "../hooks/useGoalsResumen";
import { Goals } from "../types/Goals";

export default function OrderSearchScreen() {
  const { role } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const hasPermission = role === "1" || role === "2";

  const {
    loadGoals,
    loading,
    error,
    goals,
    totalAsignada,
    totalDisponible,
    totalUtilizado,
    totalPorcent,
  } = useGoalsResumen(searchText);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const renderOrderItem = ({ item }: { item: Goals }) => {
    const img = `${imageURL}${item.codart?.trim()}.jpg`;
    return (
      <View className="p-4 border-b border-gray-200 dark:border-gray-700">
        <View className="w-16 h-16 mb-2 rounded-2xl bg-bgimages justify-center items-center overflow-hidden">
          <CustomImage img={img} />
        </View>
        <Text className="text-foreground dark:text-dark-foreground">
          {item.codart ?? JSON.stringify(item)}
        </Text>
        <Text className="text-foreground dark:text-dark-foreground">
          {item.artdes ?? JSON.stringify(item)}
        </Text>
        <Text className="text-foreground dark:text-dark-foreground">
         Disponibles {(Number(item.asignado-item.utilizado)) ?? JSON.stringify(item)}
        </Text>
      </View>
    );
  };

  if (loading) return <Loader />;

  if (error) {
    return <ErrorView error={error} getData={loadGoals} />;
  }

  return (
    <>
      <ScreenSearchLayout
        searchText={searchText}
        setSearchText={setSearchText}
        placeholder="Cliente o número de pedido..."
        onFilterPress={() => setFilterVisible(true)}
        //filterCount={activeFiltersCount}
        extrafilter={false}
        headerVisible={false}
      >
        <View className=" bg-componentbg dark:bg-dark-componentbg rounded-xl mx-4 py-4 px-2 shadow-md">
          <View className="flex-row justify-between items-center p-2 gap-2">
            <View className="items-center p-2 bg-primary rounded-xl  min-w-32">
              <View className="flex-row items-center gap-2">
                <Ionicons name="flag-outline" size={12} color="white" />
                <Text className="text-md font-normal text-white">
                  Asignadas
                </Text>
              </View>
              <Text className="text-3xl font-bold p-1 text-white">
                {totalAsignada}
              </Text>
            </View>
            <View className="items-center p-2 bg-primary rounded-xl  min-w-32">
              <View className="flex-row items-center justify-around gap-2">
                <Ionicons name="ribbon-outline" size={12} color="white" />
                <Text className="text-md font-normal text-white"> Usados</Text>
              </View>
              <Text className="text-3xl font-bold p-1 text-white">
                {totalUtilizado}
              </Text>
            </View>

            <View className="items-center p-2 bg-primary rounded-xl  min-w-32">
              <View className="flex-row items-center gap-2">
                <Ionicons name="alert-circle-outline" size={12} color="white" />
                <Text className="text-md font-normal text-white">
                  Disponibles
                </Text>
              </View>
              <Text className="text-3xl font-bold p-1 text-white">
                {totalDisponible}
              </Text>
            </View>
          </View>

          <Progress.Bar
            progress={totalPorcent}
            width={null}
            animated={true}
            color={appColors.primary.DEFAULT}
            borderRadius={8}
            height={8}
            style={{ marginTop: 10 }}
          />
          <View className="flex-row items-center justify-center">
            <Text className="text-foreground dark:text-dark-foreground text-sm font-light">
              {(totalPorcent * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
        <CustomFlatList
          data={goals}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.codart}-${index}`}
          refreshing={false}
          canRefresh={false}
          handleRefresh={loadGoals}
          //cooldown={cooldown}
          showtitle={true}
          //   title={`${totalOrders} ${totalOrders > 1 ?  'pedidos': 'pedido'}`}
          //   subtitle={`Total ${totalVenezuela(totalUSD)}$`}
          ListEmptyComponent={
            <View className="p-10 items-center">
              <Text className="text-foreground dark:text-dark-foreground">
                No se encontraron metas...
              </Text>
            </View>
          }
        />
      </ScreenSearchLayout>

      {/* {modalInfoVisible && (
        <OrderApprovalInfoModal
          visible={modalInfoVisible}
          onClose={() => setModalInfoVisible(false)}
          order={selectedOrder || undefined}
        />
      )} */}
    </>
  );
}
