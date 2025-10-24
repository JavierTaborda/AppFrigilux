import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { FlatList, Image, Text, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";


export default function FastFilters({}) {
      const { items } = useCreateOrderStore();
    
    return (
      <FlatList
        data={items}
        keyExtractor={(item: OrderItem, index) => `${item.codart}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row items-center my-1 py-2 rounded-xl">
            <Image
              source={{ uri: item.img }}
              className="w-14 h-14 rounded-xl bg-gray-200"
            />
            <View className="flex-1 ml-2">
              <Text
                className="text-sm font-normal text-gray-900 dark:text-gray-100"
                numberOfLines={2}
              >
                {item.codart?.trim()} - {item.artdes?.trim()}
              </Text>
              <Text className="text-sm text-gray-500">
                Almacen 0001 - {item.price} {currencyDollar}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                x{item.quantity}
              </Text>
              <Text className="text-md text-gray-600 dark:text-gray-300">
                {totalVenezuela(item.price * (item.quantity ?? 1))}
              </Text>
            </View>
          </View>
        )}
      />
    );
}