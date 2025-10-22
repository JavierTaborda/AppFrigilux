import FilterModal from "@/components/ui/FilterModal";
import { appColors } from "@/utils/colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Seller } from "../types/Seller";



interface GoalsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedSellers: string[]) => void;
  sellers: Seller[];
  selectedSellers: string[]; // selección inicial
  hasPermission: boolean;
  loading: boolean;
}

export default function GoalsFilterModal({
  visible,
  onClose,
  onApply,
  sellers,
  selectedSellers,
  hasPermission,
  loading,
}: GoalsFilterModalProps) {
  // Estado interno del modal
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  // Cuando el modal se abre, cargamos la selección actual
  useEffect(() => {
    if (visible) {
      setInternalSelected(selectedSellers || []);
    }
  }, [visible, selectedSellers]);

  const handleSelect = (co_ven: string) => {
    setInternalSelected((prev) =>
      prev.includes(co_ven)
        ? prev.filter((id) => id !== co_ven)
        : [...prev, co_ven]
    );
  };

  const handleApply = () => {
    onApply(internalSelected); // solo aquí pasamos la selección al padre
  };

  const handleClean = () => {
    setInternalSelected([]);
  };

  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      onApply={handleApply}
      onClean={handleClean}
      title="Filtrar Metas de Venta"
    >
      <View className="bg-background dark:bg-dark-background px-4 mb-4">
        {loading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator color={appColors.primary.DEFAULT} />
          </View>
        ) : sellers.length === 0 ? (
          <View className="p-8 items-center">
            <Text className="text-muted-foreground text-center">
              No se encontraron vendedores disponibles.
            </Text>
          </View>
        ) : (
          <>
            <Text className="pb-2 text-md font-semibold text-foreground dark:text-dark-foreground">
              Seleccione uno o más vendedores
            </Text>
   
            <View className="flex-row flex-wrap gap-2 mb-3">
              {sellers.map((seller) => (
                <TouchableOpacity
                  key={seller.codven}
                  onPress={() => handleSelect(seller.codven)}
                  className={`px-4 py-2 rounded-full border ${
                    internalSelected.includes(seller.codven)
                      ? "bg-primary border-primary"
                      : "bg-transparent border-muted"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      internalSelected.includes(seller.codven)
                        ? "text-white"
                        : "text-foreground dark:text-dark-foreground"
                    }`}
                  >
                    {seller.vendes}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </FilterModal>
  );
}
