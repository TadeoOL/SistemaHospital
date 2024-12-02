import Swal from 'sweetalert2';

export const purchaseAlerts = {
  confirmCancelOrder: () => {
    return Swal.fire({
      title: 'Advertencia',
      text: '¿Desea cancelar la orden de compra?, este cambio no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Salir',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
    });
  },

  orderCancelled: () => {
    return Swal.fire({
      title: 'Cancelada!',
      text: 'Tu orden de compra ha sido cancelada!',
      icon: 'success',
    });
  },

  orderCancelError: () => {
    return Swal.fire({
      title: 'Error!',
      text: 'Error al cancelar la orden!',
      icon: 'error',
    });
  },
};
