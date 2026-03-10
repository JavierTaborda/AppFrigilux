import FilterModal from "@/components/ui/FilterModal";
import { safeHaptic } from "@/utils/safeHaptics";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CategoryArt } from "../interfaces/CategoryArt";

interface GoalsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedCategory: string | undefined) => void;
  category: CategoryArt[];
  selectedCategory: string | undefined;
}

export default function CreateOrderFilterModal({
  visible,
  onClose,
  onApply,
  category,
  selectedCategory,
}: GoalsFilterModalProps) {
  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    selectedCategory,
  );

  useEffect(() => {
    if (visible) {
      setInternalSelected(selectedCategory);
    }
  }, [visible, selectedCategory]);

  const selectedCategoryName =
    category.find((c) => c.co_cat.trim() === internalSelected?.trim())
      ?.cat_des ?? "Ninguna";

  const handleApply = () => {
    onApply(internalSelected);
    onClose();
  };

  const handleClean = () => {
    setInternalSelected(undefined);
    onApply(undefined);
    onClose();
  };

  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      onApply={handleApply}
      onClean={handleClean}
      title="Filtrar Productos"
    >
      <View className="bg-background dark:bg-dark-background px-4 mb-4">
        <View className="flex-row items-center gap-x-2 mb-3">
          <Text className="font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Seleccionado:
          </Text>
          <Text className="text-md font-bold text-primary">
            {selectedCategoryName.trim()}
          </Text>
        </View>

        <ScrollView
          contentContainerClassName="py-2 gap-x-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {category?.map((opt) => {
            const isSelected = internalSelected === opt.co_cat;
            return (
              <Pressable
                key={opt.co_cat}
                onPress={() => {
                  setInternalSelected(opt.co_cat);
                  safeHaptic("light");
                }}
                className={`px-4 py-2 rounded-full border ${
                  isSelected ? "bg-primary border-primary" : " border-muted"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected
                      ? "text-white"
                      : "text-foreground dark:text-dark-foreground"
                  }`}
                >
                  {opt.cat_des.trim()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </FilterModal>
  );
}
