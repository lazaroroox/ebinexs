import { useEffect, useRef, useState } from "react";
import { apiGet } from "src/services/apiService";
import { BalanceComplete } from "src/types/bank";
import useSWR, { mutate } from "swr";

export default function useBalanceComplete() {
  const { data, isValidating } = useSWR<BalanceComplete>(
    "/bank/balanceComplete",
    apiGet
  );

  const [isNewValue, setIsNewValue] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect para observar mudanças no 'data'
  useEffect(() => {
    if (data) {
      setIsNewValue(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsNewValue(false);
      }, 3000); // 10000 milissegundos = 10 segundos
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data]);

  return {
    balanceComplete: data,
    loading: !data,
    isValidating,
    isNewValue,
    mutate,
  };
}
