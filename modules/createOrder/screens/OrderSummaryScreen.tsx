import ClientModal from "@/components/inputs/ClientModal";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import BottomModal from "@/components/ui/BottomModal";
import { Client } from "@/types/clients";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderSummaryList from "../components/OrderSummaryList";
import useCreateOrder from "../hooks/useCreateOrder";
import { useOrderTotals } from "../hooks/useOrderTotals";
import useCreateOrderStore from "../stores/useCreateOrderStore";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { neworder, createOrder } = useCreateOrder("");
  const { items } = useCreateOrderStore();
  const { totalGross, total, IVA, totalWithIVA, discountAmount } =
    useOrderTotals(items);
  const [direction, setDirection] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  // Customer Data
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalItemVisible, setModalItemVisible] = useState<boolean>(false);
  const isEmpty = items.length === 0;
   const [showClientModal, setShowClientModal] = useState(false);
    const handleClientSelectPress = useCallback(() => {
      setShowClientModal(true);
    }, []);
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
          <Pressable
            onPress={handleClientSelectPress}
            className="flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl"
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {selectedClient
                ? `${selectedClient.code.trim()} - ${selectedClient.name}`
                : "Seleccionar cliente..."}
            </Text>
          </Pressable>
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
            <CustomTextInput
              placeholder="Dirección de entrega"
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
          {/* Bloque de cálculos */}
          <View className="space-y-2 border-b border-gray-300 dark:border-gray-600 pb-3">
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
              <Text className="text-base text-red-500">
                -{totalVenezuela(discountAmount)} {currencyDollar}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                Total
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {totalVenezuela(total)} {currencyDollar}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                IVA
              </Text>
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {totalVenezuela(IVA)} {currencyDollar}
              </Text>
            </View>
          </View>

          {/* Precio final destacado */}
          <View className="pt-3 flex-row justify-between items-center">
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
          clients={clients}
        />
      </BottomModal>
    </View>
  );
}
