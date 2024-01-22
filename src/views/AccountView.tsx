import { Box } from "@mui/material";
import { AccountCard } from "../components/Account/AccountCard";
import { AccountAdminUsers } from "../components/Account/AccountAdminUsers";
import { useUserInfoStore } from "../store/user";

export const AccountView = () => {
  const user = useUserInfoStore((state) => state.user);
  console.log({ user });
  const isAdmin = user?.roles.find((role) => role === "ADMIN");
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AccountCard />
      {isAdmin ? <AccountAdminUsers /> : null}
    </Box>
  );
};
