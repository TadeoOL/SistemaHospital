import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';
import { Button, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAllConceptosSalida } from '../../concepts/services/concepts';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { IConcept } from '../../types/types.common';
import { crearAutorizacionRevolvente } from '../services/cashflow';

interface Props {
  //   itemId?: string;
  open: boolean;
  //   onSuccess: Function;
  onClose: Function;
}

export const addAuthorization = z.object({
  cantidad: z.string().min(1, 'Escribe una cantidad'),
  id_ConceptoSalida: z.string().min(1, 'Selecciona un concepto de salida'),
});

interface IAuthorization {
  cantidad: string;
  id_ConceptoSalida: string;
}

const AuthorizationModal = (props: Props) => {
  const { open, onClose } = props;

  const defaultValues = {};

  const [allConcepts, setAllConcepts] = useState<IConcept[]>([]);

  const loadConcepts = async () => {
    const data = await getAllConceptosSalida();
    setAllConcepts(data);
  };

  useEffect(() => {
    loadConcepts();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IAuthorization>({
    defaultValues,
    resolver: zodResolver(addAuthorization),
  });

  const onSubmit = async (data: any) => {
    try {
      await crearAutorizacionRevolvente({
        id_ConceptoSalida: data.id_ConceptoSalida,
        cantidad: data.cantidad,
      });
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

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button
        variant="contained"
        onClick={handleSubmit(onSubmit, onError)}
        // onClick={handleSubmit(onSubmit, handleError)}
        startIcon={<SaveOutlinedIcon />}
      >
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic header="Nueva autorizacion" open={open} onClose={onClose} actions={actions}>
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <SelectBasic
              {...register('id_ConceptoSalida')}
              value={watch('id_ConceptoSalida')}
              label="Concepto de salida"
              helperText={errors.id_ConceptoSalida?.message}
              error={errors.id_ConceptoSalida}
              options={allConcepts}
              uniqueProperty="id"
              displayProperty="nombre"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic
              {...register('cantidad')}
              label="Cantidad"
              helperText={errors.cantidad?.message}
              error={errors.cantidad}
            />
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default AuthorizationModal;
