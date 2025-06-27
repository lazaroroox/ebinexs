import { useEffect, useState } from "react";
import { apiGet } from "src/services/apiService";
import useSWR, { mutate } from "swr";

interface BalanceData {
  [key: string]: {
    balanceDTOS: Record<string, any>;
    totalInUsdt: number;
  };
}

export default function useAccountsBalance() {
  const [totalBalance, setTotalBalance] = useState(0);

  const { data, isValidating } = useSWR<BalanceData>(
    ["/exchange/balances"],
    () => apiGet<BalanceData>("/exchange/balances", undefined, true)
  );

  async function getTotalBalance(
    data: BalanceData | undefined
  ): Promise<number> {
    if (!data) return 0;

    console.log("data", data);

    const total = Object.values(data).reduce(
      (sum, entry) => sum + (entry.totalInUsdt || 0),
      0
    );

    const totalInBrl = await requestQuote(total);
    setTotalBalance(totalInBrl);
  }

  useEffect(() => {
    getTotalBalance(data);
  }, [data]);

  const requestQuote = async (amount: number) => {
    const data = await apiGet("/bank/conversionRate", {
      symbol: "BRLUSDT",
      amount,
    });

    return data.convertedValue;
  };

  return {
    data: data || null,
    totalBalance,
    loading: !data,
    isValidating,
    mutate,
  };
}
