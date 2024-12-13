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
  import { useState } from 'react';
  import { toast } from 'react-toastify';
  import { ReportLoader } from '../../../Commons/Report/ReportLoader';
  import { TableHeaderComponent } from '../../../Commons/TableHeaderComponent';
  import { NoDataInTableInfo } from '../../../Commons/NoDataInTableInfo';
  import { useGetAllDocumentConcepts } from '../../../../hooks/contpaqi/useGetDocumentConcepts';
  import { ContpaqiOrderService, objOrderRequest } from '@/services/contpaqi/contpaqi.order.service';
import { useGetSellInvoiceArticles } from '@/hooks/contpaqi/useGetSellInvoiceArticles';
import { IInvoiceItem } from '@/types/hospitalizationTypes';
import { registerBillInvoice } from '@/services/invoice/invoicePatientBill';
import { useInvoicePharmacySellsBillPaginationStore } from '@/store/invoice/invoicePharmacySellsBillPagination';
  
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
  
  interface GeneratePharmacySellInvoiceProps {
    setOpen: (open: boolean) => void;
    sell_Id: string;
  }
  
  
  export const GeneratePharmacySellInvoice = ({
    setOpen, sell_Id
  }: GeneratePharmacySellInvoiceProps) => {
    const { data, isLoading } = useGetSellInvoiceArticles(sell_Id);
    const { isLoadingConcepts, documentConcepts } = useGetAllDocumentConcepts();
    const [typeOfInvoiceSelected, setTypeOfInvoiceSelected] = useState(0);
    const [loadingGenerateInvoice, setLoadingGenerateInvoice] = useState(false);
    const refetch = useInvoicePharmacySellsBillPaginationStore((state) => state.fetchData);
  
    const handleCloseModal = () => {
      setOpen(false);
    };
  
    const handleGenerateInvoice = async () => {
      if (!typeOfInvoiceSelected) return toast.warning('Es necesario seleccionar un tipo de concepto para facturar');
      
      
      const objrequesOrder : objOrderRequest = {
        tipoPedido: typeOfInvoiceSelected,
        subTotal: data.subTotal,
        iva: data.iva,
        total: data.total,
        nombrePaciente : data.nombrePaciente,//`Paciente: ${data.paciente.nombrePaciente} - Medico: ${data.paciente.nombreMedico}`,
        productosFactura : data.productosFactura
      }
      setLoadingGenerateInvoice(true);
      try {
        const contpaqiRes = await ContpaqiOrderService.requestOrder(objrequesOrder)
        await registerBillInvoice({
          id_CuentaPaciente: null,
          id_VentaCaja: sell_Id,
          pedidoRelacionado: (contpaqiRes.ciddocumento).toString()
        })
  
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
  
    if ( isLoadingConcepts || isLoading)
      return (
        <Backdrop open>
          <CircularProgress />
        </Backdrop>
      );
    return (
      <>
        <Box sx={style}>
          <HeaderModal setOpen={setOpen} title={`Generar Factura de Venta Farmacia`} />
          <Box sx={style2}>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
              <Stack sx={{ flex: 1 }}>
                <Divider sx={{ my: 1 }} />
                <Stack>
                  <Typography>
                    SubTotal: <b>{data.subTotal}</b>
                  </Typography>
                  <Typography>
                    IVA: <b>{ data.iva}</b>
                  </Typography>
                  <Typography>
                    Total: <b>{data.total}</b>
                  </Typography>
                </Stack>
              </Stack>
              <Box sx={{ flex: 1 }}>
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
                      { documentConcepts.length > 0 ? documentConcepts.map((i) => (
                        <MenuItem key={i.cidconceptodocumento} value={i.cidconceptodocumento}>
                          {i.cnombreconcepto.trim()}
                        </MenuItem>
                      )) : <></>}
                    </TextField>
              </Box>
            </Box>
            <ItemsToBeInvoiced
              data={data.productosFactura}
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
    data: IInvoiceItem[];
  }) => {
    const { data} = ItemsToBeInvoicedProps;

  
    return (
      <Card sx={{ mt: 2 }}>
        <>
          <TableContainer>
            <Table>
              <TableHeaderComponent headers={INVOICE_TABLE_HEADERS} />
              <TableBody>
                {data?.map((d, i) => <TableRowItemsToBeInvoiced data={d} key={d.id+i}/>)}
              </TableBody>
            </Table>
          </TableContainer>
          {!data ||
            (data.length == 0 && (
              <NoDataInTableInfo infoTitle="No hay elementos para facturar" sizeIcon={25} variantText="h4" />
            ))}
        </>
      </Card>
    );
  };
  
  const TableRowItemsToBeInvoiced = (props: {
    data: IInvoiceItem;
  }) => {
    const { data } = props;
    return (
      <TableRow>
        <TableCell>{data.nombre}</TableCell>
        <TableCell>${data.precioUnitario}</TableCell>
        <TableCell>{data.cantidad}</TableCell>
        <TableCell>
          {data.precioNeto}
        </TableCell>
        <TableCell>
          {data.precioIVA}
        </TableCell>
        <TableCell>
          {data.precioTotal}
        </TableCell>
      </TableRow>
    );
  };
  