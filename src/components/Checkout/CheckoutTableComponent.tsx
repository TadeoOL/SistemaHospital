import { Cancel, CheckCircle, ExpandLess, ExpandMore, Info, Print, Visibility } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  alpha,
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Modal,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { success } from '../../theme/colors';
import { IArticleDetailSell, ICheckoutSell } from '../../types/types';
import { TableFooterComponent } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { hashPaymentsToString } from '../../utils/checkoutUtils';
import { CloseSaleModal } from './Modal/CloseSaleModal';
import { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useConnectionSocket } from '../../store/checkout/connectionSocket';
import { CheckoutDetailsModal } from './Modal/CheckoutDetailsModal';
import { NoDataInTableInfo } from '../Commons/NoDataInTableInfo';
import { SortComponent } from '../Commons/SortComponent';
import { useCheckoutUserEmitterPaginationStore } from '../../store/checkout/checkoutUserEmitterPagination';
import { getArticlesSold } from '../../services/pharmacy/pointOfSaleService';
import { ArticlesSoldReport } from '../Export/Checkout/ArticlesSoldReport';
import { pdf } from '@react-pdf/renderer';
import { changeCashVoucherStatus } from '../../services/checkout/chashVoucherService';

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

const headTitlesCaja = [
  'Folio',
  'Concepto',
  'Paciente',
  'Costo total',
  'Monto de Pago',
  'Tipo de pago',
  // 'Estatus',
  'Fecha Emisión',
  'Acciones',
];
const headTitlesAdmin = [
  'Folio',
  'Proveniente de',
  'Paciente',
  'Costo total',
  'Generado Por',
  'Monto de Pago',
  'Tipo de pago',
  // 'Estatus',
  'Fecha Emisión',
  // 'Notas',
  'Acciones',
];
const headTitlesFarmacia = [
  'Folio',
  'Modulo Proveniente',
  'Paciente',
  'Costo total',
  'Generado Por',
  'Monto de Pago',
  'Tipo de pago',
  // 'Estatus',
  'Fecha Emisión',
  // 'Notas',
  'Acciones',
];
interface CheckoutTableComponentProps {
  data: ICheckoutSell[];
  admin: boolean;
  count: number;
  pageIndex: number;
  pageSize: number;
  setPageIndex: Function;
  setPageSize: Function;
  hideActions?: boolean;
  refetch?: Function;
  enableEditNote?: boolean;
  fromPointOfSale: boolean;
}

interface CheckoutTableProps {
  heads: string[];
  fromPointOfSale: boolean;
}

interface CheckoutTableBodyProps {
  data: ICheckoutSell[];
  hideActions: boolean;
  admin: boolean;
  refetch: Function;
  enableEditNote: boolean;
  fromPointOfSale: boolean;
}

interface CheckoutTableRowProps {
  data: ICheckoutSell;
  hideActions: boolean;
  admin: boolean;
  refetch: Function;
  enableEditNote: boolean;
  fromPointOfSale: boolean;
}

export const CheckoutTableComponent = (props: CheckoutTableComponentProps) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <CheckoutTableHeader
            heads={props.admin ? headTitlesAdmin : headTitlesCaja}
            fromPointOfSale={props.fromPointOfSale}
          />
          <CheckoutTableBody
            data={props.data}
            admin={props.admin}
            hideActions={props?.hideActions || false}
            refetch={props?.refetch || (() => {})}
            enableEditNote={props?.enableEditNote || false}
            fromPointOfSale={props.fromPointOfSale}
          />
          {props.data.length > 0 && (
            <TableFooterComponent
              count={props.count}
              pageIndex={props.pageIndex}
              pageSize={props.pageSize}
              setPageIndex={props.setPageIndex}
              setPageSize={props.setPageSize}
            />
          )}
        </Table>
      </TableContainer>
      {props.data.length === 0 && <NoDataInTableInfo infoTitle="No hay ventas" />}
    </Card>
  );
};

const CheckoutTableHeader = (props: CheckoutTableProps) => {
  const setSort = useCheckoutPaginationStore((state) => state.setSort);
  const setSort2 = useCheckoutUserEmitterPaginationStore((state) => state.setSort);

  const doubleSort = (value: string) => {
    setSort(value);
    setSort2(value);
  };

  return (
    <TableHead>
      <TableRow>
        {
          props.fromPointOfSale
            ? headTitlesFarmacia.slice(0, -1).map((title, i) => (
                <TableCell key={i + title}>
                  <SortComponent tableCellLabel={title} headerName={title} setSortFunction={doubleSort} />
                </TableCell>
              ))
            : props.heads.slice(0, -1).map((title, i) => (
                <TableCell key={i + title}>
                  <SortComponent tableCellLabel={title} headerName={title} setSortFunction={doubleSort} />
                </TableCell>
              ))
          //headTitlesFarmacia
        }
        <TableCell>Acciones</TableCell>
      </TableRow>
    </TableHead>
  );
};

const CheckoutTableBody = (props: CheckoutTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((data) => (
        <CheckoutTableRow
          key={data.id_VentaPrincipal}
          data={data}
          admin={props.admin}
          hideActions={props.hideActions}
          refetch={props.refetch}
          enableEditNote={props.enableEditNote}
          fromPointOfSale={props.fromPointOfSale}
        />
      ))}
    </TableBody>
  );
};

