import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useQuantityHandlers } from "../hooks/useQuantityHandler";
import { OrderItem } from "../types/orderItem";

type QuantitySelectorProps = {
  item: OrderItem;
  quantity: number;
  img: string;
  height?: number;
  size?: number;
  fullView?: boolean;
};

export default function QuantitySelector({
  quantity,
  item,
  img,
  height = 30,
  size = 32,
  fullView = false,
}: QuantitySelectorProps) {
  const {
    pressedLong,
    handleIncrease,
    handleDecrease,
    handleAdd,
    handleRemove,
    handleMaxIncrease,
    handleIncreaseQty,
  } = useQuantityHandlers({
    item,
    quantity,
    img,
  });

  const [inputQuantity, setInputQuantity] = useState(quantity);

  useEffect(() => {
    setInputQuantity(quantity);
  }, [quantity]);

  // Animaciones ligeras para botones
  const scaleIncrease = useSharedValue(1);
  const scaleDecrease = useSharedValue(1);
  const scaleAdd = useSharedValue(1);

  const animatedIncrease = useAnimatedStyle(() => ({
    transform: [{ scale: scaleIncrease.value }],
  }));
  const animatedDecrease = useAnimatedStyle(() => ({
    transform: [{ scale: scaleDecrease.value }],
  }));
  const animatedAdd = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAdd.value }],
  }));

  const handleManualChange = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    let qty = numeric === "" ? 0 : parseInt(numeric);

    if (qty <= 0) {
      setInputQuantity(0);
      return;
    }

    if (qty > item.available) {
      qty = item.available;
    }

    setInputQuantity(qty);
    handleIncreaseQty(qty, quantity);
  };

  if (quantity > 0) {
    return (
      <View
        style={{ height }}
        className="flex-row items-center justify-center gap-4"
      >
        {/* DECREASE */}
        <Animated.View style={animatedDecrease}>
          <TouchableOpacity
            onPress={() => {
              handleDecrease();
              scaleDecrease.value = 1.2;
              scaleDecrease.value = withSpring(1);
            }}
            onLongPress={() => {
              pressedLong.current = true;
              handleRemove(item.codart);
            }}
            onPressOut={() => (pressedLong.current = false)}
            delayLongPress={300}
            style={{ width: size, height: size }}
            className="rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
          >
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
              -
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* QUANTITY */}
        {!fullView ? (
          <Text className="mx-4 font-semibold text-lg text-center text-foreground dark:text-dark-foreground">
            {quantity}
          </Text>
        ) : (
          <TextInput
            value={String(inputQuantity)}
            onChangeText={handleManualChange}
            keyboardType="numeric"
            className="font-semibold mx-8 p-0 text-2xl text-center text-foreground dark:text-dark-foreground"
          />
        )}

        {/* INCREASE */}
        <Animated.View style={animatedIncrease}>
          <TouchableOpacity
            onPress={() => {
              handleIncrease();
              scaleIncrease.value = 1.2;
              scaleIncrease.value = withSpring(1);
            }}
            onLongPress={() => {
              pressedLong.current = true;
              handleMaxIncrease(item.codart);
            }}
            onPressOut={() => (pressedLong.current = false)}
            delayLongPress={300}
            style={{ width: size, height: size }}
            className="rounded-full bg-primary dark:bg-dark-primary items-center justify-center"
          >
            <Text className="text-white text-md font-bold">+</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Cuando la cantidad es 0 -> botón agregar
  return (
    <Animated.View style={[{ height }, animatedAdd]} className="w-full">
      <TouchableOpacity
        onPress={() => {
          handleAdd();
          scaleAdd.value = 1.2;
          scaleAdd.value = withSpring(1);
        }}
        onLongPress={() => (pressedLong.current = true)}
        onPressOut={() => (pressedLong.current = false)}
        className="flex-1 rounded-2xl items-center justify-center bg-primary dark:bg-dark-primary"
      >
        <Text className="text-white font-bold">Agregar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
