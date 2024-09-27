import { Box, MenuItem, SxProps, TextField, Theme } from '@mui/material';
import { useGetAllOperatingRooms } from '../../hooks/operatingRoom/useGetAllOperatingRoom';

interface OperatingRoomFilterComponentProps {
  setOperatingRoomId: Function;
  operatingRoomId: string;
  sx?: SxProps<Theme>;
}
export const OperatingRoomFilterComponent = ({
  operatingRoomId,
  setOperatingRoomId,
  sx,
}: OperatingRoomFilterComponentProps) => {
  const { data, isLoading } = useGetAllOperatingRooms();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <TextField
        select
        label="Quirófanos"
        value={operatingRoomId}
        onChange={(e) => setOperatingRoomId(e.target.value)}
        fullWidth
      >
        {data.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.nombre}
          </MenuItem>
        ))}
        {isLoading && <tr>Cargando...</tr>}
      </TextField>
    </Box>
  );
};
