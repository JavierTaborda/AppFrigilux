import OrderAprovalProduct from '../data/OrderApprovalProduct.json';
import OrderAproval from '../data/OrdersApproval.json';

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
  return OrderAproval.map(order => order.zon_des.trim())
    .filter((value, index, self) => self.indexOf(value) === index);
}

export const getSellers = async () => {
  return OrderAproval.map(order => order.ven_des.trim())
    .filter((value, index, self) => self.indexOf(value) === index);
}
