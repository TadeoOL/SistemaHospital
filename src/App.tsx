import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/DashboardView";
import { ProtectedRoute } from "./utils/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
        <Route path="/"element={<DashboardView />}  />
        </Route>
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
