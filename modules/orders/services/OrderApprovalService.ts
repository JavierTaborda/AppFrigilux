import OrderAprovalProduct from '../data/OrderApprovalProduct.json';
import OrderAproval from '../data/OrdersApproval.json';
import { statusOptions } from '../types/OrderFilters';

export const getOrdersToApproval = async () => {
 
  //const response = await API.get('/pagos/pendientes');
 // return response.data;
 return OrderAproval
};

export const getOrderProducts = async (fact_num: number) => {
 
  //const response = await API.get(`/pagos/pendientes/${co_cli}`);
 // return response.data;
 return OrderAprovalProduct.filter(item => item.fact_num === fact_num);
}

export const changeRevisado = async (fact_num: number, revisado: string) => {
  //const response = await API.put(`/pagos/pendientes/${co_cli}`, { revisado });
  //return response.data;
  return { success: true, message: 'Revisado actualizado correctamente' };
}

export const getZones = async () => {
  const zones= OrderAproval.map(order => order.zon_des.trim())
    .filter((value, index, self) => self.indexOf(value) === index);
      return ["TODOS", ...zones];

}

export const getSellers = async () => {
 const sellers =OrderAproval.map(order => order.ven_des.trim())
    .filter((value, index, self) => self.indexOf(value) === index);  
      return ["TODOS", ...sellers];

}

export const getStatus = async () => {
   const statusOptionsList: statusOptions[] = [
    { label: "Todos", value: "" },
    { label: "Por Revisar", value: "0" },
    { label: "Revisado", value: "1" },
    { label: "Anulado", value: "anulada" },
  ];
  return statusOptionsList;
}