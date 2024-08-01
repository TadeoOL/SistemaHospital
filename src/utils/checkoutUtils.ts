export const hashPaymentsToNumber: { [key: string]: number } = {
  Efectivo: 1,
  Débito: 2,
  Crédito: 3,
  Transferencia: 4,
};

export const hashPaymentsToString: { [key: number]: string } = {
  1: 'Efectivo',
  2: 'Débito',
  3: 'Crédito',
  4: 'Transferencia',
};

export const hashEstatusToString: { [key: number]: string } = {
  1: 'Venta creada',
  2: 'Pagado',
  0: 'Cancelado',
};

export const leaveConcepts = ['Consulta Sami', 'Radiografías', 'Farmacia', 'Hospitalización', 'Arco en C', 'Servicios'];
