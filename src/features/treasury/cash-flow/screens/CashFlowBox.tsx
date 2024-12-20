import { InputBasic, MainCard, ModalBasic, SelectBasic, TablePaginated } from '@/common/components';
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { asignarRevolventeCaja, createCajaRevolvente, getPaginacionCajasRevolventes } from '../services/cashflow';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetUsersBySearch } from '../hooks/useGetUsersBySearch';
import { getConcepts } from '../../services/treasury';
import { useDeleteBox } from '../hooks/useDeleteBox';

interface ICashFlowBox {
  nombre: string;
  fondoDestinado: string;
  id_UsuarioEncargado: string;
}

export const addCashFlowBox = z.object({
  nombre: z.string().min(1, { message: 'Campo requerido' }),
  fondoDestinado: z.string().min(1, { message: 'Campo requerido' }),
  id_UsuarioEncargado: z.string().min(1, { message: 'Campo requerido' }),
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
};

interface IAssignMoneyModal {
  openAssignMoneyModal: boolean;
  onClose: () => void;
  selectedRow: any;
  reloadTable: () => void;
}

interface ICashFlowAssignMoney {
  id_ConceptoSalida: string;
  monto: string;
}

export const addAssignMoney = z.object({
  id_ConceptoSalida: z.string().min(1, { message: 'Campo requerido' }),
  monto: z.string().min(1, { message: 'Campo requerido' }),
});

function AssignMoneyModal({ openAssignMoneyModal, onClose, selectedRow, reloadTable }: IAssignMoneyModal) {
  const defaultValues = {};

  const [concepts, setConcepts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getConcepts();
      console.log('setConcepts:', res);
      setConcepts(res);
    };

    fetchData();
  }, []);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICashFlowAssignMoney>({
    defaultValues,
    resolver: zodResolver(addAssignMoney),
  });

  const onSubmit = async (data: any) => {
    const newData = {
      id_CajaRevolvente: selectedRow.id_CajaRevolvente,
      id_ConceptoSalida: data.id_ConceptoSalida,
      monto: data.monto,
    };
    try {
      console.log('data:', data);
      await asignarRevolventeCaja(newData);

      reloadTable();

      onClose();
      toast.success('Presupuesto asignado con éxito!');
    } catch (error: any) {
      const data = error.response.data;
      const noCashflow = data?.message[0] === 'No se encontró el saldo de Revolvente';
      if (noCashflow) {
        toast.error('No se encontró el saldo de Revolvente');
        return;
      }
      toast.error('Error al asignar presupuesto!');
    }
  };

  const onError = (errors: any) => {
    console.log('errors:', errors);
  };

  const assignMoneyActions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={onClose}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button variant="contained" onClick={handleSubmit(onSubmit, onError)} startIcon={<SaveOutlinedIcon />}>
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic
      open={openAssignMoneyModal}
      header={'Asignar presupuesto'}
      actions={assignMoneyActions}
      onClose={onClose}
    >
      <Grid component="span" container spacing={2}>
        <Grid item xs={12} md={12}>
          <SelectBasic
            {...register('id_ConceptoSalida')}
            value={watch('id_ConceptoSalida')}
            label="Concepto de salida"
            options={concepts}
            displayProperty="nombre"
            uniqueProperty="id"
            helperText={errors.id_ConceptoSalida?.message}
            error={errors.id_ConceptoSalida}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputBasic {...register('monto')} label="Monto" helperText={errors.monto?.message} error={errors.monto} />
        </Grid>
      </Grid>
    </ModalBasic>
  );
}

const CashFlowBox = () => {
  const navigate = useNavigate();

  const [openCreateBoxModal, setOpenCreateBoxModal] = useState(false);
  const [openAssignMoneyModal, setOpenAssignMoneyModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [usersSearch] = useState('');
  const { users } = useGetUsersBySearch(usersSearch);
  const { mutate: deleteBox } = useDeleteBox();

  const tableRef = useRef<any>();

  const reloadTable = () => {
    tableRef.current?.fetchData();
  };

  const handles = {
    view: (row: any) => {
      navigate(`/tesoreria/revolvente/cajas/${row.id_CajaRevolvente}`);
    },
    assignMoney: (row: any) => {
      setSelectedRow(row);
      setOpenAssignMoneyModal(true);
      console.log('row:', row);
    },
    delete: (row: any) => {
      deleteBox(row.id_CajaRevolvente, {
        onSuccess: () => {
          reloadTable();
          toast.success('Caja eliminada con éxito!');
        },
        onError: () => {
          toast.error('Error al eliminar caja!');
        },
      });
    },
    openCreateBoxModal: () => {
      setOpenCreateBoxModal(true);
    },
    closeCreateBoxModal: () => {
      setOpenCreateBoxModal(false);
    },
    closeAssignMoneyModal: () => {
      setOpenAssignMoneyModal(false);
    },
  };

  const defaultValues = {
    nombre: '',
    fondoDestinado: '',
    id_UsuarioEncargado: '',
  };

  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICashFlowBox>({
    defaultValues,
    resolver: zodResolver(addCashFlowBox),
  });

  const onSubmit = async (data: any) => {
    try {
      console.log('data:', data);
      await createCajaRevolvente({
        nombre: data.nombre,
        fondoDestinado: data.fondoDestinado,
        id_UsuarioEncargado: data.id_UsuarioEncargado,
      });

      reloadTable();

      handles.closeCreateBoxModal();

      reset();

      toast.success('Caja creada con éxito!');
    } catch (error) {
      toast.error('Error al crear caja!');
    }
  };

  const onError = (errors: any) => {
    console.log('errors:', errors);
  };

  const createBoxActions = (
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
      header: 'Nombre',
      value: 'nombre',
    },
    {
      header: 'Usuario Encargado',
      value: 'nombreUsuarioEncargado',
    },
    {
      header: 'Fondo Destinado',
      value: (row: any) => formatPrice(row.fondoDestinado),
    },
    {
      header: 'Fondo Actual',
      value: (row: any) => formatPrice(row.fondoActual),
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Ver">
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
        actions={createBoxActions}
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
            value={watch('id_UsuarioEncargado')}
            label="Usuario encargado"
            options={users}
            displayProperty="nombre"
            uniqueProperty="id"
            helperText={errors.id_UsuarioEncargado?.message}
            error={errors.id_UsuarioEncargado}
          />
        </Grid>
      </ModalBasic>
      <AssignMoneyModal
        openAssignMoneyModal={openAssignMoneyModal}
        onClose={handles.closeAssignMoneyModal}
        selectedRow={selectedRow}
        reloadTable={reloadTable}
      />
    </>
  );
};

export default CashFlowBox;
