import { AddCircleOutline } from '@mui/icons-material';
import { Box, Chip, Tooltip, Typography } from '@mui/material';

interface GenericChipProps {
  data: { id: string; nombre: string }[];
  label?: string;
}
export const GenericChip = (props: GenericChipProps) => {
  const { data, label } = props;

  if (data.length === 0) {
    return <Chip label={label || 'Sin cirugías'} />;
  }

  if (data.length === 1) {
    return <Chip key={data[0].id} label={data[0].nombre} />;
  }

  const primaryData = data[0];
  const remainingData = data.slice(1);

  return (
    <Tooltip
      title={
        <Box>
          {remainingData.map((item) => (
            <Typography key={item.id} variant="body2">
              {item.nombre}
            </Typography>
          ))}
        </Box>
      }
      arrow
    >
      <Chip
        key={primaryData.id}
        label={primaryData.nombre}
        onDelete={() => {}}
        deleteIcon={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <AddCircleOutline sx={{ fontSize: 18 }} color="secondary" />
            <Typography variant="body2" sx={{ lineHeight: 1, color: 'text.secondary' }}>
              {remainingData.length}
            </Typography>
          </Box>
        }
      />
    </Tooltip>
  );
};
