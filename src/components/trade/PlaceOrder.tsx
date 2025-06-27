import type { FC } from "react";
import { useEffect } from "react";
import useApiData from "src/hooks/useApiData";
import PlaceOrderForm from "./forms/PlaceOrderForm";

const PlaceOrder: FC = () => {
  const { candles, selectedCandle } = useApiData();

  useEffect(() => {
    if (!candles) {
      return;
    }

    const current = candles.filter((item) => item.candle === selectedCandle);
    if (current[0]) {
    }
  }, [candles, selectedCandle]);

  return <PlaceOrderForm />;
};

export default PlaceOrder;
