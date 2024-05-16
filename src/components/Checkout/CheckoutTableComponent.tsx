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
  Typography,
} from '@mui/material';
import { neutral, success } from '../../theme/colors';
import { ICheckoutSell } from '../../types/types';
import { SellTableFooter } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { hashEstatusToString, hashPaymentsToString } from '../../utils/checkoutUtils';
import { CloseSaleModal } from './Modal/CloseSaleModal';
import { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { changePrincipalSellStatus } from '../../services/checkout/checkoutService';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { useConnectionSocket } from '../../store/checkout/connectionSocket';
import { CheckoutDetailsModal } from './Modal/CheckoutDetailsModal';

const headTitles = ['Folio', 'Proveniente de', 'Paciente', 'Costo total', 'Tipo de pago', 'Estatus', 'Acciones'];

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
}

interface CheckoutTableProps {
  heads: string[];
}

interface CheckoutTableBodyProps {
  data: ICheckoutSell[];
  hideActions: boolean;
  admin: boolean;
  refetch: Function;
  enableEditNote: boolean;
}

interface CheckoutTableRowProps {
  data: ICheckoutSell;
  hideActions: boolean;
  admin: boolean;
  refetch: Function;
  enableEditNote: boolean;
}

export const CheckoutTableComponent = (props: CheckoutTableComponentProps) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <CheckoutTableHeader heads={headTitles} />
          <CheckoutTableBody
            data={props.data}
            admin={props.admin}
            hideActions={props?.hideActions || false}
            refetch={props?.refetch || (() => {})}
            enableEditNote={props?.enableEditNote || false}
          />
          {props.data.length > 0 && (
            <SellTableFooter
              count={props.count}
              pageIndex={props.pageIndex}
              pageSize={props.pageSize}
              setPageIndex={props.setPageIndex}
              setPageSize={props.setPageSize}
            />
          )}
        </Table>
      </TableContainer>
      {props.data.length === 0 && (
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', p: 6, columnGap: 2 }}>
          <Info sx={{ color: neutral[400], width: 40, height: 40 }} />
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: neutral[400] }}>No hay ventas</Typography>
        </Box>
      )}
    </Card>
  );
};

const CheckoutTableHeader = (props: CheckoutTableProps) => {
  return (
    <TableHead>
      <TableRow>
        {props.heads.map((title, i) => (
          <TableCell key={i + title}>{title}</TableCell>
        ))}
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
        <TableCell>${data.totalVenta}</TableCell>
        <TableCell>{data.tipoPago ? hashPaymentsToString[data.tipoPago] : 'Sin tipo de pago'}</TableCell>
        <TableCell>{hashEstatusToString[data.estatus]}</TableCell>

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
              {(data.notas || data.pdfCadena) && (
                <Tooltip title="Ver detalles">
                  <IconButton onClick={() => setOpenDetails(true)}>
                    <Visibility color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              {data.estatus === 1 && (
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
