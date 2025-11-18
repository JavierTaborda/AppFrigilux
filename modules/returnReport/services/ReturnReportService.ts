import api from "@/lib/axios";
import { Articulo } from "../types/Articulo";
import { Client } from "../types/clients";
import { CreateDevolucion } from "../types/createDevolucion";

export const getOrderByFactNumber = async (factNumber: number) => {

  try {
    const response = await api.get(`returns/byfactnumber/${factNumber}`);
  
    return response.data;
  }
  catch (error) {
    console.error("Error obteniendo pedidos", error);
    throw error;
  }
};
export const getBySerial = async (serial: string) => {

  try {
    const response = await api.get(`returns/byserial/${serial}`);

    return response.data;
  }
  catch (error) {
    console.error("Error obteniendo pedidos", error);
    throw error;
  }
};
export const createDevolucion = async (dev: CreateDevolucion): Promise<boolean> => {
  try {

    const response = await api.post("returns", dev);

    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
};
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await api.get("customers");

    const clients: Client[] = response.data.map((c: any) => ({
      code: c.co_cli?.trim(),
      name: c.cli_des?.split("\r\n")[0]?.trim(),
    }));

    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};
export const getArts = async (): Promise<Articulo[]> => {
  try {
    const response = await api.get("products/codebar");
    const arts: Articulo[] = response.data
    return arts;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};