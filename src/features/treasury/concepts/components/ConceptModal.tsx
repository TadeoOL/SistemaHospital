import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, CircularProgress, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import { InputBasic } from '@/common/components/InputBasic';
import { ModalBasic } from '@/common/components/ModalBasic';
import { useFetchConcept } from '../hooks/useFetchConcept';
import { createConcept, updateConcept } from '../services/concepts';
import { addConcept } from '../schemas/concept.schema';
import { IConcept } from '../interfaces/concept.interface';

interface ConceptModalProps {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

export const ConceptModal = (props: ConceptModalProps) => {
  const { open, onClose, onSuccess, itemId } = props;

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { data: concept, isLoading } = useFetchConcept(itemId);

  const defaultValues = {
    id: '',
    nombre: '',
    descripcion: '',
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<IConcept>({
    defaultValues,
    values:
      isLoading || !concept
        ? defaultValues
        : {
            ...concept,
          },
    resolver: zodResolver(addConcept),
  });

  useEffect(() => {
    clearErrors();
  }, [open]);

  const handleError = (err: any) => {
    console.log('err:', err);
  };

  const onSubmit: SubmitHandler<IConcept> = async (data) => {
    setLoadingSubmit(true);
    try {
      data.id = itemId || undefined;

      if (!itemId) {
        const res = await createConcept(data);
        console.log('res:', res);
        toast.success('Concepto creado con éxito!');
      } else {
        const res = await updateConcept(data);
        console.log('res:', res);
        toast.success('Concepto modificado con éxito!');
      }

      onSuccess();
      onClose();
      setLoadingSubmit(false);
    } catch (error) {
      console.log('error:', error);
      if (!itemId) {
        toast.error('Error al crear el concepto!');
      } else {
        toast.error('Error al modificar el concepto!');
      }
      setLoadingSubmit(false);
    }
  };

  const actions = (
    <>
      <Button
        variant="outlined"
        disabled={loadingSubmit}
        color="error"
        startIcon={<CancelIcon />}
        onClick={() => onClose()}
      >
        Cancelar
      </Button>
      <div className="col"></div>
      <Button
        variant="contained"
        disabled={loadingSubmit}
        onClick={handleSubmit(onSubmit, handleError)}
        startIcon={<SaveOutlinedIcon />}
      >
        {loadingSubmit ? <CircularProgress size={15} /> : 'Guardar'}
      </Button>
    </>
  );

  return (
    <ModalBasic
      isLoading={isLoading}
      open={open}
      header={itemId ? 'Modificar articulo' : 'Agregar articulo'}
      onClose={onClose}
      actions={actions}
    >
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <InputBasic
              label="Nombre"
              placeholder="Escriba un Nombre"
              {...register('nombre')}
              error={!!errors.nombre}
              helperText={errors?.nombre?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic
              label="Descripción"
              placeholder="Escriba una Descripción"
              {...register('descripcion')}
              error={!!errors.descripcion}
              helperText={errors?.descripcion?.message}
              multiline
              maxRows={3}
              maxLength={200}
            />
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};
