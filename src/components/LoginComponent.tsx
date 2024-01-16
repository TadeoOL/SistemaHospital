import {
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// import VisibilityIcon from '@mui/icons-material/Visibility';

export const LoginComponent = () => {
  return (
    <Card sx={{ alignItems: "center" }}>
      <Stack>
        <Typography fontWeight={700} fontSize={18}>
          Inicia sesion en tu cuenta
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                {/* <VisibilityIcon /> */}
              </InputAdornment>
            ),
          }}
        ></TextField>
        <TextField></TextField>
      </Stack>
    </Card>
  );
};
