import api from "@/lib/axios";

export const getOrderByFactNumber = async (factNumber:number) => {

  try{
      const response = await api.get(`returns/byfactnumber${factNumber}`);
      console.log(response.data)
  return response.data;
  }
  catch (error) {
    console.error("Error obteniendo pedidos", error);
    throw error;
  }
};