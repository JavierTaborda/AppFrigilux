import api from "@/lib/axios";

export const getOrderByFactNumber = async (factNumber:number) => {

  try{
      const response = await api.get(`returns/byfactnumber${factNumber}`);

  return response.data;
  }
  catch (error) {
    console.error("Error obteniendo pedidos", error);
    throw error;
  }
};
export const getBySerial = async (serial:string) => {
  //340C742480113222600054
  try{
    const response = await api.get(`returns/byserial/${serial}`);

  console.log( response.data);
  return response.data;
  }
  catch (error) {
    console.error("Error obteniendo pedidos", error);
    throw error;
  }
};