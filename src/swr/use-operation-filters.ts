import { useEffect, useState } from "react";
import { ENVIRONMENT } from "src/constants";
import { apiGet } from "src/services/apiService";
import useSWR, { mutate } from "swr";

export default function useOperationFilters() {
  const { data, isValidating, isLoading } = useSWR<any>(
    "/report/operationFilters",
    apiGet
  );

  const [operationDirections, setOperationDirections] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [pairs, setPairs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setOperationDirections([
        {
          label: "all_predictions",
          value: "ALL",
        },
        ...data.operationDirections,
      ]);
      setStatuses([
        {
          label: "all_statuses",
          value: "ALL",
        },
        ...data.statuses,
      ]);
      setPairs([
        {
          label: "all_assets",
          value: "ALL",
        },
        ...data.pairs.map((pair) => {
          const match = pair.label.match(/symbol=(\w+)/);
          const symbol = match ? match[1] : "";
          return { label: symbol, value: symbol };
        }),
      ]);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (pairs && statuses && operationDirections) {
      setLoading(false);
    }
  }, [pairs, statuses, operationDirections, isLoading]);

  return {
    environment: ENVIRONMENT,
    operationDirections,
    statuses,
    pairs,
    loading,
    isValidating,
    mutate,
  };
}
