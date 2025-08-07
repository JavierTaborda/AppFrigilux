 
import { useEffect, useState } from 'react';
import { getOrdersToApproval } from '../services/OrderApprovalService';
import { OrderApproval } from '../types/OrderApproval';
export function useAuthPays() {
 
 const [ordersAproval, setOrdersAproval] = useState<OrderApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersToApproval()
      .then(setOrdersAproval)
      .catch()
      .finally(() => setLoading(false));
  }, []);

  
  return { ordersAproval, loading, };
}