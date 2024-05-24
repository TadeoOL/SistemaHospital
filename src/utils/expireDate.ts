export const returnExpireDate = (date: string) => {
  return date === '01/01/4000' ? 'Sin fecha de caducidad' : date === '01/01/0001' ? 'Lote entrado por ajuste' : date;
};
