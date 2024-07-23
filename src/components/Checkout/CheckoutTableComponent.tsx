import { CheckCircle, Info, Visibility } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Card,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { success } from '../../theme/colors';
import { ICheckoutSell } from '../../types/types';
import { TableFooterComponent } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { hashEstatusToString, hashPaymentsToString } from '../../utils/checkoutUtils';
import { CloseSaleModal } from './Modal/CloseSaleModal';
import { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
// import { changePrincipalSellStatus } from '../../services/checkout/checkoutService';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { useConnectionSocket } from '../../store/checkout/connectionSocket';
import { CheckoutDetailsModal } from './Modal/CheckoutDetailsModal';
import { NoDataInTableInfo } from '../Commons/NoDataInTableInfo';
import { changePrincipalSellStatus } from '../../services/checkout/checkoutService';
import { SortComponent } from '../Commons/SortComponent';
import { useCheckoutUserEmitterPaginationStore } from '../../store/checkout/checkoutUserEmitterPagination';

const headTitlesCaja = [
  'Folio',
  'Concepto',
  'Paciente',
  'Costo total',
  'Monto de Pago',
  'Tipo de pago',
  'Estatus',
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
  'Estatus',
  'Notas',
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
  'Estatus',
  'Notas',
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
  const checkoutId = useCheckoutDataStore((state) => state.id);
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const conn = useConnectionSocket((state) => state.conn);
  const [openDetails, setOpenDetails] = useState(false);

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
            id_VentaPrincipal: data.id_VentaPrincipal,
            estatus: 0,
            id_CajaPrincipal: checkoutId as string,
            tieneIva: false,
            tipoPago: data.tipoPago,
            montoPago: data.totalVenta,
            id_UsuarioPase: data.id_UsuarioPase,
            pago: [
              {
                tipoPago: 0,
                montoPago: 0,
              },
            ],
          };
          await changePrincipalSellStatus(objSell);
          conn?.invoke('UpdateSell', objSell);
          return;
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetch();
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

  return (
    <>
      <TableRow>
        <TableCell>{data.folio}</TableCell>
        <TableCell>{data.moduloProveniente}</TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>$ {data.totalVenta}</TableCell>
        {(admin || props.fromPointOfSale) && <TableCell>{data.nombreUsuario}</TableCell>}
        <TableCell>{data.montoPago ? '$ ' + data.montoPago : 'No se ha cobrado'}</TableCell>
        <TableCell>{data.tipoPago ? hashPaymentsToString[data.tipoPago] : 'Sin tipo de pago'}</TableCell>
        <TableCell>{hashEstatusToString[data.estatus]}</TableCell>
        {(admin || props.fromPointOfSale) && <TableCell>{data.notas}</TableCell>}
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
              {data.estatus === 2 && (
                <Tooltip title="Pagado">
                  <Info color="primary" />
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
