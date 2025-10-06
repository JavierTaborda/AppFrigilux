import { imageURL } from "@/utils/imageURL";
import { totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OrderApprovalProduct } from "../../types/OrderApproval";

type Props = { item: OrderApprovalProduct; index: number; currency: string };

export default React.memo(
  function ProductListItem({ item, index, currency }: Props) {
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
        entering={FadeInDown.delay(index * 30)
          .duration(250)
          .springify()}
        className="bg-white dark:bg-dark-componentbg rounded-2xl mb-2 shadow-sm shadow-black/10"
      >
        <Pressable
          className="flex-row items-center p-3 gap-4 active:opacity-80"
          accessibilityLabel={`Producto ${item.art_des?.trim() ?? "Sin descripción"}`}
        >
          {/* Imagen */}
          <View className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden justify-center items-center">
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
              <Ionicons name="image-outline" size={32} color="#999" />
            )}
          </View>

          {/* info */}
          <View className="flex-1">
            <Text
              className="text-sm font-semibold text-foreground dark:text-dark-foreground"
              numberOfLines={3}
            >
              {item.co_art?.trim() ?? ""} -{" "}
              {item.art_des?.trim() ?? " SIN DESCRIPCIÓN"}
            </Text>

            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Almacén {item.co_alma?.trim()} {item.des_sub?.trim()}
            </Text>

            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Precio 
              </Text>
              {discount !== "0" ? (
                <>
                  <Text className="text-xs font-normal line-through text-gray-600 dark:text-gray-500">
                    {totalVenezuela(price)} {currency}
                  </Text>
                  <View className="bg-red-500/10 dark:bg-red-900 px-1 rounded-full border border-red-500">
                    <Text className="text-xs font-bold text-red-500 dark:text-red-400">
                      {discount}%
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {totalVenezuela(totalDiscountIVA)} {currency}
                  </Text>
                </>
              ) : (
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {totalVenezuela(price)} {currency}
                </Text>
              )}
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Cantidad <Text className="font-medium">{quantity}</Text>
              </Text>
              <View className="flex-row gap-x-1 justify-end items-end">
                <Text className=" text-sm  text-gray-600 dark:text-gray-400">
                  Total
                </Text>
                <Text className="text-md font-bold text-primary dark:text-dark-primary">
                  {totalVenezuela(total)} {currency}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
  (prev, next) => prev.item.reng_neto === next.item.reng_neto
);
