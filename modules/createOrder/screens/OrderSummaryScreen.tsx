
import CustomTouchableOpacity from "@/components/ui/CustomTouchableOpacity";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import useCreateOrder from "../hooks/useCreateOrder";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const{ neworder,
     createOrder,
  } = useCreateOrder();

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background px-6 pt-10">

      <View className="mb-6">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
          Detalles del pedido
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Revisa los detalles antes de confirmar
        </Text>
      </View>
      <View className="mb-3 flex-row justify-start items-center gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Condicion del pago
        </Text>
        <Text className="text-base text-white bg-primary rounded-full p-2">
          Contado
        </Text>
      </View>
      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Dirección de entrega{" "}
        </Text>
      </View>
      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Comentario
        </Text>
      </View>
      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Artículos
        </Text>
      </View>

      <View className="bg-componentbg dark:bg-gray-800 rounded-xl p-4 mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 dark:text-gray-300">Producto:</Text>
          <Text className="font-semibold text-gray-900 dark:text-white">
            Zapatos deportivos
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 dark:text-gray-300">Cantidad:</Text>
          <Text className="font-semibold text-gray-900 dark:text-white">2</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700 dark:text-gray-300">Total:</Text>
          <Text className="font-bold text-lg text-primary dark:text-dark-primary">
            $120.00
          </Text>
        </View>
      </View>

      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Descuento
        </Text>
      </View>

      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Subtotal
        </Text>
      </View>
      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          IVA
        </Text>
      </View>
      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Total
        </Text>
      </View>
      <View className="mb-3 flex-1 justify-start items-start gap-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          Precio final
        </Text>
      </View>

      <View className="mt-4">
        <CustomTouchableOpacity
          onPress={() => router.back()}
          label="↩️ Volver"
        />
      </View>
    </ScrollView>
  );
}