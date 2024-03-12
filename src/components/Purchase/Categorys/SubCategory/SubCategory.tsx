import { Box, Button, Divider, Modal, Stack } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { useState } from "react";
import { SubCategoryTable } from "./SubCategoryTable";
import { AddSubCategoryModal } from "./Modal/AddSubCategoryModal";
import { useSubCategoryPagination } from "../../../../store/purchaseStore/subCategoryPagination";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

export const SubCategory = () => {
  const [open, setOpen] = useState(false);
  const { enabled, setSearch, setEnabled } = useSubCategoryPagination(
    (state) => ({
      enabled: state.enabled,
      setSearch: state.setSearch,
      setEnabled: state.setEnabled,
    })
  );

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
            {/* <Typography fontWeight={700} fontSize={24}>
              {enabled ? "Sub categorías" : "Sub categorías deshabilitadas"}
            </Typography> */}
            <SearchBar
              title="Busca la sub categoría..."
              searchState={setSearch}
              sx={{ width: "30%" }}
            />
            <Divider sx={{ my: 1 }} />
            <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
                startIcon={<ClassOutlinedIcon />}
              >
                {enabled
                  ? "Mostrar sub categorías deshabilitadas"
                  : "Mostrar sub categorías habilitados"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlinedIcon />}
                onClick={() => setOpen(!open)}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>
          <SubCategoryTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddSubCategoryModal open={setOpen} />
        </div>
      </Modal>
    </>
  );
};
