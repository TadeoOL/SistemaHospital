import {
  Card,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { RolesChip } from "./RolesChip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { DeleteModal } from "../Modals/DeleteModal";
import { ModifyUserModal } from "../Modals/ModifyUserModal";
import { IUser, IUserSettings } from "../../../types/types";

const users = [
  {
    id: "1",
    nombre: "Fernando",
    apellidoPaterno: "Perez",
    apellidoMaterno: "Juarez",
    telefono: "6623231234",
    email: "juan.perez@gmail.com",
    roles: ["farmacia", "programacion", "farmacia", "farmacia", "farmacia"],
  },
  {
    id: "2",
    nombre: "Gerardo",
    apellidoPaterno: "Luna",
    apellidoMaterno: "Suarez",
    telefono: "6623231234",
    email: "gerardo.luna@gmail.com",
    roles: ["farmacia"],
  },
];

export const UsersTable = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  return (
    <>
      <Card sx={{ display: "flex" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Correo Electronico</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Modificacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.apellidoMaterno}</TableCell>
                <TableCell>
                  {user.apellidoPaterno + " " + user.apellidoMaterno}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RolesChip user={user} />
                </TableCell>
                <TableCell>{user.telefono}</TableCell>
                <TableCell>
                  <Stack sx={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setUserData(user);
                        setOpenEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setOpenDeleteModal(true)}
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DeleteModal setOpen={setOpenDeleteModal} />
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <ModifyUserModal user={userData} setOpen={setOpenEditModal} />
      </Modal>
    </>
  );
};
