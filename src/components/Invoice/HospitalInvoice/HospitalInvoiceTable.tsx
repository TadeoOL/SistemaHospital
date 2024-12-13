import { Box, Card, CircularProgress, Table, TableBody, Tooltip, TableCell, TableContainer, TableRow, TableHead, styled, tableCellClasses, alpha, Collapse, IconButton, Modal } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useInvoicePharmacySellsBillPaginationStore } from '@/store/invoice/invoicePharmacySellsBillPagination';
import { useEffect, useState } from 'react';
import { FaFileInvoice } from 'react-icons/fa6';
import { TableFooterComponent } from '@/components/Pharmacy/ArticlesSoldHistoryTableComponent';
import { InvoiceSellInvoiceArticle, InvoiceSellInvoicePagination } from '@/types/invoiceTypes';
import { CheckCircle, Info, ExpandLess, ExpandMore } from '@mui/icons-material';
import { GeneratePharmacySellInvoice } from './Modal/GeneratePharmacySellInvoice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 1),
    fontWeight: 'bold',
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
  },
  [`&.${tableCellClasses.root}`]: {
    width: '20%',
  },
}));

const TABLE_HEADERS = ['Folio', 'Subtotal', 'Iva', 'Total', 'Metodo de Pago', 'Fecha Venta', 'Acciones'];

const useGetPaginationData = () => {
  const fetch = useInvoicePharmacySellsBillPaginationStore((state) => state.fetchData);
  const data = useInvoicePharmacySellsBillPaginationStore((state) => state.data);
  const isLoading = useInvoicePharmacySellsBillPaginationStore((state) => state.loading);
  const search = useInvoicePharmacySellsBillPaginationStore((state) => state.search);
  const pageSize = useInvoicePharmacySellsBillPaginationStore((state) => state.pageSize);
  const pageIndex = useInvoicePharmacySellsBillPaginationStore((state) => state.pageIndex);
  const setPageIndex = useInvoicePharmacySellsBillPaginationStore((state) => state.setPageIndex);
  const setPageSize = useInvoicePharmacySellsBillPaginationStore((state) => state.setPageSize);
  const count = useInvoicePharmacySellsBillPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);

  return {
    data,
    isLoading,
    pageSize,
    pageIndex,
    count,
    setPageIndex,
    setPageSize,
  };
};

export const HospitalInvoiceTable = () => {
  const { count, data, isLoading, pageIndex, pageSize, setPageIndex, setPageSize } = useGetPaginationData();
  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          <TableBody>
            {data.map((d) => (
              <HospitalInvoiceTableRow data={d} key={d.id_VentaCaja} />
            ))}
          </TableBody>
          {data && data.length > 0 && (
            <TableFooterComponent
              count={count}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
            />
          )}
        </Table>
      </TableContainer>
      {(!data || data.length < 1) && <NoDataInTableInfo infoTitle="No hay facturas generadas" />}
    </Card>
  );
};
interface HospitalInvoiceTableRowProps {
  data: InvoiceSellInvoicePagination;
}
const HospitalInvoiceTableRow = ({ data }: HospitalInvoiceTableRowProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };
  const [openRows, setOpenRows] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
            {data.articulos.length > 0 && <IconButton onClick={() => setOpenRows(!openRows)}>{!openRows ? <ExpandMore /> : <ExpandLess />}</IconButton>}
            {data.facturada ? (
              <Tooltip title="Facturación realizada">
                <CheckCircle color="success" />
              </Tooltip>
            ) : (
              <Tooltip title="Pendiente por facturar">
                <Info color="info" />
              </Tooltip>
            )}
            {data.folio}
          </Box>

        </TableCell>
        <TableCell>{data.subTotal}</TableCell>
        <TableCell>{data.iva}</TableCell>
        <TableCell>{data.total}</TableCell>
        <TableCell>{data.metodoPago}</TableCell>
        <TableCell>{data.fechaCompra}</TableCell>
        <TableCell>
          <Tooltip title="Generar factura">
            <IconButton onClick={handleOpenModal}>
              <FaFileInvoice style={{ color: 'gray' }} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {data.articulos.length > 0 && (<TableRow>
        <TableCell colSpan={8} sx={{ padding: 0 }}>
          <Collapse in={openRows} unmountOnExit>
            <SubItemsTable articles={data.articulos} />
          </Collapse>
        </TableCell>
      </TableRow>)}
      <Modal open={open}>
        <>
          <GeneratePharmacySellInvoice
            setOpen={setOpen} sell_Id={data.id_VentaCaja}
          />
        </>
      </Modal>
    </>
  );
};

interface SubItemsTableProps {
  articles: InvoiceSellInvoiceArticle[];
}
const SubItemsTable: React.FC<SubItemsTableProps> = ({ articles }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Nombre Articulo</StyledTableCell>
            <StyledTableCell align="center">Cantidad</StyledTableCell>
            <StyledTableCell align="center">Subtotal</StyledTableCell>
            <StyledTableCell align="center">IVA</StyledTableCell>
            <StyledTableCell align="center">Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((a, i) => (
            <SubItemsTableRow articleR={a} key={`${a.id_Articulo}|${i}`} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  //GeneratePatientAccountInvoiceProps
};
interface SubItemsTableRowProps {
  articleR: InvoiceSellInvoiceArticle;
}
const SubItemsTableRow: React.FC<SubItemsTableRowProps> = ({ articleR }) => {
  return (
    <TableRow key={articleR.id_Articulo}>
      <TableCell align="center">{articleR.nombre}</TableCell>
      <TableCell align="center">{articleR.cantidad}</TableCell>
      <TableCell align="center">{articleR.subTotal}</TableCell>
      <TableCell align="center">{articleR.iva}</TableCell>
      <TableCell align="center">{articleR.total}</TableCell>
    </TableRow>
  );
};
