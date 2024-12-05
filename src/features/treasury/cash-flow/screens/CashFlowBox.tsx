import { MainCard, TablePaginated } from '@/common/components';
import { getEmptyResponse } from '../../helpers/getEmptyResponse';
import { IconButton, Tooltip, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const CashFlowBox = () => {
  const navigate = useNavigate();

  const fakeData = [
    {
      id: 1,
      folio: '123',
      concepto: 'Pago de nomina',
      cantidad: 1000,
      fecha: '2021-10-10',
    },
  ];

  const handles = {
    handleView: (row: any) => {
      navigate(`/tesoreria/revolvente/cajas/${row.id}`);
    },
    handleAssignMoney: (row: any) => {
      console.log('row:', row);
    },
    handleDelete: (row: any) => {
      console.log('row:', row);
    },
  };

  const columns = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: 'concepto',
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'fecha',
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Editar">
            <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={() => handles.handleView(row)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Asignar presupuesto">
            <IconButton size="small" sx={{ color: 'green' }} onClick={() => handles.handleAssignMoney(row)}>
              <LocalAtmIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" sx={{ color: 'red' }} onClick={() => handles.handleDelete(row)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <MainCard sx={{ mt: 1.5 }}>
        <Typography variant="h5">Gestion de Cajas</Typography>
        <TablePaginated columns={columns} fetchData={() => getEmptyResponse(fakeData)} params={{}} />
      </MainCard>
    </>
  );
};

export default CashFlowBox;
