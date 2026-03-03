import { ExchangeRate } from "@/types/exchangerate";
import { currencyDollar } from "@/utils/moneyFormat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
    FadeInRight,
    FadeOutRight,
    SlideInRight,
    SlideOutRight,
} from "react-native-reanimated";

type ExchangeRateBadgeSmallProps = {
  exchangeRate: ExchangeRate;
};

export default function ExchangeRateBadgeSmall({
  exchangeRate,
}: ExchangeRateBadgeSmallProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="absolute bottom-52 right-0 items-end">
      {isVisible && (
        <Animated.View
          key="badge-full"
          className="bg-primary/90 dark:bg-dark-componentbg rounded-l-3xl px-4 py-2 flex-row items-center"
          entering={SlideInRight.springify().damping(110)}
          exiting={SlideOutRight.duration(400)}
        >
          <View className="items-end mr-2">
            <Text className="text-[10px] text-white dark:text-dark-foreground font-light">
              Tasa de cambio
            </Text>
            <Text className="text-sm text-white dark:text-dark-foreground font-bold">
              {exchangeRate?.tasa_v ?? 0} Bs / {currencyDollar}
            </Text>
          </View>

          <Pressable
            onPress={() => setIsVisible(false)}
            className="bg-gray-200/50 dark:bg-gray-700/50 rounded-full p-1"
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="gray"
            />
          </Pressable>
        </Animated.View>
      )}

      {!isVisible && (
        <Animated.View
          key="badge-tab"
          entering={FadeInRight.duration(300)}
          exiting={FadeOutRight.duration(300)}
        >
          <Pressable
            onPress={() => setIsVisible(true)}
            className="bg-primary/80 dark:bg-dark-primary rounded-l-3xl pl-3 pr-1 py-3 shadow-lg"
          >
            <MaterialCommunityIcons
              name="currency-usd"
              size={20}
              color="white"
            />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
