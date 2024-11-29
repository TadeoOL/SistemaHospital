export const convertDate = (date?: Date): any => {
  if (!date) return;
  const offset = new Date().getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString();
};
