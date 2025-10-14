import api from "@/lib/axios";
import { Goals } from "../types/Goals";


export const getGoals = async (): Promise<Goals[]> => {

    try {
        const response = await api.get("goals");
        return response.data;
    }
    catch (error) {
        console.error("Error obteniendo los datos", error);
        throw error;
    }
};