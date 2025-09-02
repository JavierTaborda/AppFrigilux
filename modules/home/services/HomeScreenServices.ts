import api from "@/lib/axios";

export const getPedidos = async (user?: string) => {
  const response = await api.get("orders/all");
  console.log(response)
  return response.data;
};
