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

const enabled = true;
const isLoading = false;
const data = [
  {
    id: "1",
    articulo: "Ibuprofeno",
    cantidadComprar: "12",
    cantidadStock: "14",
    almacen: "Farmacia",
  },
];

export const AlertArticlesTable = () => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>Articulo</TableCell>
            <TableCell>Cantidad a comprar</TableCell>
            <TableCell>Cantidad de stock</TableCell>
            <TableCell>Almacén</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.articulo}</TableCell>
              <TableCell>{item.cantidadComprar}</TableCell>
              <TableCell>{item.cantidadStock}</TableCell>
              <TableCell>{item.almacen}</TableCell>
            </TableRow>
          ))}
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
