import { Close } from '@mui/icons-material';
import { Autocomplete, Box, Button, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaUserDoctor } from 'react-icons/fa6';
import { useGetMedics } from '../../../../hooks/programming/useGetDoctors';
import {
  anesthesiologistOperatingRoomSchema,
  surgeonOperatingRoomSchema,
} from '../../../../schema/operatingRoom/operatingRoomSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { modifyOperatingRoom } from '../../../../services/programming/admissionRegisterService';
import { toast } from 'react-toastify';
import { useDailyOperatingRoomsPaginationStore } from '../../../../store/operatingRoom/dailyOperatingRoomsPagination';
import { useGetAnesthesiologists } from '../../../../hooks/hospitalization/useGetAnesthesiologists';
import { LiaUserNurseSolid } from 'react-icons/lia';
import { NurseSelectorModal } from './NurseSelectorModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
const topContainerStyle = {
  bgcolor: 'background.paper',
  p: 2,
  borderTopRightRadius: 10,
  borderTopLeftRadius: 10,
};

const bottomContainerStyle = {
  bgcolor: 'background.paper',
  p: 1,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  display: 'flex',
  justifyContent: 'space-between',
};

interface Props {
  setOption: (option: number) => void;
  registerRoomId: string;
  surgeon?: { id: string; nombre: string };
  anesthesiologist?: { id: string; nombre: string };
}
interface OptionsModalProps {
  setOpen: (open: boolean) => void;
  registerRoomId: string;
  medical?: { id: string; nombre: string };
  anesthesiologist?: { id: string; nombre: string };
  nurses?: { id_Enfermero: string; nombre: string }[];
}
interface CardOptionsProps {
  title: string;
  icon: ReactNode;
  onClick: (option: number) => void;
  valueOption: number;
}
interface MainMenuProps {
  setOption: (option: number) => void;
  setOpen: (open: boolean) => void;
  cardOptions: CardOptionsProps[];
}

export const OptionsModal = (props: OptionsModalProps) => {
  const [option, setOption] = useState(0);
  const theme = useTheme();
  const iconColor = theme.palette.grey[400];

  const CARD_OPTIONS: CardOptionsProps[] = [
    {
      icon: <FaUserDoctor style={{ color: iconColor, width: 80, height: 80 }} />,
      onClick: setOption,
      title: 'Anestesiólogo',
      valueOption: 1,
    },
    {
      icon: <FaUserDoctor style={{ color: iconColor, width: 80, height: 80 }} />,
      onClick: setOption,
      title: 'Cirujano',
      valueOption: 2,
    },
    {
      icon: <LiaUserNurseSolid style={{ color: iconColor, width: 80, height: 80 }} />,
      onClick: setOption,
      title: 'Enfermeros',
      valueOption: 3,
    },
  ];

  const RENDER_OPTIONS: Record<number, JSX.Element> = {
    0: <MainMenu setOption={setOption} setOpen={props.setOpen} cardOptions={CARD_OPTIONS} />,
    1: (
      <AddAnesthesiologist
        setOption={setOption}
        registerRoomId={props.registerRoomId}
        anesthesiologist={props.anesthesiologist}
      />
    ),
    2: <AddSurgeon setOption={setOption} registerRoomId={props.registerRoomId} surgeon={props.medical} />,
    3: (
      <NurseSelectorModal
        setOption={setOption}
        registerRoomId={props.registerRoomId}
        nurses={props.nurses ?? []}
        setOpen={props.setOpen}
      />
    ),
  };

  return <Box sx={style}>{RENDER_OPTIONS[option]}</Box>;
};

function MainMenu(props: MainMenuProps) {
  const { setOpen, cardOptions } = props;
  return (
    <>
      <Box sx={topContainerStyle}>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          <Typography sx={{ display: 'flex', alignSelf: 'end', color: 'gray', fontSize: 24, fontWeight: 700 }}>
            Selecciona una opción
          </Typography>
          <IconButton sx={{ display: 'flex', alignSelf: 'start' }} onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            rowGap: 2,
            columnGap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {cardOptions.map((co, i) => (
            <CardOptions key={i} icon={co.icon} onClick={co.onClick} title={co.title} valueOption={co.valueOption} />
          ))}
        </Box>
      </Box>
      <Box sx={bottomContainerStyle}>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
      </Box>
    </>
  );
}

