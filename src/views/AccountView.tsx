import { Box } from "@mui/material";
import { AccountCard } from "../components/Account/AccountCard";
import { AccountAdminUsers } from "../components/Account/AccountAdminUsers";
import { useAuthStore } from "../store/auth";

export const AccountView = () => {
  const user = useAuthStore((state) => state.profile);
  console.log({ user });
  const isAdmin = user?.roles.find((role) => role === "ADMIN");
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AccountCard />
      {isAdmin ? <AccountAdminUsers /> : null}
    </Box>
  );
};
