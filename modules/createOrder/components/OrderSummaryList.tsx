import BottomModal from "@/components/ui/BottomModal";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import { calculateTotals } from "../utils/calculateTotals";
import ItemModal from "./ItemModal";
type Props = {
  scrollEnabled?: boolean;
};
export default function OrderSummaryList({ scrollEnabled = true }: Props) {
  const { items } = useCreateOrderStore();
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const [item, setItem] = useState<OrderItem>({} as OrderItem);
  const handleOpenItem = (item: OrderItem) => {
    setItem(item);
    setModalItemVisible(true);
  };
  return (
    <>
      <FlatList
        scrollEnabled={scrollEnabled}
        data={items}
        keyExtractor={(item: OrderItem, index) => `${item.codart}-${index}`}
        renderItem={({ item }) => {
          const { totalGross, discountAmount, subtotal, iva, total } =
            calculateTotals(
              item.price,
              item.quantity ?? 1,
              item.discount ?? ""
            );

          return (
            <Pressable
              onPress={() => handleOpenItem(item)}
              className="flex-row items-center my-1 py-2 px-3 rounded-xl bg-componentbg dark:bg-dark-componentbg"
            >
              <Image
                source={{ uri: item.img }}
                className="w-20 h-20 rounded-xl bg-gray-200"
              />
              <View className="flex-1 ml-2">
                <Text
                  className="text-sm font-normal text-gray-900 dark:text-gray-100"
                  numberOfLines={2}
                >
                  {item.codart?.trim()} - {item.artdes?.trim()}
                </Text>
                <Text className="text-sm text-gray-500 ">Almacen 0001 </Text>
                <View className="flex-row items-center space-x-2">
                  {item.discount ? (
                    <>
                      <Text className="text-sm line-through  text-gray-500">
                        {item.price} {currencyDollar}
                      </Text>
                      <View className="mx-2 bg-red-500/10 dark:bg-red-900 px-1 rounded-full border border-red-500">
                        <Text className="text-xs font-bold text-red-500 dark:text-red-400">
                          {item.discount}%
                        </Text>
                      </View>
                    </>
                  ) : null}
                  <Text className="text-sm text-primary  dark:text-dark-primary font-semibold">
                    {totalVenezuela(subtotal)} {currencyDollar}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-1 items-center">
                  <Text className="text-sm font-normal text-gray-800 dark:text-gray-200">
                    Cantidad {item.quantity}
                  </Text>
                  <View className="flex-row">
                    <Text className="text-sm font-normal text-gray-800 dark:text-gray-300">
                      Total{" "}
                    </Text>
                    <Text className="text-md font-semibold text-primary dark:text-dark-primary">
                      {totalVenezuela(total)}
                      {currencyDollar}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
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
}
