import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import BottomModal from "@/components/ui/BottomModal";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FastFilters from "../components/FastFilters";
import ItemModal from "../components/ItemModal";
import OrderModal from "../components/OrderModal";
import ProductCard from "../components/ProductCard";
import useCreateOrder from "../hooks/useCreateOrder";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";

export default function CreateOrderScreen() {
  const [searchText, setSearchText] = useState("");
  const {
    loading,
    error,
    productItems,
    handleRefresh,
    refreshing,
    canRefresh,
    notUsed,
    setNotUsed,
    sortByAvailable,
    setSortByAvailable,
    sortByAssigned,
    setSortByAssigned,
    handleSummary,
    loadSummary,
  } = useCreateOrder(searchText);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [item, setItem] = useState<OrderItem>({} as OrderItem);
  const router = useRouter();
  const { items } = useCreateOrderStore();
  const haveOrder = items?.length > 0;

  const { height } = Dimensions.get("window");

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

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

  if (error) {
    return <ErrorView error={error} getData={handleRefresh} />;
  }

  const handleSetModalItemVisible = useCallback((item: OrderItem) => {
    setItem(item);
    setModalItemVisible(true);
  }, []);

  const availableProducts = useMemo(() => {
    return productItems.filter((p) => p.available);
  }, [productItems]);

  const renderProductItem = useCallback(
    ({ item }: { item: OrderItem }) => (
      <ProductCard
        codart={item.codart}
        artdes={item.artdes}
        price={item.price}
        available={item.available}
        almacen=""
        setModalItemVisible={() => handleSetModalItemVisible(item)}
      />
    ),
    [handleSetModalItemVisible]
  );

  const CreateButton = () =>
    loadSummary ? (
      <ActivityIndicator color="white" />
    ) : (
      <View className="flex-row gap-1 items-center">
        <Ionicons name="checkmark-sharp" size={24} color="white" />
        <Text className="text-lg font-semibold text-white">
          Confirmar
        </Text>
      </View>
    );
    
  const data = () => (
    <>
      <CustomFlatList
        data={availableProducts}
        renderItem={renderProductItem}
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
        <TouchableOpacity
          disabled={!haveOrder}
          className="p-4 flex-1 items-center justify-center rounded-full shadow-lg bg-primary dark:bg-dark-primary"
          onPress={handleSummary}
        >
          {CreateButton()}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!haveOrder}
          onPress={() => setModalVisible(true)}
          className="p-4 rounded-full shadow-lg bg-primary dark:bg-dark-primary"
          accessibilityHint="Ver Pedido"
          accessibilityLabel="Ver Pedido"
          accessibilityRole="button"
        >
          <Ionicons name="bag" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <OrderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          handleSummary();
        }}
      />

      <BottomModal
        visible={modalItemVisible}
        onClose={() => setModalItemVisible(false)}
        heightPercentage={0.85}
      >
        <ItemModal onClose={setModalItemVisible} item={item} />
      </BottomModal>
    </>
  );

  const loader = () => <Loader />;

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
      {loading ? loader() : data()}
    </ScreenSearchLayout>
  );
}
