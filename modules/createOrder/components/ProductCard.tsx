import { Image, Text, TouchableOpacity, View } from "react-native";

type ProductCardProps = {
    title: string;
    price: number;
    image: string;
};
export default function ProductCard({ title, price, image }: ProductCardProps) {
  return (
    <View className="bg-componentbg dark:bg-dark-componentbg rounded-xl shadow-md p-4 mb-4 w-full">
      <Image
        source={{ uri: image }}
        className="h-40 w-full rounded-lg mb-3"
        resizeMode="cover"
      />
      <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">{title}</Text>
      <Text className="text-base text-gray-500 dark:text-gray-300">${price}</Text>
      <TouchableOpacity className="mt-3 bg-primary dark:bg-primary-dark py-2 rounded-md">
        <Text className="text-white text-center font-medium">
          Agregar 
        </Text>
      </TouchableOpacity>
    </View>
  );
}
