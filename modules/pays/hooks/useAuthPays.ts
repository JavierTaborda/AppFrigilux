
import { useEffect, useState } from 'react';
import { getPaysToAuthorize } from '../services/AuthPaysServices';
import { AuthPay } from '../types/AuthPay';

export function useAuthPays() {
  const [pays, setPays] = useState<AuthPay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaysToAuthorize()
      .then(setPays)
      .catch()
      .finally(() => setLoading(false));
  }, []);

  return { pays, loading };
}
