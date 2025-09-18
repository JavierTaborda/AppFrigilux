import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OrderModal from "../components/OrderModal";
import ProductCard from "../components/ProductCard";
import useCreateOrder from "../hooks/useCreateOrder";

export default function CreateOrderScreen() {
  const {
    loading,
    error,
    products,
    handleRefresh,
    refreshing,
    canRefresh,
    createOrder,
  } = useCreateOrder();

  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorView error={error} getData={handleRefresh}/>
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
            available={item.available}
          />
        )}
        keyExtractor={(item, index) => `${item.code}-${index}`}
        refreshing={refreshing}
        canRefresh={canRefresh}
        handleRefresh={handleRefresh}
        onHeaderVisibleChange={setHeaderVisible}
        showtitle={true}
        numColumns={2}
        showScrollTopButton={false}
      />

      <View
        style={{
          position: "absolute",
          zIndex: 50,
          bottom: 120,
          paddingHorizontal: 20,
        }}
        className="flex-row gap-3 w-full "
      >
        <TouchableOpacity
          className="bg-primary dark:bg-dark-primary p-4 flex-1 items-center justify-center rounded-full shadow-lg  shadow-inherit"
          onPress={() =>
            router.push("/(main)/(tabs)/(createOrder)/order-summary")
          }
        >
          <View className="flex-row gap-1 items-center">
            <Ionicons name="checkmark-sharp" size={24} color="white" />
            <Text className="text-lg font-semibold text-white">
              Confirmar pedido
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          // onPress={() => alert("Ver Pedido")}
          className="bg-primary dark:bg-dark-primary p-4 rounded-full shadow-lg"
          accessibilityHint="Ver Pedido"
          accessibilityLabel="Ver Pedido"
          accessibilityRole="button"
        >
          <Ionicons name="bag" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal */}

      <OrderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
           router.push("/(main)/(tabs)/(createOrder)/order-summary");
        }}
      />
    </ScreenSearchLayout>
  );
}
