import { AddCircleOutline } from '@mui/icons-material';
import { Chip, IconButton, Tooltip, Typography } from '@mui/material';

export const SurgeryProceduresChip = (props: { surgeries: { id: string; nombre: string }[] }) => {
  const { surgeries } = props;

  if (surgeries.length === 0) {
    return <Chip label="Sin cirugías" />;
  }

  if (surgeries.length === 1) {
    return <Chip key={surgeries[0].id} label={surgeries[0].nombre} />;
  }

  const primarySurgery = surgeries[0];
  const remainingSurgeries = surgeries.slice(1);

  return (
    <Tooltip
      title={
        <div>
          {remainingSurgeries.map((surgery) => (
            <Typography key={surgery.id} variant="body2">
              {surgery.nombre}
            </Typography>
          ))}
        </div>
      }
      arrow
    >
      <Chip
        key={primarySurgery.id}
        label={primarySurgery.nombre}
        onDelete={() => {}}
        deleteIcon={
          <IconButton size="small">
            <AddCircleOutline />
            <Typography variant="body2">{remainingSurgeries.length}</Typography>
          </IconButton>
        }
      />
    </Tooltip>
  );
};
