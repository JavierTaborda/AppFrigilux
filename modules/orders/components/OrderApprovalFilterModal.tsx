import CustomDateTimePicker from "@/components/inputs/CustomDateTimePicker";
import FilterModal from "@/components/ui/FilterModal";
import React, { useState } from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { OrderFilters, OrderStatus, statusOptions } from "../types/OrderFilters";

interface OrderApprovalFilterModalProps {
  visible: boolean;
  onClose: () => void;
  dataFilters: {
    zones: string[];
    sellers: string[];
    statusList: statusOptions[];

  };
  filters: OrderFilters;
  onApply: (newFilters: OrderFilters) => void;
}

export default function OrderApprovalFilterModal({
  visible,
  onClose,
  onApply,
  filters,
  dataFilters,
}: OrderApprovalFilterModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate);
  const [status, setStatus] = useState<OrderStatus>(filters.status);
  const [zone, setZone] = useState<string | undefined>(filters.zone);
  const [seller, setSeller] = useState<string | undefined>(filters.seller);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);



  


  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      onApply={() => onApply({ startDate, endDate, status, zone, seller })}
      onClean={() => {
        setStartDate(undefined);
        setEndDate(undefined);
        setStatus(undefined);
        setZone(undefined);
        setSeller(undefined);
       
      }}
      title="Filtrar Pedidos"
    >
      <ScrollView
        showsVerticalScrollIndicator={true}

        className="bg-background dark:bg-dark-background"

      >
        <View className="gap-2">
          {/* Fecha inicial */}
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Desde
          </Text>
          <TouchableOpacity
            className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3"
            onPress={() => setShowStartPicker(true)}
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {startDate ? startDate.toLocaleDateString() : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
           
           <ShowDateIos onPress={()=>setShowStartPicker(false)}>
              <CustomDateTimePicker
                value={startDate || new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) setStartDate(selectedDate);
                }}
                onClose={() => setShowStartPicker(false)} />
            </ShowDateIos>
          
          )}

          {/* Fecha final */}
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Hasta
          </Text>
          <TouchableOpacity
            className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3"
            onPress={() => setShowEndPicker(true)}
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {endDate ? endDate.toLocaleDateString() : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>

          {showEndPicker &&
            <ShowDateIos onPress={() => setShowEndPicker(false)}>
              <CustomDateTimePicker
                value={endDate || new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) setEndDate(selectedDate);
                }}
                onClose={() => setShowEndPicker(false)}

              />

            </ShowDateIos>
          }

          {/* Estatus */}
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Estatus
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {dataFilters.statusList.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                className={`px-4 py-2 rounded-full border ${status === opt.value
                  ? "bg-primary border-primary"
                  : "bg-transparent border-muted"
                  }`}
                onPress={() => setStatus(opt.value)}
              >
                <Text
                  className={`text-sm ${status === opt.value
                    ? "text-white"
                    : "text-foreground dark:text-dark-foreground"
                    }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Zona */}
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
             {`Zona ${zone? ': '+zone :''  } `  } 
          </Text>
          <View className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dataFilters.zones.map((value) => (
                <TouchableOpacity
                  key={value}
                  className={`px-4 py-2 rounded-full border ${zone === value
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted"
                    } mr-2`}
                  onPress={() => setZone(value)}
                >
                  <Text
                    className={`text-sm ${zone === value
                      ? "text-white"
                      : "text-foreground dark:text-dark-foreground"
                      }`}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Vendedor */}
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            {`Vendedor ${seller? ': '+seller :''  } `  } 
          </Text>
          <View className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dataFilters.sellers.map((value) => (
                <TouchableOpacity
                  key={value}
                  className={`px-4 py-2 rounded-full border ${seller === value
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted"
                    } mr-2`}
                  onPress={() => setSeller(value)}
                >
                  <Text
                    className={`text-sm ${seller === value
                      ? "text-white"
                      : "text-foreground dark:text-dark-foreground"
                      }`}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </FilterModal >
  );
}

interface PropsShowDateIos {
  onPress: () => void;
  children: React.ReactNode

}

export function ShowDateIos({ onPress, children }: PropsShowDateIos) {
  if (Platform.OS !== "ios") return <>{children}</>;
  
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown.duration(150)}
      className="bg-componentbg dark:bg-dark-componentbg p-2 m-1 rounded-3xl shadow-inner"
    >
      {children}
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity onPress={onPress} className="px-4 py-2">
          <Text className="text-primary">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}




