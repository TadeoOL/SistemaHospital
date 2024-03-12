import { Box, Button, Divider, Modal, Stack } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { useState } from "react";
import { ExistingArticleTable } from "./ExistingArticleTable";
import { useExistingArticlePagination } from "../../../../store/purchaseStore/existingArticlePagination";
import { AddExistingArticleModal } from "./Modal/AddExistingArticleModal";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

export const ExistingArticle = () => {
  const [open, setOpen] = useState(false);
  const { enabled, setEnabled, setSearch } = useExistingArticlePagination(
    (state) => ({
      enabled: state.enabled,
      setEnabled: state.setEnabled,
      setSearch: state.setSearch,
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
            <SearchBar
              title="Busca el articulo existente..."
              searchState={setSearch}
              sx={{ width: "30%" }}
            />
            <Divider sx={{ my: 1 }} />
            <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
                startIcon={<ArticleOutlinedIcon />}
              >
                {enabled
                  ? "Mostrar artículos existentes deshabilitados"
                  : "Mostrar artículos existentes habilitados"}
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
          <ExistingArticleTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddExistingArticleModal open={setOpen} />
        </>
      </Modal>
    </>
  );
};
