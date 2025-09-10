import { useState } from "react";
import { Text, View } from "react-native";

import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import Loader from "@/components/ui/Loader";
import ProductCard from "../components/ProductCard";
import useCreateOrder from "../hooks/useCreateOrder";

export default function AuthorizationScreen() {
  const { loading, error, createOrder, products, handleRefresh, refreshing, canRefresh } = useCreateOrder();

  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Código o descripción..."
      onFilterPress={() => setFilterModalVisible(true)}
      headerVisible={false}
      extrafilter={false}
    >
      <View className="flex-1 items-center pt-1">
        <CustomFlatList
          
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              code={item.code}
              title={item.title}
              price={item.price}
              image={item.image}
            />
          )}
          keyExtractor={(item, index) => `${item.code}-${index}`}
          refreshing={refreshing}
          canRefresh={canRefresh}
          handleRefresh={handleRefresh}
          //onHeaderVisibleChange={setHeaderVisible} // Only if use extrafilter={true} on ScreenSearchLayout
          showtitle={true}
          //title={`${totalOrders} pedidos`}
          //subtitle={`con total ${totalVenezuela(totalUSD)}$`}
          ListEmptyComponent={
            <View className="p-10 items-center">
              <Text className="text-foreground dark:text-dark-foreground">
                No se encontraron prooductos...
              </Text>
            </View>
          }
            numColumns={2}
        />

        {/*       
        <FlatList
          data={products}
          keyExtractor={(item) => item.code}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard
              code={item.code}
              title={item.title}
              price={item.price}
              image={item.image}
            />
          )}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding:4, paddingBottom: 140 }}
        /> */}
      </View>
    </ScreenSearchLayout>
  );
}
