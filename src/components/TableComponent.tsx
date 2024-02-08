import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import React, { useCallback, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ArticleProvidersTable } from "./Purchase/Articles/Article/SubComponent/ArticleProviderPriceTable";

interface ITableComponentProps {
  fetchDataHook: (isArticleProvider: boolean) => {
    data?: any[];
    count?: number;
    pageSize?: number;
    pageIndex?: number;
    isLoading?: boolean;
    enabled?: boolean;
    setPageIndex?: (index: number) => void;
    setPageSize?: (size: number) => void;
  };
  disableHook: (id: string) => void;
  modifyModalComponent: (props: {
    data: string;
    open: (isOpen: boolean) => void;
  }) => React.ReactElement;
  isArticle?: boolean;
  isArticleProvider?: boolean;
  addProvider?: () => void;
}

export const TableComponent: React.FC<ITableComponentProps> = ({
  fetchDataHook,
  disableHook,
  modifyModalComponent,
  isArticle = false,
  isArticleProvider = false,
  addProvider,
}) => {
  const [dataId, setDataId] = useState("");
  const [open, setOpen] = useState(false);
  const [openArticle, setOpenArticle] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handlePageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
      setPageIndex(value);
    },
    []
  );

  const handleCollapseToggle = (itemId: string) => {
    setCollapseOpen((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  let fetchHookDataParams: boolean = false;
  let fetchDataHookResult: any = {};
  if (isArticleProvider) {
    fetchHookDataParams = true;
    fetchDataHookResult = fetchDataHook(fetchHookDataParams);
  } else {
    fetchDataHookResult = fetchDataHook(false);
  }

  const {
    data = [],
    count = 0,
    pageIndex = 0,
    pageSize = 0,
    isLoading = false,
    enabled = false,
    setPageIndex = () => {},
    setPageSize = () => {},
  } = fetchDataHookResult;

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {data.length > 0 &&
                Object.keys(data[0])
                  .filter((key) => key !== "id")
                  .map((key, index) => (
                    <TableCell key={index}>{key}</TableCell>
                  ))}
              <TableCell />
              {isArticle && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
              ? null
              : data.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <TableRow
                      onClick={() => {}}
                      sx={{
                        "&:hover": { cursor: "pointer", bgcolor: "whitesmoke" },
                      }}
                    >
                      {Object.keys(item).map(
                        (key, index) =>
                          key !== "id" && (
                            <TableCell key={index}>{item[key]}</TableCell>
                          )
                      )}
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            sx={{ color: "neutral.700" }}
                            onClick={(e) => {
                              setDataId(item.id);
                              setOpen(true);
                              e.stopPropagation();
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={enabled ? "Deshabilitar" : "Habilitar"}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              disableHook(item.id);
                              e.stopPropagation();
                            }}
                          >
                            {enabled ? (
                              <RemoveCircleIcon sx={{ color: "red" }} />
                            ) : (
                              <CheckIcon sx={{ color: "green" }} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      {isArticle && (
                        <TableCell>
                          <Tooltip title="Proveedores">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleCollapseToggle(item.id);
                              }}
                            >
                              {!collapseOpen[item.id] ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <KeyboardArrowUpIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                    {isArticle && (
                      <TableRow>
                        <Collapse in={collapseOpen[item.id]} unmountOnExit>
                          <ArticleProvidersTable />
                        </Collapse>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
          </TableBody>
        </Table>
        {isLoading && (
          <Box
            sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}
          >
            <CircularProgress />
          </Box>
        )}
        {data.length === 0 && !isLoading && (
          <Card
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              columnGap: 1,
            }}
          >
            <ErrorOutlineIcon
              sx={{ color: "neutral.400", width: "40px", height: "40px" }}
            />
            <Typography
              sx={{ color: "neutral.400" }}
              fontSize={24}
              fontWeight={500}
            >
              No existen registros
            </Typography>
          </Card>
        )}
        {!isArticleProvider && (
          <TablePagination
            component="div"
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={(e: any) => {
              setPageSize(e.target.value);
            }}
            page={pageIndex}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>{modifyModalComponent({ data: dataId, open: setOpen })}</div>
      </Modal>
      {isArticle && (
        <Modal open={openArticle} onClose={() => setOpenArticle(false)}>
          <div></div>
        </Modal>
      )}
    </>
  );
};
