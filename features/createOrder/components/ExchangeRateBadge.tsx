import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import React from "react";
import { Pressable, Text } from "react-native";
import { ExchangeRate } from "../../../types/exchangerate";

type ExchangeRateBadgeProps = {
  exchangeRate: ExchangeRate;

  onPress: () => void;
  inline?: boolean;
};

const ExchangeRateBadge: React.FC<ExchangeRateBadgeProps> = ({
  exchangeRate,

  onPress,
  inline = false,
}) => {
  return (
    <Pressable
      className={`${
        inline
          ? "shrink-0 rounded-xl px-3 py-1"
          : "absolute right-7 top-2 z-40 rounded-2xl px-4 py-1"
      } bg-componentbg/50 dark:bg-dark-componentbg/50`}
      onPress={onPress}
    >
      <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Tasa
      </Text>
      <Text className="text-sm font-normal text-gray-600 dark:text-gray-400">
        {totalVenezuela(exchangeRate.tasa_v)} Bs/{currencyDollar}
      </Text>
    </Pressable>
  );
};

export default ExchangeRateBadge;
