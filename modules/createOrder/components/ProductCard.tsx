import { totalVenezuela } from "@/utils/moneyFormat";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ProductCardProps = {
  code: string;
  title: string;
  price: number;
  image: string;
};

export default function ProductCard({
  title,
  price,
  image,
  code,
}: ProductCardProps) {
  return (
    <View className="bg-white dark:bg-dark-componentbg rounded-2xl  p-4 mb-4 w-[48%] shadow shadow-gray-200 dark:shadow-black/20">
      <Image
        source={{ uri: image }}
        className="h-32 w-full rounded-xl mb-2"// bg-stone-200/60 dark:bg-stone-100
        resizeMode='cover' // contain
      />
      <Text
        className="text-base text-foreground dark:text-dark-foreground  overflow-hidden"
        numberOfLines={2}
        lineBreakMode="tail"
      >
        {code}
      </Text>
      <Text
        className="text-sm text-foreground dark:text-dark-foreground "
        numberOfLines={2}
        ellipsizeMode="middle"
      >
        {title}
      </Text>

      <View className="flex-row items-center justify-between pt-1">
        <Text className="text-lg font-semibold text-primary dark:text-primary-dark">
          {totalVenezuela(price)}
        </Text>
        <TouchableOpacity className="flex-row items-center justify-center bg-primary dark:bg-primary-dark rounded-xl active:opacity-80">
          <Text className="text-white text-center font-semibold text-xl py-1 px-4">
            +
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-gray-400 dark:text-gray-500">
        Disponibles 12
      </Text>
    </View>
  );
}
