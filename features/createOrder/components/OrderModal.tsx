import Ionicons from "@react-native-vector-icons/ionicons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeStore } from "@/stores/useThemeStore";
import { safeHaptic } from "@/utils/safeHaptics";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { calculateTotals } from "../utils/calculateTotals";
import { calculateTotalsPedido } from "../utils/calculateTotalsPedido";
import ExchangeRateBadge from "./ExchangeRateBadge";
import OrderSummaryList from "./OrderSummaryList";
import TotalView from "./TotalView";

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
  const { items, clearOrder, exchangeRate, IVA } = useCreateOrderStore();
  const { isDark } = useThemeStore();
  const { fontScale } = useWindowDimensions();
  const useStackedActions = fontScale > 1.1;

  // let tot_bruto_usd = 0;
  // let tot_bruto_bs = 0;
  // let iva_USD = 0;

  // const calculate = items.map((item, index) => {
  //   const r = calculateTotals(
  //     item.price,
  //     item.quantity ?? 1,
  //     item.discount ?? "",
  //     exchangeRate.tasa_v,
  //     IVA,
  //   );

  //   tot_bruto_usd += r.unitUsd * item.quantity;
  //   tot_bruto_bs += r.reng_neto;
  //   iva_USD += r.unitUsd * IVA * item.quantity;
  // });

  // const { totalBruto, totalIVA, totalNeto, usdBruto, usdIva, totalNetoUsd } =
  //   calculateTotalsPedido(
  //     tot_bruto_usd,
  //     tot_bruto_bs,
  //     IVA,
  //     exchangeRate.tasa_v,
  //   );

  // Calculate totals for TotalView
  const { totalBruto, totalIVA, totalNeto, usdBruto, usdIva, totalNetoUsd } =
    useMemo(() => {
      // Calculate totalBruto in USD
      let tot_bruto_usd = 0;
      let tot_bruto_bs = 0;
      items.forEach((item) => {
        const r = calculateTotals(
          item.price,
          item.quantity ?? 1,
          item.discount ?? "",
          exchangeRate.tasa_v,
          IVA,
        );
        tot_bruto_usd += r.reng_neto_usd;
        tot_bruto_bs += r.reng_neto;
      });

      return calculateTotalsPedido(
        tot_bruto_usd,
        tot_bruto_bs,
        IVA,
        exchangeRate.tasa_v,
      );
    }, [items, IVA, exchangeRate]);

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
    Alert.alert("¿Desea descartar el pedido?", "", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Descartar",
        style: "destructive",
        onPress: () => {
          clearOrder();
          onClose();
        },
      },
    ]);
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <BlurView intensity={60} tint="default" style={StyleSheet.absoluteFill}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0, 0, 0, 0.32)",
            },
          ]}
        />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
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
            height: height * 0.77,
            width: "100%",
            padding: 10,
          },
          animatedStyle,
        ]}
      >
        <View className="flex-1 rounded-3xl bg-background dark:bg-dark-background px-5 pt-2 pb-3 shadow-lg backdrop-blur-md">
          <View className="mb-2 flex-row items-start justify-between gap-2 pr-8">
            <View className="min-w-0 flex-1 flex-row items-center">
              <Ionicons
                name="bag-handle"
                size={26}
                color={isDark ? "#fff" : "#000"}
              />
              <View className="ml-2 min-w-0 flex-1">
                <Text className="text-xl font-extrabold text-foreground dark:text-dark-foreground">
                  Resumen
                </Text>
                <Text className="text-md font-semibold text-gray-500 dark:text-gray-400">
                  {items?.length} {items?.length > 1 ? "artículos" : "artículo"}
                </Text>
              </View>
            </View>
            <ExchangeRateBadge
              exchangeRate={exchangeRate}
              onPress={() => {}}
              inline
            />
          </View>

          {items.length === 0 ? (
            <>
              <View className="flex-1 justify-center items-center">
                <Ionicons name="bag-outline" size={42} color="#aaa" />
                <Text className="text-base text-gray-400 mt-2">
                  No tienes productos.
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="py-4 rounded-full items-center bg-gray-300 dark:bg-gray-700"
              >
                <Text className="text-white font-semibold text-base">
                  Cerrar
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <OrderSummaryList />

              <View className="mt-1 border-t border-gray-300/30 dark:border-white/10">
                <View className="space-y-1 mb-2">
                  <TotalView
                    totalBruto={totalBruto}
                    TotalIVA={totalIVA}
                    totalNeto={totalNeto}
                    usdBruto={usdBruto}
                    usdIva={usdIva}
                    totalNetoUsd={totalNetoUsd}
                  />
                </View>

                <View
                  className={
                    useStackedActions ? "gap-2" : "flex-row items-center gap-2"
                  }
                >
                  <Pressable
                    disabled={isEmpty}
                    onPress={onConfirm}
                    className={`items-center rounded-full px-3  ${
                      useStackedActions ? "w-full py-4 " : "flex-[7] py-5 "
                    } ${
                      isEmpty
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-primary dark:bg-dark-primary"
                    }`}
                  >
                    <View className="flex-row">
                      <Ionicons
                        name="checkmark-sharp"
                        size={18}
                        color="white"
                      />
                      <Text className="text-md font-semibold text-white">
                        Confirmar cliente
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      handleRemove();
                    }}
                    disabled={isEmpty}
                    className={`items-center rounded-full px-3 ${
                      useStackedActions ? "w-full py-4 " : "flex-[3] py-3"
                    } ${
                      isEmpty
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-red-500 dark:bg-red-600"
                    }`}
                  >
                    <Text className="text-center text-md font-semibold text-white">
                      Descartar pedido
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
          <Pressable
            onPress={onClose}
            className="p-1 bg-componentbg dark:bg-dark-componentbg rounded-full
             absolute right-2 top-2"
          >
            <Ionicons name="close" size={20} color="#555" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default OrderModal;
