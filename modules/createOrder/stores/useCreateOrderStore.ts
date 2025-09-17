import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { OrderItem } from "../types/orderItem";

type CreateOrderState = {
  items: OrderItem[];
  addItem: (product: OrderItem, qty?: number) => void;
  removeItem: (code: string) => void;
  clearOrder: () => void;
};

const useCreateOrderStore = create<CreateOrderState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty) => {
        // Suse qty here
        set({ items: [...get().items, product] });
      },
      removeItem: (code) => {
        set({ items: get().items.filter((i) => i.code !== code) });
      },
      clearOrder: () => {
        set({ items: [] });
      },
    }),
    {
      name: "create-order-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCreateOrderStore;
