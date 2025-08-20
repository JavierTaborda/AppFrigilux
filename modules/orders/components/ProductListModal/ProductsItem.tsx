import { totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OrderApprovalProduct } from "../../types/OrderApproval";

type Props = { item: OrderApprovalProduct; index: number; currency: string };

export default React.memo(function ProductItem({ item, index, currency }: Props) {
    const quantity = parseFloat(item.total_art);
    const price = parseFloat(item.prec_vta);
    const discount = item.porc_desc.trim();
    const total = parseFloat(item.reng_neto) ;
     // TODO add to the OrderApprovalProduct type
    const imageUrl = null// item.imageUrl?.trim(); 

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 35).duration(250).springify()}
            className="bg-componentbg dark:bg-dark-componentbg border-gray-200 dark:border-gray-700 rounded-2xl p-1 mb-2 shadow-xs shadow-black"
        >
            <Pressable className="flex-row items-center gap-3">
               <View className="w-2/6 ml-1 aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden justify-center items-center">
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons name="image-outline" size={36} color="#999" />
                    )}
                </View>

                <View className="flex-1 gap-0.5 w-4/6">
                    <Text
                        className="text-base font-medium text-foreground dark:text-dark-foreground"
                        numberOfLines={2}
                    >
                        {item.co_art.trim()} - {item.art_des.trim()}
                    </Text>

                    <Text className="text-sm text-foreground/80 dark:text-dark-foreground/80">
                        Almacén {item.co_alma.trim()}
                    </Text>

                    <View className="flex-row items-center">
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                            Cantidad {quantity}
                        </Text>
                        <Text className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                            Precio {totalVenezuela(price)} {currency}
                        </Text>

                    </View>
                    <View className="flex-row items-center">
                        {discount !== "0" && (
                            <View className=" bg-red-100 dark:bg-red-900 px-2 py-0.5 rounded-full border border-red-300">
                                <Text className="text-xs text-red-600 dark:text-red-400 font-bold">
                                    -{discount}%
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-xl font-bold text-primary dark:text-dark-primary">
                        {totalVenezuela(total)} {currency}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}, (prev, next) => prev.item.reng_neto === next.item.reng_neto);