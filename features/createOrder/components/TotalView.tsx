import { totalVenezuela } from "@/utils/moneyFormat";
import { safeHaptic } from "@/utils/safeHaptics";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useCreateOrderStore from "../stores/useCreateOrderStore";

type TotalsProps = {
  totalBruto: number;
  TotalIVA: number;
  totalNeto: number;
  usdBruto: number;
  usdIva: number;
  totalNetoUsd: number;
};

export default function TotalView({
  totalBruto,
  TotalIVA,
  totalNeto,
  usdBruto,
  usdIva,
  totalNetoUsd,
}: TotalsProps) {
  const { setTotalsVES, totalsVES, IVA } = useCreateOrderStore();
  const totalItems = useCreateOrderStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const [showInBs, setShowInBs] = useState(totalsVES);

  const anim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [{ scale: anim.value }],
    };
  });

  const toggleCurrency = () => {
    anim.value = 0.5;
    setTimeout(() => {
      safeHaptic("success");
      setShowInBs(!showInBs);
      setTotalsVES(!showInBs);
      anim.value = withTiming(1, { duration: 250 });
    }, 150);
  };

  const formatValue = (value: number) => {
    return showInBs
      ? `${totalVenezuela(value)} Bs`
      : `${totalVenezuela(value)} $`;
  };

  return (
    <View className="mb-2 px-4 py-3 bg-componentbg dark:bg-dark-componentbg rounded-xl">
      <View className="space-y-2 border-b border-gray-300 dark:border-gray-600 pb-1">
        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
            Articulos
          </Text>
          <Text className="text-base font-medium text-foreground dark:text-dark-foreground">
            {totalItems}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
            Subtotal
          </Text>
          <Pressable onPress={toggleCurrency}>
            <Animated.Text
              style={animatedStyle}
              className="text-base text-foreground dark:text-dark-foreground"
            >
              {showInBs ? formatValue(totalBruto) : formatValue(usdBruto)}
            </Animated.Text>
          </Pressable>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
            IVA ({IVA * 100}%)
          </Text>
          <Pressable onPress={toggleCurrency}>
            <Animated.Text
              style={animatedStyle}
              className="text-base text-foreground dark:text-dark-foreground"
            >
              {showInBs ? formatValue(TotalIVA) : formatValue(usdIva)}
            </Animated.Text>
          </Pressable>
        </View>
      </View>

      <View className="pt-2 flex-row justify-between items-center">
        <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
          Total
        </Text>
        <Pressable onPress={toggleCurrency}>
          <Animated.Text
            style={animatedStyle}
            className="text-xl font-bold text-primary dark:text-dark-primary"
          >
            {showInBs ? formatValue(totalNeto) : formatValue(totalNetoUsd)}
          </Animated.Text>
        </Pressable>
      </View>
    </View>
  );
}
