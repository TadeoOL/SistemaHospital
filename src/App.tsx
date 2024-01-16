import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/DashboardView";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="login" element={<LoginView />} />

          <Route path="dashboard" element={<DashboardView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
