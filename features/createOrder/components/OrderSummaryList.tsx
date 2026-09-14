import BottomModal from "@/components/ui/BottomModal";
import CustomImagen from "@/components/ui/CustomImagen";
import {
  currencyDollar,
  currencyVES,
  totalVenezuela,
} from "@/utils/moneyFormat";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import { calculateTotals } from "../utils/calculateTotals";
import ItemModal from "./ItemModal";

type Props = {
  scrollEnabled?: boolean;
};

export default function OrderSummaryList({ scrollEnabled = true }: Props) {
  const { items, removeItem, setTotalsVES, exchangeRate, totalsVES, IVA } =
    useCreateOrderStore();
  const { fontScale } = useWindowDimensions();
  const useCompactQuantity = fontScale > 1.1;
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [item, setItem] = useState<OrderItem>({} as OrderItem);

  const handleOpenItem = (item: OrderItem) => {
    setItem(item);
    setModalItemVisible(true);
  };

  return (
    <>
      <Animated.ScrollView
        layout={LinearTransition.springify()}
        scrollEnabled={scrollEnabled}
        style={{ flex: 1, minHeight: 0 }}
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => {
          const { unitUsd, unitBs, reng_neto, reng_iva, reng_total } =
            calculateTotals(
              item.price,
              item.quantity ?? 1,
              item.discount ?? "",
              exchangeRate.tasa_v,
              IVA,
            );

          const basePrice = item.price;
          const priceWithIVA = basePrice * (1 + IVA);

          const itemPrice = totalVenezuela(
            totalsVES ? priceWithIVA * exchangeRate.tasa_v : priceWithIVA,
          );

          const unitPriceWithIVA = unitUsd * (1 + IVA);

          const finalPrice = totalVenezuela(
            totalsVES
              ? unitPriceWithIVA * exchangeRate.tasa_v
              : unitPriceWithIVA,
          );

          const totalPrice = totalVenezuela(
            totalsVES
              ? reng_neto * (1 + IVA)
              : (reng_neto * (1 + IVA)) / exchangeRate.tasa_v,
          );

          const currency = totalsVES ? currencyVES : currencyDollar;
          return (
            <Animated.View
              key={item.codart}
              exiting={FadeOutLeft.duration(200)}
              layout={LinearTransition.springify()}
              className="my-1"
            >
              <Pressable
                onPress={() => handleOpenItem(item)}
                className="flex-row items-start rounded-xl bg-componentbg px-3 py-3 dark:bg-dark-componentbg"
              >
                <View className="my-1 h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bgimages">
                  <CustomImagen key={item.codart.trim()} img={item.img!} />
                </View>
                <View className="ml-2 min-w-0 flex-1">
                  <Text
                    className="leading-5 text-sm font-normal text-gray-900 dark:text-gray-100"
                    numberOfLines={3}
                  >
                    {item.codart?.trim()} - {item.artdes?.trim()}
                  </Text>

                  <Text className="text-sm text-gray-500">Almacén 0001</Text>

                  <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
                    {item.discount ? (
                      <>
                        <Text className="shrink leading-5 text-sm line-through text-gray-500">
                          {itemPrice} {currency}
                        </Text>
                        <View className="shrink-0 rounded-full border border-red-500 bg-red-500/10 px-1 dark:bg-red-900">
                          <Text className="text-xs font-bold text-red-500 dark:text-red-400">
                            {item.discount}%
                          </Text>
                        </View>
                      </>
                    ) : null}

                    <Text className="min-w-0 flex-1 leading-5 text-sm font-semibold text-primary dark:text-dark-primary">
                      {finalPrice} {currency}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row flex-wrap items-center gap-x-2 gap-y-1">
                    <Text
                      className={`shrink-0 leading-5 text-sm text-gray-800 dark:text-gray-200 ${
                        useCompactQuantity ? "font-bold" : "font-normal"
                      }`}
                    >
                      {useCompactQuantity
                        ? `X ${item.quantity}`
                        : `Cantidad ${item.quantity}`}
                    </Text>

                    <View className="min-w-0 flex-1 flex-row flex-wrap justify-end">
                      <Text className="text-sm text-gray-800 dark:text-gray-300">
                        Total
                      </Text>
                      <Text className="text-right text-md font-semibold text-primary dark:text-dark-primary">
                        {totalPrice} {currency}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setTimeout(() => removeItem(item.codart), 200);
                  }}
                  className="shrink-0 p-2"
                >
                  <Ionicons name="trash" size={22} color="grey" />
                </Pressable>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <BottomModal
        visible={modalItemVisible}
        onClose={() => setModalItemVisible(false)}
        heightPercentage={0.8}
      >
        <ItemModal onClose={setModalItemVisible} item={item} />
      </BottomModal>
    </>
  );
}
