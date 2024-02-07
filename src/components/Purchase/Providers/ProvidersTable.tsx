import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
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
import { useCallback, useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { ModifyProviderModal } from "./Modal/ModifyProviderModal";
import { ProvidersInfoModal } from "./Modal/ProvidersInfoModal";
import { useProviderPagination } from "../../../store/purchaseStore/providerPagination";
import { shallow } from "zustand/shallow";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { disableProvider } from "../../../api/api.routes";

const useDisableProvider = () => {
  const { setHandleChangeProvider, enabled, handleChangeProvider } =
    useProviderPagination(
      (state) => ({
        setHandleChangeProvider: state.setHandleChangeProvider,
        enabled: state.enabled,
        handleChangeProvider: state.handleChangeProvider,
      }),
      shallow
    );

  const disableProviderModal = (userId: string) => {
    withReactContent(Swal)
      .fire({
        title: "Estas seguro?",
        text: `Estas a punto de ${
          enabled ? "deshabilitar" : "habilitar"
        } un proveedor`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Si, ${enabled ? "deshabilitalo!" : "habilitalo!"}`,
        confirmButtonColor: "red",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableProvider(userId);
            setHandleChangeProvider(!handleChangeProvider);
            withReactContent(Swal).fire({
              title: `${enabled ? "Deshabilitado!" : "Habilitado!"}`,
              text: `El proveedor se ha ${
                enabled ? "deshabilitado" : "habilitado"
              }`,
              icon: "success",
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: "Error!",
              text: `No se pudo ${
                enabled ? "deshabilitar" : "habilitar"
              } al proveedor`,
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          withReactContent(Swal).fire({
            title: "Cancelado",
            icon: "error",
          });
        }
      });
  };

  return disableProviderModal;
};

export const ProvidersTable = () => {
  const disableProviderModal = useDisableProvider();
  const [providerId, setProviderId] = useState<string>("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const {
    pageIndex,
    pageSize,
    count,
    fetchProviders,
    search,
    enabled,
    data,
    setPageSize,
    setPageIndex,
    isLoading,
    handleChangeProvider,
  } = useProviderPagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchProviders: state.fetchProviders,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeProvider: state.handleChangeProvider,
    }),
    shallow
  );

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

  const handlePageChange = useCallback((event: any, value: any) => {
    setPageIndex(value);
  }, []);

  useEffect(() => {
    fetchProviders(pageIndex, pageSize, search, enabled);
  }, [pageIndex, pageSize, search, enabled, handleChangeProvider]);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre compañía</TableCell>
              <TableCell>Nombre contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell></TableCell>
              {/* <TableCell /> */}
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
                    correoElectronico,
                    telefono,
                  } = provider;

                  return (
                    <TableRow
                      key={id}
                      onClick={() => {
                        setOpenInfoModal(true);
                        setProviderId(provider.id);
                      }}
                      sx={{
                        "&:hover": { cursor: "pointer", bgcolor: "whitesmoke" },
                      }}
                    >
                      <TableCell>{nombreCompania}</TableCell>
                      <TableCell>{nombreContacto}</TableCell>
                      <TableCell>{telefono}</TableCell>
                      <TableCell>{correoElectronico}</TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            sx={{ color: "neutral.700" }}
                            onClick={(e) => {
                              setProviderId(provider.id);
                              setOpenEditModal(true);
                              e.stopPropagation();
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={enabled ? "Deshabilitar" : "Habilitar"}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              disableProviderModal(provider.id);
                              e.stopPropagation();
                            }}
                          >
                            {enabled ? (
                              <RemoveCircleIcon sx={{ color: "red" }} />
                            ) : (
                              <CheckIcon sx={{ color: "green" }} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        {isLoading && (
          <Box
            sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}
          >
            <CircularProgress />
          </Box>
        )}
        {data.length === 0 && !isLoading && (
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
        )}
        {
          <TablePagination
            component="div"
            count={count}
            onPageChange={() => {
              handlePageChange;
            }}
            onRowsPerPageChange={(e: any) => {
              setPageSize(e.target.value);
            }}
            page={pageIndex}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        }
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyProviderModal
            providerId={providerId}
            setOpen={setOpenEditModal}
          />
        </div>
      </Modal>
      <Modal open={openInfoModal} onClose={() => setOpenInfoModal(false)}>
        <div>
          <ProvidersInfoModal
            setOpen={setOpenInfoModal}
            providerId={providerId}
          />
        </div>
      </Modal>
    </>
  );
};
