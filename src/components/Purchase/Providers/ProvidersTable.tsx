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
import { useCallback, useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { ModifyProviderModal } from "./Modal/ModifyProviderModal";
import { ProvidersInfoModal } from "./ProvidersInfoModal";
import { useProviderPagination } from "../../../store/purchaseStore/providerPagination";
import { shallow } from "zustand/shallow";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const ProvidersTable = () => {
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
    updatedProvider,
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
      updatedProvider: state.updatedProvider,
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
  }, [pageIndex, pageSize, search, enabled, updatedProvider]);

  return (
    <>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nombre compañía</TableCell>
              <TableCell>Nombre contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell />
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
                      }}
                      sx={{
                        "&:hover": { cursor: "pointer", bgcolor: "whitesmoke" },
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          value={id}
                          onChange={() => {}}
                        />
                      </TableCell>
                      <TableCell>{nombreCompania}</TableCell>
                      <TableCell>{nombreContacto}</TableCell>
                      <TableCell>{telefono}</TableCell>
                      <TableCell>{correoElectronico}</TableCell>
                      <TableCell>
                        <Stack sx={{ display: "flex", flexDirection: "row" }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: "neutral.700" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setProviderId(provider.id);
                                setOpenEditModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={enabled ? "Deshabilitar" : "Habilitar"}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
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
                        </Stack>
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
