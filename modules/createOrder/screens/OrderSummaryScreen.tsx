import ClientModal from "@/components/inputs/ClientModal";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import BottomModal from "@/components/ui/BottomModal";
import { useThemeStore } from "@/stores/useThemeStore";
import { ClientData } from "@/types/clients";
import { appColors } from "@/utils/colors";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { safeHaptic } from "@/utils/safeHaptics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderSummaryList from "../components/OrderSummaryList";
import useCreateOrder from "../hooks/useCreateOrder";
import { useOrderTotals } from "../hooks/useOrderTotals";
import useCreateOrderStore from "../stores/useCreateOrderStore";

export default function OrderSummaryScreen() {
  const { clients } = useLocalSearchParams<{ clients?: string }>();
  const parsedClients: ClientData[] = clients ? JSON.parse(clients) : [];

  const router = useRouter();
  const [isFacturable, setIsFacturable] = useState(false);

 
  const { isDark } = useThemeStore();
  const { neworder, createOrder } = useCreateOrder("");
  const { items } = useCreateOrderStore();
  const { totalGross, total, IVA, totalWithIVA, discountAmount } =
    useOrderTotals(items);
  const [direction, setDirection] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const [selected, setSelected] = useState("Contado");
  const options = ["Contado", "Crédito 15 días", "Crédito 30 días"];

  // Customer Data
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const isEmpty = items.length === 0;
  const [showClientModal, setShowClientModal] = useState(false);

  const handleClientSelectPress = useCallback(() => {
    setShowClientModal(true);
  }, []);

  const handleswitch = (val: boolean) => {
      setIsFacturable(val);

      if(!val) {
        // No Facturable
        if(comment.startsWith("**")) {
          setComment(comment.replace("**",""));
        }
      } else {
        // Facturable
        if(!comment.startsWith("**"))
          setComment("**"+comment);
      }
      //
    };
  useEffect(() => {
    setDirection(selectedClient?.dir_ent2?.trim() || "");
  }, [selectedClient]);

  return (
    <View className="fex-1 bg-background dark:bg-dark-background">
      <View className="px-6 pt-2">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
          Detalles del pedido
        </Text>
      </View>
      <ScrollView
        className="px-6 pt-2"
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
            <Text className="text-md font-medium text-foreground dark:text-dark-foreground mb-2">
              Condición de pago
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-3 pt-4"
            >
              {options.map((option) => {
                const isActive = selected === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSelected(option)}
                    activeOpacity={0.7}
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
                        isActive
                          ? "text-white"
                          : "text-foreground dark:text-dark-foreground"
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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

          <View className="px-1 mb-1">
            <Text className="text-md font-medium text-foreground dark:text-dark-foreground mb-2">
              Facturar
            </Text>
            <View className="w-[50] h-[35]  justify-center">
              <Switch
                value={isFacturable}
                onValueChange={(val) => {
                  handleswitch(val);
                  Platform.OS === "android" ? safeHaptic("soft") : null;
                }}
                {...(Platform.OS === "android"
                  ? {
                      thumbColor: isFacturable
                        ? isDark
                          ? appColors.dark.tertiary.DEFAULT
                          : appColors.tertiary.DEFAULT
                        : isDark
                          ? appColors.dark.mutedForeground
                          : appColors.muted,
                      trackColor: {
                        false: isDark
                          ? appColors.dark.mutedForeground
                          : appColors.muted,
                        true: isDark
                          ? appColors.dark.tertiary.DEFAULT
                          : appColors.tertiary.DEFAULT,
                      },
                    }
                  : {
                      trackColor: {
                        true: isDark
                          ? appColors.dark.tertiary.DEFAULT
                          : appColors.tertiary.DEFAULT,
                      },
                    })}
              />
            </View>
          </View>
        </View>
        <View className="mb-4 bg-componentbg dark:bg-dark-componentbg px-4 py-2 rounded-xl">
          <Text className="text-md font-medium text-foreground dark:text-dark-foreground mb-2">
            Artículos
          </Text>
          <OrderSummaryList scrollEnabled={false} />
        </View>

        <View className="mb-2 px-4 py-3 bg-componentbg dark:bg-dark-componentbg rounded-xl">
          <View className="space-y-2 border-b border-gray-300 dark:border-gray-600 pb-1">
            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                Subtotal
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {totalVenezuela(total)} {currencyDollar}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                IVA (16%)
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {totalVenezuela(IVA)} {currencyDollar}
              </Text>
            </View>
          </View>

          <View className="pt-2 flex-row justify-between items-center">
            <Text className="ttext-md font-medium text-foreground dark:text-dark-foreground">
              Total
            </Text>
            <Text className="text-xl font-bold  text-primary dark:text-dark-primary ">
              {totalVenezuela(totalWithIVA)} {currencyDollar}
            </Text>
          </View>
          <View className="flex-row justify-between my-1">
            <Text className="text-sm font-normal text-gray-600 dark:text-gray-400">
              {`Tasa ${totalVenezuela(288)} Bs`}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="flex-row gap-2 px-6 absolute z-50 bottom-48 left-0 right-0">
        <TouchableOpacity
          className="p-4 flex-1 items-center justify-center rounded-full shadow-lg  bg-primary dark:bg-dark-primary"
          onPress={() =>
            Alert.alert(
              "Confirmar pedido",
              "¿Estás seguro de confirmar el pedido?",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Confirmar",
                  onPress: async () => {
                    await createOrder();
                  },
                },
              ]
            )
          }
        >
          <View className="flex-row gap-1 items-center">
            <Ionicons name="checkmark-sharp" size={24} color="white" />
            <Text className="text-lg font-semibold text-white">Confirmar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/(main)/(tabs)/(createOrder)/create-order")
          }
          className={
            "p-4 rounded-full shadow-lg bg-primary dark:bg-dark-primary"
          }
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

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
    </View>
  );
}
