import { InputBasic, MainCard, ModalBasic, SelectBasic, TablePaginated } from '@/common/components';
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { createCajaRevolvente, getPaginacionCajasRevolventes } from '../services/cashflow';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { zodResolver } from '@hookform/resolvers/zod';

interface ICashFlowBox {
  nombre: string;
  fondoDestinado: string;
  id_UsuarioEncargado: string;
}

export const addCashFlowBox = z.object({});

const CashFlowBox = () => {
  const navigate = useNavigate();

  const [openCreateBoxModal, setOpenCreateBoxModal] = useState(false);

  const handles = {
    view: (row: any) => {
      navigate(`/tesoreria/revolvente/cajas/${row.id}`);
    },
    assignMoney: (row: any) => {
      console.log('row:', row);
    },
    delete: (row: any) => {
      console.log('row:', row);
    },
    openCreateBoxModal: () => {
      setOpenCreateBoxModal(true);
    },
    closeCreateBoxModal: () => {
      setOpenCreateBoxModal(false);
    },
  };

  const defaultValues = {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICashFlowBox>({
    defaultValues,
    resolver: zodResolver(addCashFlowBox),
  });

  const onSubmit = async (data: any) => {
    await createCajaRevolvente({
      nombre: data.nombre,
      fondoDestinado: data.fondoDestinado,
      id_UsuarioEncargado: '1', // TODO: get user id
    });
  };

  const onError = (errors: any) => {
    console.log('errors:', errors);
  };

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => handles.closeCreateBoxModal()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button variant="contained" onClick={handleSubmit(onSubmit, onError)} startIcon={<SaveOutlinedIcon />}>
        Guardar
      </Button>
    </>
  );

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
            <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={() => handles.view(row)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Asignar presupuesto">
            <IconButton size="small" sx={{ color: 'green' }} onClick={() => handles.assignMoney(row)}>
              <LocalAtmIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" sx={{ color: 'red' }} onClick={() => handles.delete(row)}>
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
          <Button variant="contained" onClick={handles.openCreateBoxModal}>
            Crear Caja
          </Button>
        </Grid>
        <TablePaginated columns={columns} fetchData={getPaginacionCajasRevolventes} params={{}} />
      </MainCard>
      <ModalBasic
        open={openCreateBoxModal}
        header={'Crear caja'}
        actions={actions}
        onClose={handles.closeCreateBoxModal}
      >
        <Grid item xs={12} md={12}>
          <InputBasic
            {...register('nombre')}
            label="Nombre"
            helperText={errors.nombre?.message}
            error={errors.nombre}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputBasic
            {...register('fondoDestinado')}
            label="Fondo destinado"
            helperText={errors.fondoDestinado?.message}
            error={errors.fondoDestinado}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <SelectBasic
            {...register('id_UsuarioEncargado')}
            label="Usuario encargado"
            helperText={errors.id_UsuarioEncargado?.message}
            error={errors.id_UsuarioEncargado}
          />
        </Grid>
      </ModalBasic>
    </>
  );
};

export default CashFlowBox;
