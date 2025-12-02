import ClientModal from "@/components/inputs/ClientModal";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import BottomModal from "@/components/ui/BottomModal";
import { ClientData } from "@/types/clients";
import { appColors } from "@/utils/colors";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import OrderSummaryList from "../components/OrderSummaryList";
import useCreateOrder from "../hooks/useCreateOrder";
import { useOrderTotals } from "../hooks/useOrderTotals";
import useCreateOrderStore from "../stores/useCreateOrderStore";

export default function OrderSummaryScreen() {
  const { clients } = useLocalSearchParams<{ clients?: string }>();
  const parsedClients: ClientData[] = clients ? JSON.parse(clients) : [];

  const router = useRouter();
  const { neworder, createOrder } = useCreateOrder("");
  const { items } = useCreateOrderStore();
  const { totalGross, total, IVA, totalWithIVA, discountAmount } =
    useOrderTotals(items);
  const [direction, setDirection] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  // Customer Data
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [modalItemVisible, setModalItemVisible] = useState<boolean>(false);
  const isEmpty = items.length === 0;
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true);

  const handleClientSelectPress = useCallback(() => {
    setShowClientModal(true);
  }, []);

  useEffect(() => {
    setShowSuggestion(true);
  }, [selectedClient]);

  const DirectionView = () => {
   if (!selectedClient?.dir_ent2) return null;
    return (
      <Animated.View
        entering={FadeInUp.duration(100).springify()}
        exiting={FadeOutDown.duration(300)}
        className="mb-3 p-4 rounded-xl bg-background dark:bg-dark-background"
      >
        <TouchableOpacity
          onPress={() => setShowSuggestion(false)}
          className="absolute right-3 top-3 p-1"
        >
          <Ionicons name="close" size={18} color="#888" />
        </TouchableOpacity>
        <View className="flex-row items-start gap-3">
          <Ionicons
            name="location-sharp"
            size={26}
            color={appColors.primary.DEFAULT}
          />

          <View className="flex-1">
            <Text className="font-semibold text-foreground dark:text-dark-foreground">
              Dirección sugerida
            </Text>

            <Text className="text-gray-600 dark:text-gray-300 mt-1">
              {selectedClient?.dir_ent2?.trim()}
            </Text>

            <View className="flex-row gap-3 mt-3">
              <TouchableOpacity
                onPress={() => {
                  setDirection(selectedClient?.dir_ent2?.trim() || "")
                  setShowSuggestion(false);
                }}
                className="px-3 py-2 bg-primary dark:bg-dark-primary rounded-full"
              >
                <Text className="text-white text-md font-semibold">Usar esta</Text>
              </TouchableOpacity>

             
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="fex-1 bg-background dark:bg-dark-background">
      <View className="px-6 pt-2">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
          Detalles del pedido
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Revisa los detalles antes de confirmar
        </Text>
      </View>
      <ScrollView
        className="px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="mb-4 p-4 bg-componentbg dark:bg-dark-componentbg rounded-xl gap-y-3">
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
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
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
              Condición del pago
            </Text>
            <TouchableOpacity
              onPress={() => setModalItemVisible(true)}
              className="flex-row items-center gap-2 px-4 py-2 bg-primary dark:bg-dark-primary rounded-full self-start"
            >
              <Ionicons name="card" size={20} color="white" />
              <Text className="text-white font-semibold">Contado</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
              Dirección de entrega
            </Text>
            {showSuggestion && DirectionView()}

            <CustomTextInput
              placeholder="Escribe la dirección de entrega"
              value={direction}
              onChangeText={setDirection}
              multiline
              numberOfLines={3}
            />
          </View>

          <View>
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
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

          <View className="flex-row justify-center gap-6">
            <TouchableOpacity className="flex-row items-center gap-2 px-4 py-2 bg-primary dark:bg-dark-primary  rounded-full">
              <Ionicons name="bag" size={20} color="white" />
              <Text className="text-white font-semibold">Facturar</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-2 px-4 py-2 bg-primary dark:bg-dark-primary rounded-full">
              <Ionicons name="cube" size={20} color="white" />
              <Text className="text-white font-semibold">Convertir</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mb-4 bg-componentbg dark:bg-dark-componentbg px-4 py-2 rounded-xl">
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
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
                {totalVenezuela(totalGross)} {currencyDollar}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                Descuento
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                -{totalVenezuela(discountAmount)} {currencyDollar}
              </Text>
            </View>

            {/* <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                Total
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {totalVenezuela(total)} {currencyDollar}
              </Text>
            </View> */}

            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                IVA
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {totalVenezuela(IVA)} {currencyDollar}
              </Text>
            </View>
          </View>

          <View className="pt-2 flex-row justify-between items-center">
            <Text className="text-xl font-extrabold text-primary dark:text-dark-primary">
              Precio final
            </Text>
            <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
              {totalVenezuela(totalWithIVA)} {currencyDollar}
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
            <Text className="text-lg font-semibold text-white">
              Confirmar pedido
            </Text>
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
        visible={modalItemVisible}
        onClose={() => setModalItemVisible(false)}
        heightPercentage={0.6}
      >
        <View className="flex-1 gap-3 items-center justify-start pt-10">
          {["Contado", "Crédito 15 días", "Crédito 30 días"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setModalItemVisible(false)}
              className="flex-row items-center gap-2 px-4 py-2 bg-componentbg dark:bg-dark-componentbg rounded-full"
            >
              <Ionicons name="checkmark-circle" size={20} color="black" />
              <Text className="text-foreground dark:text-dark-foreground font-semibold">
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomModal>
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
