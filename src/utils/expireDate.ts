export const returnExpireDate = (date: string) => {
  return date === '01/01/4000' ? 'Sin fecha de caducidad' : date;
};
