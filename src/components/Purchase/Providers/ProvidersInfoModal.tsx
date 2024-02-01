import {
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IProvider } from "../../../types/types";
import { HeaderModal } from "../../Account/Modals/SubComponents/HeaderModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, md: 800, lg: 1000 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: 600,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.4em",
    zIndex: 1,
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    zIndex: 1,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
    zIndex: 1,
  },
};

const data: IProvider = {
  id: "1",
  nombreCompania: "Bimbo",
  nombreContacto: "Juan Perez",
  puesto: "Encargado de ventas",
  direccion: "Garcia Morales #34",
  telefono: "6624523632",
  email: "Bimbo@gmail.com",
  rfc: "JIQA650427GH2",
  giroEmpresa: "Comercial",
  tipoContribuyente: 1,
  numIdentificacionFiscal: "1231231233123",
  direccionFiscal: "Villa hermosa, villa colonial #10",
  certificacionBP: "",
  certificacionCR: "",
  certificacionISO: "",
};

const fetchMuckData = async () => {
  return new Promise<IProvider>((resolve, reject) => {
    setTimeout(() => {
      if (data) {
        resolve(data);
      } else {
        reject(new Error("No se pudo cargar la información del proveedor"));
      }
    }, 2000);
  });
};

const useFetchProvider = (id: string) => {
  const [providerData, setProviderData] = useState<IProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMuckData();
        // Puedes realizar más operaciones con los datos si es necesario
        setProviderData(data); // Tomando el primer elemento de mockData
      } catch (error) {
        console.error("Error al cargar el proveedor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  return { providerData, isLoading };
};
interface IProviderInfoModal {
  setOpen: Function;
}
export const ProvidersInfoModal = (props: IProviderInfoModal) => {
  const { providerData, isLoading } = useFetchProvider("1");
  const {
    nombreCompania,
    nombreContacto,
    puesto,
    direccion,
    email,
    telefono,
    rfc,
    tipoContribuyente,
    direccionFiscal,
    giroEmpresa,
    numIdentificacionFiscal,
  } = providerData ?? {};

  if (isLoading)
    return (
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal title="Información del proveedor" setOpen={() => {}} />
      <Stack spacing={2} sx={{ display: "flex", flex: 1, p: 2 }}>
        <Card sx={{ p: 2 }}>
          <Grid
            container
            spacing={3}
            sx={{ justifyContent: "start", display: "flex", flex: 1 }}
          >
            <Grid item xs={12}>
              <Typography fontWeight={700} fontSize={24}>
                Información general:
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Nombre de la compañía:
                </Typography>
                <Typography>{nombreCompania}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Nombre del contacto:
                </Typography>
                <Typography>{nombreContacto}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Puesto:
                </Typography>
                <Typography>{puesto}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Dirección:
                </Typography>
                <Typography>{direccion}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Teléfono:
                </Typography>
                <Typography>{telefono}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Correo electrónico:
                </Typography>
                <Typography>{email}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight={700} fontSize={24}>
                Información fiscal:
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  RFC:
                </Typography>
                <Typography>{rfc}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Domicilio fiscal:
                </Typography>
                <Typography>{direccionFiscal}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Numero de identificación fiscal:
                </Typography>
                <Typography>{numIdentificacionFiscal}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Giro de la empresa:
                </Typography>
                <Typography>{giroEmpresa}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Stack>
                <Typography fontWeight={500} fontSize={16}>
                  Tipo de contribuyente:
                </Typography>
                <Typography>{tipoContribuyente}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        <Card>
          <Stack>
            <Typography fontWeight={700} fontSize={24}>
              Certificaciones
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};
