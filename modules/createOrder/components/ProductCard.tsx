import CustomImage from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  BounceOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useCreateOrderStore from "../stores/useCreateOrderStore";

type ProductCardProps = {
  codart: string;
  artdes: string;
  price: number;
  available?: number;
  almacen?: string;
};

export default function ProductCard({
  codart,
  artdes,
  price,
  available,
}: ProductCardProps) {
  const cartItem = useCreateOrderStore((s) =>
    s.items.find((i) => i.codart === codart)
  );
  const addItem = useCreateOrderStore((s) => s.addItem);
  const increase = useCreateOrderStore((s) => s.increase);
  const decrease = useCreateOrderStore((s) => s.decrease);
  const removeItem = useCreateOrderStore((s) => s.removeItem);
  const [showMenu, setShowMenu] = useState(false);

  const img = `${imageURL}${codart?.trim()}.jpg`;
  const quantity = cartItem?.quantity ?? 0;

  // animations
  const pressedLong = useRef(false);

  const btnScale = useSharedValue(1);
  const qtyScale = useSharedValue(1);
  const addScale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const qtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  const ANIM_DURATION = 100; //   ms

  const handleIncrease = () => {
    if (pressedLong.current) {
      pressedLong.current = false;
      return;
    }
    increase(codart);
    Haptics.selectionAsync();
    btnScale.value = withTiming(
      0.9,
      { duration: ANIM_DURATION },
      () => (btnScale.value = 1)
    );
    qtyScale.value = withTiming(
      1.1,
      { duration: ANIM_DURATION },
      () => (qtyScale.value = 1)
    );
  };

  const handleDecrease = () => {
    if (pressedLong.current) {
      pressedLong.current = false;
      return; // Evita que se dispare después del long press
    }
    decrease(codart);
    Haptics.selectionAsync();
    btnScale.value = withTiming(
      0.9,
      { duration: ANIM_DURATION },
      () => (btnScale.value = 1)
    );
  };

  const handleAdd = () => {
    if (pressedLong.current) {
      pressedLong.current = false;
      return;
    }

    addItem({ codart, artdes, price, img, available, quantity: 1 });
    Haptics.selectionAsync();
    addScale.value = withTiming(
      1.1,
      { duration: ANIM_DURATION },
      () => (addScale.value = 1)
    );
  };
  const handleRemove = () => {
    pressedLong.current = true;
    removeItem(codart);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };
  const handleMaxIncrease = () => {
    pressedLong.current = true;
    if (available && available > quantity) {
      increase(codart, available - quantity);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qtyScale.value = withTiming(
        1.1,
        { duration: ANIM_DURATION },
        () => (qtyScale.value = 1)
      );
    }
  };
  const scale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withTiming(1.05, { duration: 150 });
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    scale.value = withTiming(1, { duration: 150 }); // vuelve a su tamaño
    setShowMenu(false);
  };
  return (
    <>
      <Pressable
        className="bg-white dark:bg-dark-componentbg rounded-xl p-3 mb-4 w-[48%] shadow shadow-gray-200 dark:shadow-black/20"
        onPress={() => alert("Hola")}
        onLongPress={handleLongPress}
      >
        <View className="flex-1 items-center justify-center pb-1">
          <View className="h-28 w-2/3 rounded-xl overflow-hidden pb-1 bg-bgimages">
            <CustomImage img={img} />
          </View>
        </View>
        <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground  ">
          {codart}
        </Text>
        <Text
          className="text-xs font-normal text-foreground dark:text-dark-foreground  w-full leading-snug break-words min-h-10"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {artdes}
        </Text>
        <Text className="text-base font-bold text-foreground dark:text-dark-foreground ">
          {totalVenezuela(price)} {currencyDollar}
        </Text>
        {/* Stock  */}
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ">
          Disponibles: {available ?? "—"}
        </Text>
        {/* buttions */}
        {quantity > 0 ? (
          <Animated.View
            style={btnStyle}
            className="flex-row items-center justify-center gap-4 h-[30]"
          >
            <TouchableOpacity
              onPress={handleDecrease}
              onLongPress={handleRemove}
              onPressOut={() => (pressedLong.current = false)}
              delayLongPress={300}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
            >
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
                -
              </Text>
            </TouchableOpacity>

            <Animated.View
              entering={BounceIn}
              exiting={BounceOut.duration(150)}
            >
              <Text className="mx-2 font-semibold text-lg text-center text-foreground dark:text-dark-foreground">
                {quantity}
              </Text>
            </Animated.View>
            <TouchableOpacity
              onPress={handleIncrease}
              onLongPress={handleMaxIncrease}
              onPressOut={() => (pressedLong.current = false)}
              delayLongPress={300}
              className="w-8 h-8 rounded-full bg-primary items-center justify-center"
            >
              <Text className="text-white text-md font-bold">+</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={addStyle} className="h-[30]">
            <TouchableOpacity
              onPress={() => {
                if (pressedLong.current) return;
                handleAdd();
              }}
              onPressOut={() => {
                setTimeout(() => {
                  pressedLong.current = false;
                }, 100);
              }}
              className="flex-1 rounded-2xl items-center justify-center bg-primary dark:bg-dark-primary"
            >
              <Text className="text-white font-bold">Agregar</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Pressable>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        {/* Fondo con blur */}
        <BlurView
          intensity={95}
          tint="dark"
          className="flex-1 justify-center items-center"
        >
          {/* Card ampliada en el centro */}
          <Animated.View
            style={cardStyle}
            className="w-64 p-4 bg-white dark:bg-dark-componentbg rounded-2xl"
          >
            <View className="h-40 w-full rounded-lg mb-3 bg-bgimages">
              <CustomImage img={img} />
            </View>
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
              {artdes}
            </Text>
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-4">
              {totalVenezuela(price)} {currencyDollar}
            </Text>

            {/* Opciones */}
            <TouchableOpacity
              onPress={() => {
                alert("Aplicar descuento");
                handleCloseMenu();
              }}
              className="py-2"
            >
              <Text className="text-primary font-semibold text-center">
                Aplicar descuento
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                removeItem(codart);
                handleCloseMenu();
              }}
              className="py-2"
            >
              <Text className="text-red-500 font-semibold text-center">
                Eliminar del carrito
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCloseMenu} className="py-2 mt-2">
              <Text className="text-blue-500 text-center">Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Modal>
    </>
  );
}
