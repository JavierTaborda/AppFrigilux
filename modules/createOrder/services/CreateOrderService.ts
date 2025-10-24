import api from "@/lib/axios";
import { OrderItem } from "../types/orderItem";

export const getItemsByGoals = async  (): Promise<OrderItem[]> => {
  try {
    const params: any = {};
    params.codven ="00002";
   
    const response = await api.get("create-orders", { params });
    return response.data;

  } catch (error) {
    console.error("Error obteniendo los datos", error);
    throw error;
  }
};
