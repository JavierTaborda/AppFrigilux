import { totalVenezuela } from "@/utils/moneyFormat";
import * as Haptics from "expo-haptics";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useCreateOrderStore from "../stores/useCreateOrderStore";

type ProductCardProps = {
  code: string;
  title: string;
  price: number;
  image: string;
  available?: number;
  almacen: string;
};

export default function ProductCard({
  code,
  title,
  price,
  image,
  available,
}: ProductCardProps) {
  const cartItem = useCreateOrderStore((s) =>
    s.items.find((i) => i.code === code)
  );
  const addItem = useCreateOrderStore((s) => s.addItem);
  const increase = useCreateOrderStore((s) => s.increase);
  const decrease = useCreateOrderStore((s) => s.decrease);

  const quantity = cartItem?.quantity ?? 0;

  // animations
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
    increase(code);
    Haptics.selectionAsync();
    btnScale.value = withTiming(
      1.1,
      { duration: ANIM_DURATION },
      () => (btnScale.value = 1)
    );
    qtyScale.value = withTiming(
      1.2,
      { duration: ANIM_DURATION },
      () => (qtyScale.value = 1)
    );
  };

  const handleDecrease = () => {
    decrease(code);
    Haptics.selectionAsync();
    btnScale.value = withTiming(
      0.9,
      { duration: ANIM_DURATION },
      () => (btnScale.value = 1)
    );
    qtyScale.value = withTiming(
      1.2,
      { duration: ANIM_DURATION },
      () => (qtyScale.value = 1)
    );
  };

  const handleAdd = () => {
    addItem({ code, title, price, image, available, quantity: 1 });
    Haptics.selectionAsync();
    addScale.value = withTiming(
      1.1,
      { duration: ANIM_DURATION },
      () => (addScale.value = 1)
    );
  };

  return (
    <View className="bg-white dark:bg-dark-componentbg rounded-2xl p-4 mb-4 w-[48%] shadow shadow-gray-200 dark:shadow-black/20">
      <Image
        source={{ uri: image }}
        className="h-32 w-full rounded-xl mb-2"
        resizeMode="cover"
      />

      <Text className="text-xs text-gray-500 dark:text-gray-400">{code}</Text>
      <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-1">
        {title}
      </Text>

      <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-1">
        {totalVenezuela(price)}
      </Text>

      {/* Stock  */}
      <Text className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        Disponibles: {available ?? "—"}
      </Text>

      {/* buttions */}
      {quantity > 0 ? (
        <Animated.View
          style={btnStyle}
          className="flex-row items-center justify-center gap-4"
        >
          <TouchableOpacity
            onPress={handleDecrease}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
          >
            <Text className="text-lg font-bold">-</Text>
          </TouchableOpacity>

          <Animated.Text
            style={qtyStyle}
          >
            <Text className="mx-2 font-semibold text-lg">{quantity}</Text>
          </Animated.Text>

          <TouchableOpacity
            onPress={handleIncrease}
            className="w-8 h-8 rounded-full bg-primary items-center justify-center"
          >
            <Text className="text-white text-lg font-bold">+</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={addStyle}>
          <TouchableOpacity
            onPress={handleAdd}
            className="flex-1 bg-primary rounded-xl py-2 items-center justify-center"
          >
            <Text className="text-white font-bold">Agregar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
