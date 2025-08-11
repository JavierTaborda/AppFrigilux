import BottomModal from "@/components/ui/BottomModal";
import { totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OrderApprovalProduct } from "../types/OrderApproval";

type Props = {
  visible: boolean;
  onClose: () => void;
  products: OrderApprovalProduct[];
  loading?: boolean;
  tasa: string;
  error?: boolean;

};

const SkeletonItem = () => (
  <View className="flex-row bg-gray-200 dark:bg-gray-700 rounded-xl p-5 mb-4">
    <View className="w-20 h-20 rounded-lg bg-gray-300 dark:bg-gray-600 mr-4 animate-pulse" />
    <View className="flex-1 justify-between">
      <View className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4 animate-pulse" />
      <View className="flex-row justify-between mb-1">
        <View className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse" />
        <View className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse" />
      </View>
      <View className="flex-row justify-between mb-1">
        <View className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse" />
        <View className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse" />
      </View>
      <View className="h-6 bg-green-300 dark:bg-green-700 rounded mt-3 w-1/2 animate-pulse" />
    </View>
  </View>
);

const ProductItem = React.memo(
  ({
    item,
    index,
  }: {
    item: OrderApprovalProduct;
    index: number;
  }) => {
    const cantidad = parseFloat(item.total_art);
    const precio = parseFloat(item.prec_vta);
    const descuento = item.porc_desc.trim();
    const total = parseFloat(item.prec_vta);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 80).duration(350).springify()}
        className="flex-row bg-white dark:bg-dark-componentbg rounded-xl p-5 mb-4 shadow-lg"
      >
        <View className="mr-4 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 justify-center items-center shadow-sm">

          <Ionicons name="image-outline" size={40} color="#999" />

        </View>

        <View className="flex-1 justify-between">
          <Text
            className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-1"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.co_art.trim()} - {item.art_des.trim()}
          </Text>


          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Cantidad: {cantidad}
            </Text>
            <Text className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Precio Unitario: {totalVenezuela(precio)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Descuento:
              {descuento} %
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Almacén: {item.co_alma.trim()} - {item.alma_des.trim()}
            </Text>
          </View>

          <View className="mt-3 bg-green-100 dark:bg-green-900 rounded-lg py-2 px-4 self-start shadow-inner">
            <Text className="text-green-800 dark:text-green-200 font-semibold text-base">
              Total Artículo: {totalVenezuela(total)}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => prevProps.item.reng_num === nextProps.item.reng_num
);

export default function ProductListModal({
  visible,
  onClose,
  products,
  loading,
  error,
  tasa,
}: Props) {
  useEffect(() => {
    if (error) {
      Alert.alert(
        "Error",
        "Ocurrió un error al cargar los productos. El modal se cerrará.",
        [
          {
            text: "OK",
            onPress: () => onClose(),
          },
        ]
      );
    }
  }, [error, onClose]);

  const totalFactura = products.reduce(
    (acc, item) => acc + parseFloat(item.reng_neto)*1.16,
    0
  );

  const facturaNumero = products.length > 0 ? products[0].fact_num : "N/A";
  const tasaPedido = parseFloat(tasa) || 1; // Fallback to 1 if tasa is not a valid number
  return (
    <BottomModal visible={visible} onClose={onClose} heightPercentage={0.85}>
      {loading ? (
        <View className="flex-1 px-5 pt-4">
          <Text className="text-3xl font-extrabold text-center mb-6 text-primary dark:text-dark-foreground">
            Peido #{facturaNumero}
          </Text>
          {[...Array(5)].map((_, i) => (
            <SkeletonItem key={i} />
          ))}
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#E53E3E" />
          <Text className="text-center text-red-600 dark:text-red-400 text-lg mt-4 font-semibold">
            No se encontraron productos para esta factura.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="mt-6 bg-primary dark:bg-dark-primary px-8 py-3 rounded-full shadow-md"
          >
            <Text className="text-white font-semibold text-lg">Cerrar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 px-1 pt-1">
          <Text className="text-3xl font-extrabold text-center mb-6 text-primary dark:text-dark-foreground">
            Pedido #{facturaNumero}
          </Text>
          <Text>
            Tasa {tasa}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {products.map((item, index) => (
              <ProductItem
                key={`${item.fact_num}-${item.reng_num}`}
                item={item}
                index={index}
             
              />
            ))}
          </ScrollView>

          <View className="absolute bottom-20 left-0 right-0 px-6 py-4 bg-componentbg dark:bg-dark-componentbg border-t border-gray-300 dark:border-gray-700 flex-row justify-between items-center rounded-t-xl shadow-md">
            <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
              Total Factura:
            </Text>
            <Text className="text-xl font-extrabold text-primary dark:text-dark-primary">
              {totalVenezuela(totalFactura )}
            </Text>
          </View>


          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="bg-primary dark:bg-dark-primary rounded-full py-3 mt-2 flex-row justify-center items-center shadow-sm"
          >
            <Ionicons name="arrow-back-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </BottomModal>
  );
}
