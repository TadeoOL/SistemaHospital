import { ArticleObject } from "../../types/types";

export const addArticlesPrice = (arrayDeObjetos: ArticleObject[]) => {
  const precioTotal = arrayDeObjetos.reduce((total, objeto) => {
    const precioTotalObjeto = objeto.cantidadComprar * objeto.precioInventario;
    return total + precioTotalObjeto;
  }, 0);

  return precioTotal;
};
