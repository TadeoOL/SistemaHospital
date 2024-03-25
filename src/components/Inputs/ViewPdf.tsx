import { Close } from '@mui/icons-material';
import { Box, ClickAwayListener, IconButton, Stack } from '@mui/material';

interface ViewPdfProps {
  setViewPdf: Function;
  pdf: string;
}

export const ViewPdf = (props: ViewPdfProps) => {
  const { setViewPdf, pdf } = props;
  const pdfData = pdf.split(':')[0] === 'data' ? pdf : 'data:application/pdf;base64,' + pdf;
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
        <IconButton onClick={() => setViewPdf(false)}>
          <Close />
        </IconButton>
      </Box>
      <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => setViewPdf(false)}>
        <Box
          sx={{
            display: 'flex',
            flex: 10,
            mx: 7,
            mb: 3,
          }}
        >
          <embed
            src={pdfData}
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
