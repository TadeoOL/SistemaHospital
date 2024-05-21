import { Info } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const DEFAULT_SIZE_ICON = 50;
interface NoDataInTableInfoProps {
  infoTitle: string;
  sizeIcon?: number;
  variantText?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
}
export const NoDataInTableInfo = (props: NoDataInTableInfoProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1, p: 4, color: 'gray' }}>
      <Info
        sx={{
          width: props.sizeIcon ? props.sizeIcon : DEFAULT_SIZE_ICON,
          height: props.sizeIcon ? props.sizeIcon : DEFAULT_SIZE_ICON,
        }}
      />
      <Typography variant={props.variantText ? props.variantText : 'h2'}>{props.infoTitle}</Typography>
    </Box>
  );
};
