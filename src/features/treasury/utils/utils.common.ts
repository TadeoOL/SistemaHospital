export const removeTimeFromDate = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};
