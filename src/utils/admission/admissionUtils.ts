import dayjs from 'dayjs';

export const convertToUTC = (date: Date) => {
  return new Date(date).toISOString();
};

export const parseDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return dayjs().hour(hours).minute(minutes).second(seconds);
};
