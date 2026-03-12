import api from "@/lib/axios";
import { ClientData } from "@/types/clients";
import { ExchangeRate } from "../../../types/exchangerate";
import { PedidoDTO } from "../interfaces/pedidoDTO";
import { Conditions } from "../types/conditions";
import { OrderItem } from "../types/orderItem";

export const getItemsByGoals = async (): Promise<OrderItem[]> => {

  try {
  

    const params: any = {};
    params.codven = "00006";

    const response = await api.get("create-orders", { params });  

    //const response = await api.get("create-orders");
    return response.data;

  } catch (error) {
    console.error("Error obteniendo los datos", error);
    throw error;
  }
};

export const getClients = async (): Promise<ClientData[]> => {
  try {
    const response = await api.get("customers");
    const clients: ClientData[] = response.data;


    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const getExchangeRate = async (): Promise<ExchangeRate> => {
  try {
    const response = await api.get("create-orders/exchangerate");
    const result: ExchangeRate = response.data

    return result;
  } catch (error) {
    throw error;
  }
};
export const getIVA = async (): Promise<number> => {
  try {
    const response = await api.get("create-orders/iva");
    return response.data.tasa
  } catch (error) {
    throw error;
  }
};

export const getConditionsPay = async (): Promise<Conditions[]> => {
  try {
    const response = await api.get("create-orders/conditions");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const insertOrder = async (pedido: PedidoDTO): Promise<any> => {
  try {
    const response = await api.post("create-orders", pedido);

    return response.data;
  } catch (error) {
    throw error;
  }
};
