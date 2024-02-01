import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const SuccessForm = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CheckCircleIcon color="success" sx={{ width: 100, height: 100 }} />
      <Typography fontWeight={700} fontSize={20}>
        Información registrada con éxito!
      </Typography>
    </Box>
  );
};
