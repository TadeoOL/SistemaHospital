import Swal from 'sweetalert2';

export const alertsBankPurchase = {
  approve: () => {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de autorizar la compra?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
    });
  },
  approved: () => {
    return Swal.fire({
      title: 'Compra Aprobada!',
      text: 'La compra ha sido aprobada!',
      icon: 'success',
    });
  },
  error: (error: string) => {
    return Swal.fire({
      title: 'Error!',
      text: error,
      icon: 'error',
    });
  },
  cancelled: () => {
    return Swal.fire({
      title: 'Cancelado!',
      text: 'La compra ha sido cancelada!',
      icon: 'error',
    });
  },
};
