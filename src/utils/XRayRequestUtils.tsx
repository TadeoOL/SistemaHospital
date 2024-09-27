export const getStatus = (value: number) => {
  switch (value) {
    case 0:
      return 'Cancelada';
    case 1:
      return 'Pendiente';
    case 2:
      return 'Aceptada';
    default:
      break;
  }
};

export const XRAY_REQUEST_STATUS: Record<number, string> = {
  0: 'Cancelada',
  1: 'Pendiente',
  2: 'Aceptada',
};
