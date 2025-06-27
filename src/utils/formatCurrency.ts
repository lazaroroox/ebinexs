const formatCurrency = (value: number, options?: Intl.NumberFormatOptions) => {
  if (isNaN(value)) {
    return "$0.00";
  }
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

export default formatCurrency;
