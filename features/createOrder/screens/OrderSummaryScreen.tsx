import ClientModal from "@/components/inputs/ClientModal";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import ExchangeInput from "@/components/inputs/ExchangeInput";
import BottomModal from "@/components/ui/BottomModal";
import { useOverlayStore } from "@/stores/useSuccessOverlayStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ClientData } from "@/types/clients";
import { appTheme } from "@/utils/appTheme";
import { safeHaptic } from "@/utils/safeHaptics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import ExchangeRateBadge from "../components/ExchangeRateBadge";
import OrderSummaryList from "../components/OrderSummaryList";
import TotalView from "../components/TotalView";
import useCreateOrder from "../hooks/useCreateOrder";
import { useOrderTotals } from "../hooks/useOrderTotals";
import { PedidoDTO } from "../interfaces/pedidoDTO";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { Conditions } from "../types/conditions";
import { calculateTotals } from "../utils/calculateTotals";

type ConditionsProps = {
  option: Conditions;
  isActive: boolean;
  onPress: () => void;
};

const ConditionChip = React.memo(
  ({ option, isActive, onPress }: ConditionsProps) => (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 px-4 ms-1 py-2 rounded-full ${
        isActive
          ? "bg-primary dark:bg-dark-primary"
          : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <Ionicons
        name={isActive ? "checkmark-circle" : "ellipse-outline"}
        size={20}
        color={isActive ? "#fff" : "#555"}
      />
      <Text
        className={`font-semibold ${
          isActive ? "text-white" : "text-foreground dark:text-dark-foreground"
        }`}
      >
        {option.cond_des.trim()}
      </Text>
    </Pressable>
  ),
);

const EmptyOrder = React.memo(() => {
  const router = useRouter();
  return (
    <Animated.View
      entering={FadeInUp.duration(300).easing(Easing.inOut(Easing.quad))}
      className="flex-1 items-center justify-center bg-background dark:bg-dark-background px-4"
    >
      <Text className="text-foreground dark:text-dark-foreground text-lg text-center">
        No hay artículos en el pedido. Agrega artículos para continuar.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(main)/(tabs)/(createOrder)/create-order")}
        className="flex-row mt-4 px-6 py-3 rounded-full bg-primary dark:bg-dark-primary"
      >
        <Ionicons name="bag-add" size={24} color="white" />
        <Text className="text-white font-bold py-1"> Agregar artículos</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function OrderSummaryScreen() {
  const { clients, options } = useLocalSearchParams<{
    clients?: string;
    options?: string;
  }>();

  const parsedClients = useMemo<ClientData[]>(
    () => (clients ? JSON.parse(clients) : []),
    [clients],
  );
  const parsedOptions = useMemo<Conditions[]>(
    () => (options ? JSON.parse(options) : []),
    [options],
  );

  const router = useRouter();
  const { isDark } = useThemeStore();
  const { items, exchangeRate, IVA, clearOrder } = useCreateOrderStore();
  const { createOrder } = useCreateOrder("");
  const { total, TotalIVA, totalWithIVA } = useOrderTotals(items);

  const [isFacturable, setIsFacturable] = useState(false);
  const [direction, setDirection] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState(parsedOptions[0]?.cond_des ?? "");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const overlay = useOverlayStore();
  const isEmpty = items.length === 0;

  const resetForm = useCallback(() => {
    setIsFacturable(false);
    setDirection("");
    setComment("");
    setEmail("");
    setSelected("");
    setSelectedClient(null);
  }, [parsedOptions]);

  useEffect(() => {
    setDirection(selectedClient?.dir_ent2?.trim() ?? "");
    setEmail(selectedClient?.email?.trim() ?? "");
  }, [selectedClient]);

  useEffect(() => {
    if (comment.startsWith("**") && !isFacturable) setIsFacturable(true);
    else if (!comment.startsWith("**") && isFacturable) setIsFacturable(false);
  }, [comment]);

  const handleSwitch = useCallback((val: boolean) => {
    setIsFacturable(val);
    setComment((prev) => {
      if (!val) return prev.startsWith("**") ? prev.replace("**", "") : prev;
      return prev.startsWith("**") ? prev : "**" + prev;
    });
  }, []);

  const buildPedido = (): PedidoDTO => {
    const fact_num = 0;

    const condicion = parsedOptions.find((opt) => opt.cond_des === selected);
    const vencimientoDays = condicion?.dias_cred ?? 0;
    const fecVenc = new Date(
      Date.now() + vencimientoDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    let tot_bruto_usd = 0;
    let iva_USD = 0;

    const renglonPedidos = items.map((item, index) => {
      const r = calculateTotals(
        item.price,
        item.quantity ?? 1,
        item.discount ?? "",
        exchangeRate.tasa_v,
        IVA,
      );

      tot_bruto_usd += r.unitUsd * item.quantity;
      iva_USD += r.unitUsd * IVA * item.quantity;

      return {
        fact_num,
        reng_num: index + 1,
        co_art: item.codart,
        total_art: item.quantity,
        pendiente: item.quantity,
        reng_neto: r.reng_neto,
        prec_vta: Number((item.price * exchangeRate.tasa_v).toFixed(5)),
        prec_vta2: item.price,
        unidad: "0001",
        cos_pro_un: item.cos_pro_un ?? 0,
        ult_cos_un: item.ult_cos_un ?? 0,
        ult_cos_om: item.ult_cos_om ?? 0,
        cos_pro_om: item.cos_pro_om ?? 0,
        porc_desc: item.discount ?? "",
        tipo_imp: item.tip_imp ?? "",
      };
    });

    const totalBruto =
      (Math.round(tot_bruto_usd * 100) / 100) * exchangeRate.tasa_v;

    const totalIVA = (Math.round(iva_USD * 100) / 100) * exchangeRate.tasa_v;

    const pedido: PedidoDTO = {
      fact_num,
      contrib: true,
      comentario: comment,
      nombre: "",
      rif: selectedClient?.rif ?? "",
      dir_ent: direction,
      co_cli: selectedClient?.co_cli ?? "",
      forma_pag: condicion?.co_cond ?? "",

      tot_bruto: Number(totalBruto.toFixed(2)),
      iva: Number(totalIVA.toFixed(2)),
      tot_neto: Number((totalBruto + totalIVA).toFixed(2)),

      fec_emis: new Date().toISOString(),
      fec_venc: fecVenc,
      saldo: Number((totalBruto + totalIVA).toFixed(2)),
      status: "0",
      moneda: "USD",
      tasa: exchangeRate?.tasa_v ?? 1,
      tasag: IVA * 100,
      telefono: selectedClient?.telefonos?.trim().slice(0, 11) ?? "",
      reng_ped: renglonPedidos,
    };

    console.log("Pedido construido:", pedido);
    return pedido;
  };
  const handleCreateOrder = useCallback(async () => {
    if (!selectedClient || !selected) {
      Alert.alert("Error", "Faltan datos requeridos.");
      return;
    }

    setLoadingOrder(true);

    try {
      const pedido = buildPedido();
      const result = await createOrder(pedido);

      if (!result.success) {
        overlay.show("error", {
          title: "Error",
          subtitle: "No se pudo crear el pedido. Intenta nuevamente.",
        });
        return;
      }

      clearOrder();
      resetForm();

      overlay.show("success", {
        title: `Pedido creado`,
        subtitle: "Se ha creado el pedido exitosamente.",
      });

      router.push("/(main)/(tabs)/(createOrder)/create-order");
    } catch (err) {
      Alert.alert("Error", "No se pudo crear el pedido. Intenta nuevamente.");
    } finally {
      setLoadingOrder(false);
    }
  }, [items, selectedClient, selected, comment, direction, exchangeRate]);

  const handleConditionPress = useCallback((cond_des: string) => {
    safeHaptic("light");
    setSelected(cond_des);
  }, []);
  useEffect(() => {
    resetForm();
  }, [isEmpty]);
  if (isEmpty) return <EmptyOrder />;

  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary">
      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl">
        <View className="px-6 pt-4">
          <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
            Detalles del pedido
          </Text>
        </View>

        <ScrollView
          className="px-4 pt-2"
          contentContainerStyle={{ paddingBottom: 240 }}
        >
          <View className="mb-4 p-4 bg-componentbg dark:bg-dark-componentbg rounded-xl gap-y-3">
            <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
              Cliente
            </Text>
            <TouchableOpacity
              onPress={() => setShowClientModal(true)}
              className="flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl"
            >
              <Text className="text-foreground dark:text-dark-foreground">
                {selectedClient
                  ? `${selectedClient.co_cli.trim()} - ${selectedClient.cli_des.trim()}`
                  : "Seleccionar cliente..."}
              </Text>
              <Ionicons name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>

            <View>
              <View className="flex-row mb-2">
                <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                  Condición de pago
                </Text>
                {selected && (
                  <Text className="text-md ml-2 font-semibold text-primary dark:text-dark-primary">
                    {selected}
                  </Text>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {parsedOptions.map((option) => (
                  <ConditionChip
                    key={option.co_cond}
                    option={option}
                    isActive={selected === option.cond_des}
                    onPress={() => handleConditionPress(option.cond_des)}
                  />
                ))}
              </ScrollView>
            </View>

            <View>
              <Text className="text-md font-medium text-foreground dark:text-dark-foreground mb-2">
                Dirección de entrega
              </Text>
              <CustomTextInput
                placeholder="Escribe la dirección de entrega"
                value={direction}
                onChangeText={setDirection}
                multiline
                numberOfLines={3}
              />
            </View>

            <View>
              <Text className="text-md font-medium text-foreground dark:text-dark-foreground mb-2">
                Comentario
              </Text>
              <CustomTextInput
                placeholder="Comentario"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="px-1 mb-1 gap-y-2">
              <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                Facturar
              </Text>
              <View className="w-[50] h-[35] justify-center">
                <Switch
                  value={isFacturable}
                  onValueChange={(val) => {
                    handleSwitch(val);
                    if (Platform.OS === "android") safeHaptic("soft");
                  }}
                  {...(Platform.OS === "android"
                    ? {
                        thumbColor: isFacturable
                          ? isDark
                            ? appTheme.dark.tertiary.DEFAULT
                            : appTheme.tertiary.DEFAULT
                          : isDark
                            ? appTheme.dark.mutedForeground
                            : appTheme.muted,
                        trackColor: {
                          false: isDark
                            ? appTheme.dark.mutedForeground
                            : appTheme.muted,
                          true: isDark
                            ? appTheme.dark.tertiary.DEFAULT
                            : appTheme.tertiary.DEFAULT,
                        },
                      }
                    : {
                        trackColor: {
                          true: isDark
                            ? appTheme.dark.tertiary.DEFAULT
                            : appTheme.tertiary.DEFAULT,
                        },
                      })}
                />
              </View>
              <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                Correo
              </Text>
              <CustomTextInput
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Artículos */}
          <View className="mb-4 bg-componentbg dark:bg-dark-componentbg px-4 py-2 rounded-xl">
            <Text className="text-md font-medium text-foreground dark:text-dark-foreground mb-2">
              Artículos
            </Text>
            <OrderSummaryList scrollEnabled={false} />
          </View>

          <TotalView
            total={total}
            totalWithIVA={totalWithIVA}
            TotalIVA={TotalIVA}
            exchangeRate={exchangeRate}
          />
        </ScrollView>

        <View className="flex-row gap-2 px-6 absolute z-50 bottom-36 left-0 right-0">
          <Pressable
            className="p-4 flex-1 items-center justify-center rounded-full shadow-lg bg-primary dark:bg-dark-primary"
            onPress={handleCreateOrder}
            disabled={loadingOrder}
          >
            <View className="flex-row gap-1 items-center">
              {loadingOrder ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-sharp" size={24} color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Confirmar
                  </Text>
                </>
              )}
            </View>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push("/(main)/(tabs)/(createOrder)/create-order")
            }
            className="p-4 rounded-full shadow-lg bg-primary dark:bg-dark-primary"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>

        <ExchangeRateBadge
          exchangeRate={exchangeRate}
          onPress={() => setShowExchangeModal(true)}
        />

        <BottomModal
          visible={showClientModal}
          onClose={() => setShowClientModal(false)}
        >
          <ClientModal
            onClose={setShowClientModal}
            setSelectedClient={setSelectedClient}
            clients={parsedClients}
          />
        </BottomModal>

        <BottomModal
          visible={showExchangeModal}
          onClose={() => setShowExchangeModal(false)}
          heightPercentage={0.385}
        >
          <ExchangeInput exchangeRate={exchangeRate} />
        </BottomModal>
      </View>
    </View>
  );
}
