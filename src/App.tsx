import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/Layout/DashboardView";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { WarehouseView } from "./views/Pharmacy/WarehouseView";
import { ScheduleView } from "./views/Schedule/ScheduleView";
import { Layout } from "./components/Layout/Layout";
import { AccountView } from "./views/AccountView";
import { NotFoundPage } from "./views/404Page";
import { LoginRoute } from "./utils/LoginRoute";
import { ToastContainer } from "react-toastify";
import { ProvidersView } from "./views/Purchase/ProvidersView";
import { PurchaseRequestView } from "./views/Purchase/PurchaseRequestView";
import { RequestedMedicineTable } from "./components/Purchase/PurchaseRequest/SubComponents/RequestedMedicineTable";
import { ToQuoteMedicineTable } from "./components/Purchase/PurchaseRequest/SubComponents/ToQuoteMedicineTable";
import { PurchasedMedicineTable } from "./components/Purchase/PurchaseRequest/SubComponents/PurchasedMedicineTable";
import { CategoryView } from "./views/Purchase/CategoryView";
import { Category } from "./components/Purchase/Categorys/Category/Category";
import { SubCategory } from "./components/Purchase/Categorys/SubCategory/SubCategory";
import { ArticleView } from "./views/Purchase/ArticleView";
import { Article } from "./components/Purchase/Articles/Article/Article";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/compras/proveedores" element={<ProvidersView />} />
            <Route
              path="/compras/solicitud-compras"
              element={<PurchaseRequestView />}
            >
              <Route
                path="productos-solicitados"
                element={<RequestedMedicineTable />}
              />
              <Route
                path="productos-cotizados"
                element={<ToQuoteMedicineTable />}
              />
              <Route
                path="productos-comprados"
                element={<PurchasedMedicineTable />}
              />
            </Route>
            <Route path="/compras/categorias" element={<CategoryView />}>
              <Route path="categoria" element={<Category />} />
              <Route path="subcategoria" element={<SubCategory />} />
            </Route>
            <Route path="/compras/articulos" element={<ArticleView />}>
              <Route path="articulo" element={<Article />} />
              <Route path="articulo-existente" element={<SubCategory />} />
            </Route>
            <Route path="/farmacia/almacen" element={<WarehouseView />} />
            <Route path="/configuracion" element={<AccountView />} />
            <Route
              path="/programacion/agenda-quirofano"
              element={<ScheduleView />}
            />
          </Route>
        </Route>
        <Route element={<LoginRoute />}>
          <Route path="/login" element={<LoginView />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
