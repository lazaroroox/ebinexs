import { apiGet } from "src/services/apiService";
import { FavoriteSymbol } from "src/types/symbol";
import useSWR from "swr";

export default function useFavoritesSymbols() {
  const { data, isValidating, mutate } = useSWR<FavoriteSymbol[]>(
    "/users/favoritesSymbols",
    apiGet
  );

  return {
    favoritesSymbols: data,
    loading: !data,
    isValidating,
    mutate,
  };
}
