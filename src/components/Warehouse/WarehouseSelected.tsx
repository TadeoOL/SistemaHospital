import { useParams } from "react-router-dom";

export const WarehouseSelected = () => {
  const warehouseId = useParams();
  return <div>WarehouseSelected</div>;
};
