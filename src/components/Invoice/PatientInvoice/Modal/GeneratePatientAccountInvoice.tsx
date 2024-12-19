import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
///import { generatePatientBillInvoice } from '../../../../services/invoice/invoicePatientBill';
import { registerBillInvoice } from '../../../../services/invoice/invoicePatientBill';
import { useInvoicePatientBillPaginationStore } from '../../../../store/invoice/invoicePatientBillPagination';
import { ReportLoader } from '../../../Commons/Report/ReportLoader';
import {
  useGetAccountFullInformation,
  UseGetAccountFullInformationParams,
} from '../../../../hooks/programming/useGetAccountFullInformation';
import { TableHeaderComponent } from '../../../Commons/TableHeaderComponent';
import { IAcountInvoiceFullInformation, IInvoiceItem } from '../../../../types/hospitalizationTypes';
import { NoDataInTableInfo } from '../../../Commons/NoDataInTableInfo';
import { useGetAllDocumentConcepts } from '../../../../hooks/contpaqi/useGetDocumentConcepts';
import { PriceCell } from '../../../Commons/PriceCell';
import { ContpaqiOrderService, objOrderRequest } from '@/services/contpaqi/contpaqi.order.service';

const INVOICE_TABLE_HEADERS = ['Nombre', 'Precio Unitario', 'Cantidad', 'Precio Neto', 'IVA', 'Precio Total'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: `600px`, // Uso de la variable para mantener consistencia.
};

