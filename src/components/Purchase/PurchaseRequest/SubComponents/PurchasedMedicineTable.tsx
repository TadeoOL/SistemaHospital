import {
  Card,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckIcon from "@mui/icons-material/Check";

const data = [
  {
    id: "1",
    nombreCompania: "2",
    nombreContacto: "3",
    puesto: "4",
    direccion: "5",
    email: "6",
    telefono: "7",
  },
];
const enabled = true;
const isLoading = false;

export const PurchasedMedicineTable = () => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nombre</TableCell>
            <TableCell>Compañía</TableCell>
            <TableCell>Nombre genérico</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody></TableBody>
      </Table>
      {/* {isLoading && (
              <Box
                sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}
              >
                <CircularProgress />
              </Box>
            )} */}
      {/* {data.length === 0 && !isLoading && (
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
            )} */}
      {/* <TablePagination
              component="div"
              count={count}
              onPageChange={handlePageChange}
              onRowsPerPageChange={(e: any) => {
                setResultByPage(e.target.value);
              }}
              page={pageIndex}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
            /> */}
    </Card>
  );
};
