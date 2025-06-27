import { apiGet } from "src/services/apiService";
import { Account } from "src/types";
import useSWR, { mutate } from "swr";

export default function useAccounts() {
  const { data, isValidating } = useSWR<Account[]>(
    "/users/listAccounts",
    apiGet
  );

  return {
    accountsList: data,
    loading: !data,
    isValidating,
    mutate,
  };
}
