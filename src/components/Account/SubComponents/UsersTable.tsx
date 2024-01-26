import {
  Card,
  Checkbox,
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
import { RolesChip } from "./RolesChip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useEffect, useState } from "react";
import { ModifyUserModal } from "../Modals/ModifyUserModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useUserPaginationStore } from "../../../store/userPagination";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { disableUser } from "../../../api/api.routes";
import { useAuthStore } from "../../../store/auth";

// interface IUsersData {
//   id: string;
//   nombre: string;
//   apellidoPaterno: string;
//   apellidoMaterno: string;
//   telefono: string;
//   email: string;
//   roles: string[];
// }

export const UsersTable = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const profile = useAuthStore((state) => state.profile);
  const fetchData = useUserPaginationStore((state) => state.fetchData);
  const data = useUserPaginationStore((state) => state.data);
  const pageSize = useUserPaginationStore((state) => state.pageSize);
  const enabled = useUserPaginationStore((state) => state.enabled);
  const search = useUserPaginationStore((state) => state.search);
  const setPageIndex = useUserPaginationStore((state) => state.setPageIndex);
  const pageIndex = useUserPaginationStore((state) => state.pageIndex);
  const count = useUserPaginationStore((state) => state.count);
  const setResultByPage = useUserPaginationStore(
    (state) => state.setResultByPage
  );
  const setUserDisabled = useUserPaginationStore(
    (state) => state.setUserDisabled
  );
  const newUser = useUserPaginationStore((state) => state.newUser);

  const userDisabled = useUserPaginationStore((state) => state.userDisabled);

  const handlePageChange = useCallback((event: any, value: any) => {
    setPageIndex(value);
  }, []);

  useEffect(() => {
    fetchData(pageSize, search, enabled, pageIndex);
  }, [pageSize, enabled, search, pageIndex, userDisabled, profile, newUser]);

  const deleteModal = (userId: string) => {
    withReactContent(Swal)
      .fire({
        title: "Estas seguro?",
        text: "Estas a punto de deshabilitar un usuario",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, deshabilitalo!",
        confirmButtonColor: "red",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableUser(userId);
            setUserDisabled(userId);
            withReactContent(Swal).fire({
              title: "Deshabilitado!",
              text: "El usuario se ha deshabilitado",
              icon: "success",
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: "Error!",
              text: "No se pudo deshabilitar el usuario",
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

  return (
    <>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Correo Electronico</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Modificacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : data.map((user) => (
                  <TableRow key={user?.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{user?.nombre}</TableCell>
                    <TableCell>
                      {user?.apellidoPaterno + " " + user?.apellidoMaterno}
                    </TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>
                      <RolesChip user={user} />
                    </TableCell>
                    <TableCell>{user?.telefono}</TableCell>
                    <TableCell>
                      <Stack sx={{ display: "flex", flexDirection: "row" }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setUserData(user);
                              setOpenEditModal(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => {
                              deleteModal(user.id);
                            }}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {data.length === 0 && (
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
        <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(e: any) => {
            setResultByPage(e.target.value);
          }}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyUserModal user={userData} setOpen={setOpenEditModal} />
        </div>
      </Modal>
    </>
  );
};
