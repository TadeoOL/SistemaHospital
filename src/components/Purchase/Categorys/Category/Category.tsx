import { Box, Button, Divider, Modal, Stack } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { useState } from "react";
import { CategoryTable } from "./CategoryTable";
import { AddCategoryModal } from "./Modal/AddCategoryModal";
import { useCategoryPagination } from "../../../../store/purchaseStore/categoryPagination";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";

export const Category = () => {
  const [open, setOpen] = useState(false);
  const { enabled, setEnabled, setSearch } = useCategoryPagination((state) => ({
    enabled: state.enabled,
    setEnabled: state.setEnabled,
    setSearch: state.setSearch,
  }));

  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          overflowX: "auto",
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            minWidth: { xs: 950, xl: 0 },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
            }}
          >
            <SearchBar
              title="Busca la categoría..."
              searchState={setSearch}
              sx={{ width: "30%" }}
            />
            <Divider sx={{ my: 1 }} />
            {/* <Typography fontWeight={700} fontSize={24}>
							{enabled ? "Categorías" : "Categorías deshabilitadas"}
						</Typography> */}
            <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
                startIcon={<ClassOutlinedIcon />}
              >
                {enabled
                  ? "Mostrar categorías deshabilitadas"
                  : "Mostrar categorías habilitados"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpen(!open)}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>
          <CategoryTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddCategoryModal open={setOpen} />
        </div>
      </Modal>
    </>
  );
};
