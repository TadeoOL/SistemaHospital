import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Card,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  Checkbox,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { IPurchase } from "../../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPurchase } from "../../../../schema/schemas";
import { useGetArticles } from "../../../../hooks/useGetArticles";
import { useState } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, md: 600, lg: 800 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: { xs: 600 },
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
  },
};

const Alert = () => {
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
};

let data = [{ id: "1", nombre: "Ibuprofeno", cantidad: "100" }];
const data2 = [
  { id: "2", nombre: "Carbafen", cantidad: "100" },
  { id: "3", nombre: "Omepraxol", cantidad: "100" },
  { id: "4", nombre: "Paracetamol", cantidad: "100" },
  { id: "5", nombre: "Paracetamol", cantidad: "100" },
  { id: "6", nombre: "Paracetamol", cantidad: "100" },
  { id: "7", nombre: "Paracetamol", cantidad: "100" },
];

const stepsForm = [
  {
    id: "step 1",
    title: "Solicitar orden de compra",
    fields: [
      "nombreCompania",
      "nombreContacto",
      "puesto",
      "direccion",
      "telefono",
      "correoElectronico",
    ],
  },
  {
    id: "step 2",
    title: "Seleccionar proveedor",
    fields: [
      "rfc",
      "nif",
      "giroEmpresa",
      "direccionFiscal",
      "tipoContribuyente",
    ],
  },
];
interface RequestPurchasedOrderModalProps {
  open: Function;
}
export const RequestPurchasedOrderModal = ({
  open,
}: RequestPurchasedOrderModalProps) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedArticle, setSelectedArticle] = useState("");
  const [step, setStep] = useState(0);
  const [isAddingMoreArticles, setIsAddingMoreArticles] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPurchase>({
    defaultValues: {
      id_articulo: "",
      cantidad: 0,
    },
    resolver: zodResolver(addPurchase),
  });

  const onSubmit: SubmitHandler<IPurchase> = async (data) => {
    console.log({ data });
    try {
      toast.success("Categoría creada con éxito");
    } catch (error) {
      console.log(error);
      toast.error("Error al crear la categoría");
    }
  };

  const handleChange = (articleId: string) => {
    setSelectedArticle(articleId);
  };

  // if (isLoadingArticles)
  //   return (
  //     <Backdrop open>
  //       <CircularProgress />
  //     </Backdrop>
  //   );

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={() => {}}
        title={
          step === 0 ? "Solicitar de orden de compra" : "Seleccionar proveedor"
        }
      />
      <Stack spacing={4} sx={{ p: 3, px: 6 }}>
        <Stepper activeStep={step}>
          {stepsForm.map((step) => (
            <Step key={step.id}>
              <StepLabel>
                {
                  <Typography fontSize={{ lg: 14, xs: 12 }} fontWeight={500}>
                    {step.title}
                  </Typography>
                }
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Stack
          sx={{
            columnGap: 2,
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            flexDirection: { md: "row", xs: "column" },
            alignItems: "center",
          }}
        >
          <Typography fontSize={20} fontWeight={700}>
            Productos
          </Typography>
          <Button
            disabled={isAddingMoreArticles}
            variant="contained"
            onClick={() => setIsAddingMoreArticles(!isAddingMoreArticles)}
          >
            Agregar mas productos
          </Button>
        </Stack>
        {!isAddingMoreArticles ? <TableComponent /> : <AddMoreArticlesTable />}
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "sticky",
            bottom: 0,
            zIndex: 1, // Ensures it stays above other content
            backgroundColor: "white",
            pb: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              !isAddingMoreArticles
                ? open(false)
                : setIsAddingMoreArticles(false)
            }
          >
            {!isAddingMoreArticles ? "Cancelar" : "Atrás"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!isAddingMoreArticles && step === 0) {
                open(false);
                Alert();
              } else if (isAddingMoreArticles && step === 0) {
                setTimeout(() => {
                  setIsAddingMoreArticles(false);
                }, 1000);
              } else {
                null;
              }
            }}
          >
            {!isAddingMoreArticles && step === 0
              ? "Siguiente"
              : isAddingMoreArticles && step === 0
              ? "Agregar artículos"
              : "Enviar solicitud"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const TableComponent = () => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>
                <Tooltip title="Eliminar">
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const AddMoreArticlesTable = () => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data2.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>
                <Tooltip title="Eliminar">
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
