import { useEffect, useState } from "react";
import { apiGet } from "src/services/apiService";
import useSWR, { mutate } from "swr";

const requestQuote = async (amount: number) => {
  if (!amount) {
    return;
  }

  const data = await apiGet("/bank/conversionRate", {
    symbol: "USDTBRL",
    amount,
  });

  const value = amount * data.conversionRate;
  const convertedValue = Math.floor(value * 100) / 100;
  return convertedValue;
};

export default function usePixTransactionVolume() {
  const { data, isValidating } = useSWR<{
    totalWithdrawlsVolume: number;
    totalDepositsVolume: number;
  }>("/bank/pixTransactionVolume", apiGet);
  const [brlPixVolume, setBrlPixVolume] = useState<number>(0);

  useEffect(() => {
    if (data) {
      requestQuote(data.totalWithdrawlsVolume).then((convertedValue) => {
        setBrlPixVolume(convertedValue);
      });
    }
  }, [data]);

  return {
    pixVolume: data || 0,
    brlPixVolume,
    loading: !data,
    isValidating,
    mutate,
  };
}
