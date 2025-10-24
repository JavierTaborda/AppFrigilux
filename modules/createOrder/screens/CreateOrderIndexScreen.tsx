import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FastFilters from "../components/FastFilters";
import OrderModal from "../components/OrderModal";
import ProductCard from "../components/ProductCard";
import useCreateOrder from "../hooks/useCreateOrder";
import useCreateOrderStore from "../stores/useCreateOrderStore";

export default function CreateOrderScreen() {
   const [searchText, setSearchText] = useState("");
    const {
      loading,
      error,
      productItems,
      products,
      handleRefresh,
      refreshing,
      canRefresh,
      notUsed,
      setNotUsed,
      sortByAvailable,
      setSortByAvailable,
      sortByAssigned,
      setSortByAssigned,
    } = useCreateOrder(searchText);


  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { items } = useCreateOrderStore();
  const haveOrder = items?.length > 0;

  const { height } = Dimensions.get("window");

  const translateY = useSharedValue(height); // start hide
  const opacity = useSharedValue(0); // init invisible

  useEffect(() => {
    if (haveOrder) {
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
    } else {
      translateY.value = withTiming(height, {
        duration: 500,
        easing: Easing.in(Easing.exp),
      });
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.exp),
      });
    }
  }, [haveOrder]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (loading) return <Loader />;

  if (error) {
    return <ErrorView error={error} getData={handleRefresh} />;
  }

  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Código o descripción..."
      onFilterPress={() => setFilterModalVisible(true)}
      headerVisible={headerVisible}
      extrafilter={true}
      extraFiltersComponent={
        <FastFilters
          notUsed={notUsed}
          setNotUsed={setNotUsed}
          sortByAvailable={sortByAvailable}
          setSortByAvailable={setSortByAvailable}
          sortByAssigned={sortByAssigned}
          setSortByAssigned={setSortByAssigned}
        />
      }
    >
      <CustomFlatList
        data={productItems}
        renderItem={({ item }) => (
          <ProductCard
            codart={item.codart}
            artdes={item.artdes}
            price={item.price}
            //image={item.image}
            available={item.available}
            almacen={""}
          />
        )}
        keyExtractor={(item, index) => `${item.codart}-${index}`}
        refreshing={refreshing}
        canRefresh={canRefresh}
        handleRefresh={handleRefresh}
        onHeaderVisibleChange={setHeaderVisible}
        showtitle={true}
        numColumns={2}
        showScrollTopButton={false}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            zIndex: 50,
            bottom: 120,
            paddingHorizontal: 20,
            width: "100%",
            flexDirection: "row",
            gap: 12,
          },
          animatedStyle,
        ]}
      >
        {/* Confirmar pedido */}
        <TouchableOpacity
          disabled={!haveOrder}
          className="p-4 flex-1 items-center justify-center rounded-full shadow-lg  bg-primary dark:bg-dark-primary"
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

        {/* Ver pedido */}
        <TouchableOpacity
          disabled={!haveOrder}
          onPress={() => setModalVisible(true)}
          className={
            "p-4 rounded-full shadow-lg bg-primary dark:bg-dark-primary"
          }
          accessibilityHint="Ver Pedido"
          accessibilityLabel="Ver Pedido"
          accessibilityRole="button"
        >
          <Ionicons name="bag" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

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
