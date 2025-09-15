import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import Loader from "@/components/ui/Loader";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import useCreateOrder from "../hooks/useCreateOrder";

export default function CreateOrderScreen() {
  const { loading, error, products, handleRefresh, refreshing, canRefresh } =
    useCreateOrder();

  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  if (loading) return <Loader />;

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500">Error al cargar productos: {error}</Text>
      </View>
    );
  }

  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Código o descripción..."
      onFilterPress={() => setFilterModalVisible(true)}
      headerVisible={headerVisible}
      extrafilter={true}
    >
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
        onHeaderVisibleChange={setHeaderVisible}
        showtitle={true}
        numColumns={2}
      />

      {/* Botón flotante de ver orden */}
      <TouchableOpacity
        onPress={() => alert("Ver Orden")}
        className="bg-primary dark:bg-dark-primary p-4 rounded-full shadow-lg"
        style={{ position: "absolute", zIndex: 50, right: 20, bottom: 160 }}
        accessibilityHint="Ver Orden"
        accessibilityLabel="Ver Orden"
        accessibilityRole="button"
      >
        <Ionicons name="bag" size={24} color="white" />
      </TouchableOpacity>
    </ScreenSearchLayout>
  );
}
