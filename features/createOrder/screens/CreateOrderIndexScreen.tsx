import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  BounceIn,
  Easing,
  FadeIn,
  FadeOut,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import BottomModal from "@/components/ui/BottomModal";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import { Ionicons } from "@expo/vector-icons";
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
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  // --- ANIMACIONES (SIN WARNINGS) ---
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(haveOrder ? 0 : height, {
      duration: 500,
      easing: haveOrder ? Easing.out(Easing.exp) : Easing.in(Easing.exp),
    });
    opacity.value = withTiming(haveOrder ? 1 : 0, {
      duration: 300,
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
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      className="absolute top-0 left-0 right-0 bottom-0 z-[999] justify-center items-center bg-overlay dark:bg-dark-overlay"
      pointerEvents="auto"
    >
      <ActivityIndicator size="large" color="#fff" />
    </Animated.View>
  );

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
            <ActivityIndicator color="white" />
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
            refreshing={refreshing}
            canRefresh={canRefresh}
            cooldown={cooldown}
            handleRefresh={handleRefresh}
            onHeaderVisibleChange={setHeaderVisible}
            showtitle={true}
            numColumns={numColumns}
            showScrollTopButton={false}
          />

          {/* Botones de acción inferiores */}
          <Animated.View
            style={[
              {
                position: "absolute",
                zIndex: 50,
                bottom: 120,
                paddingHorizontal: 24,
                width: "100%",
                flexDirection: "row",
                gap: 12,
              },
              animatedStyle,
            ]}
          >
            <Pressable
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
            </Pressable>

            <Pressable
              disabled={!haveOrder}
              onPress={() => setModalVisible(true)}
              className="p-4 rounded-full shadow-lg bg-primary dark:bg-dark-primary"
            >
              <Ionicons name="bag" size={24} color="white" />
              {items.length > 0 && (
                <Animated.View
                  entering={BounceIn.delay(100)}
                  exiting={FadeOutDown}
                  className="absolute right-1 top-0 bg-tertiary dark:bg-dark-tertiary rounded-full px-1 min-w-[25px] items-center justify-center"
                >
                  <Text className="text-white font-bold text-xs">
                    {items.length}
                  </Text>
                </Animated.View>
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
            heightPercentage={0.85}
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
