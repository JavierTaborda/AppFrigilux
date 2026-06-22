import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
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
  onChangeQuantity?: (nextQuantity: number) => void;
};

export default function QuantitySelector({
  quantity,
  item,
  img,
  height = 30,
  size = 32,
  fullView = false,
  onChangeQuantity,
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

  const [inputQuantity, setInputQuantity] = useState(String(quantity));

  useEffect(() => {
    setInputQuantity(String(quantity));
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

    if (numeric === "") {
      setInputQuantity("");
      return;
    }

    let qty = parseInt(numeric, 10);

    if (qty <= 0) {
      setInputQuantity(numeric);
      return;
    }

    if (qty > item.available) {
      qty = item.available;
    }

    setInputQuantity(String(qty));

    if (onChangeQuantity) {
      onChangeQuantity(qty);
      return;
    }

    handleIncreaseQty(qty, quantity);
  };

  const maxAvailable = item.available ?? Number.MAX_SAFE_INTEGER;

  const handleControlledAdd = () => {
    if (!onChangeQuantity) return;
    onChangeQuantity(Math.min(1, maxAvailable));
  };

  const handleControlledIncrease = () => {
    if (!onChangeQuantity) return;
    onChangeQuantity(Math.min(quantity + 1, maxAvailable));
  };

  const handleControlledDecrease = () => {
    if (!onChangeQuantity) return;
    onChangeQuantity(Math.max(quantity - 1, 0));
  };

  const handleControlledMaxIncrease = () => {
    if (!onChangeQuantity) return;
    onChangeQuantity(maxAvailable);
  };

  const handleControlledRemove = () => {
    if (!onChangeQuantity) return;
    onChangeQuantity(0);
  };

  if (quantity > 0) {
    return (
      <View
        style={{ height }}
        className="flex-row items-center justify-center gap-4"
      >
        {/* DECREASE */}
        <Animated.View style={animatedDecrease}>
          <Pressable
            onPress={() => {
              if (onChangeQuantity) {
                handleControlledDecrease();
              } else {
                handleDecrease();
              }
              scaleDecrease.value = 1.2;
              scaleDecrease.value = withSpring(1);
            }}
            onLongPress={() => {
              pressedLong.current = true;
              if (onChangeQuantity) {
                handleControlledRemove();
              } else {
                handleRemove(item.codart);
              }
            }}
            onPressOut={() => (pressedLong.current = false)}
            delayLongPress={300}
            style={{ width: size, height: size }}
            className="rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
          >
            <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
              -
            </Text>
          </Pressable>
        </Animated.View>

        {/* QUANTITY */}
        {!fullView ? (
          <Text className="mx-4 font-semibold text-xl text-center text-foreground dark:text-dark-foreground">
            {quantity}
          </Text>
        ) : (
          <TextInput
            value={inputQuantity}
            onChangeText={handleManualChange}
            keyboardType="numeric"
            style={{ minWidth: size * 1.5 }}
            className="font-semibold mx-8 p-0 text-2xl text-center text-foreground dark:text-dark-foreground"
          />
        )}

        {/* INCREASE */}
        <Animated.View style={animatedIncrease}>
          <Pressable
            onPress={() => {
              if (onChangeQuantity) {
                handleControlledIncrease();
              } else {
                handleIncrease();
              }
              scaleIncrease.value = 1.2;
              scaleIncrease.value = withSpring(1);
            }}
            onLongPress={() => {
              pressedLong.current = true;
              if (onChangeQuantity) {
                handleControlledMaxIncrease();
              } else {
                handleMaxIncrease(item.codart);
              }
            }}
            onPressOut={() => (pressedLong.current = false)}
            delayLongPress={300}
            style={{ width: size, height: size }}
            className="rounded-full bg-primary dark:bg-dark-primary items-center justify-center"
          >
            <Text className="text-white text-md font-bold">+</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // Cuando la cantidad es 0 -> botón agregar
  return (
    <Animated.View style={[{ height }, animatedAdd]} className="w-full">
      <Pressable
        onPress={() => {
          if (onChangeQuantity) {
            handleControlledAdd();
          } else {
            handleAdd();
          }
          scaleAdd.value = 1.2;
          scaleAdd.value = withSpring(1);
        }}
        onLongPress={() => (pressedLong.current = true)}
        onPressOut={() => (pressedLong.current = false)}
        className="flex-1 rounded-xl items-center justify-center bg-primary dark:bg-dark-primary"
      >
        <Text className="text-white font-bold">Agregar</Text>
      </Pressable>
    </Animated.View>
  );
}
