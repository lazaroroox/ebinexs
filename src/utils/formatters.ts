export const formatCpf = (value: string) => {
  const pattern = /^(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?$/;
  const maxLength = 11;

  value = value.slice(0, maxLength);

  return value.replace(pattern, (_, p1, p2, p3, p4) => {
    let formatted = p1;
    if (p2) formatted += `.${p2}`;
    if (p3) formatted += `.${p3}`;
    if (p4) formatted += `-${p4}`;
    return formatted;
  });
};

export const formatCnpj = (value: string) => {
  const maxLength = 14;
  const pattern = /^(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?$/;

  value = value.slice(0, maxLength);

  return value.replace(pattern, (_, p1, p2, p3, p4, p5) => {
    let formatted = p1;
    if (p2) formatted += `.${p2}`;
    if (p3) formatted += `.${p3}`;
    if (p4) formatted += `/${p4}`;
    if (p5) formatted += `-${p5}`;
    return formatted;
  });
};

export const formatCellphone = (value: string): string => {
  const numeric = value.replace(/\D/g, "").slice(0, 11);

  if (numeric.length <= 10) {
    return numeric.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  } else {
    return numeric.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  }
};
