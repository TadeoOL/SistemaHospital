const roundToTwoDecimals = (value: number) => {
  return Math.round(value * 100) / 100;
};

export const calculateDiscountedPrice = (price: number, haveDiscount?: number) => {
  if (haveDiscount) {
    const porcentajeDescuento = roundToTwoDecimals(haveDiscount);
    const montoDescuento = roundToTwoDecimals(price * (porcentajeDescuento / 100));
    return roundToTwoDecimals(price - montoDescuento);
  }
  return price;
};
