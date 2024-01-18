import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { IModuleItems } from "../types/types";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

export const ModuleItems: IModuleItems[] = [
  {
    title: "Farmacia",
    path: "/farmacia",
    childrenItems: [
      {
        title: "Almacen",
        path: "/farmacia/almacen",
        icon: <WarehouseIcon />,
      },
    ],
    icon: <LocalHospitalIcon />,
  },
  {
    title: "Programacion",
    path: "/programacion",
    childrenItems: [
      {
        title: "Agenda Quirofano",
        path: "/programacion/agenda-quirofano",
        icon: <MonitorHeartIcon />,
      },
    ],
    icon: <AssignmentIcon />,
  },
];
