import React from "react";
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
  if (!visible) return null;

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
        Seleccionar cliente
      </Text>
      <FlatList
        data={clients || []}
        keyExtractor={(item: any) => (item.id ?? item.code ?? item.name) + ""}
        renderItem={({ item }: any) => (
          <Pressable
            onPress={() => {
              setSelectedClient(item);
              onClose(false);
            }}
            className="py-3 px-4 rounded-xl bg-componentbg dark:bg-dark-componentbg"
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {item.code} - {item.name}
            </Text>
            {item?.identification && (
              <Text className="text-sm text-mutedForeground dark:text-dark-mutedForeground mt-1">
                {item.identification}
              </Text>
            )}
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

export default ClientModal;