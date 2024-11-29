import { Box, MenuItem, SxProps, TextField, Theme } from '@mui/material';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';
import { useGetAllRooms } from '@/hooks/programming/useGetAllRooms';
import { IHospitalRoom } from '@/types/programming/hospitalRoomTypes';
import { ISurgeryRoom } from '@/types/programming/surgeryRoomTypes';

interface OperatingRoomFilterComponentProps {
  setSpaceId: (id: string) => void;
  spaceId: string;
  sx?: SxProps<Theme>;
  hospitalSpaceType: HospitalSpaceType;
}

export const OperatingRoomFilterComponent = ({
  spaceId,
  setSpaceId,
  sx,
  hospitalSpaceType,
}: OperatingRoomFilterComponentProps) => {
  const { data, isLoading } = useGetAllRooms(hospitalSpaceType);

  const getSpaceId = (space: IHospitalRoom | ISurgeryRoom) => {
    return hospitalSpaceType === HospitalSpaceType.Room
      ? (space as IHospitalRoom).id_Cuarto
      : (space as ISurgeryRoom).id_Quirofano;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <TextField
        select
        label={hospitalSpaceType === HospitalSpaceType.Room ? 'Habitaciones' : 'Quirófanos'}
        value={spaceId}
        onChange={(e) => setSpaceId(e.target.value)}
        fullWidth
      >
        {data?.map((space) => (
          <MenuItem key={getSpaceId(space)} value={getSpaceId(space)}>
            {space.nombre}
          </MenuItem>
        ))}
        {isLoading && <MenuItem disabled>Cargando...</MenuItem>}
      </TextField>
    </Box>
  );
};
