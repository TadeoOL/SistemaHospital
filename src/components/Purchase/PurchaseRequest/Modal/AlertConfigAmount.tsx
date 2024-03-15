import Swal from "sweetalert2";
import { error, primary } from "../../../../theme/colors";

export const AlertConfigAmount = (
  setStep: Function,
  step: number,
  setIsManyProviders: Function,
  directlyTender: boolean
) => {
  Swal.fire({
    icon: "warning",
    title: "Advertencia",
    text: `Esta orden sobrepasa el límite de compra directa. ${
      directlyTender
        ? "Se requerirá 3 proveedores para licitar la solicitud de compra."
        : "Se enviará la orden a autorización y es necesario anexar un PDF a continuación."
    }`,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Siguiente",
    confirmButtonColor: primary.main,
    cancelButtonColor: error.main,
    reverseButtons: true,
    customClass: {
      container: "swal-container",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      setIsManyProviders(directlyTender ? true : false);
      setStep(step + 1);
    }
  });
};
