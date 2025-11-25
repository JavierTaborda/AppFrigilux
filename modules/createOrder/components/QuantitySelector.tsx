/**
 * QuantitySelector Component
 * ----------------------------------------------
 * A highly interactive counter widget used to adjust the
 * quantity of a product inside a cart or catalog.
 *
 * It supports:
 * - Increase / decrease quantity
 * - Auto-remove on long-press (holding "-")
 * - Max-increase on long-press (holding "+")
 * - Animated feedback using Reanimated
 * - Haptic feedback using safeHaptics
 * - "Add" mode when quantity = 0
 *
 * This component was designed with layout animation safety in mind.
 * Layout animations (BounceIn / BounceOut) are applied only to
 * non-transform wrappers to avoid conflicts with transform animations.
 *
 * Props:
 *  - quantity: number
 *      Current quantity of the product.
 *
 *  - onIncrease: () => void
 *      Called when the user taps the "+" button.
 *
 *  - onDecrease: () => void
 *      Called when the user taps the "-" button.
 *
 *  - onRemove: () => void
 *      Called on long press of "-". Usually removes the item completely.
 *
 *  - onMaxIncrease: () => void
 *      Called on long press of "+". Usually sets the quantity to the max available.
 *
 *  - onAdd: () => void
 *      Called when quantity = 0 and the user presses the "Add" button.
 *
 *  - height?: number
 *      Optional height of the "Add" button container.
 *
 *  - size?: number
 *      Optional size for "+" and "-" circular buttons.
 *
 * Behavior:
 *  - When quantity > 0:
 *        Shows decrement button, current quantity, and increment button.
 *
 *  - When quantity = 0:
 *        Shows an "Add" button instead.
 *
 * Animations:
 *  - Scale animations for buttons and quantity text using useSharedValue()
 *  - Layout animations (BounceIn / BounceOut) on quantity to animate entry/exit
 *
 * Haptics:
 *  - Light selection feedback on each increment/decrement
 *  - Strong feedback on long press actions (remove/max-increase)
 *
 * Notes:
 *  - Long press state is managed via a ref to prevent accidental double triggers.
 *  - All transform animations are applied only on inner wrappers to prevent
 *    conflicts with Reanimated's layout animations.
 */

import { Text, TouchableOpacity } from "react-native";
import Animated, {
  BounceIn,
  BounceOut,
  useAnimatedStyle
} from "react-native-reanimated";
import { useQuantityHandlers } from "../hooks/useQuantityHandler";



type QuantitySelectorProps = {
  quantity: number;
  available?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void; // long press decrease
  onMaxIncrease: () => void; // long press increase
  onAdd: () => void;
  height?: number;
  size?: number;
};

export default function QuantitySelector({
  quantity,
  available,
  onIncrease,
  onDecrease,
  onRemove,
  onMaxIncrease,
  onAdd,
  height = 30,
  size = 32,
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
    quantity,
    available,
    onIncrease,
    onDecrease,
    onRemove,
    onMaxIncrease,
    onAdd,
  });

  // Animated styles
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const qtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));


  return quantity > 0 ? (

    <Animated.View className="flex-row items-center justify-center gap-4">
      {/* INNER wrapper con transform */}
      <Animated.View style={btnStyle} className="flex-row items-center gap-4">
        {/* BTN - */}
        <TouchableOpacity
          onPress={handleDecrease}
          onLongPress={() => {
            pressedLong.current = true;
            handleRemove();
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

        {/* CANTIDAD */}
        <Animated.View entering={BounceIn} exiting={BounceOut.duration(150)}>
          <Animated.View style={qtyStyle}>
            <Text className="mx-2 font-semibold text-lg text-center text-foreground dark:text-dark-foreground">
              {quantity}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* BTN + */}
        <TouchableOpacity
          onPress={handleIncrease}
          onLongPress={() => {
            pressedLong.current = true;
            handleMaxIncrease();
          }}
          onPressOut={() => (pressedLong.current = false)}
          delayLongPress={300}
          style={{ width: size, height: size }}
          className="rounded-full bg-primary items-center justify-center"
        >
          <Text className="text-white text-md font-bold">+</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  ) : (

    <Animated.View style={[{ height }, addStyle]} className="w-full flex-1">
      <TouchableOpacity
        onPress={handleAdd}
        onLongPress={() => (pressedLong.current = true)}
        onPressOut={() => setTimeout(() => (pressedLong.current = false), 120)}
        className="flex-1 rounded-2xl items-center justify-center bg-primary dark:bg-dark-primary"
      >
        <Text className="text-white font-bold">Agregar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
