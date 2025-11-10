import SearchBar from "@/components/ui/SearchBar";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Client } from "../types/clients";

type ClientModalProps = {
  clients?: Client[];
  visible?: boolean;
  setSelectedClient: (client: Client) => void;
  onClose: (close: boolean) => void;
};

const ClientModal: React.FC<ClientModalProps> = ({
  clients = [],
  visible = true,
  setSelectedClient,
  onClose,
}) => {
  const [searchText, setSearchText] =useState("")
      const filterClient = useMemo(() => {
  
          if (!searchText || searchText.length < 4) return clients;
  
          return clients.filter((c) => {
              const client = c.code.toLowerCase() || "";
              const name = c.name?.toLowerCase() || "";
           
  
              return (
                  client.includes(searchText.toLowerCase()) ||
                  name.includes(searchText.toLowerCase())
              );
          });
          
      }, [ searchText]);

  if (!visible) return null;

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
        Seleccionar cliente
      </Text>
      <View className="py-1 mb-2">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeHolderText="Buscar cliente..."
          isFull
        />
      </View>
      <FlatList
        data={filterClient || []}
        keyExtractor={(item: Client) => (item.code ?? item.name) + ""}
        renderItem={({ item }: { item: Client }) => (
          <Pressable
            onPress={() => {
              setSelectedClient(item);
              onClose(false);
            }}
            className="h-16 py-3 px-4 justify-center rounded-xl bg-componentbg dark:bg-dark-componentbg"
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {item.code} - {item.name}
            </Text>
            
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

export default ClientModal;