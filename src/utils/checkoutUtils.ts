export const hashPaymentsToNumber: { [key: string]: number } = {
  Efectivo: 1,
  Transferencia: 2,
  Crédito: 3,
  Débito: 4,
};

export const hashPaymentsToString: { [key: number]: string } = {
  1: 'Efectivo',
  2: 'Transferencia',
  3: 'Crédito',
  4: 'Débito',
};

export const hashEstatusToString: { [key: number]: string } = {
  1: 'Venta creada',
  2: 'Pagado',
  0: 'Cancelado',
};