const style2 = {
  bgcolor: 'background.paper',
  overflowY: 'auto',
  p: 2,
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

interface GeneratePatientAccountInvoiceProps {
  setOpen: (open: boolean) => void;
  patientName: string;
  patientKey: string;
  patientAccountId: string;
}

const INVOICE_OPTIONS = [
  {
    value: 1,
    label: 'Farmacia',
  },
  {
    value: 2,
    label: 'Espacios Hospitalarios',
  },
  {
    value: 3,
    label: 'Todo',
  },
  {},
];

export const GeneratePatientAccountInvoice = ({
  setOpen,
  patientName,
  patientKey,
  patientAccountId,
}: GeneratePatientAccountInvoiceProps) => {
  const [objParams, setObjParams] = useState<UseGetAccountFullInformationParams>({
    patientAccountId: patientAccountId,
    opcionesFacturacion: {
      articulos: false,
      servicios: false,
      cuartos: false,
      quirofanos: false,
      cirugias: false,
    },
  });
  const { data, isLoading } = useGetAccountFullInformation(objParams);
  const { isLoadingConcepts, documentConcepts } = useGetAllDocumentConcepts();
  const [invoiceMethodSelected, setInvoiceMethodSelected] = useState(0);
  const [typeOfInvoiceSelected, setTypeOfInvoiceSelected] = useState(0);
  const [loadingGenerateInvoice, setLoadingGenerateInvoice] = useState(false);
  const refetch = useInvoicePatientBillPaginationStore((state) => state.fetchData);
  const [ivaValue, setIvaValue] = useState(0);
  const [subTotalValue, setSubTotalValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceMethodSelected) return toast.warning('Es necesario seleccionar un tipo de facturación');
    if (!typeOfInvoiceSelected) return toast.warning('Es necesario seleccionar un tipo de concepto para facturar');

    const productsSelected = (): IInvoiceItem[] => {
      switch (invoiceMethodSelected) {
        case 1:
          return data.articulos;
        case 2:
          return [
            ...data.cirugias,
            ...data.cuartos,
            ...data.quirofanos,
            ...data.quirofanosRecuperacion,
            ...data.servicios,
          ];
        default:
          return [
            ...data.articulos,
            ...data.cirugias,
            ...data.cuartos,
            ...data.quirofanos,
            ...data.quirofanosRecuperacion,
            ...data.servicios,
          ];
      }
    };

    const objrequesOrder: objOrderRequest = {
      tipoPedido: typeOfInvoiceSelected,
      subTotal: data.subTotal,
      iva: data.iva,
      total: data.total,
      nombrePaciente: `Paciente: ${data.paciente.nombrePaciente} - Medico: ${data.paciente.nombreMedico}`,
      productosFactura: productsSelected(),
    };
    setLoadingGenerateInvoice(true);
    try {
      const contpaqiRes = await ContpaqiOrderService.requestOrder(objrequesOrder);
      await registerBillInvoice({
        id_CuentaPaciente: patientAccountId,
        id_VentaCaja: null,
        pedidoRelacionado: contpaqiRes.ciddocumento.toString(),
      });

      /*await generatePatientBillInvoice({
        id_CuentaPaciente: patientAccountId,
        tipoFacturacion: invoiceMethodSelected,
        tipoPedido: typeOfInvoiceSelected,
        porcentajeDescuento: data.descuento ?? 0,
      });*/
      toast.success('Factura generada correctamente');
      setOpen(false);
      refetch();
    } catch (error: any) {
      console.log(error);
      if ((error.response.data.message[0] as string).includes('Error 1001')) {
        toast.error(`${error.response.data.message[0].split(':')[1]}`);
        return;
      }
      toast.error('Error al generar la factura');
    } finally {
      setLoadingGenerateInvoice(false);
    }
  };

  if (isLoading || isLoadingConcepts)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <Box sx={style}>
        <HeaderModal setOpen={setOpen} title={`Generar Factura - Paciente: ${patientName}`} />
        <Box sx={style2}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Stack sx={{ flex: 1 }}>
              <Stack>
                <Typography>
                  Clave Paciente: <b>{patientKey}</b>
                </Typography>
                <Typography>
                  Nombre Paciente: <b>{patientName}</b>
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack>
                <Typography>
                  SubTotal: <b>{subTotalValue.toFixed(2)}</b>
                </Typography>
                <Typography>
                  IVA: <b>{ivaValue.toFixed(2)}</b>
                </Typography>
                <Typography>
                  Total: <b>{totalValue.toFixed(2)}</b>
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Opciones a facturar"
                  fullWidth
                  value={invoiceMethodSelected}
                  onChange={(e) => {
                    const valueSelected = e.target.value as any as number;
                    setInvoiceMethodSelected(valueSelected);
                    switch (valueSelected) {
                      case 1:
                        setObjParams({
                          patientAccountId: patientAccountId,
                          opcionesFacturacion: {
                            articulos: true,
                            servicios: false,
                            cuartos: false,
                            quirofanos: false,
                            cirugias: false,
                          },
                        });
                        break;
                      case 2:
                        setObjParams({
                          patientAccountId: patientAccountId,
                          opcionesFacturacion: {
                            articulos: false,
                            servicios: true,
                            cuartos: true,
                            quirofanos: true,
                            cirugias: true,
                          },
                        });
                        break;
                      case 3:
                        setObjParams({
                          patientAccountId: patientAccountId,
                          opcionesFacturacion: {
                            articulos: true,
                            servicios: true,
                            cuartos: true,
                            quirofanos: true,
                            cirugias: true,
                          },
                        });
                        break;
                      default:
                        setObjParams({
                          patientAccountId: patientAccountId,
                          opcionesFacturacion: {
                            articulos: false,
                            servicios: false,
                            cuartos: false,
                            quirofanos: false,
                            cirugias: false,
                          },
                        });
                        break;
                    }
                  }}
                >
                  <MenuItem key={0} value={0}>
                    Seleccionar
                  </MenuItem>
                  {INVOICE_OPTIONS.map((i, index) => (
                    <MenuItem key={index} value={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack>
                  <Typography>Selecciona el tipo de facturación:</Typography>
                  <TextField
                    select
                    label="Tipo de facturación"
                    fullWidth
                    value={typeOfInvoiceSelected}
                    onChange={(e) => setTypeOfInvoiceSelected(e.target.value as any as number)}
                  >
                    <MenuItem key={0} value={0}>
                      Seleccionar
                    </MenuItem>
                    {documentConcepts.length > 0 ? (
                      documentConcepts.map((i) => (
                        <MenuItem key={i.cidconceptodocumento} value={i.cidconceptodocumento}>
                          {i.cnombreconcepto.trim()}
                        </MenuItem>
                      ))
                    ) : (
                      <></>
                    )}
                  </TextField>
                </Stack>
              </Stack>
            </Box>
          </Box>
          <ItemsToBeInvoiced
            invoiceMethodSelected={invoiceMethodSelected}
            data={data}
            setIva={setIvaValue}
            setSubTotal={setSubTotalValue}
            setTotal={setTotalValue}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            p: 1,
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button variant="outlined" color="error" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleGenerateInvoice}>
            Generar
          </Button>
        </Box>
      </Box>
      <Backdrop open={loadingGenerateInvoice}>
        <ReportLoader title="Generando Factura..." />
      </Backdrop>
    </>
  );
};

const ItemsToBeInvoiced = (ItemsToBeInvoicedProps: {
  data: IAcountInvoiceFullInformation;
  invoiceMethodSelected: number;
  setIva: Function;
  setSubTotal: Function;
  setTotal: Function;
}) => {
  const { data, invoiceMethodSelected, setIva, setSubTotal, setTotal } = ItemsToBeInvoicedProps;
  const [items, setItems] = useState<
    {
      id: string;
      nombre: string;
      precioUnitario: number;
      precioOriginal: number;
      precioNeto: number;
      precioIVA: number;
      precioTotal: number;
      cantidad: number;
    }[]
  >([]);

  const formatArticles = () => {
    if (!data.articulos) return [];
    return data.articulos.map((article) => article);
  };

  const formatRooms = () => {
    if (!data.quirofanos && !data.cuartos) return [];
    const rooms: {
      id: string;
      nombre: string;
      precioUnitario: number;
      precioOriginal: number;
      precioNeto: number;
      precioIVA: number;
      precioTotal: number;
      cantidad: number;
    }[] = [];

    /*if (data.totalPagoSami > 0) {
      rooms.push({
        id: 'b1337f24-19e4-4ee1-bee5-dde5785b05e8',
        nombre: 'CONSULTA SAMI',
        precioUnitario: data.totalPagoSami,
        precioNeto: data.totalPagoSami,
        iva: 0,
        precioTotal: data.totalPagoSami,
        cantidad: 1,
      });
    }*/

    data.quirofanos.forEach((room) => {
      rooms.push({
        ...room,
        id: room.id + room.nombre,
      });
    });
    data.quirofanosRecuperacion.forEach((room) => {
      rooms.push({
        ...room,
        id: room.id + room.nombre,
      });
    });
    data.cuartos.forEach((room) => {
      rooms.push(room);
    });
    return rooms;
  };

  const formatCabinetStudies = () => {
    if (!data.servicios) return [];
    return data.servicios.map((cabinetStudy) => cabinetStudy);
  };

  const formatAll = () => {
    return [...formatArticles(), ...formatRooms(), ...formatCabinetStudies()];
  };

  useEffect(() => {
    switch (invoiceMethodSelected) {
      case 1:
        setItems(formatArticles());
        setIva(data.iva);
        setSubTotal(data.subTotal);
        setTotal(data.total);
        break;
      case 2:
        const newItems = [...formatRooms(), ...formatCabinetStudies()];
        setItems(newItems);
        setIva(data.iva);
        setSubTotal(data.subTotal);
        setTotal(data.total);
        break;
      case 3:
        setItems([...formatAll()]);
        setIva(data.iva);
        setSubTotal(data.subTotal);
        setTotal(data.total);
        break;
      default:
        setItems([]);
        setIva(0);
        setSubTotal(0);
        setTotal(0);
        break;
    }
  }, [invoiceMethodSelected]);

  return (
    <Card sx={{ mt: 2 }}>
      <>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={INVOICE_TABLE_HEADERS} />
            <TableBody>
              {items?.map((d, i) => (
                <TableRowItemsToBeInvoiced data={d} key={d.id + i} discount={data.descuento ?? 0} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!items ||
          (items.length == 0 && (
            <NoDataInTableInfo infoTitle="No hay elementos para facturar" sizeIcon={25} variantText="h4" />
          ))}
      </>
    </Card>
  );
};

const TableRowItemsToBeInvoiced = (props: {
  data: {
    id: string;
    nombre: string;
    precioUnitario: number;
    precioOriginal: number;
    precioNeto: number;
    precioIVA: number;
    precioTotal: number;
    cantidad: number;
  };
  discount?: number;
}) => {
  const { data } = props;
  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>${data.precioUnitario}</TableCell>
      <TableCell>{data.cantidad}</TableCell>
      <TableCell>
        <PriceCell discountedPrice={data.precioNeto} originalPrice={data.precioOriginal} />
      </TableCell>
      <TableCell>
        <PriceCell
          //discountedPrice={calculateDiscountedPrice(data.precioIVA, discount)}
          originalPrice={data.precioIVA}
        />
      </TableCell>
      <TableCell>
        <PriceCell
          //discountedPrice={calculateDiscountedPrice(data.precioTotal, discount)}
          originalPrice={data.precioTotal}
        />
      </TableCell>
    </TableRow>
  );
};
