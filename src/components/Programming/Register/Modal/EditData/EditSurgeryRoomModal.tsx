import { FullscreenLoader } from '@/common/components';
import { HeaderModal } from '@/components/Account/Modals/SubComponents/HeaderModal';
import { useGetSurgeryRoomDetails } from '@/hooks/admission/useGetSurgeryRoomDetails';
import { useGetMedics } from '@/hooks/programming/useGetDoctors';
import { useGetSurgicalPackages } from '@/hooks/programming/useGetSurgicalPackages';
import { SurgeryRoomFormInputs, validateDatesSchema } from '@/schema/admission/surgeryRoomSchema';
import { modifyRoomsEvents } from '@/services/admission/admisionService';
import { getSurgeryRoomsReservations } from '@/services/programming/hospitalSpace';
import { HospitalSpaceType, IPatientHospitalSpace } from '@/types/admission/admissionTypes';
import { convertDate } from '@/utils/convertDate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid } from '@mui/material';
import { Box, MenuItem, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface EditSurgeryRoomModalProps {
  onClose: () => void;
  surgeryRoomData: IPatientHospitalSpace;
  onUpdate: (dates: { startDate: Date; endDate: Date; roomId: string }) => void;
  operatingRooms: { id: string; nombre: string }[];
  patientAccountId: string;
}

const styleModal = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 750 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  maxHeight: { xs: 650, md: 800 },
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

export const EditSurgeryRoomModal = ({
  onClose,
  surgeryRoomData,
  onUpdate,
  operatingRooms,
  patientAccountId,
}: EditSurgeryRoomModalProps) => {
  const { data: surgeryDetails, isLoading } = useGetSurgeryRoomDetails(surgeryRoomData.id_EspacioHospitalario);
  const { doctorsData: doctors } = useGetMedics();
  const { data: surgeryPackages } = useGetSurgicalPackages();

  const { handleSubmit, watch, setValue } = useForm<SurgeryRoomFormInputs>({
    values: {
      startDate: dayjs(surgeryRoomData.horaInicio).toDate(),
      endDate: dayjs(surgeryRoomData.horaFin).toDate(),
      roomId: surgeryRoomData.id_Cuarto,
      doctorId: surgeryDetails?.id_Medico || '',
      surgeryPackageId: surgeryDetails?.id_PaqueteQuirurgico || '',
    },
    resolver: zodResolver(validateDatesSchema),
  });

  console.log({ surgeryRoomData });

  const onSubmit: SubmitHandler<SurgeryRoomFormInputs> = async (data) => {
    try {
      const isAvailable = await getSurgeryRoomsReservations({
        initialDate: convertDate(data.startDate),
        endDate: convertDate(data.endDate),
        surgeryRoomId: data.roomId,
        hospitalizationSpaceId: surgeryRoomData.id_EspacioHospitalario,
      });

      if (isAvailable.length > 0) {
        return Swal.fire({
          title: 'Error',
          text: `El quirófano no esta disponible de ${dayjs(data.startDate).format('DD/MM/YYYY - HH:mm')} a ${dayjs(data.endDate).format('DD/MM/YYYY - HH:mm')}`,
          icon: 'error',
        });
      }

      await modifyRoomsEvents({
        id_CuentaPaciente: patientAccountId,
        listaRegistros: [
          {
            id_EspacioHospitalario: surgeryRoomData.id_EspacioHospitalario,
            fechaInicio: convertDate(data.startDate),
            fechaFin: convertDate(data.endDate),
            id_Espacio: data.roomId,
            TipoEspacioHospitalario: HospitalSpaceType.OperatingRoom,
            id_PaqueteQuirurgico: data.surgeryPackageId,
            id_Medico: data.doctorId,
          },
        ],
      });

      onUpdate({
        startDate: data.startDate,
        endDate: data.endDate,
        roomId: data.roomId,
      });

      Swal.fire({
        title: 'Éxito',
        text: 'Quirófano actualizado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      console.error('Error al actualizar quirófano:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el quirófano', 'error');
    }
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <Box sx={styleModal}>
      <HeaderModal setOpen={onClose} title="Editar Quirófano" />
      <Box sx={{ p: 2 }}>
        <Box
          component="form"
          id="edit-surgery-room-form"
          onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            select
            label="Quirófano"
            fullWidth
            value={watch('roomId')}
            onChange={(e) => setValue('roomId', e.target.value)}
          >
            {operatingRooms.map((or) => (
              <MenuItem key={or.id} value={or.id}>
                {or.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Doctor"
            fullWidth
            value={watch('doctorId')}
            onChange={(e) => setValue('doctorId', e.target.value)}
          >
            {doctors?.map((doctor) => (
              <MenuItem key={doctor.id_Medico} value={doctor.id_Medico}>
                {doctor.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Paquete Quirúrgico"
            fullWidth
            value={watch('surgeryPackageId')}
            onChange={(e) => setValue('surgeryPackageId', e.target.value)}
          >
            {surgeryPackages?.data.map((pkg) => (
              <MenuItem key={pkg.id_PaqueteQuirurgico} value={pkg.id_PaqueteQuirurgico}>
                {pkg.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Hora inicio"
                  value={dayjs(watch('startDate'))}
                  onChange={(newValue) => setValue('startDate', newValue?.toDate() || new Date())}
                  format="DD/MM/YYYY HH:mm"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Hora fin"
                  value={dayjs(watch('endDate'))}
                  onChange={(newValue) => setValue('endDate', newValue?.toDate() || new Date())}
                  format="DD/MM/YYYY HH:mm"
                  minDateTime={dayjs(watch('startDate'))}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="primary">
            Actualizar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
