import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { FlatList, Text, View } from "react-native";
import { useHomeScreen } from "../hooks/useHomeScreen";

export default function HomeScreen() {
  const { session } = useAuthStore();
  const { loading, pedidos } = useHomeScreen();
  console.log(pedidos)

  if(loading) return<Loader/>

  return (
    <View className="flex-1 bg-background dark:bg-dark-background ">
      <Text className="text-black dark:text-white text-xl mb-4">
        Bienvenido
      </Text>
      {session && session.user && (
        <Text className="text-black dark:text-white text-xl mb-4">
          {session.user.email}
        </Text>
      )}
      <FlatList
        data={pedidos}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="mb-6">
            <Text className="text-2xl font-bold mb-2">
              📄 Factura #{item.fact_num}
            </Text>
            <Text className="text-base text-gray-700">
              Fecha: {item.fec_emis}
            </Text>
            <Text className="text-base text-gray-700">
              Total Neto: ${item.tot_neto}
            </Text>
            <Text className="text-base text-gray-700 mb-4">
              IVA: ${item.iva}
            </Text>

            <Text className="text-xl font-semibold mb-2">🧾 Productos</Text>
            {item.reng_ped.map((producto, idx) => (
              <View key={idx} className="bg-gray-100 p-3 rounded-lg mb-2">
                <Text className="text-sm font-medium">
                  Artículo: {producto.co_art.trim()}
                </Text>
                <Text className="text-sm">Cantidad: {producto.total_art}</Text>
                <Text className="text-sm">Precio: ${producto.prec_vta}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
