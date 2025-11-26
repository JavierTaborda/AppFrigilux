import CustomTextInput from "@/components/inputs/CustomTextInput";
import CustomImage from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import QuantitySelector from "./QuantitySelector";

type ItemModalProps = {
  visible?: boolean;
  onClose: (close: boolean) => void;
  item?: OrderItem;
};

const ItemModal: React.FC<ItemModalProps> = ({ onClose, item }) => {
  const [discountPercent, setDiscountPercent] = useState<string>("");

  const price = Number(item?.price ?? 0);
  const cartItem = useCreateOrderStore((s) =>
    s.items.find((i) => i.codart === item?.codart)
  );
  const quantity = cartItem?.quantity ?? 0;
  const available = item?.available ?? 0;

  const totalGross = useMemo(() => price * quantity, [price, quantity]);

  const discountsArray = useMemo(() => {
    if (!discountPercent.trim()) return [];
    return discountPercent
      .split("+")
      .map((d) => Number(d.trim()))
      .filter((n) => !isNaN(n) && n > 0);
  }, [discountPercent]);

  const discountAmount = useMemo(() => {
    let current = totalGross;

    discountsArray.forEach((percent) => {
      const amount = (current * percent) / 100;
      current -= amount;
    });

    return totalGross - current; // total discounted
  }, [totalGross, discountsArray]);

  const subtotal = useMemo(
    () => totalGross - discountAmount,
    [totalGross, discountAmount]
  );
  const iva = useMemo(() => subtotal * 0.16, [subtotal]);
  const total = useMemo(() => subtotal + iva, [subtotal, iva]);

  const handleDiscountToggle = (percent: number) => {
    const currentDiscounts = discountPercent
      .split("+")
      .filter((d) => d.trim() !== "")
      .map((d) => Number(d));

    let newDiscounts: number[];

    if (currentDiscounts.includes(percent)) {
      newDiscounts = currentDiscounts.filter((d) => d !== percent);
    } else {
      newDiscounts = [...currentDiscounts, percent];
    }

    setDiscountPercent(newDiscounts.join("+"));
  };
  const handleChangeDiscount = (text: string) => {
    // only numberes and "+"
    const regex = /^[0-9+]*$/;

    if (regex.test(text)) {
      setDiscountPercent(text);
    }
  };

  const img = `${imageURL}${item?.codart?.trim()}.jpg`;

  return (
    <View className="gap-3 py-2">
      <View className="flex-row bg-componentbg dark:bg-dark-componentbg rounded-2xl p-2">
        <View className="w-32 h-32 rounded-xl overflow-hidden bg-bgimages mr-3">
          <CustomImage img={img} />
        </View>

        <View className="flex-1 justify-between">
          <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
            {item?.codart}
          </Text>

          <Text
            className="text-sm text-foreground dark:text-dark-foreground leading-snug"
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item?.artdes}
          </Text>

          <View className="mt-1 px-2 py-1 rounded-full bg-primary/15 dark:bg-primary/25 self-start">
            <Text className="text-primary dark:text-dark-primary font-semibold text-sm">
              {available} disponibles
            </Text>
          </View>

          <Text className="text-lg font-extrabold text-primary dark:text-dark-primary ">
            {totalVenezuela(price)} {currencyDollar}
          </Text>
        </View>
      </View>

      <View className="bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl">
        <View className="w-full items-center mb-5">
          <QuantitySelector
            codart={item!.codart}
            quantity={quantity}
            available={item!.available}
            artdes={item!.artdes}
            price={item!.price}
            img={img}
          />
        </View>
        <ScrollView horizontal className="flex-row py-2 rounded-xl mb-1">
          {[5, 10, 15, 20, 25, 30, 35, 40].map((percent) => {
            const currentDiscounts = discountPercent
              .split("+")
              .filter((d) => d.trim() !== "")
              .map((d) => Number(d));

            const isSelected = currentDiscounts.includes(percent);

            return (
              <TouchableOpacity
                key={percent}
                onPress={() => handleDiscountToggle(percent)}
                className={`flex-1 py-2 px-4 mx-2 rounded-xl items-center justify-center 
          ${isSelected ? "bg-primary dark:bg-dark-primary" : "bg-gray-200 dark:bg-gray-700"}`}
                style={{ minHeight: 48 }}
              >
                <Text
                  className={`font-semibold text-base 
            ${isSelected ? "text-white" : "text-foreground dark:text-dark-foreground"}`}
                >
                  {percent}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View className="p-2 mb-5">
          <CustomTextInput
            placeholder="Descuento (ej: 5+10+2)"
            value={discountPercent}
            onChangeText={handleChangeDiscount}
            editable={true}
          />
        </View>
        <View className="gap-y-1 px-2 ">
          <View className="flex-row justify-between">
            <Text className="text-md text-gray-500 dark:text-gray-400">
              Total bruto:
            </Text>
            <Text className="text-md text-gray-600 dark:text-gray-300">
              {totalVenezuela(totalGross)} {currencyDollar}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-md text-gray-500 dark:text-gray-400">
              Descuento:
            </Text>
            <Text className="text-md text-red-500 font-semibold">
              -{totalVenezuela(discountAmount)} {currencyDollar}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-md text-gray-500 dark:text-gray-400">
              Subtotal:
            </Text>
            <Text className="text-md text-gray-600 dark:text-gray-300">
              {totalVenezuela(subtotal)} {currencyDollar}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-md text-gray-500 dark:text-gray-400">
              IVA:
            </Text>
            <Text className="text-md text-gray-600 dark:text-gray-300">
              {totalVenezuela(iva)} {currencyDollar}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-gray-300 dark:bg-gray-700 my-3" />

        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-primary">Precio Final</Text>
          <Text className="text-lg font-bold text-primary">
            {totalVenezuela(total)} {currencyDollar}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-6">
        <TouchableOpacity
          onPress={() => onClose(false)}
          className="flex-1 rounded-2xl bg-primary py-3 items-center mr-2"
        >
          <Text className="text-white font-bold text-base">
            Agregar al Pedido
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onClose(false)}
          className="flex-1 rounded-2xl bg-gray-300 dark:bg-gray-700 py-3 items-center ml-2"
        >
          <Text className="text-black dark:text-white font-bold text-base">
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemModal;
