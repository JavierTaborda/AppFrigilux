import CustomTextInput from "@/components/inputs/CustomTextInput";
import CustomImage from "@/components/ui/CustomImagen";
import { imageURL } from "@/utils/imageURL";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";
import QuantitySelector from "./QuantitySelector";

type ItemModalProps = {
  visible?: boolean;
  onClose: (close: boolean) => void;
  item?: OrderItem;
};

const PRESET_DISCOUNTS = [5, 10, 20, 25, 30, 35, 40];

type DiscountButtonProps = {
  percent: number;
  isSelected: boolean;
  onPress: (percent: number) => void;
};

const DiscountButton = React.memo<DiscountButtonProps>(
  ({ percent, isSelected, onPress }) => (
    <Pressable
      onPress={() => onPress(percent)}
      className={`flex-1 py-2 mx-2 rounded-xl items-center justify-center min-w-[55]
      ${isSelected ? "bg-primary dark:bg-dark-primary" : "bg-gray-200 dark:bg-gray-700"}`}
      style={{ minHeight: 48 }}
    >
      <Text
        className={`font-semibold text-base
        ${isSelected ? "text-white" : "text-foreground dark:text-dark-foreground"}`}
      >
        {percent}%
      </Text>
    </Pressable>
  ),
);

const ItemModal: React.FC<ItemModalProps> = ({ visible, onClose, item }) => {
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [draftQuantity, setDraftQuantity] = useState<number>(1);

  const cartItem = useCreateOrderStore((s) =>
    s.items.find((i) => i.codart === item?.codart),
  );

  // Mantenemos tus constantes del store, añadiendo 'tasa'
  const {
    addItem,
    setItemQuantity,
    removeItem,
    IVA,
    totalsVES,
    setTotalsVES,
    exchangeRate,
  } = useCreateOrderStore();

  if (!item) return null;

  const price = Number(item.price ?? 0);
  const quantity = draftQuantity;
  const available = item.available ?? 0;
  const baseImageURL = imageURL.endsWith("/") ? imageURL : `${imageURL}/`;
  const img = `${baseImageURL}${encodeURIComponent(item.codart.trim())}.webp`;

  // Función interna para formatear segun totalsVES sin cambiar tus estilos
  const formatCurrency = (value: number) => {
    if (totalsVES) {
      return `${totalVenezuela(value * exchangeRate.tasa_v)} Bs`;
    }
    return `${totalVenezuela(value)} ${currencyDollar}`;
  };

  useEffect(() => {
    if (!item || visible === false) return;
    setDraftQuantity(Math.max(cartItem?.quantity ?? 1, 1));
    setDiscountPercent(cartItem?.discount ?? "");
  }, [visible, item, cartItem?.quantity, cartItem?.discount]);

  const discountsArray = useMemo(() => {
    if (!discountPercent.trim()) return [];
    return discountPercent
      .split("+")
      .map((d) => Number(d.trim()))
      .filter((n) => !isNaN(n) && n > 0);
  }, [discountPercent]);

  const finalUnitPrice = useMemo(() => {
    let current = price;
    discountsArray.forEach((percent) => {
      current = current * (1 - percent / 100);
    });
    return current;
  }, [price, discountsArray]);

  const discountPerUnit = useMemo(
    () => price - finalUnitPrice,
    [price, finalUnitPrice],
  );

  const totalGross = useMemo(() => price * quantity, [price, quantity]);
  const totalDiscount = useMemo(
    () => discountPerUnit * quantity,
    [discountPerUnit, quantity],
  );
  const subtotal = useMemo(
    () => finalUnitPrice * quantity,
    [finalUnitPrice, quantity],
  );
  const iva = useMemo(() => subtotal * IVA, [subtotal, IVA]);
  const total = useMemo(() => subtotal + iva, [subtotal, iva]);

  const handleDiscountToggle = useCallback(
    (percent: number) => {
      const current = discountPercent
        .split("+")
        .filter((d) => d.trim() !== "")
        .map((d) => Number(d));
      if (!current.includes(percent) && current.length < 3) {
        setDiscountPercent([...current, percent].join("+"));
      } else if (current.includes(percent)) {
        setDiscountPercent(current.filter((d) => d !== percent).join("+"));
      } else {
        Alert.alert("No se pueden aplicar más de 3 descuentos", "", [
          { text: "Aceptar" },
        ]);
      }
    },
    [discountPercent],
  );

  const handleChangeDiscount = useCallback((text: string) => {
    if (!/^[0-9+]*$/.test(text)) return;
    const cleaned = text.replace(/\+\+/g, "+");
    const discounts = cleaned.split("+").filter(Boolean).map(Number);
    if (discounts.length > 3) {
      Alert.alert("No se pueden aplicar más de 3 descuentos", "", [
        { text: "Aceptar" },
      ]);
      return;
    }
    setDiscountPercent(cleaned);
  }, []);

  const handleAddItem = useCallback(() => {
    if (!item) {
      return;
    }

    if (draftQuantity <= 0) {
      removeItem(item.codart);
      onClose(false);
      return;
    }

    setItemQuantity({ ...item, img }, draftQuantity);
    addItem(
      { ...item, img, quantity: draftQuantity, discount: discountPercent },
      0,
    );
    onClose(false);
  }, [
    item,
    draftQuantity,
    discountPercent,
    removeItem,
    setItemQuantity,
    addItem,
    onClose,
  ]);

  const discountButtons = useMemo(
    () =>
      PRESET_DISCOUNTS.map((percent) => (
        <DiscountButton
          key={percent}
          percent={percent}
          isSelected={discountsArray.includes(percent)}
          onPress={handleDiscountToggle}
        />
      )),
    [discountsArray, handleDiscountToggle],
  );

  return (
    <View className="flex-1 gap-3 py-2">
      <View className="flex-row bg-componentbg dark:bg-dark-componentbg rounded-2xl p-2 gap-2">
        <View className="w-32 h-32 my-2 rounded-xl overflow-hidden bg-bgimages mr-3 items-center justify-center">
          <CustomImage img={img} />
        </View>

        <View className="flex-1 justify-between gap-y-1">
          <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
            {item.codart}
          </Text>

          <Text
            className="text-sm text-foreground dark:text-dark-foreground leading-snug"
            numberOfLines={3}
          >
            {item.artdes}
          </Text>

          <View className="px-2 py-1 rounded-full bg-primary/15 dark:bg-primary/25 self-start">
            <Text className="text-primary dark:text-dark-primary font-semibold text-sm">
              {available - quantity} disponibles
            </Text>
          </View>

          <View className="flex-row overflow-hidden gap-1">
            {discountsArray.length > 0 && (
              <>
                <Text className="text-md line-through text-gray-500 dark:text-gray-300 mx-1">
                  {formatCurrency(price * (1 + IVA))}
                </Text>
                <View className="bg-red-500/10 dark:bg-red-900 px-1 rounded-full border border-red-500">
                  <Text className="text-xs font-bold text-red-500 dark:text-red-400">
                    {discountPercent} %
                  </Text>
                </View>
              </>
            )}
            <Text className="text-md font-bold text-primary dark:text-dark-primary">
              {formatCurrency(finalUnitPrice * (1 + IVA))}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl">
        <View className="w-full items-center mb-5">
          <QuantitySelector
            item={item}
            quantity={quantity}
            img={img}
            fullView={true}
            onChangeQuantity={setDraftQuantity}
          />
        </View>

        {quantity > 0 && (
          <>
            <ScrollView horizontal className="flex-row py-2 rounded-xl mb-1">
              {discountButtons}
            </ScrollView>

            <View className="p-2 mb-5">
              <CustomTextInput
                placeholder="Descuento (ej: 5+10+2)"
                value={discountPercent}
                onChangeText={handleChangeDiscount}
              />
            </View>
          </>
        )}

        <View className="gap-y-1 px-2">
          <Row
            label="Total bruto:"
            value={totalGross}
            formatFn={formatCurrency}
          />
          <Row
            label="Descuento:"
            value={-totalDiscount}
            red
            formatFn={formatCurrency}
          />
          <Row label="Subtotal:" value={subtotal} formatFn={formatCurrency} />
          <Row
            label={`IVA (${IVA * 100}%):`}
            value={iva}
            formatFn={formatCurrency}
          />
        </View>

        <View className="h-[1px] bg-gray-300 dark:bg-gray-700 my-3" />

        <Pressable
          onPress={() => setTotalsVES(!totalsVES)}
          className="flex-row justify-between items-center"
        >
          <Text className="text-lg font-bold text-primary dark:text-dark-primary">
            Total {totalsVES ? "(Bs)" : "($)"}
          </Text>
          <Text className="text-lg font-bold text-primary dark:text-dark-primary">
            {formatCurrency(total)}
          </Text>
        </Pressable>
      </View>

      <View className="flex-col mt-6 gap-3">
        <Pressable
          onPress={handleAddItem}
          className="rounded-2xl bg-primary dark:bg-dark-primary py-4 items-center"
        >
          <Text className="text-white font-bold text-base">
            Guardar cambios
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onClose(false)}
          className="rounded-2xl bg-gray-300 dark:bg-gray-700 py-4 items-center"
        >
          <Text className="text-black dark:text-white font-bold text-base">
            Cancelar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const Row = React.memo(
  ({
    label,
    value,
    red,
    formatFn,
  }: {
    label: string;
    value: number;
    red?: boolean;
    formatFn: (v: number) => string;
  }) => (
    <View className="flex-row justify-between">
      <Text className="text-md text-gray-500 dark:text-gray-400">{label}</Text>
      <Text
        className={`text-md ${red ? "text-red-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
      >
        {formatFn(value)}
      </Text>
    </View>
  ),
);

export default ItemModal;
