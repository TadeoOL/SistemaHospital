import {
  Box,
  Card,
  CircularProgress,
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
import { useCallback, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ITableComponente {
  fetchDataHook: () => {
    data: any[];
    count: number;
    pageSize: number;
    pageIndex: number;
    isLoading: boolean;
    enabled: boolean;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
  };
  disableHook: (id: string) => void;
  modifyModalComponent: (props: {
    data: string;
    open: (isOpen: boolean) => void;
  }) => React.ReactElement;
}

export const TableComponent = (props: ITableComponente) => {
  const { fetchDataHook, disableHook, modifyModalComponent } = props;
  const {
    data,
    count,
    pageIndex,
    pageSize,
    isLoading,
    enabled,
    setPageIndex,
    setPageSize,
  } = fetchDataHook();
  const [dataId, setDataId] = useState("");
  const [open, setOpen] = useState(false);

  const handlePageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
      setPageIndex(value);
    },
    []
  );

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
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
              ? null
              : data.map((item) => {
                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => {}}
                      sx={{
                        "&:hover": { cursor: "pointer", bgcolor: "whitesmoke" },
                      }}
                    >
                      {Object.keys(item).map((key, index) => {
                        if (key === "id") {
                          return null;
                        } else {
                          return (
                            <TableCell key={index}>{item[key]} </TableCell>
                          );
                        }
                      })}
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
                    </TableRow>
                  );
                })}
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
        {
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
        }
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>{modifyModalComponent({ data: dataId, open: setOpen })}</div>
      </Modal>
    </>
  );
};
