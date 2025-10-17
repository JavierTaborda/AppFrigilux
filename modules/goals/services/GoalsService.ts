import api from "@/lib/axios";
import { Goals } from "../types/Goals";

export const getGoals = async  (cod_ven?:string[]): Promise<Goals[]> => {
  try {
    const params: any = {};

    if (cod_ven && cod_ven.length > 0) {
      params.cod_ven = cod_ven; 
    }

    const response = await api.get("goals",{params});
    return response.data;

  } catch (error) {
    console.error("Error obteniendo los datos", error);
    throw error;
  }
};

export const getSellersGoals = async (): Promise<{co_ven: string; des_ven: string }[] > => {
  try {
    const response = await api.get("goals/sellers");
    return response.data;

  } catch (error) {
    console.error("Error obteniendo los datos", error);
    throw error;
  }
};
