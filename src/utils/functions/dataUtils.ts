export const addArticlesPrice = (arrayDeObjetos: any[]) => {
  console.log({ arrayDeObjetos });
  const precioTotal = arrayDeObjetos.flatMap(
    (objeto) => objeto.precioInventario
  );
  return precioTotal.reduce((total, precio) => total + precio, 0);
};
