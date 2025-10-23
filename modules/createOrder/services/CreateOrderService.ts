import api from "@/lib/axios";
import { OrderItem } from "../types/orderItem";

export const getItemsByGoals = async  (): Promise<OrderItem[]> => {
  try {

    const response = await api.get("create-orders");
    return response.data;

  } catch (error) {
    console.error("Error obteniendo los datos", error);
    throw error;
  }
};