const CheckoutTableRow = (props: CheckoutTableRowProps) => {
  const { data, admin } = props;
  const [open, setOpen] = useState(false);
  const refetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);
  const conn = useConnectionSocket((state) => state.conn);
  const [openDetails, setOpenDetails] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [openRows, setOpenRows] = useState(false);

  const rejectRequest = () => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas cancelar este pase a caja?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const objSell = {
            id_VentaCaja: data.id_VentaPrincipal,
            estatus: 0,
          };
          await changeCashVoucherStatus(objSell);
          conn?.invoke('UpdateSell', objSell);
          return;
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          refetch();
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Pase a caja cancelado',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'No se cancelo el pase a caja',
            icon: 'info',
          });
        }
      });
  };

  const handlePrint = async () => {
    setLoadingPrint(true);
    try {
      const res = await getArticlesSold(data.id_VentaPrincipal);
      const document = <ArticlesSoldReport venta={res} />;

      const blob = await pdf(document).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPrint(false);
    }
  };
  const returnIcon = (status: number): { title: string; icon: JSX.Element } => {
    switch (status) {
      case 0:
        return { title: 'Venta cancelada', icon: <Cancel color="error" /> };
      case 1:
        return { title: 'Venta creada', icon: <Info color="info" /> };
      case 2:
        return { title: 'Venta pagada', icon: <CheckCircle color="success" /> };
      default:
        return { title: 'Venta creada', icon: <Info color="info" /> };
    }
  };
  if (loadingPrint)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {data.detalleVenta && data.detalleVenta.length > 0 && (
              <IconButton onClick={() => setOpenRows(!openRows)}>
                {!openRows ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            )}
            <Tooltip title={returnIcon(data.estatus).title}>{returnIcon(data.estatus).icon}</Tooltip>
            <Typography sx={{ fontWeight: 400, fontSize: 12 }}>{data.folio}</Typography>
          </Box>
        </TableCell>
        <TableCell>{data.conceptoVenta}</TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>$ {data.totalVenta}</TableCell>
        {(admin || props.fromPointOfSale) && <TableCell>{data.nombreUsuario}</TableCell>}
        <TableCell>{data.montoPago ? '$ ' + data.montoPago : 'No se ha cobrado'}</TableCell>
        <TableCell>{data.tipoPago ? hashPaymentsToString[data.tipoPago] : 'Sin tipo de pago'}</TableCell>
        {/* <TableCell>{hashEstatusToString[data.estatus]}</TableCell> */}
        <TableCell>{data.fechaCreacion}</TableCell>
        {/* {(admin || props.fromPointOfSale) && <TableCell>{data.notas}</TableCell>} */}
        <TableCell>
          {!props.hideActions ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {data.estatus === 1 && admin && (
                <Tooltip title="Aceptar">
                  <IconButton onClick={() => setOpen(true)}>
                    <CheckCircle sx={{ color: success.main }} />
                  </IconButton>
                </Tooltip>
              )}
              {(data.notas || data.pdfCadena) && !props.fromPointOfSale && (
                <Tooltip title="Ver detalles">
                  <IconButton onClick={() => setOpenDetails(true)}>
                    <Visibility color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              {data.estatus === 1 && !admin && (
                <Tooltip title="Cancelar">
                  <IconButton
                    onClick={() => {
                      rejectRequest();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              )}
              {/* {data.estatus === 2 && (
                <Tooltip title="Pagado">
                  <Info color="primary" />
                </Tooltip>
              )} */}
              {data.estatus === 1 && data.paciente === 'Punto de Venta' && (
                <Tooltip title="Imprimir">
                  <IconButton onClick={handlePrint}>
                    <Print />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ) : data.notas || data.pdfCadena ? (
            <Tooltip title="Ver detalles">
              <IconButton onClick={() => setOpenDetails(true)}>
                <Visibility color="primary" />
              </IconButton>
            </Tooltip>
          ) : (
            <>Sin acciones</>
          )}
        </TableCell>
      </TableRow>
      {data.detalleVenta && data.detalleVenta.length > 0 && (
        <TableRow>
          <TableCell colSpan={8} sx={{ padding: 0 }}>
            <Collapse in={openRows} unmountOnExit>
              <SubItemsTable articles={data.detalleVenta} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CloseSaleModal setOpen={setOpen} sellData={data} />
        </>
      </Modal>
      <Modal open={openDetails} onClose={() => setOpenDetails(false)}>
        <>
          <CheckoutDetailsModal
            setOpen={setOpenDetails}
            sellData={data}
            refetch={props.refetch}
            enableEditNote={props.enableEditNote}
          />
        </>
      </Modal>
    </>
  );
};

interface SubItemsTableProps {
  articles: IArticleDetailSell[];
}
const SubItemsTable: React.FC<SubItemsTableProps> = ({ articles }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Nombre Articulo</StyledTableCell>
            <StyledTableCell align="center">Cantidad</StyledTableCell>
            <StyledTableCell align="center">Precio Unitario</StyledTableCell>
            <StyledTableCell align="center">Neto</StyledTableCell>
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
};
interface SubItemsTableRowProps {
  articleR: IArticleDetailSell;
}
const SubItemsTableRow: React.FC<SubItemsTableRowProps> = ({ articleR }) => {
  return (
    <TableRow key={articleR.id_Articulo}>
      <TableCell align="center">{articleR.nombre}</TableCell>
      <TableCell align="center">{articleR.cantidad}</TableCell>
      <TableCell align="center">$ {articleR.precioUnitario}</TableCell>
      <TableCell align="center">$ {articleR.precioNeto}</TableCell>
      <TableCell align="center">$ {articleR.iva}</TableCell>
      <TableCell align="center">$ {articleR.total}</TableCell>
    </TableRow>
  );
};
