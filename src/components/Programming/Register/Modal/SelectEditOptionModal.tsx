import { AirlineSeatFlatOutlined, Close, MedicalServices, PermIdentity, Vaccines } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { EditPersonalInfoModal } from './EditData/EditPersonalInfoModal';
import { SelectProcedureToEdit } from './EditData/SelectProcedureToEdit';
import { EditCalendarEventModal } from './EditData/EditCalendarEventModal';
import { SelectMedicModal } from './EditData/SelectMedicModal';
import React from 'react';
import { ISurgicalProcedure } from '@/types/admission/admissionTypes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500, md: 600 },
  maxWidth: 600,
  borderRadius: 2,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  bgcolor: 'background.paper',
};

const optionStyle = (isLast: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 2,
  borderBottom: isLast ? 'none' : '1px solid',
  borderColor: 'divider',
  transition: '0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    bgcolor: 'action.hover',
    '& .MuiSvgIcon-root': {
      color: 'primary.main',
    },
  },
});

const iconStyle = {
  color: 'text.secondary',
  fontSize: { xs: 24, md: 28 },
};

interface SelectEditOptionModalProps {
  setOpen: Function;
  patientId: string;
  clinicalHistoryId: string;
  value: number;
  setValue: Function;
  patientAccountId: string;
  setRegisterRoomId: Function;
  registerRoomId: string;
  id_IngresoPaciente: string;
  procedures?: ISurgicalProcedure[];
  medic: { id?: string; nombre?: string };
  isProgramming?: boolean;
}
export const SelectEditOptionModal = (props: SelectEditOptionModalProps) => {
  switch (props.value) {
    case 0:
      return <MainMenuEditView setOpen={props.setOpen} setValue={props.setValue} isProgramming={props.isProgramming} />;
    case 1:
      return (
        <EditPersonalInfoModal
          setOpen={props.setOpen}
          id_IngresoPaciente={props.id_IngresoPaciente}
          isProgramming={props.isProgramming}
        />
      );
    case 3:
      return (
        <EditCalendarEventModal
          setOpen={props.setOpen}
          patientAccountId={props.patientAccountId}
          setValue={props.setValue}
          admission={!props.isProgramming}
        />
      );
    case 4:
      return (
        <SelectProcedureToEdit
          setOpen={props.setOpen}
          setValue={props.setValue}
          procedures={props.procedures}
          patientAccountId={props.patientAccountId}
        />
      );
    case 5:
      return (
        <SelectMedicModal
          setOpen={props.setOpen}
          setValue={props.setValue}
          surgeon={props.medic}
          patientAccountId={props.patientAccountId}
        />
      );
    default:
      break;
  }
};

export const MainMenuEditView = (props: { setOpen: Function; setValue: Function; isProgramming?: boolean }) => {
  const options = [
    {
      icon: <PermIdentity />,
      label: 'Información personal',
      value: 1,
      description: 'Editar datos personales del paciente',
    },
    {
      icon: <AirlineSeatFlatOutlined />,
      label: `${props.isProgramming ? 'Quirófanos y/o Cuartos' : 'Cuartos'}`,
      value: 3,
      description: `${props.isProgramming ? 'Gestionar asignación de espacios hospitalarios' : 'Gestionar asignación de habitaciones'}`,
    },
    !props.isProgramming
      ? null
      : {
          icon: <Vaccines />,
          label: 'Procedimientos',
          value: 4,
          description: 'Modificar procedimientos médicos',
        },
    {
      icon: <MedicalServices />,
      label: 'Médico',
      value: 5,
      description: 'Cambiar médico asignado',
    },
  ];

  return (
    <Box sx={style}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="text.primary">
            Opciones de edición
          </Typography>
          <IconButton onClick={() => props.setOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Seleccione la información que desea modificar
        </Typography>
      </Box>

      <Box>
        {options.map(
          (option, index) =>
            option && (
              <Box
                key={option.value}
                sx={optionStyle(index === options.length - 1)}
                onClick={() => props.setValue(option.value)}
              >
                <Box sx={{ color: 'text.secondary' }}>{React.cloneElement(option.icon, { sx: iconStyle })}</Box>
                <Box>
                  <Typography variant="subtitle1" color="text.primary">
                    {option.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};
