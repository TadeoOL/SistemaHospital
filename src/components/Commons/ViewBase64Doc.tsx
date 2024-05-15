import { Close } from '@mui/icons-material';
import { Box, ClickAwayListener, IconButton, Stack } from '@mui/material';

interface ViewBase64DocProps {
  setViewPdf: Function;
  pdf: string;
}
export const ViewBase64Doc = (props: ViewBase64DocProps) => {
  return (
    <Stack
      sx={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => props.setViewPdf(false)}>
          <Close />
        </IconButton>
      </Box>
      <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => props.setViewPdf(false)}>
        <Box
          sx={{
            display: 'flex',
            flex: 10,
            mx: 7,
            mb: 3,
          }}
        >
          <embed
            src={props.pdf}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </Box>
      </ClickAwayListener>
    </Stack>
  );
};
