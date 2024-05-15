import { CloudUpload, Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, Collapse, IconButton, Modal, Stack, Tooltip, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { convertBase64 } from '../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { ViewBase64Doc } from './ViewBase64Doc';

interface UploadFileProps {
  pdf: string;
  setPdf: Function;
  title: string;
}

export const UploadFile = (props: UploadFileProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return toast.error('Error: Solo se puede adjuntar 1 archivo .pdf!');
    try {
      const base64 = await convertBase64(acceptedFiles[0]);
      toast.success('Archivo subido con éxito!');
      setInputKey((prevKey) => prevKey + 1);
      props.setPdf(base64);
    } catch (error) {
      console.log(error);
      toast.error('Error al subir el documento pdf!');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <>
      <Stack spacing={1} sx={{ mt: 4 }}>
        <Stack>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              bgcolor: '#EDEDED',
              p: 1,
              borderRadius: 2,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {openCollapse ? (
                <IconButton
                  onClick={() => {
                    setOpenCollapse(!openCollapse);
                  }}
                >
                  <KeyboardArrowUp />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setOpenCollapse(!openCollapse);
                  }}
                >
                  <KeyboardArrowDown />
                </IconButton>
              )}
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>{props.pdf ? 'Ver PDF' : ' Subir PDF'}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 500, fontSize: 14 }}>{props.title}</Typography>
          </Box>
          <Collapse in={openCollapse} sx={{ px: 2 }}>
            {props.pdf.trim() !== '' ? (
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  p: 1,
                }}
              >
                <Button
                  onClick={() => {
                    setViewPdf(true);
                  }}
                  variant="outlined"
                  sx={{ p: 6 }}
                >
                  {props.title}
                </Button>
                <Box>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => {
                        props.setPdf('');
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <Stack
                sx={{
                  my: 1,
                  p: 4,
                  border: '1px #B4B4B8 dashed',
                  borderRadius: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps({ className: 'dropzone' })}
              >
                <CloudUpload sx={{ width: 40, height: 40, color: 'Gray' }} />
                <input key={inputKey} {...getInputProps()} />
                <Typography
                  sx={{
                    color: '#B4B4B8',
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  Arrastra y suelta tus archivos aquí para subirlos
                </Typography>
              </Stack>
            )}
          </Collapse>
        </Stack>
      </Stack>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <>
          <ViewBase64Doc pdf={props.pdf} setViewPdf={setViewPdf} />
        </>
      </Modal>
    </>
  );
};
