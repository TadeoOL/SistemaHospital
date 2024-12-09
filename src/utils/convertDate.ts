export const convertDate = (date?: Date): any => {
  if (!date) return;
  if (typeof date === 'string') return date;
  const offset = new Date().getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString();
};
