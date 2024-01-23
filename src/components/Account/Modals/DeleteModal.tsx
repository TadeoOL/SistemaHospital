import { Box, Button, Stack, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flex: 1,
};

interface IDeleteModal {
  setOpen: Function;
}

export const DeleteModal = (props: IDeleteModal) => {
  const { setOpen } = props;
  return (
    <Box sx={style}>
      <Stack spacing={4} sx={{ display: "flex", flex: 1 }}>
        <Stack sx={{ display: "flex", alignItems: "center" }}>
          <WarningIcon sx={{ color: "red", width: "54px", height: "54px" }} />
          <Typography fontSize={20} fontWeight={700}>
            ¿Estas seguro que deseas borrar el usuario?
          </Typography>
          <Typography fontSize={14} fontWeight={400}>
            Esta accion eliminara al usuario para siempre.
          </Typography>
        </Stack>
        <Stack
          sx={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            columnGap: 2,
            display: "flex",
            flex: 1,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "red",
                "&:hover": { bgcolor: "#DC0000" },
              }}
            >
              Si, Eliminar
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};
