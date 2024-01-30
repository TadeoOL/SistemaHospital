import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import { IProvider } from "../../../types/types";
import { ModifyProviderModal } from "./Modal/ModifyProviderModal";

const data: IProvider[] = [
  {
    id: "1",
    nombreCompania: "Bimbo",
    nombreContacto: "Juan Perez",
    puesto: "Encargado de ventas",
    direccion: "Garcia Morales #34",
    telefono: "662452363",
    email: "Bimbo@gmail.com",
  },
];

const enabled = true;
const isLoading = false;

export const ProvidersTable = () => {
  const [providerData, setProviderData] = useState<IProvider | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // const handlePageChange = useCallback((event: any, value: any) => {
  //   setPageIndex(value);
  // }, []);

  // const handleUserChecked = (e: any) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setIsChecked([...isChecked, value]);
  //   } else {
  //     setIsChecked(isChecked.filter((item) => item !== value));
  //   }
  // };

  // const handleIsUserChecked = (userId: string) => {
  //   if (isChecked.some((user) => user === userId)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  return (
    <>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nombre compañia</TableCell>
              <TableCell>Nombre contacto</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo electronico</TableCell>
              <TableCell>Modificación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
              ? null
              : data.map((provider) => {
                  const {
                    id,
                    nombreCompania,
                    nombreContacto,
                    puesto,
                    direccion,
                    email,
                    telefono,
                  } = provider;
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <Checkbox value={id} onChange={() => {}} />
                      </TableCell>
                      <TableCell>{nombreCompania}</TableCell>
                      <TableCell>{nombreContacto}</TableCell>
                      <TableCell>{puesto}</TableCell>
                      <TableCell>{telefono}</TableCell>
                      <TableCell>{direccion}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>
                        <Stack sx={{ display: "flex", flexDirection: "row" }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: "neutral.700" }}
                              onClick={() => {
                                setProviderData(provider);
                                setOpenEditModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={enabled ? "Deshabilitar" : "Habilitar"}
                          >
                            <IconButton size="small" onClick={() => {}}>
                              {enabled ? (
                                <RemoveCircleIcon sx={{ color: "red" }} />
                              ) : (
                                <CheckIcon sx={{ color: "green" }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        {/* {isLoading && (
          <Box
            sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}
          >
            <CircularProgress />
          </Box>
        )} */}
        {/* {data.length === 0 && !isLoading && (
          <Card
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              columnGap: 1,
            }}
          >
            <ErrorOutlineIcon
              sx={{ color: "neutral.400", width: "40px", height: "40px" }}
            />
            <Typography
              sx={{ color: "neutral.400" }}
              fontSize={24}
              fontWeight={500}
            >
              No existen registros
            </Typography>
          </Card>
        )} */}
        {/* <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(e: any) => {
            setResultByPage(e.target.value);
          }}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
        /> */}
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyProviderModal provider={providerData} />
        </div>
      </Modal>
    </>
  );
};
