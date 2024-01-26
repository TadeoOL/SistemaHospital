import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UsersTable } from "./SubComponents/UsersTable";
import { useState } from "react";
import { AddUserModal } from "./Modals/AddUserModal";
import { SearchBar } from "../Inputs/SearchBar";
import { useUserPaginationStore } from "../../store/userPagination";

export const AccountAdminUsers = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const enabled = useUserPaginationStore((state) => state.enabled);
  const setEnabled = useUserPaginationStore((state) => state.setEnabled);

  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
          mt: 4,
          minWidth: { xs: 950, xl: 0 },
        }}
      >
        <Stack sx={{ display: "flex", flex: 1 }}>
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
              Usuarios
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
                startIcon={<AddIcon />}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>
          <SearchBar />
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
