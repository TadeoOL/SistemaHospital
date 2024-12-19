import SweetAlert from 'sweetalert2';

export const alerts = {
  generateArticlesChargedPDF: () => {
    return SweetAlert.fire({
      title: '¿Deseas imprimir el ticket o generar un PDF?',
      text: 'El ticket se imprimirá en el momento que se cierre la ventana',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Imprimir',
      denyButtonText: 'Generar PDF',
      showCloseButton: true,
      reverseButtons: true,
      showDenyButton: true,
    });
  },
};
