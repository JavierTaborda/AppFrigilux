import CustomImagen from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { memo, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import QuantitySelector from "./QuantitySelector";
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
  const badge = (
    <View
      className={`absolute top-2 right-2 rounded-full px-3 py-1 border
      ${
        isOut
          ? "bg-error/70 dark:bg-dark-error border-red-600 dark:border-red-500"
          : isLow
            ? "bg-warning/30 dark:bg-dark-warning border-yellow-500"
            : "bg-componentbg dark:bg-dark-componentbg border-black/10"
      }
    `}
    >
      <Text
        className={`
        text-xs font-semibold
        ${isOut ? "text-white" : "text-foreground dark:text-dark-foreground"}
      `}
      >
        {isOut ? "Sin unidades" : `${stock} disp.`}
      </Text>
    </View>
  );
  return (
    <Pressable
      className={`
    bg-componentbg dark:bg-dark-componentbg  overflow-hidden mb-3 rounded-2xl border
    ${quantity > 0 ? "border-primary dark:border-dark-primary" : "border-black/10"}`}
      style={{ borderWidth: 0.7 }}
      onPress={handlePress}
    >
      <View className="h-[120] w-full bg-bgimages relative">
        <CustomImagen img={img} />
        {badge}
      </View>

      <View className="px-3 pb-3 pt-0.5">
        <Text className="text-sm text-gray-900 dark:text-dark-foreground tracking-wide font-bold ">
          {item.codart}
        </Text>
        <Text
          numberOfLines={2}
          className=" text-mutedForeground dark:text-dark-mutedForeground text-sm pb-0.5 tracking-tight"
        >
          {item.artdes}
        </Text>

        <View className="flex-row items-baseline mb-0.5">
          <Text className="text-foreground dark:text-dark-foreground text-lg font-bold">
            {Price}
          </Text>

          <Text className="text-mutedForeground dark:text-dark-mutedForeground ml-1 text-md">
            {currencyDollar}
          </Text>
        </View>

        <QuantitySelector
          item={item}
          quantity={quantity}
          img={img}
          fullView={false}
        />
      </View>
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
