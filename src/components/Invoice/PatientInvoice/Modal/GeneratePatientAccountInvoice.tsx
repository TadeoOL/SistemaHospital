import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
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

const INVOICE_TABLE_HEADERS = ['Nombre', 'Precio Unitario', 'Cantidad', 'Precio Neto', 'IVA', 'Precio Total'];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, xl: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
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
  const [invoiceMethodSelected, setInvoiceMethodSelected] = useState(0);
  const [loadingGenerateInvoice, setLoadingGenerateInvoice] = useState(false);
  const refetch = useInvoicePatientBillPaginationStore((state) => state.fetchData);

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceMethodSelected) return toast.warning('Es necesario seleccionar un tipo de facturación');
    setLoadingGenerateInvoice(true);
    try {
      await generatePatientBillInvoice({
        id_CuentaPaciente: patientAccountId,
        tipoFacturacion: invoiceMethodSelected,
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

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <Box sx={style}>
        <HeaderModal setOpen={setOpen} title={`Generar Factura - Paciente: ${patientName}`} />
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Stack sx={{ flex: 1 }}>
              <Typography>
                Clave Paciente: <b>{patientKey}</b>
              </Typography>
              <Typography>
                Nombre Paciente: <b>{patientName}</b>
              </Typography>
            </Stack>
            <Box sx={{ flex: 1 }}>
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
            </Box>
          </Box>
          <ItemsToBeInvoiced invoiceMethodSelected={invoiceMethodSelected} data={data} />
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

const ItemsToBeInvoiced = (ItemsToBeInvoicedProps: { data: IAcountAllInformation; invoiceMethodSelected: number }) => {
  const { data, invoiceMethodSelected } = ItemsToBeInvoicedProps;
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
        break;
      case 2:
        setItems([...formatRooms()]);
        break;
      case 3:
        setItems(formatAll());
        break;
      default:
        setItems([]);
        break;
    }
  }, [invoiceMethodSelected]);

  return (
    <Card sx={{ mt: 2 }}>
      <>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={INVOICE_TABLE_HEADERS} />
            <TableBody>{items?.map((d) => <TableRowItemsToBeInvoiced data={d} key={d.id} />)}</TableBody>
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
}) => {
  const { data } = props;

  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>${data.precioUnitario}</TableCell>
      <TableCell>{data.cantidad}</TableCell>
      <TableCell>${data.precioNeto}</TableCell>
      <TableCell>${data.iva}</TableCell>
      <TableCell>${data.precioTotal}</TableCell>
    </TableRow>
  );
};
