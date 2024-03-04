import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { useState } from "react";
import { ArticleTable } from "./ArticleTable";
import { AddArticleModal } from "./Modal/AddArticleModal";
import { useArticlePagination } from "../../../../store/purchaseStore/articlePagination";

export const Article = () => {
  const [open, setOpen] = useState(false);
  const { enabled, setEnabled, setSearch } = useArticlePagination((state) => ({
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
            <Typography fontWeight={700} fontSize={24}>
              {enabled ? "Artículos" : "Artículos deshabilitados"}
            </Typography>
            <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
              >
                {enabled
                  ? "Mostrar artículos deshabilitados"
                  : "Mostrar artículos habilitados"}
              </Button>
              <Button variant="contained" onClick={() => setOpen(!open)}>
                Agregar
              </Button>
            </Stack>
          </Stack>
          <SearchBar title="Busca el articulo..." searchState={setSearch} />
          <Divider sx={{ my: 1 }} />
          <ArticleTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddArticleModal open={setOpen} />
        </>
      </Modal>
    </>
  );
};
