import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/Layout/DashboardView";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { PharmacyView } from "./views/Pharmacy/PharmacyView";
import { WarehouseView } from "./views/Pharmacy/WarehouseView";
import { ScheduleView } from "./views/Schedule/ScheduleView";
import { Layout } from "./components/Layout/Layout";
import { AccountView } from "./views/AccountView";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/farmacia" element={<PharmacyView />} />
            <Route path="/farmacia/almacen" element={<WarehouseView />} />
            <Route path="/configuracion" element={<AccountView />} />
            <Route
              path="/programacion/agenda-quirofano"
              element={<ScheduleView />}
            />
          </Route>
        </Route>
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
