export const NumericOnly = (e: any) => {
  const reg = /^[0-9\b]+$/;
  if (e.target.value === "" || reg.test(e.target.value)) return true;
  return false;
};

export const NumericOnlyWithFloat = (e: any) => {
  const reg = /^[0-9\b]+([.,]?[0-9\b]*)?$/; // Permite números, um único ponto ou vírgula
  if (e.target.value === "" || reg.test(e.target.value)) return true;
  return false;
};
