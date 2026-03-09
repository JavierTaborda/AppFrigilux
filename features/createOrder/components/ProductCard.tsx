import CustomImage from "@/components/ui/CustomImagen";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";

import { imageURL } from "@/utils/imageURL";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import QuantitySelector from "./QuantitySelector";

type ProductCardProps = {
  item: OrderItem;
  IVA: number;

  setModalItemVisible: (it: OrderItem) => void;
};

function ProductCard({ item, setModalItemVisible, IVA }: ProductCardProps) {
  const img = `${imageURL}${item.codart.trim()}.jpg`;
  const quantity = useCreateOrderStore(
    useCallback(
      (s: { items: OrderItem[] }) =>
        s.items.find((i) => i.codart === item.codart)?.quantity ?? 0,
      [item.codart],
    ),
  );

  const Price = totalVenezuela(item.price * (1 + IVA));

  return (
    <>
      <Pressable
        className="bg-componentbg dark:bg-dark-componentbg rounded-xl p-3 mb-4   shadow shadow-gray-200 dark:shadow-black/20"
        onPress={() => setModalItemVisible(item)}
      >
        <View className="flex-1 items-center justify-center pb-1">
          <View className="h-28 w-2/3 rounded-xl overflow-hidden pb-1 bg-bgimages">
            <CustomImage img={`${imageURL}${item.codart.trim()}.jpg`} />
          </View>
        </View>
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground  ">
          {item.codart}
        </Text>
        <Text
          className="text-xs font-normal text-foreground dark:text-dark-foreground  w-full leading-snug break-words min-h-10"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.artdes}
        </Text>
        <Text className="text-base font-bold text-foreground dark:text-dark-foreground ">
          {Price} {currencyDollar}
        </Text>

        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ">
          Disponibles:{" "}
          {item.available != null ? item.available - quantity : "—"}
        </Text>
        {quantity > 0 || true ? (
          <QuantitySelector
            item={item}
            quantity={quantity}
            img={img}
            fullView={false}
          />
        ) : null}
      </Pressable>
    </>
  );
}
export default memo(ProductCard);
