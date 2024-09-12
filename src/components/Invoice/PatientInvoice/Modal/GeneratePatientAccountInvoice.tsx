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
import { generatePatientBillInvoice } from '../../../../services/invoice/invoicePatientBill';
import { useInvoicePatientBillPaginationStore } from '../../../../store/invoice/invoicePatientBillPagination';
import { ReportLoader } from '../../../Commons/Report/ReportLoader';
import { useGetAccountFullInformation } from '../../../../hooks/programming/useGetAccountFullInformation';
import { TableHeaderComponent } from '../../../Commons/TableHeaderComponent';
import { IAcountAllInformation } from '../../../../types/hospitalizationTypes';
import { NoDataInTableInfo } from '../../../Commons/NoDataInTableInfo';
import { useGetAllDocumentConcepts } from '../../../../hooks/contpaqi/useGetDocumentConcepts';
import { PriceCell } from '../../../Commons/PriceCell';
import { calculateDiscountedPrice } from '../../../../utils/calculateDiscountedPrice';

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
  patientId: string;
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
  patientId,
}: GeneratePatientAccountInvoiceProps) => {
  const { data, isLoading } = useGetAccountFullInformation(patientId, patientAccountId);
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
    setLoadingGenerateInvoice(true);
    try {
      await generatePatientBillInvoice({
        id_CuentaPaciente: patientAccountId,
        tipoFacturacion: invoiceMethodSelected,
        tipoPedido: typeOfInvoiceSelected,
        porcentajeDescuento: data.porcentajeDescuento,
      });
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
                  onChange={(e) => setInvoiceMethodSelected(e.target.value as any as number)}
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
                    {documentConcepts.map((i) => (
                      <MenuItem key={i.cidconceptodocumento} value={i.cidconceptodocumento}>
                        {i.cnombreconcepto.trim()}
                      </MenuItem>
                    ))}
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
  data: IAcountAllInformation;
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
      precioNeto: number;
      iva: number;
      precioTotal: number;
      cantidad: number;
    }[]
  >([]);

  const formatArticles = () => {
    if (!data.articulos) return [];
    return data.articulos.map((article) => ({
      id: article.id,
      nombre: article.nombre,
      precioUnitario: article.precioVenta,
      precioNeto: article.precioNeto,
      iva: article.precioIVA,
      precioTotal: article.precioTotal,
      cantidad: article.cantidad,
    }));
  };

  const formatRooms = () => {
    if (!data.quirofanos && !data.cuartos) return [];
    const rooms: {
      id: string;
      nombre: string;
      precioUnitario: number;
      precioNeto: number;
      iva: number;
      precioTotal: number;
      cantidad: number;
    }[] = [];
    data.quirofanos.forEach((room) => {
      rooms.push({
        id: room.id_RegistroCuarto + room.nombre,
        nombre: room.nombre,
        precioUnitario: room.precioHora,
        precioNeto: room.precioNeto,
        iva: room.precioIVA,
        precioTotal: room.precioTotal,
        cantidad: 1,
      });
    });
    data.cuartos.forEach((room) => {
      rooms.push({
        id: room.id_RegistroCuarto,
        nombre: room.nombre,
        precioUnitario: room.precioDia,
        precioNeto: room.precioNeto,
        iva: room.precioIVA,
        precioTotal: room.precioTotal,
        cantidad: 1,
      });
    });
    return rooms;
  };

  const formatCabinetStudies = () => {
    if (!data.registrosRadiografias) return [];
    return data.registrosRadiografias.map((cabinetStudy) => ({
      id: cabinetStudy.id_RegistroRadiografia,
      nombre: cabinetStudy.nombre,
      precioUnitario: cabinetStudy.precio,
      precioNeto: cabinetStudy.precioNeto ?? 0,
      iva: cabinetStudy.precioIVA ?? 0,
      precioTotal: (cabinetStudy.precioNeto ?? 0) + (cabinetStudy.precioIVA ?? 0),
      cantidad: 1,
    }));
  };

  const formatBiomedicalEquipment = () => {
    if (!data.registrosEquiposBiomedicos && !data.registrosEquiposBiomedicosHonorario) return [];
    const biomedicalEquipment: {
      id: string;
      nombre: string;
      precioUnitario: number;
      precioNeto: number;
      iva: number;
      precioTotal: number;
      cantidad: number;
    }[] = [];

    data.registrosEquiposBiomedicos.forEach((be) => {
      biomedicalEquipment.push({
        id: be.id_RegistroEquipoBiomedico,
        nombre: be.nombre,
        precioUnitario: be.precio,
        precioNeto: be.precioNeto ?? 0,
        iva: be.precioIVA ?? 0,
        precioTotal: (be.precioNeto ?? 0) + (be.precioIVA ?? 0),
        cantidad: 1,
      });
    });

    data.registrosEquiposBiomedicosHonorario.forEach((be) => {
      biomedicalEquipment.push({
        id: be.id_Medico,
        nombre: be.nombre,
        precioUnitario: be.precio,
        precioNeto: be.precioNeto ?? 0,
        iva: be.precioIVA ?? 0,
        precioTotal: (be.precioNeto ?? 0) + (be.precioIVA ?? 0),
        cantidad: 1,
      });
    });

    return biomedicalEquipment;
  };

  const formatAll = () => {
    return [...formatArticles(), ...formatRooms(), ...formatCabinetStudies(), ...formatBiomedicalEquipment()];
  };

  useEffect(() => {
    switch (invoiceMethodSelected) {
      case 1:
        setItems([...formatArticles()]);
        setIva(
          formatArticles()
            .flatMap((a) => calculateDiscountedPrice(a.iva, data.porcentajeDescuento))
            .reduce((prev, val) => prev + val, 0)
        );
        setSubTotal(
          formatArticles()
            .flatMap((a) => calculateDiscountedPrice(a.precioNeto, data.porcentajeDescuento))
            .reduce((prev, val) => prev + val, 0)
        );
        setTotal(
          formatArticles()
            .flatMap((a) => calculateDiscountedPrice(a.precioTotal, data.porcentajeDescuento))
            .reduce((prev, val) => prev + val, 0)
        );
        break;
      case 2:
        setItems([...formatRooms(), ...formatCabinetStudies()]);
        setIva(
          formatRooms()
            .flatMap((a) => calculateDiscountedPrice(a.iva, data.porcentajeDescuento))
            .concat(formatCabinetStudies().flatMap((a) => calculateDiscountedPrice(a.iva, data.porcentajeDescuento)))
            .reduce((prev, val) => prev + val, 0)
        );
        setSubTotal(
          formatRooms()
            .flatMap((a) => calculateDiscountedPrice(a.precioNeto, data.porcentajeDescuento))
            .concat(
              formatCabinetStudies().flatMap((a) => calculateDiscountedPrice(a.precioNeto, data.porcentajeDescuento))
            )
            .reduce((prev, val) => prev + val, 0)
        );
        setTotal(
          formatRooms()
            .flatMap((a) => calculateDiscountedPrice(a.precioTotal, data.porcentajeDescuento))
            .concat(
              formatCabinetStudies().flatMap((a) => calculateDiscountedPrice(a.precioTotal, data.porcentajeDescuento))
            )
            .reduce((prev, val) => prev + val, 0)
        );
        break;
      case 3:
        setItems([...formatAll()]);
        setIva(
          formatAll()
            .flatMap((a) => calculateDiscountedPrice(a.iva, data.porcentajeDescuento))
            .reduce((prev, val) => prev + val, 0)
        );
        setSubTotal(
          formatAll()
            .flatMap((a) => calculateDiscountedPrice(a.precioNeto, data.porcentajeDescuento))
            .reduce((prev, val) => prev + val, 0)
        );
        setTotal(
          formatAll()
            .flatMap((a) => calculateDiscountedPrice(a.precioTotal, data.porcentajeDescuento))
            .reduce((prev, val) => prev + val, 0)
        );
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
              {items?.map((d) => <TableRowItemsToBeInvoiced data={d} key={d.id} discount={data.porcentajeDescuento} />)}
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
    precioNeto: number;
    iva: number;
    precioTotal: number;
    cantidad: number;
  };
  discount?: number;
}) => {
  const { data, discount } = props;
  console.log(calculateDiscountedPrice(data.precioNeto, discount));
  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>${data.precioUnitario}</TableCell>
      <TableCell>{data.cantidad}</TableCell>
      <TableCell>
        <PriceCell
          discountedPrice={calculateDiscountedPrice(data.precioNeto, discount)}
          originalPrice={data.precioNeto}
        />
      </TableCell>
      <TableCell>
        <PriceCell discountedPrice={calculateDiscountedPrice(data.iva, discount)} originalPrice={data.iva} />
      </TableCell>
      <TableCell>
        <PriceCell
          discountedPrice={calculateDiscountedPrice(data.precioTotal, discount)}
          originalPrice={data.precioTotal}
        />
      </TableCell>
    </TableRow>
  );
};
