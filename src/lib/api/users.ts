import { apiPost, apiPut } from "src/services/apiService";

export const favoriteSymbol = (symbol: string, favorite: boolean) => {
  return apiPost("/users/favoritesSymbols", { symbol, favorite });
};

export const changeTimeZone = async (timezone: number) => {
  return await apiPut(`users/timezone`, {
    timezone: timezone,
  });
};
