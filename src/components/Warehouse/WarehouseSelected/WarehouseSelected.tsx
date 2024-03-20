import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IWarehouseData } from "../../../types/types";
import { getWarehouseById } from "../../../api/api.routes";
import { Box } from "@mui/system";
import LoadingView from "../../../views/LoadingView/LoadingView";
import {
  Button,
  Card,
  Checkbox,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { WarehouseTabs } from "./WarehouseTabs";

const useGetWarehouseSelected = (warehouseId: string | undefined) => {
  const [warehouseData, setWarehouseData] = useState<IWarehouseData>();
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  useEffect(() => {
    if (!warehouseId) return;
    const fetch = async () => {
      try {
        const warehouse = await getWarehouseById(warehouseId);
        setWarehouseData(warehouse);
      } catch (error) {
        console.log("error");
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, [warehouseId]);
  return { warehouseData, isLoadingWarehouse };
};

const WarehouseSelected = () => {
  const { warehouseId } = useParams();
  console.log({ warehouseId });
  const { isLoadingWarehouse, warehouseData } =
    useGetWarehouseSelected(warehouseId);
  console.log({ warehouseData });

  if (isLoadingWarehouse) return <LoadingView />;
  const { nombre } = warehouseData as IWarehouseData;

  return (
    <Stack>
      <Typography variant="h2">{nombre}</Typography>
      <Stack sx={{ bgcolor: "background.paper" }}>
        <WarehouseTabs />
        <Box sx={{ display: "flex", flex: 1 }}>
          Filtros
          <Button>Salida de articulos</Button>
        </Box>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>Nombre articulo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio de compra</TableCell>
                  <TableCell>Precio de venta</TableCell>
                  <TableCell>Stock mínimo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Card>
      </Stack>
    </Stack>
  );
};
export default WarehouseSelected;
