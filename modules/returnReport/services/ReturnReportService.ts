import api from "@/lib/axios";
import { CreateDevolucion } from "../types/createDevolucion";

export const getOrderByFactNumber = async (factNumber: number) => {

  try {
    const response = await api.get(`returns/byfactnumber/${factNumber}`);
    //console.log(response.data)
    return response.data;
  }
  catch (error) {
    console.error("Error obteniendo pedidos", error);
    throw error;
  }
};
export const getBySerial = async (serial: string) => {
  //340C742480113222600054
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
  
    const response = await api.post("/returns", dev);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error("Error creating return:", error);
    return false; 
  }
};