import api from "@/lib/axios";
import { ClientData } from "@/types/clients";
import { OrderItem } from "../types/orderItem";

export const getItemsByGoals = async (): Promise<OrderItem[]> => {
  try {
    const params: any = {};
    params.codven = "00002";

    const response = await api.get("create-orders", { params });
    return response.data;

  } catch (error) {
    console.error("Error obteniendo los datos", error);
    throw error;
  }
};
export const getClients = async (): Promise<ClientData[]> => {
  try {
    const response = await api.get("customers");

    const clients: ClientData[] = response.data.map((c: any) => ({
      co_cli: c.co_cli?.trim(),
      cli_des: c.cli_des?.split("\r\n")[0]?.trim(),
      co_zon: c.co_zon?.trim(),
      dir_ent2: c.dir_ent2?.trim(),
      direc1: c.direc1?.trim(),
      direc2: c.direc2?.trim(),
    }));

    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const getExchangeRate = async (): Promise<number> => {
  try {
    //const response = await api.get("customers");

    return 288;
  } catch (error) {
    throw error;
  }
};
