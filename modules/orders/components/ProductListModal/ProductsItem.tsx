import { imageURL } from "@/utils/imageURL";
import { totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OrderApprovalProduct } from "../../types/OrderApproval";

type Props = { item: OrderApprovalProduct; index: number; currency: string };

export default React.memo(
  function ProductItem({ item, index, currency }: Props) {
    const quantity = parseFloat(item.total_art);
    const price = parseFloat(item.prec_vta2);
    const discount = item.porc_desc?.trim();
    const totalDiscountIVA = item.prec_vta_desc.toFixed(2);
    const total = parseFloat(item.reng_neto);
    const img = `${imageURL}${item.co_art.trim()}.jpg`;

    const [imageExists, setImageExists] = useState(true);
    const [loadingImage, setLoadingImage] = useState(true);

    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 35)
          .duration(250)
          .springify()}
        className="bg-componentbg dark:bg-dark-componentbg rounded-2xl mb-3 shadow-xs shadow-black"
      >
        <Pressable
          className="flex-row gap-3 p-3 active:opacity-80 items-center"
          accessibilityLabel={`Producto ${item.art_des?.trim() ?? "Sin descripción"}`}
          accessibilityRole="button"
        >
          <View className="w-32 aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden justify-center items-center">
            {imageExists ? (
              <>
                {loadingImage && (
                  <View className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
                <Image
                  source={{ uri: img }}
                  className="w-full h-full"
                  resizeMode="cover"
                  onLoadEnd={() => setLoadingImage(false)}
                  onError={() => {
                    setImageExists(false);
                    setLoadingImage(false);
                  }}
                />
              </>
            ) : (
              <Ionicons name="image-outline" size={42} color="#999" />
            )}
          </View>


          <View className="flex-1">
          
            <Text
              className="text-sm font-semibold text-foreground dark:text-dark-foreground"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.co_art?.trim()} -{" "}
              {item.art_des?.trim() ?? "SIN DESCRIPCIÓN"}
            </Text>

   
            <Text className="text-sm text-foreground/70 dark:text-dark-foreground/70 "numberOfLines={1}  ellipsizeMode="tail">
               Almacén {item.co_alma?.trim()} {item.des_sub?.trim()}
            </Text>

     
            <View className="flex-row flex-wrap items-center gap-x-2">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Cantidad {quantity}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Precio
              </Text>
              <Text
                className={`text-sm text-gray-600 dark:text-gray-400 ${
                  discount !== "0" ? "line-through" : ""
                }`}
              >
                {totalVenezuela(price)} {currency}
              </Text>
            </View>

     
            {discount !== "0" && (
              <View className="flex-row items-center gap-x-2">
                <View className="bg-red-100 dark:bg-red-900 px-2 rounded-full border border-red-300 flex-row items-center gap-1">
                  <Ionicons name="pricetag" size={12} color="#dc2626" />
                  <Text className="text-xs text-red-600 dark:text-red-400 font-bold">
                    {discount}%
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {totalVenezuela(totalDiscountIVA)} {currency}
                </Text>
              </View>
            )}

   
            <View className="flex-row items-center justify-between ">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Total
              </Text>
              <Text className="text-lg font-bold text-primary dark:text-dark-primary">
                {totalVenezuela(total)} {currency}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
  (prev, next) => prev.item.reng_neto === next.item.reng_neto
);
