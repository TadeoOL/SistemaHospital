import { ArticleObject } from '../../types/types';

export const addArticlesPrice = (arrayDeObjetos: ArticleObject[]) => {
  const precioTotal = arrayDeObjetos.reduce((total, objeto) => {
    const precioTotalObjeto = objeto.cantidadComprar * objeto.precioInventario;
    return total + precioTotalObjeto;
  }, 0);

  return precioTotal;
};

export const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const isValidInteger = (value: string) => {
  if (value.trim() === '') return true;
  const regex = /^[1-9][0-9]*$/;
  return regex.test(value);
};

export const isValidFloat = (value: string) => {
  if (value.trim() === '') return true;
  const regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  return regex.test(value);
};

export const getFirstDayOfTheMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const firstday = '01';
  return `${year}-${month}-${firstday}`;
}