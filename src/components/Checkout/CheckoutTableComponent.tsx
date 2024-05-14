import { CheckCircle, Info } from '@mui/icons-material';
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

const headTitles = ['Folio', 'Proveniente de', 'Paciente', 'Costo total', 'Tipo de pago', 'Estatus', 'Acciones'];

interface CheckoutTableComponentProps {
  onClickFunction?: Function;
  data: ICheckoutSell[];
  admin: boolean;
}

interface CheckoutTableProps {
  heads: string[];
}

interface CheckoutTableBodyProps {
  onClickFunction?: Function;
  data: ICheckoutSell[];
  admin: boolean;
}

interface CheckoutTableRowProps {
  onClickFunction: Function;
  data: ICheckoutSell;
  admin: boolean;
}

export const CheckoutTableComponent = (props: CheckoutTableComponentProps) => {
  const count = useCheckoutPaginationStore((state) => state.count);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutPaginationStore((state) => state.setPageSize);

  return (
    <Card>
      <TableContainer>
        <Table>
          <CheckoutTableHeader heads={headTitles} />
          <CheckoutTableBody
            data={props.data}
            onClickFunction={props?.onClickFunction || undefined}
            admin={props.admin}
          />
          {props.data.length > 0 && (
            <SellTableFooter
              count={count}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
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
          onClickFunction={props?.onClickFunction || (() => {})}
          admin={props.admin}
        />
      ))}
    </TableBody>
  );
};

const CheckoutTableRow: React.FC<CheckoutTableRowProps> = ({ onClickFunction, data, admin }) => {
  const [open, setOpen] = useState(false);
  const checkoutId = useCheckoutDataStore((state) => state.id);
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);

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
        preConfirm: () => {
          return changePrincipalSellStatus({
            id_VentaPrincipal: data.id_VentaPrincipal,
            estatus: 0,
            id_CajaPrincipal: checkoutId as string,
            tieneIva: false,
            tipoPago: data.tipoPago,
            montoPago: data.totalVenta,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetch();
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Pase a caja canceladd',
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
        <TableCell>{data.totalVenta}</TableCell>
        <TableCell>{data.tipoPago ? hashPaymentsToString[data.tipoPago] : 'Sin tipo de pago'}</TableCell>
        <TableCell>{hashEstatusToString[data.estatus]}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {data.estatus === 1 && admin && (
              <Tooltip title="Aceptar">
                <IconButton onClick={() => setOpen(true)}>
                  <CheckCircle sx={{ color: success.main }} />
                </IconButton>
              </Tooltip>
            )}
            {data.estatus !== 0 && (
              <Tooltip title="Cancelar">
                <IconButton
                  onClick={() => {
                    //console.log(data);
                    //onClickFunction();
                    rejectRequest();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
            {/*
              {data.estatus !== 0 && (<Tooltip title="Cancelar">
              <IconButton
                onClick={() => {
                  //console.log(data);
                  //onClickFunction();
                  rejectRequest();
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>)}
              */}
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CloseSaleModal setOpen={setOpen} sellId={data.id_VentaPrincipal} totalAmount={data.totalVenta} />
        </>
      </Modal>
    </>
  );
};
