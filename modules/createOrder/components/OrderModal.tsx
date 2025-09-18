import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { emojis } from "@/utils/emojis";
import { totalVenezuela } from "@/utils/moneyFormat";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";

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
  const { items } = useCreateOrderStore();

  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

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
            height: height * 0.65,
            width: "100%",
            padding: 10,
          },
          animatedStyle,
        ]}
      >
        <View className="flex-1 rounded-3xl bg-background dark:bg-dark-background p-5 shadow-lg backdrop-blur-md">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
              {emojis.bags} Tu Pedido
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
            <FlatList
              data={items}
              keyExtractor={(item: OrderItem, index) => `${item.code}-${index}`}
              renderItem={({ item }) => (
                <View className="flex-row items-center my-2">
                  <Image
                    source={{ uri: item.image }}
                    className="w-14 h-14 rounded-xl bg-gray-200"
                  />
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-sm font-semibold text-gray-900 dark:text-gray-100"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500">{item.code}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      x{item.quantity}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {totalVenezuela(item.price * (item.quantity ?? 1))}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* Footer */}
          <View className="border-t border-white/30 mt-3 pt-3">
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-3">
              Total: {totalVenezuela(total)}
            </Text>

            
            <TouchableOpacity
              className={`rounded-full py-4 items-center ${
                items.length === 0
                  ? "bg-gray-400"
                  : "bg-primary dark:bg-dark-primary"
              }`}
              disabled={items.length === 0}
              onPress={onConfirm}
            >
              <Text className="text-white text-base font-semibold">
                Confirmar Pedido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default OrderModal;
