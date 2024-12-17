import Swal from 'sweetalert2';

export const administrationAlerts = {
  createDepositQuestion: () => {
    return Swal.fire({
      title: '¿Desea crear el deposito?',
      text: 'Se creara un deposito con el monto de la venta',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
  },
  depositApproved: () => {
    return Swal.fire({
      title: 'Deposito Aprobado!',
      text: 'El deposito ha sido aprobado!',
      icon: 'success',
    });
  },
  depositError: () => {
    return Swal.fire({
      title: 'Error!',
      text: 'Ocurrio un error al crear el deposito!',
      icon: 'error',
    });
  },
};
