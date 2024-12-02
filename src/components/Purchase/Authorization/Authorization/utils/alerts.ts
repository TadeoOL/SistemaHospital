import Swal from 'sweetalert2';

const purchaseAuthorizationAlerts = {
  acceptAuthorization: () => {
    return Swal.fire({
      title: 'Estas seguro?',
      text: 'La orden de compra sera autorizada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
  },
  acceptedAuthorization: () => {
    return Swal.fire({
      title: 'Autorizada!',
      text: 'La orden de compra ha sido autorizada',
      icon: 'success',
    });
  },
  rejectAuthorization: () => {
    return Swal.fire({
      title: 'Estas seguro?',
      text: 'La orden de compra sera rechazada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
  },
  rejectedAuthorization: () => {
    return Swal.fire({
      title: 'Rechazada!',
      text: 'La orden de compra ha sido rechazada!',
      icon: 'error',
    });
  },
  acceptAuthorizationError: () => {
    return Swal.fire({
      title: 'Error!',
      text: 'Error al autorizar la orden de compra!',
      icon: 'error',
    });
  },
  rejectAuthorizationError: () => {
    return Swal.fire({
      title: 'Error!',
      text: 'Error al rechazar la orden de compra!',
      icon: 'error',
    });
  },
  viewPdfEmpty: () => {
    return Swal.fire({
      title: 'Sin PDF',
      text: 'No hay PDF disponible para mostrar',
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  },
};

export default purchaseAuthorizationAlerts;
