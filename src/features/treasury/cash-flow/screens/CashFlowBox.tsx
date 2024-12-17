import { MainCard, ModalBasic, TablePaginated } from '@/common/components';
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { getPaginacionCajasRevolventes } from '../services/cashflow';
import { useState } from 'react';

const CashFlowBox = () => {
  const navigate = useNavigate();

  const [openCreateBoxModal, setOpenCreateBoxModal] = useState(false);

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
    handleOpenCreateBoxModal: () => {
      setOpenCreateBoxModal(true);
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
        <Grid container direction={'row'} justifyContent={'space-between'} sx={{ pb: 2 }}>
          <Typography variant="h5">Gestion de Cajas</Typography>
          <Button variant="contained" onClick={handles.handleOpenCreateBoxModal}>
            Crear Caja
          </Button>
        </Grid>
        <TablePaginated columns={columns} fetchData={getPaginacionCajasRevolventes} params={{}} />
      </MainCard>
      <ModalBasic></ModalBasic>
    </>
  );
};

export default CashFlowBox;
