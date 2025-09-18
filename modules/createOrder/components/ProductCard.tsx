import { totalVenezuela } from "@/utils/moneyFormat";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useCreateOrderStore from "../stores/useCreateOrderStore";

type ProductCardProps = {
  code: string;
  title: string;
  price: number;
  image: string;
  available?: number;
};

export default function ProductCard({
  code,
  title,
  price,
  image,
  available,
}: ProductCardProps) {
  const cartItem = useCreateOrderStore((s) =>
    s.items.find((i) => i.code === code)
  );
  const addItem = useCreateOrderStore((s) => s.addItem);
  const increase = useCreateOrderStore((s) => s.increase);
  const decrease = useCreateOrderStore((s) => s.decrease);

  const quantity = cartItem?.quantity ?? 0;

  return (
    <View className="bg-white dark:bg-dark-componentbg rounded-2xl  p-4 mb-4 w-[48%] shadow shadow-gray-200 dark:shadow-black/20">
      <Image
        source={{ uri: image }}
        className="h-32 w-full rounded-xl mb-2"
        resizeMode="cover"
      />
      <Text className="text-base text-foreground dark:text-dark-foreground">
        {code}
      </Text>
      <Text className="text-sm text-foreground dark:text-dark-foreground">
        {title}
      </Text>

      <View className="flex-row items-center justify-between pt-1">
        <Text className="text-lg font-semibold text-foreground  dark:text-dark-foreground">
          {totalVenezuela(price)}
        </Text>

        {quantity > 0 ? (
          
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => decrease(code)}
              className="px-3 py-1 border rounded"
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text className="mx-2">{quantity}</Text>
            <TouchableOpacity
              onPress={() => increase(code)}
              className="px-3 py-1 border rounded"
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => addItem({
              code, title, price, image, available,
              quantity: 1
            })}
            className="bg-primary rounded-xl py-2 px-4"
          >
            <Text className="text-white font-bold">+</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-xs text-gray-400 dark:text-gray-500">
        Disponibles {available ?? "—"}
      </Text>
    </View>
  );
}
