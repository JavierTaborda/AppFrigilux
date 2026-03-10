import CustomImagen from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import QuantitySelector from "./QuantitySelector";

type ProductCardProps = {
  item: OrderItem;
  IVA: number;
  setModalItemVisible: (it: OrderItem) => void;
  //showImage: boolean;
};

const createQuantitySelector =
  (codart: string) => (s: { items: OrderItem[] }) =>
    s.items.find((i) => i.codart === codart)?.quantity ?? 0;

function ProductCard({
  item,
  setModalItemVisible,
  IVA,
  //showImage,
}: ProductCardProps) {
  const img = `${imageURL}${item.codart.trim()}.jpg`;

  const quantity = useCreateOrderStore(
    useCallback(createQuantitySelector(item.codart), [item.codart]),
  );

  const Price = totalVenezuela(item.price * (1 + IVA));
  const available = item.available != null ? item.available - quantity : null;

  return (
    <Pressable
      className="bg-componentbg dark:bg-dark-componentbg rounded-xl p-3 mb-4 shadow shadow-gray-200 dark:shadow-black/20"
      onPress={() => setModalItemVisible(item)}
    >
      <View className="flex-1 items-center justify-center pb-1">
        <View className="h-28 w-2/3 rounded-xl bg-bgimages">
          <CustomImagen img={img} recyclingKey={item.codart} />
        </View>
      </View>

      <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
        {item.codart}
      </Text>
      <Text
        className="text-xs font-normal text-foreground dark:text-dark-foreground w-full leading-snug break-words min-h-10"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.artdes}
      </Text>
      <Text className="text-base font-bold text-foreground dark:text-dark-foreground">
        {Price} {currencyDollar}
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        Disponibles: {available ?? "—"}
      </Text>

      <QuantitySelector
        item={item}
        quantity={quantity}
        img={img}
        fullView={false}
      />
    </Pressable>
  );
}

export default memo(ProductCard, (prev, next) => {
  return (
    //prev.showImage === next.showImage &&
    prev.item.codart === next.item.codart &&
    prev.item.asignado === next.item.asignado &&
    prev.item.utilizado === next.item.utilizado &&
    prev.IVA === next.IVA
  );
});
