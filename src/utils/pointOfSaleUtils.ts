export const getSellType = (value: number) => {
  switch (value) {
    case 1:
      return 'Efectivo';
    case 2:
      return 'Débito';
    case 3:
      return 'Crédito';
    case 4:
      return 'Transferencia';
    default:
      break;
  }
};

export const getSellStatus = (value: number) => {
  switch (value) {
    case 0:
      return 'Cancelada';
    case 1:
      return 'En espera';
    case 2:
      return 'Aceptada';
    default:
      break;
  }
};
