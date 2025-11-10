import CustomImage from "@/components/ui/CustomImagen";
import SearchBar from "@/components/ui/SearchBar";
import { imageURL } from "@/utils/imageURL";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Articulo } from "../types/Articulo";

type ArtsModalProps = {
  arts?: Articulo[];
  visible?: boolean;
  setCodeArt: (art: string) => void;
  onClose: (close: boolean) => void;
};

const ArtsModal: React.FC<ArtsModalProps> = ({
  arts = [],
  visible = true,
  setCodeArt,
  onClose,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredArts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query || query.length < 2) return arts;

    return arts.filter(
      ({ co_art = "", art_des = "" }) =>
        co_art.toLowerCase().includes(query) ||
        art_des.toLowerCase().includes(query)
    );
  }, [searchText, arts]);

  if (!visible) return null;

  return (
  
      <View className="p-4">
        <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
          Seleccionar artículo
        </Text>
        <View className="py-1 mb-2">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeHolderText="Buscar artículo..."
            isFull
          />
        </View>

        {filteredArts.length === 0 ? (
          <Text className="text-center text-mutedForeground dark:text-dark-mutedForeground mt-4">
            No se encontraron artículos.
          </Text>
        ) : (
          <FlatList
            data={filteredArts}
            keyExtractor={(item: Articulo) => item.co_art}
            renderItem={({ item }: { item: Articulo }) => (
              <Pressable
                onPress={() => {
                  setCodeArt(item.co_art);
                  onClose(false);
                }}
                className="flex-row items-center gap-3 p-3 rounded-xl bg-componentbg dark:bg-dark-componentbg"
              >
                <View className="w-14 h-14 rounded-md bg-bgimages">
                  <CustomImage img={`${imageURL}${item.co_art?.trim()}.jpg`} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-foreground dark:text-dark-foreground">
                    {item.co_art?.trim()} - {item.art_des?.trim()}
                  </Text>
                </View>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
          />
        )}
      </View>
  
  );
};

export default ArtsModal;
