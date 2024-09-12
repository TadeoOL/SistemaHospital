export const calculateDiscountedPrice = (price: number, haveDiscount?: number) => {
  if (haveDiscount) {
    const montoDescuento = price * (haveDiscount / 100);
    return price - montoDescuento;
  }
  return price;
};
