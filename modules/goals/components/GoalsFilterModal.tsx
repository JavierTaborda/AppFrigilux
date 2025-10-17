import FilterModal from "@/components/ui/FilterModal";
import { appColors } from "@/utils/colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface Seller {
  co_ven: string;
  des_ven: string;
}

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
            <View className="border rounded-lg border-muted overflow-hidden">
              {sellers.map((seller) => (
                <TouchableOpacity
                  key={seller.co_ven}
                  onPress={() => handleSelect(seller.co_ven)}
                  className={`px-4 py-3 border-b border-muted ${
                    internalSelected.includes(seller.co_ven)
                      ? "bg-primary dark:bg-dark-primary"
                      : "bg-background dark:bg-dark-background"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      internalSelected.includes(seller.co_ven)
                        ? "text-white"
                        : "text-foreground dark:text-dark-foreground"
                    }`}
                  >
                    {seller.des_ven}
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
