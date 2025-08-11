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
