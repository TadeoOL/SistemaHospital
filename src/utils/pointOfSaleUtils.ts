import { ISell } from '../types/types';

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

export const getTotalAmount = (amount: number[]): number => {
  const totalAmount = amount.reduce((acc, amount) => acc + amount, 0);
  return totalAmount;
};

export const getPaymentsData = (data: ISell[]) => {
  let credito: number = 0;
  let debito: number = 0;
  let transferencia: number = 0;
  let efectivo: number = 0;
  data.map((sell) => {
    switch (sell.tipoPago) {
      case 1:
        return (efectivo += sell.totalVenta);
      case 2:
        return (debito += sell.totalVenta);
      case 3:
        return (credito += sell.totalVenta);
      case 4:
        return (transferencia += sell.totalVenta);
      default:
        break;
    }
  });
  return {
    credito: credito,
    debito: debito,
    transferencia: transferencia,
    efectivo: efectivo,
  };
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
};
