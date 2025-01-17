import { Box, Grid, Collapse, Stack, Tooltip, IconButton, Typography } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { IProvider } from '../../../../../types/types';
// import { convertBase64 } from "../../../../../utils/functions/dataUtils";
import { useDropzone } from 'react-dropzone';
import { CloudUpload, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useState } from 'react';
// import { useCertificateProviderStore } from "../../../../../store/provider/certificateProvider";
// import { shallow } from "zustand/shallow";

interface ICertificateForm {
  errors: FieldErrors<IProvider>;
  register: UseFormRegister<IProvider>;
}

export const CertificateForm = (props: ICertificateForm) => {
  // const {
  //   urlCertificadoCR,
  //   urlCertificadoBP,
  //   urlCertificadoISO9001,
  //   setUrlCertificadoCR,
  //   setUrlCertificadoBP,
  //   setUrlCertificadoISO9001,
  // } = useCertificateProviderStore();
  const { errors, register } = props;
  // const { urlCR } = useCertificateProviderStore(
  //   (state) => ({ urlCR: state.urlCertificadoCR }),
  //   shallow
  // );
  const [isCollapseOpenBP, setIsCollapseOpenBP] = useState(false);
  const [isCollapseOpenCR, setIsCollapseOpenCR] = useState(false);
  const [isCollapseOpenISO, setIsCollapseOpenISO] = useState(false);

  const toggleCollapseBP = () => {
    setIsCollapseOpenBP(!isCollapseOpenBP);
  };

  const toggleCollapseCR = () => {
    setIsCollapseOpenCR(!isCollapseOpenCR);
  };

  const toggleCollapseISO = () => {
    setIsCollapseOpenISO(!isCollapseOpenISO);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    // const base64 = await convertBase64(acceptedFiles[0]);
  };

  const handleDrop = (input: number) => {
    console.log(input);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <Box>
      <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
        <Grid>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              bgcolor: '#EDEDED',
              p: 1,
              borderRadius: 2,
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Stack direction="row" alignItems="center">
              <IconButton onClick={toggleCollapseBP}>
                {isCollapseOpenBP ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {isCollapseOpenBP
                  ? 'Ocultar Certificado buenas practicas de manofactura'
                  : 'Certificado buenas practicas de manofactura'}
              </Typography>
            </Stack>
          </Box>
          <Collapse in={isCollapseOpenBP}>
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
              <Box>
                <input {...getInputProps({ onClick: () => handleDrop(1) })} />
                <Tooltip title="Subir Certificado BP">
                  <IconButton>
                    <CloudUpload
                      sx={{
                        width: 40,
                        height: 40,
                        color: 'Gray',
                        marginLeft: '255px',
                      }}
                    />
                  </IconButton>
                </Tooltip>
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
              </Box>
              <Typography>{errors?.urlCertificadoBP?.message}</Typography>
            </Stack>
          </Collapse>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              bgcolor: '#EDEDED',
              p: 1,
              borderRadius: 2,
              alignItems: 'center',
              position: 'relative',
              mt: 1,
            }}
          >
            <Stack direction="row" alignItems="center">
              <IconButton onClick={toggleCollapseCR}>
                {isCollapseOpenCR ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {isCollapseOpenCR
                  ? 'Ocultar Certificado de cumplimiento regulatorio'
                  : 'Certificado de cumplimiento regulatorio'}
              </Typography>
            </Stack>
          </Box>
          <Collapse in={isCollapseOpenCR}>
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
              <Box>
                <input {...getInputProps()} {...register('urlCertificadoCR')} />
                <Tooltip title="Certificado de cumplimiento regulatorio">
                  <IconButton>
                    <CloudUpload
                      sx={{
                        width: 40,
                        height: 40,
                        color: 'Gray',
                        marginLeft: '255px',
                      }}
                    />
                  </IconButton>
                </Tooltip>
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
              </Box>
              <Typography>{errors?.urlCertificadoCR?.message}</Typography>
            </Stack>
          </Collapse>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              bgcolor: '#EDEDED',
              p: 1,
              borderRadius: 2,
              alignItems: 'center',
              position: 'relative',
              mt: 1,
            }}
          >
            <Stack direction="row" alignItems="center">
              <IconButton onClick={toggleCollapseISO}>
                {isCollapseOpenISO ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {isCollapseOpenISO ? 'Ocultar Certificado ISO 9001' : 'Certificado ISO 9001'}
              </Typography>
            </Stack>
          </Box>
          <Collapse in={isCollapseOpenISO}>
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
              <Box>
                <input {...getInputProps()} {...register('urlCertificadoISO9001')} />
                <Tooltip title="Certificado ISO 9001">
                  <IconButton>
                    <CloudUpload
                      sx={{
                        width: 40,
                        height: 40,
                        color: 'Gray',
                        marginLeft: '255px',
                      }}
                    />
                  </IconButton>
                </Tooltip>
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
              </Box>
              <Typography>{errors?.urlCertificadoISO9001?.message}</Typography>
            </Stack>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );
};
