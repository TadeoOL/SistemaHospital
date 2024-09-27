import dayjs from 'dayjs';

export const convertToUTC = (date: Date) => {
  return new Date(date).toISOString();
};

export const parseDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return dayjs().hour(hours).minute(minutes).second(seconds);
};

export const calculateAge = (birthDate: string | Date | undefined): number | string => {
  if (!birthDate) {
    return '';
  }
  let birth: Date;
  if (typeof birthDate === 'string') {
    birth = new Date(birthDate);
  } else {
    birth = birthDate;
  }
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  const dayDifference = today.getDate() - birth.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
};
