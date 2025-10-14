import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";

import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { Text } from "react-native";

export default function OrderSearchScreen() {
  const { role } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const hasPermission = role === "1" || role === "2";

  if (loading) return <Loader />;

  //   if (error) {
  //     return <ErrorView error={error} getData={} />;
  //   }

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
        {/* <CustomFlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.fact_num}-${index}`}
          refreshing={refreshing}
          canRefresh={canRefresh}
          handleRefresh={()=>handleRefresh(filters)}
          cooldown={cooldown}
          showtitle={true}
          title={`${totalOrders} ${totalOrders > 1 ?  'pedidos': 'pedido'}`}
          subtitle={`Total ${totalVenezuela(totalUSD)}$`}
          ListEmptyComponent={
            <View className="p-10 items-center">
              <Text className="text-foreground dark:text-dark-foreground">
                No se encontraron pedidos...
              </Text>
            </View>
          }
        /> */}
        <Text> Hola</Text>
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
