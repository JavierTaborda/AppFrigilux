import { totalVenezuela } from "@/utils/moneyFormat";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useCreateOrderStore from "../stores/useCreateOrderStore";

type TotalsProps = {
  total: number;
  IVA: number;
  totalWithIVA: number;
  exchangeRate: number;
};

export default function TotalView({
  total,
  IVA,
  totalWithIVA,
  exchangeRate,
}: TotalsProps) {
  const { setTotalsVES,totalsVES } = useCreateOrderStore();
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
      setShowInBs(!showInBs);
      setTotalsVES(!showInBs);
      anim.value = withTiming(1, { duration: 250 });
    }, 150);
  };

  const formatValue = (value: number) => {
    return showInBs
      ? `${totalVenezuela(value * exchangeRate)} Bs`
      : `${totalVenezuela(value)} $`;
  };

  return (
    <View className="mb-2 px-4 py-3 bg-componentbg dark:bg-dark-componentbg rounded-xl">
      <View className="space-y-2 border-b border-gray-300 dark:border-gray-600 pb-1">
        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
            Subtotal
          </Text>
          <Pressable onPress={toggleCurrency}>
            <Animated.Text
              style={animatedStyle}
              className="text-base text-foreground dark:text-dark-foreground"
            >
              {formatValue(total)}
            </Animated.Text>
          </Pressable>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
            IVA (16%)
          </Text>
          <Pressable onPress={toggleCurrency}>
            <Animated.Text
              style={animatedStyle}
              className="text-base text-foreground dark:text-dark-foreground"
            >
              {formatValue(IVA)}
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
            {formatValue(totalWithIVA)}
          </Animated.Text>
        </Pressable>
      </View>
    </View>
  );
}
