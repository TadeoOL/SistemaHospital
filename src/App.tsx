import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/DashboardView";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { PharmacyView } from "./views/Pharmacy/PharmacyView";
import { WarehouseView } from "./views/Pharmacy/WarehouseView";
import { ScheduleView } from "./views/Schedule/ScheduleView";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/farmacia" element={<PharmacyView />} />
          <Route path="/farmacia/almacen" element={<WarehouseView />} />
          <Route
            path="/programacion/agenda-quirofano"
            element={<ScheduleView />}
          />
        </Route>
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
