import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UsersTable } from "./SubComponents/UsersTable";

export const AccountAdminUsers = () => {
  return (
    <Box
      sx={{
        width: {
          lg: `calc(100% - 180px)`,
          md: `calc(100% - 140px)`,
          sm: `calc(100% - 100px)`,
          xs: `calc(100% -140px)`,
        },
        height: 1,
        boxShadow: 10,
        borderRadius: 2,
        display: "flex",
        flex: 1,
        p: 1,
        ml: { lg: 10, xs: 2 },
        mr: { xs: 2, md: 0 },
        mt: 4,
        mb: 4,
        minWidth: { xs: 850, xl: 0 },
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
          <Button variant="contained" startIcon={<AddIcon />}>
            Agregar
          </Button>
        </Stack>
        <UsersTable />
      </Stack>
    </Box>
  );
};
