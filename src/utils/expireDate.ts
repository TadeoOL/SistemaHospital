export const returnExpireDate = (date: string) => {
  return date === '1/1/4000' ? 'Sin fecha de caducidad' : date;
};
