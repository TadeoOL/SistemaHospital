import { useQuery } from '@tanstack/react-query';
import { IAcountInvoiceFullInformation, IInvoiceItem } from '../../types/hospitalizationTypes';
import { getAccountBillInformation } from '@/services/invoice/invoicePatientBill';

export interface UseGetAccountFullInformationParams {
  patientAccountId: string;
  opcionesFacturacion?: {
    articulos?: boolean;
    servicios?: boolean;
    cuartos?: boolean;
    quirofanos?: boolean;
    cirugias?: boolean;
  };
}

export const useGetAccountFullInformation = ({
  patientAccountId,
  opcionesFacturacion = {
    articulos: true,
    servicios: true,
    cuartos: true,
    quirofanos: true,
    cirugias: true,
  },
}: UseGetAccountFullInformationParams) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: [
      'accountFullInformation', 
      patientAccountId, 
      opcionesFacturacion
    ],
    queryFn: async () => {
      const params = `Id_CuentaPaciente=${patientAccountId}&Articulos=${opcionesFacturacion.articulos
        }&Servicios=${opcionesFacturacion.servicios}&Cuartos=${opcionesFacturacion.cuartos
        }&Quirofanos=${opcionesFacturacion.quirofanos}&Cirugias=${opcionesFacturacion.cirugias}`;
      
      const rawData = await getAccountBillInformation(params);

      const formattedData: IAcountInvoiceFullInformation = {
        id: rawData.id,
        paciente: rawData.paciente,
        cuartos: [],
        quirofanos: [],
        quirofanosRecuperacion: [],
        cirugias: [],
        servicios: [],
        articulos: [],
        pagosCuenta: rawData.pagosCuenta,
        subTotal: rawData.subTotal,
        descuento: rawData.descuento,
        iva: rawData.iva,
        total: rawData.total,
        totalPagos: rawData.totalPagos,
        facturable: rawData.facturable,
      };

      rawData.productosFactura.forEach((producto: IInvoiceItem) => {
        switch (producto.tipoProducto) {
          case 1:
            formattedData.articulos.push(producto);
            break;
          case 2:
            formattedData.servicios.push(producto);
            break;
          case 3: 
            formattedData.cuartos.push(producto);
            break;
          case 4: 
            formattedData.quirofanos.push(producto);
            break;
          case 5:
            formattedData.quirofanosRecuperacion.push(producto);
            break;
          case 6:
            formattedData.cirugias.push(producto);
            break;
          default:
            console.warn(`Tipo de producto desconocido: ${producto.tipoProducto}`);
        }
      });

      return formattedData;
    },
    enabled: !!patientAccountId,
  });

  return {
    isLoading,
    data: data as IAcountInvoiceFullInformation,
    isError,
  };
};
