import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeStore } from "@/stores/useThemeStore";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { safeHaptic } from "@/utils/safeHaptics";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import OrderSummaryList from "./OrderSummaryList";

const { height, width } = Dimensions.get("window");

type OrderModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { items, clearOrder } = useCreateOrderStore();
  const { isDark } = useThemeStore();

  const applyDiscounts = (price: number, discountStr: string) => {
    if (!discountStr.trim()) return price;

    const discounts = discountStr
      .split("+")
      .map((d) => Number(d.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    return discounts.reduce((acc, d) => acc * (1 - d / 100), price);
  };

  const totalGross = items.reduce((acc, item) => {
    return acc + item.price * (item.quantity ?? 1);
  }, 0);

  const total = items.reduce((acc, item) => {
    const finalPrice = applyDiscounts(item.price, item.discount ?? "");
    return acc + finalPrice * (item.quantity ?? 1);
  }, 0);

  const IVA = total * 0.16;
  const totalWithIVA = total + IVA;

  const isEmpty = items.length === 0;

  // Reanimated setup
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : width, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const handleRemove = () => {
    safeHaptic("warning");
    Alert.alert("Vaciar pedido", "¿Estás seguro de vaciar el pedido?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Vaciar",
        style: "destructive",
        onPress: () => {
          clearOrder();
        },
      },
    ]);
    
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <BlurView intensity={50} tint="dark" className="absolute inset-0">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
      </BlurView>

      <Animated.View
        style={[
          {
            position: "absolute",
            right: 0,
            bottom: 100,
            height: height * 0.7,
            width: "100%",
            padding: 10,
          },
          animatedStyle,
        ]}
      >
        <View className="flex-1 rounded-3xl bg-componentbg dark:bg-dark-componentbg p-5 shadow-lg backdrop-blur-md">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
              <Ionicons
                name="bag-handle"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />{" "}
              Tu Pedido
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className=" bg-slate-200 dark:bg-slate-100 rounded-full"
            >
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Lista de productos */}
          {items.length === 0 ? (
            <>
              <View className="flex-1 justify-center items-center">
                <Ionicons name="bag-outline" size={42} color="#aaa" />
                <Text className="text-base text-gray-400 mt-2">
                  No tienes productos.
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="py-4 rounded-full items-center bg-gray-300 dark:bg-gray-700"
              >
                <Text className="text-white font-semibold text-base">
                  Cerrar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <OrderSummaryList />

              <View className="mt-2 pt-2 border-t border-gray-300/30 dark:border-white/10">
                <View className="space-y-1 mb-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">
                      Subtotal
                    </Text>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                      {totalVenezuela(totalGross)} {currencyDollar}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">
                      Descuento
                    </Text>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                      -{totalVenezuela(totalGross - total)} {currencyDollar}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">
                      Total con descuento
                    </Text>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                      {totalVenezuela(total)} {currencyDollar}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">
                      IVA
                    </Text>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                      +{totalVenezuela(IVA)} {currencyDollar}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mt-1">
                    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Total
                    </Text>
                    <Text className="text-lg font-bold text-primary dark:text-dark-primary">
                      {totalVenezuela(totalWithIVA)} {currencyDollar}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center space-x-3 mt-2 gap-1 ">
                  <TouchableOpacity
                    disabled={isEmpty}
                    onPress={onConfirm}
                    className={`flex-1 py-4 rounded-full items-center ${
                      isEmpty
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-primary dark:bg-dark-primary"
                    }`}
                  >
                    <Text className="text-white font-semibold text-base">
                      Confirmar Pedido
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleRemove}
                    disabled={isEmpty}
                    className={`p-4 rounded-full ${
                      isEmpty
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-red-500 dark:bg-red-600"
                    }`}
                  >
                    <Ionicons name="trash" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default OrderModal;
