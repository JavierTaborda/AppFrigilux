import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import BottomModal from "@/components/ui/BottomModal";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import { safeHaptic } from "@/utils/safeHaptics";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CreateOrderFilterModal from "../components/CreateOrderFilterModal";
import CreateOrderSkeleton from "../components/CreateOrderSkeleton";
import ExchangeRateBadgeSmall from "../components/ExchangeRateBadgeSmall";
import FastFilters from "../components/FastFilters";
import ItemModal from "../components/ItemModal";
import OrderModal from "../components/OrderModal";
import ProductCard from "../components/ProductCard";
import useCreateOrder from "../hooks/useCreateOrder";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";

export default function CreateOrderScreen() {
  const [searchText, setSearchText] = useState("");
  const { height } = Dimensions.get("window");
  const { width } = useWindowDimensions();

  const {
    loading,
    error,
    filteredProducts,
    handleRefresh,
    refreshing,
    cooldown,
    canRefresh,
    notUsed,
    setNotUsed,
    sortByAvailable,
    setSortByAvailable,
    sortByAssigned,
    setSortByAssigned,
    handleSummary,
    loadSummary,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useCreateOrder(searchText);

  const [headerVisible, setHeaderVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [item, setItem] = useState<OrderItem>({} as OrderItem);
  const { items, IVA, exchangeRate } = useCreateOrderStore();
  const [filterVisible, setFilterVisible] = useState(false);

  const haveOrder = items?.length > 0;
  //const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const numColumns = 1;

  // --- ANIMACIONES (SIN WARNINGS) ---
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(haveOrder ? 0 : height, {
      duration: 300,
      easing: haveOrder ? Easing.out(Easing.exp) : Easing.in(Easing.exp),
    });
    opacity.value = withTiming(haveOrder ? 1 : 0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, [haveOrder, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // --- HANDLERS ---
  const handleSetModalItemVisible = useCallback((it: OrderItem) => {
    setItem(it);
    setModalItemVisible(true);
  }, []);

  const renderProductItem = useCallback(
    ({ item }: { item: OrderItem }) => (
      <View style={{ flex: 1, margin: 4 }}>
        <ProductCard
          item={item}
          setModalItemVisible={handleSetModalItemVisible}
          IVA={IVA}
        />
      </View>
    ),
    [handleSetModalItemVisible, IVA],
  );

  const extraFilters = useMemo(
    () => (
      <FastFilters
        notUsed={notUsed}
        setNotUsed={setNotUsed}
        sortByAvailable={sortByAvailable}
        setSortByAvailable={setSortByAvailable}
        sortByAssigned={sortByAssigned}
        setSortByAssigned={setSortByAssigned}
      />
    ),
    [notUsed, sortByAvailable, sortByAssigned],
  );

  const FullScreenLoaderOverlay = (
    <Modal
      visible={loadSummary}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="absolute top-0 left-0 right-0 bottom-0 z-[999] justify-center items-center bg-overlay dark:bg-dark-overlay"
        pointerEvents="auto"
      >
        <ActivityIndicator size="large" color="#fff" />
      </Animated.View>
    </Modal>
  );
  // useEffect(() => {
  //   if (!filteredProducts.length) return;

  //   const toPreload = filteredProducts
  //     .slice(0, 60)
  //     .map((p) => `${imageURL}${p.codart.trim()}.webp`);
  //   Image.prefetch(toPreload);
  // }, [filteredProducts]);

  if (error) return <ErrorView error={error} getData={handleRefresh} />;

  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Código o descripción..."
      headerVisible={true}
      extrafilter={true}
      extraFiltersComponent={
        loading ? (
          <>
            <View className="flex-row gap-3 items-center w-full ">
              <View className=" bg-gray-300 dark:bg-gray-700  items-center px-14 py-5 rounded-full  animate-pulse "></View>
              <View className=" bg-gray-300 dark:bg-gray-700  items-center px-14 py-5 rounded-full  animate-pulse "></View>
              <View className=" bg-gray-300 dark:bg-gray-700  items-center px-14 py-5 rounded-full  animate-pulse "></View>
            </View>
          </>
        ) : (
          extraFilters
        )
      }
      onFilterPress={() => setFilterVisible(true)}
    >
      {loading ? (
        <CreateOrderSkeleton columns={numColumns} />
      ) : (
        <>
          <CustomFlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.codart}
            numColumns={numColumns}
            removeClippedSubviews={false}
            drawDistance={1500}
            showScrollTopButton={true}
            refreshing={refreshing}
            canRefresh={canRefresh}
            cooldown={cooldown}
            handleRefresh={handleRefresh}
            contentContainerStyle={{
              paddingBottom: 160,
              paddingHorizontal: 6,
              paddingTop: 4,
            }}
          />
          {/* Bottom Buttons*/}
          <Animated.View
            style={[
              {
                position: "absolute",
                zIndex: 50,
                right: 55,
                bottom: 115,
                paddingHorizontal: 25,
                width: "25%",
                //flexDirection: "row",
                gap: 15,
              },
              animatedStyle,
            ]}
          >
            {/* <Pressable
              disabled={!haveOrder}
              className="p-4 flex-1 items-center justify-center rounded-full shadow-lg bg-primary dark:bg-dark-primary"
              onPress={handleSummary}
            >
              {loadSummary ? (
                <ActivityIndicator color="white" />
              ) : (
                <View className="flex-row gap-1 items-center">
                  <Ionicons name="checkmark-sharp" size={24} color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Confirmar
                  </Text>
                </View>
              )}
            </Pressable> */}

            <Pressable
              disabled={!haveOrder}
              onPress={() => {
                setModalVisible(true);
                safeHaptic("soft");
              }}
              className="w-14 h-14 rounded-full items-center justify-center shadow-lg bg-tertiary dark:bg-dark-tertiary"
            >
              <Ionicons name="bag" size={24} color="white" />
              {items.length > 0 && (
                <View className="absolute right-2 top-0 bg-componentbg dark:bg-dark-componentbg rounded-full px-1 min-w-[25px] items-center justify-center">
                  <Text className="text-black dark:text-white font-bold text-xs">
                    {items.length}
                  </Text>
                </View>
              )}
            </Pressable>
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
            heightPercentage={0.75}
          >
            <ItemModal onClose={setModalItemVisible} item={item} />
          </BottomModal>
        </>
      )}

      <ExchangeRateBadgeSmall exchangeRate={exchangeRate} />
      {loadSummary && FullScreenLoaderOverlay}

      {filterVisible && (
        <CreateOrderFilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(selectedCat) => {
            setSelectedCategory(selectedCat);
            setFilterVisible(false);
          }}
          category={categories}
          selectedCategory={selectedCategory}
        />
      )}
    </ScreenSearchLayout>
  );
}
