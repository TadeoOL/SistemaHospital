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
    nombre: "Paracetamol",
    compania: "ASCII",
    nombreGenerico: "5",
    cantidad: "17",
  },
];
const enabled = true;
const isLoading = false;

export const RequestedMedicineTable = () => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nombre</TableCell>
            <TableCell>Compañía</TableCell>
            <TableCell>Nombre genérico</TableCell>
            <TableCell>Cantidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((drug) => {
            const { id, compania, cantidad, nombre, nombreGenerico } = drug;
            return (
              <TableRow key={id}>
                <TableCell>
                  <Checkbox value={id} onChange={() => {}} />
                </TableCell>
                <TableCell>{nombre}</TableCell>
                <TableCell>{compania}</TableCell>
                <TableCell>{nombreGenerico}</TableCell>
                <TableCell>{cantidad}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
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
