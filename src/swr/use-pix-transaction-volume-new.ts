import { useEffect, useState } from "react";
import { apiGet } from "src/services/apiService";
import useSWR, { mutate } from "swr";

interface PixTransactionVolume {
  totalDepositsVolume: number;
  totalWithdrawalsVolume: number;
}
export default function usePixTransactionVolumeNew() {
  const { data, isValidating } = useSWR<PixTransactionVolume>(
    "/bank/pixTransactionVolume",
    apiGet
  );
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [totalDepositsVolume, setTotalDepositsVolume] = useState<number>(0);
  const [totalWithdrawalsVolume, setTotalWithdrawalsVolume] =
    useState<number>(0);

  useEffect(() => {
    if (data) {
      requestQuote(data?.totalDepositsVolume + data?.totalWithdrawalsVolume);
      setTotalDepositsVolume(data?.totalDepositsVolume);
      setTotalWithdrawalsVolume(data?.totalWithdrawalsVolume);
    }
  }, [data]);

  const requestQuote = async (amount: number) => {
    const data = await apiGet("/bank/conversionRate", {
      symbol: "BRLUSDT",
      amount,
    });

    setTotalVolume(data.convertedValue);
  };

  return {
    totalDepositsVolume,
    totalWithdrawalsVolume,
    totalVolume,
    loading: !data,
    isValidating,
    mutate,
  };
}
