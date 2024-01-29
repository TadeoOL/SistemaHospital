import {
  Box,
  Button,
  Collapse,
  Divider,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { UsersTable } from "./SubComponents/UsersTable";
import { useState } from "react";
import { AddUserModal } from "./Modals/AddUserModal";
import { SearchBar } from "../Inputs/SearchBar";
import { useUserPaginationStore } from "../../store/userPagination";
import { disableUser } from "../../api/api.routes";
import { shallow } from "zustand/shallow";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const useDisableManyUsersModal = () => {
  const { setUserDisabled, setIsChecked } = useUserPaginationStore(
    (state) => ({
      setUserDisabled: state.setUserDisabled,
      setIsChecked: state.setIsChecked,
    }),
    shallow
  );

  const disableUserModal = (
    usersArrayIds: string[],
    stateEnabled: boolean,
    userDisabled: boolean
  ) => {
    withReactContent(Swal)
      .fire({
        title: "Estas seguro?",
        text: `Estas a punto de ${
          stateEnabled ? "deshabilitar" : "habilitar"
        } varios usuarios`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Si, ${
          stateEnabled ? "Deshabilitalos!" : "Habilitalos!"
        }`,
        confirmButtonColor: "red",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            for (const userId of usersArrayIds) {
              await disableUser(userId);
            }
            setIsChecked([]);
            setUserDisabled(!userDisabled);
            withReactContent(Swal).fire({
              title: `${stateEnabled ? "Deshabilitado!" : "Habilitado!"}`,
              text: `Los usuarios se han ${
                stateEnabled ? "deshabilitado" : "habilitado"
              }`,
              icon: "success",
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: "Error!",
              text: `No se pudo ${
                stateEnabled ? "deshabilitar" : "habilitar"
              } los usuarios`,
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

  return disableUserModal;
};

export const AccountAdminUsers = () => {
  const disableManyUsersModal = useDisableManyUsersModal();
  const search = useUserPaginationStore((state) => state.searchPagination);
  const [openAddModal, setOpenAddModal] = useState(false);
  const { enabled, setEnabled, userDisabled, isChecked } =
    useUserPaginationStore(
      (state) => ({
        enabled: state.enabled,
        setEnabled: state.setEnabled,
        userDisabled: state.userDisabled,
        isChecked: state.isChecked,
      }),
      shallow
    );

  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
          mt: 4,
          bgcolor: "white",
          overflowX: "auto",
        }}
      >
        <Stack sx={{ display: "flex", flex: 1, minWidth: { xs: 950, xl: 0 } }}>
          <Stack
            sx={{
              p: 2,
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={700} fontSize={24}>
              {enabled ? "Usuarios" : "Usuarios deshabilitados"}
            </Typography>
            <Stack sx={{ flexDirection: "row", display: "flex", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
              >
                {enabled
                  ? "Mostrar usuarios deshabilitados"
                  : "Mostrar usuarios habilitados"}
              </Button>
              <Button
                onClick={() => setOpenAddModal(true)}
                variant="contained"
                startIcon={<AddCircleOutlinedIcon />}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>
          <SearchBar title="Busca al usuario..." searchState={search} />
          <Collapse in={isChecked.length !== 0}>
            <Box sx={{ pr: 2, pt: 2 }}>
              {enabled ? (
                <Button
                  onClick={() =>
                    disableManyUsersModal(isChecked, enabled, userDisabled)
                  }
                  variant="contained"
                  sx={{
                    bgcolor: "red",
                    "&:hover": { backgroundColor: "#9A031E" },
                  }}
                >
                  Deshabilitar usuarios seleccionados ({isChecked.length})
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    disableManyUsersModal(isChecked, enabled, userDisabled)
                  }
                  variant="contained"
                  sx={{
                    bgcolor: "green",
                    "&:hover": { backgroundColor: "#004225" },
                  }}
                >
                  Habilitar usuarios seleccionados ({isChecked.length})
                </Button>
              )}
            </Box>
          </Collapse>
          <Divider sx={{ my: 2 }} />
          <UsersTable />
        </Stack>
      </Box>

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <div>
          <AddUserModal setOpen={setOpenAddModal} />
        </div>
      </Modal>
    </>
  );
};
