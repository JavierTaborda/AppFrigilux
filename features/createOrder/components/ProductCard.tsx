import CustomImagen from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { memo, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
type ProductCardProps = {
  item: OrderItem;
  IVA: number;
  setModalItemVisible: (it: OrderItem) => void;
};

const createQuantitySelector =
  (codart: string) => (s: { items: OrderItem[] }) =>
    s.items.find((i) => i.codart === codart)?.quantity ?? 0;

function ProductCard({ item, setModalItemVisible, IVA }: ProductCardProps) {
  const img = `${imageURL}${item.codart.trim()}.webp`;

  const selector = useCallback(createQuantitySelector(item.codart), [
    item.codart,
  ]);
  const quantity = useCreateOrderStore(selector);

  const Price = useMemo(
    () => totalVenezuela(item.price * (1 + IVA)),
    [item.price, IVA],
  );
  const available = useMemo(
    () => (item.available != null ? item.available - quantity : null),
    [item.available, quantity],
  );

  const handlePress = useCallback(
    () => setModalItemVisible(item),
    [item, setModalItemVisible],
  );
  const stock = available ?? 0;

  const isOut = stock === 0;
  const isLow = stock > 0 && stock < 5;

  const availabilityChipClass = isOut
    ? "bg-red-500/10 dark:bg-red-900/40"
    : isLow
      ? "bg-warning/20 dark:bg-dark-warning/30"
      : "bg-primary/15 dark:bg-primary/25";

  const availabilityTextClass = isOut
    ? "text-red-600 dark:text-red-400"
    : isLow
      ? "text-yellow-700 dark:text-yellow-300"
      : "text-primary dark:text-dark-primary";
  return (
    <Pressable
      className={`bg-componentbg dark:bg-dark-componentbg overflow-hidden mb-1 rounded-2xl border p-2
      ${quantity > 0 ? "border-primary dark:border-dark-primary" : "border-black/10"}`}
      style={{ borderWidth: 0.7 }}
      onPress={handlePress}
    >
      <View className="flex-row gap-2">
        <View className="w-32 h-32 my-1 rounded-xl overflow-hidden bg-bgimages items-center justify-center">
          <CustomImagen img={img} />
        </View>

        <View className="flex-1 justify-between gap-y-1 py-1">
          <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
            {item.codart}
          </Text>

          <Text
            numberOfLines={3}
            className="text-sm text-foreground dark:text-dark-foreground leading-snug"
          >
            {item.artdes}
          </Text>

          <View
            className={`px-2 py-1 rounded-full self-start ${availabilityChipClass}`}
          >
            <Text className={`font-semibold text-sm ${availabilityTextClass}`}>
              {isOut ? "Sin unidades" : `${stock} disponibles`}
            </Text>
          </View>

          <View className="flex-row items-baseline">
            <Text className="text-md font-bold text-primary dark:text-dark-primary">
              {Price}
            </Text>
            <Text className="text-sm text-primary dark:text-dark-primary ml-1 font-semibold">
              {currencyDollar}
            </Text>
          </View>
        </View>

        {quantity > 0 && (
          <View className="justify-start pt-1">
            <View className="px-2 py-1 rounded-lg bg-primary dark:bg-dark-primary self-start">
              <Text className="text-white font-semibold text-sm">
                {quantity}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* <View className="pt-2 px-1">
        <QuantitySelector
          item={item}
          quantity={quantity}
          img={img}
          fullView={false}
        />
      </View> */}
    </Pressable>
  );
  // return (
  //   <Pressable
  //     className="bg-componentbg dark:bg-dark-componentbg rounded-xl p-3 mb-4 shadow shadow-gray-200 dark:shadow-black/20"
  //     onPress={handlePress}
  //   >
  //     <View className="flex-1 items-center justify-center pb-1">
  //       <View className="h-28 w-2/3 rounded-xl bg-bgimages overflow-hidden">
  //         <Image
  //           source={{
  //             uri: img,
  //             width: 180,
  //             height: 180,
  //           }}
  //           style={{ flex: 1, width: "100%" }}
  //           contentFit="contain"
  //           transition={0}
  //           cachePolicy="disk"
  //           recyclingKey={item.codart}
  //           priority="normal"
  //         />
  //       </View>
  //     </View>

  //     <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
  //       {item.codart}
  //     </Text>
  //     <Text
  //       className="text-xs font-normal text-foreground dark:text-dark-foreground w-full leading-snug break-words min-h-10"
  //       numberOfLines={2}
  //       ellipsizeMode="tail"
  //     >
  //       {item.artdes}
  //     </Text>
  //     <Text className="text-base font-bold text-foreground dark:text-dark-foreground">
  //       {Price} {currencyDollar}
  //     </Text>
  //     <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
  //       Disponibles: {available ?? "—"}
  //     </Text>

  //     <QuantitySelector
  //       item={item}
  //       quantity={quantity}
  //       img={img}
  //       fullView={false}
  //     />
  //   </Pressable>
  // );
}

export default memo(ProductCard, (prev, next) => {
  return (
    prev.item.codart === next.item.codart &&
    prev.item.asignado === next.item.asignado &&
    prev.item.utilizado === next.item.utilizado &&
    prev.IVA === next.IVA
  );
});
