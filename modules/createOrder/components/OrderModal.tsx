import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeStore } from "@/stores/useThemeStore";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
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

  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

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
     
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      clearOrder()
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
              <Ionicons name="bag-handle" size={24} color={isDark ? "#fff" : "#000"} /> Tu Pedido
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
            <View className="flex-1 justify-center items-center">
              <Ionicons name="bag-outline" size={42} color="#aaa" />
              <Text className="text-base text-gray-400 mt-2">
                No tienes productos.
              </Text>
            </View>
          ) : (
            <OrderSummaryList />
          )}

          {/* Footer */}
          <View className="border-t border-white/30 mt-1">
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
              Descuento {totalVenezuela(total)} {currencyDollar}
            </Text>
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
              Subtotal {totalVenezuela(total)} {currencyDollar}
            </Text>
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
              IVA {currencyDollar}
            </Text>
            <Text className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-3">
              Total {totalVenezuela(total)} {currencyDollar}
            </Text>

            <View className="flex-row w-full space-x-2">
              <TouchableOpacity
                className={`flex-1 rounded-full py-4 items-center ${
                  isEmpty ? "bg-gray-400" : "bg-primary dark:bg-dark-primary"
                }`}
                disabled={isEmpty}
                onPress={onConfirm}
              >
                <Text className="text-white text-base font-semibold">
                  Confirmar Pedido
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemove}
                className={`ml-1 p-4 rounded-full shadow-lg items-center justify-center ${
                  isEmpty ? "bg-gray-400" : "bg-error dark:bg-dark-error"
                }`}
                accessibilityHint="Eliminar Pedido"
                accessibilityLabel="Eliminar Pedido"
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default OrderModal;
