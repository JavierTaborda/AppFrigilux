import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { OrderItem } from "../types/orderItem";

type CreateOrderState = {
  items: OrderItem[];
  addItem: (product: OrderItem, qty?: number) => void;
  increase: (codart:string, by?: number)=> void;
  decrease: (codart:string, by?: number)=> void;
  removeItem: (codart: string) => void;
  clearOrder: () => void;
  getSubtotal: ()=> number;
  getItemsCount: ()=> number;
};

const useCreateOrderStore = create<CreateOrderState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty=1) => {
        const exists = get().items.find((i) => i.codart === product.codart);
        if (exists) {
          set({
            items: get().items.map((i) =>
              i.codart === product.codart
                ? {
                    ...i,
                    quantity: Math.min(
                      i.quantity + qty,
                      product.available ?? Infinity
                    ),
                  }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...product, quantity: Math.min(qty, product.available ?? qty) },
            ],
          });
        }
      },
      
      increase: (codart, by = 1) => {
        set({
          items: get().items.map((i) =>
            i.codart === codart
              ? {
                  ...i,
                  quantity: Math.min(
                    i.quantity + by,
                    i.available ?? i.quantity + by
                  ),
                }
              : i
          ),
        });
      },

      decrease: (codart, by = 1) =>
        set({
          items: get()
            .items.map((i) =>
              i.codart === codart
                ? { ...i, quantity: Math.max(0, i.quantity - by) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),

      removeItem: (codart) => {
        set({ items: get().items.filter((i) => i.codart !== codart) });
      },

      clearOrder: () => {
        set({ items: [] });
      },

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemsCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "create-order-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCreateOrderStore;
