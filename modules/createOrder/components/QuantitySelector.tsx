

import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  BounceOut,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useQuantityHandlers } from "../hooks/useQuantityHandler";

type QuantitySelectorProps = {
  codart: string;
  quantity: number;
  available?: number;
  artdes: string;
  price: number;
  img?: string;
  height?: number;
  size?: number;
  fullView?: boolean;
};

export default function QuantitySelector({
  quantity,
  available,
  codart,
  artdes,
  price,
  img,
  height = 30,
  size = 32,
  fullView = false,
}: QuantitySelectorProps) {

  const {
    pressedLong,
    btnScale,
    qtyScale,
    addScale,
    handleIncrease,
    handleDecrease,
    handleAdd,
    handleRemove,
    handleMaxIncrease,
  } = useQuantityHandlers({
    codart,
    quantity,
    available,
    artdes,
    price,
    img,
  });
const [inputQuantity, setInputQuantity] = useState(0);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const qtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));
const containerHeight = height || 40;


  if (quantity > 0) {
    return (
      <Animated.View
        style={[{ height: containerHeight }]}
        className="flex-row items-center justify-center gap-4 "
      >
        <Animated.View style={btnStyle} className="flex-row items-center">
          <TouchableOpacity
            onPress={handleDecrease}
            onLongPress={() => {
              pressedLong.current = true;
              handleRemove(codart);
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

          <Animated.View entering={BounceIn} exiting={BounceOut.duration(150)}>
            <Animated.View style={qtyStyle}>
              {!fullView ? (
                <Text className="mx-4 font-semibold text-lg text-center text-foreground dark:text-dark-foreground">
                  {quantity}
                </Text>
              ) : (
                <TextInput
                  value={String(quantity)}
                  onChangeText={(text) => setInputQuantity(Number(text))}
                  keyboardType="numeric"
                  className="font-semibold mx-8 p-0 text-2xl text-center text-foreground dark:text-dark-foreground"
                  
                />
              )}
            </Animated.View>
          </Animated.View>


          <TouchableOpacity
            onPress={handleIncrease}
            onLongPress={() => {
              pressedLong.current = true;
              handleMaxIncrease(codart);
            }}
            onPressOut={() => (pressedLong.current = false)}
            delayLongPress={300}
            style={{ width: size, height: size }}
            className="rounded-full bg-primary dark:bg-dark-primary items-center justify-center"
          >
            <Text className="text-white text-md font-bold">+</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <View style={{ height }} className="w-full">
      <Animated.View style={addStyle} className="flex-1">
        <TouchableOpacity
          onPress={handleAdd}
          onLongPress={() => (pressedLong.current = true)}
          onPressOut={() => (pressedLong.current = false)}
          className="flex-1 rounded-2xl items-center  justify-center bg-primary dark:bg-dark-primary"
        >
          <Text className="text-white font-bold">Agregar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
