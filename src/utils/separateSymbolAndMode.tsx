import { OperationsMode } from "src/types/symbol";

export function separateSymbolAndMode(menuHeaderSelected: string) {
  const [menuSymbol, menuOperationMode] = menuHeaderSelected.split("-") as [symbol: string, operationMode: OperationsMode];

  return {
    menuSymbol,
    menuOperationMode,
  };
}

export function compareMenuHeaderSelected(
  menuHeaderSelected: string,
  newMenuHeader: string
) {
  if (menuHeaderSelected === newMenuHeader) return true;

  return false;
}