function AddAnesthesiologist(props: Props) {
  interface AnesthesiologistInput {
    anesthesiologist: { id: string; nombre: string } | null;
  }
  const { anesthesiologistsData, isLoadingAnesthesiologists } = useGetAnesthesiologists();
  const refetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnesthesiologistInput>({
    defaultValues: {
      anesthesiologist: props.anesthesiologist ? props.anesthesiologist : null,
    },
    resolver: zodResolver(anesthesiologistOperatingRoomSchema),
  });

  const onSubmit: SubmitHandler<AnesthesiologistInput> = async (data) => {
    try {
      await modifyOperatingRoom({
        id_RegistroCuarto: props.registerRoomId,
        id_Anestesiologo: data.anesthesiologist?.id,
      });
      toast.success('Anestesiólogo agregado con éxito!');
      refetch();
      props.setOption(0);
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al agregar el anestesiólogo!');
    }
  };
  return (
    <>
      <Box sx={topContainerStyle}>
        <Typography>Agregar anestesiólogo</Typography>
        <form onSubmit={handleSubmit(onSubmit)} id="form1">
          <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setValue('anesthesiologist', val);
            }}
            loading={isLoadingAnesthesiologists}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={anesthesiologistsData}
            value={watch('anesthesiologist') ?? null}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setValue('anesthesiologist', null);
              }
            }}
            noOptionsText="No se encontraron anestesiólogos"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Anestesiólogos"
                error={!!errors.anesthesiologist?.message}
                helperText={errors.anesthesiologist?.message}
              />
            )}
          />
        </form>
      </Box>
      <Box sx={bottomContainerStyle}>
        <Button onClick={() => props.setOption(0)}>Regresar</Button>
        <Button type="submit" form="form1" variant="contained">
          Agregar
        </Button>
      </Box>
    </>
  );
}

function AddSurgeon(props: Props) {
  const { doctorsData, isLoadingMedics } = useGetMedics();
  const refetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);
  interface Input {
    medical: { id: string; nombre: string } | null;
  }
  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<Input>({
    defaultValues: { medical: props.surgeon ? props.surgeon : null },
    resolver: zodResolver(surgeonOperatingRoomSchema),
  });

  const onSubmit: SubmitHandler<Input> = async (data) => {
    console.log(data);
    try {
      await modifyOperatingRoom({
        id_RegistroCuarto: props.registerRoomId,
        id_Medico: data.medical?.id,
      });
      toast.success('Cirujano agregado con éxito!');
      refetch();
      props.setOption(0);
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al agregar el cirujano!');
    }
  };

  return (
    <>
      <Box sx={topContainerStyle}>
        <Typography>Agregar Cirujano</Typography>
        <form onSubmit={handleSubmit(onSubmit)} id="form1">
          <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setValue('medical', val);
            }}
            loading={isLoadingMedics}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={doctorsData}
            value={watch('medical') ?? null}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setValue('medical', null);
              }
            }}
            noOptionsText="No se encontraron cirujanos"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Cirujanos"
                error={!!errors.medical?.message}
                helperText={errors.medical?.message}
              />
            )}
          />
        </form>
      </Box>
      <Box sx={bottomContainerStyle}>
        <Button onClick={() => props.setOption(0)} variant="outlined">
          Regresar
        </Button>
        <Button type="submit" form="form1" variant="contained">
          Agregar
        </Button>
      </Box>
    </>
  );
}

function CardOptions(props: CardOptionsProps) {
  const { icon, onClick, title, valueOption } = props;

  return (
    <Box
      sx={{
        width: { md: 250, xs: '50%' },
        height: { md: 180, xs: 75 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 10,
        boxShadow: '5px 5px 5px 5px rgba(0,0,0,.1)',
        m: 2,
        cursor: 'pointer',
        p: 4,
        transition: '0.15s ease-in-out',
        '&:hover': {
          transition: '0.15s ease-in-out',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 10,
          cursor: 'pointer',
          transform: 'scale(1.05)',
          boxShadow: '7px 7px 7px 7px rgba(0,0,0,.1)',
        },
      }}
      onClick={() => onClick(valueOption)}
    >
      {icon}
      <Typography sx={{ fontSize: { xs: 16, md: 28 }, fontWeight: 600, color: 'gray' }}>{title}</Typography>
    </Box>
  );
}
