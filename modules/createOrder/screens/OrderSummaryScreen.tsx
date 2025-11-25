import CustomTouchableOpacity from "@/components/ui/CustomTouchableOpacity";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import OrderSummaryList from "../components/OrderSummaryList";
import useCreateOrder from "../hooks/useCreateOrder";
import useCreateOrderStore from "../stores/useCreateOrderStore";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { neworder, createOrder } = useCreateOrder("");
  const { items } = useCreateOrderStore();
const isEmpty =items.length === 0;
  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background px-6 pt-28">

      <View className="mb-6">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
          Detalles del pedido
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Revisa los detalles antes de confirmar
        </Text>
      </View>

   
      <View className="mb-4 p-4 bg-componentbg dark:bg-dark-componentbg rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
          Condición del pago
        </Text>
        <Text className="text-base text-white bg-primary rounded-full px-3 py-1 self-start">
          Contado
        </Text>
      </View>


      <View className="mb-4 p-4 bg-componentbg dark:bg-dark-componentbg rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
          Dirección de entrega
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400">
          Calle Principal #123, Guacara
        </Text>
      </View>

  
      <View className="mb-4 p-4 bg-componentbg dark:bg-dark-componentbg rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
          Comentario
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400">
          Entregar antes de las 5 PM
        </Text>
      </View>

  
      <View className="mb-4 bg-componentbg dark:bg-dark-componentbg px-4 py-2 rounded-xl">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2">
          Artículos
        </Text>
        <OrderSummaryList />
      </View>

      <View className="mb-2 p-4 bg-primary/10 dark:bg-dark-primary/20 rounded-xl">
        <Text className="text-lg font-bold text-primary dark:text-dark-primary mb-1">
          Descuento
        </Text>
        <Text className="text-base text-foreground dark:text-dark-foreground mb-2">
          10%
        </Text>

        <Text className="text-lg font-bold text-primary dark:text-dark-primary mb-1">
          Subtotal
        </Text>
        <Text className="text-base text-foreground dark:text-dark-foreground mb-2">
          $100.00
        </Text>

        <Text className="text-lg font-bold text-primary dark:text-dark-primary mb-1">
          IVA
        </Text>
        <Text className="text-base text-foreground dark:text-dark-foreground mb-2">
          $16.00
        </Text>

        <Text className="text-lg font-bold text-primary dark:text-dark-primary mb-1">
          Total
        </Text>
        <Text className="text-base text-foreground dark:text-dark-foreground mb-2">
          $116.00
        </Text>

        <Text className="text-xl font-bold text-foreground dark:text-dark-foreground mt-2">
          Precio final: $104.40
        </Text>
      </View>

   
      <View className="mt-3 mb-44 gap-4">
        <CustomTouchableOpacity
          onPress={createOrder}
          label="✅ Confirmar Pedido"
        />
        <CustomTouchableOpacity
          onPress={() =>
            router.push("/(main)/(tabs)/(createOrder)/create-order")
          }
          label="↩️ Volver"
        />
      </View>
    </ScrollView>
  );
}
