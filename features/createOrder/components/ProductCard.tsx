import CustomImage from "@/components/ui/CustomImagen";
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
};

function ProductCard({ item, setModalItemVisible, IVA }: ProductCardProps) {
  // const cartItem = useCreateOrderStore((s) =>
  //   s.items.find((i) => i.codart === item.codart),
  // );
  // const cartItem = useCreateOrderStore(
  //   useCallback(
  //     (s) => s.items.find((i) => i.codart === item.codart),
  //     [item.codart],
  //   ),
  // );

  //const removeItem = useCreateOrderStore((s) => s.removeItem);
  //const [showMenu, setShowMenu] = useState(false);

  const img = `${imageURL}${item.codart.trim()}.jpg`;
  const quantity = useCreateOrderStore(
    useCallback(
      (s: { items: OrderItem[] }) =>
        s.items.find((i) => i.codart === item.codart)?.quantity ?? 0,
      [item.codart],
    ),
  );

  //const scale = useSharedValue(1);

  // const cardStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: scale.value }],
  // }));
  // const handleLongPress = () => {
  //   safeHaptic("medium");
  //   scale.value = withTiming(1.05, { duration: 150 });
  //   setShowMenu(true);
  // };

  // const handleCloseMenu = () => {
  //   scale.value = withTiming(1, { duration: 150 });
  //   setShowMenu(false);
  // };

  const Price = totalVenezuela(item.price * (1 + IVA));

  return (
    <>
      <Pressable
        className="bg-componentbg dark:bg-dark-componentbg rounded-xl p-3 mb-4   shadow shadow-gray-200 dark:shadow-black/20"
        onPress={() => setModalItemVisible(item)}
        //onLongPress={handleLongPress}
      >
        <View className="flex-1 items-center justify-center pb-1">
          <View className="h-28 w-2/3 rounded-xl overflow-hidden pb-1 bg-bgimages">
            <CustomImage img={img} />
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

      {/* TODO: move to main screen */}
      {/* <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <BlurView
          intensity={95}
          tint="dark"
          className="flex-1 justify-center items-center"
        >
          <Animated.View
            style={cardStyle}
            className="w-64 p-4 bg-white dark:bg-dark-componentbg rounded-2xl"
          >
            <View className="h-40 w-full rounded-lg mb-3 bg-bgimages">
              <CustomImage img={img} />
            </View>
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
              {item.artdes}
            </Text>
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-4">
              {totalVenezuela(item.price)} {currencyDollar}
            </Text>

            <Pressable
              onPress={() => {
                alert("Aplicar descuento");
                handleCloseMenu();
              }}
              className="py-2"
            >
              <Text className="text-primary font-semibold text-center">
                Aplicar descuento
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                removeItem(item.codart);
                handleCloseMenu();
              }}
              className="py-2"
            >
              <Text className="text-red-500 font-semibold text-center">
                Eliminar del carrito
              </Text>
            </Pressable>

            <Pressable onPress={handleCloseMenu} className="py-2 mt-2">
              <Text className="text-blue-500 text-center">Cerrar</Text>
            </Pressable>
          </Animated.View>
        </BlurView>
      </Modal> */}
    </>
  );
}
export default memo(ProductCard);
