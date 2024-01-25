import { Box, Container } from "@mui/material";
import { AccountCard } from "../components/Account/AccountCard";
import { AccountAdminUsers } from "../components/Account/AccountAdminUsers";
import { useAuthStore } from "../store/auth";

export const AccountView = () => {
  const user = useAuthStore((state) => state.profile);
  console.log({ user });
  const isAdmin = user?.roles.find((role) => role === "ADMIN");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, py: 4 }}>
      <Container maxWidth={"xl"}>
        <AccountCard />
        {isAdmin ? <AccountAdminUsers /> : null}
      </Container>
    </Box>
  );
};
