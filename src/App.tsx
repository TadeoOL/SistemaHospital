import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/Layout/DashboardView";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { ScheduleView } from "./views/Schedule/ScheduleView";
import { Layout } from "./components/Layout/Layout";
import { AccountView } from "./views/AccountView";
import { NotFoundPage } from "./views/404Page";
import { LoginRoute } from "./utils/LoginRoute";
import { ToastContainer } from "react-toastify";
import { ProvidersView } from "./views/Purchase/ProvidersView";
import { PurchaseRequestView } from "./views/Purchase/PurchaseRequestView";
import { CategoryView } from "./views/Purchase/CategoryView";
import { Category } from "./components/Purchase/Categorys/Category/Category";
import { SubCategory } from "./components/Purchase/Categorys/SubCategory/SubCategory";
import { ArticleView } from "./views/Purchase/ArticleView";
import { Article } from "./components/Purchase/Articles/Article/Article";
import { ExistingArticle } from "./components/Purchase/Articles/ExistingArticle/ExistingArticle";
import { WarehouseView } from "./views/Purchase/WarehouseView";
import { PurchaseAuthorizationView } from "./views/Purchase/PurchaseAuthorizationView";
import { PurchaseRequestCard } from "./components/Purchase/PurchaseRequest/PurchaseRequestCard";
import { WaitAuthPurchase } from "./components/Purchase/PurchaseRequest/WaitAuthPurchase";
import { PurchaseOrderRequest } from "./components/Purchase/PurchaseRequest/PurchaseOrderRequest/PurchaseOrderRequest";
import { PurchaseOrder } from "./components/Purchase/PurchaseRequest/PurchaseOrder/PurchaseOrder";
import { PurchaseConfigView } from "./views/Purchase/PurchaseConfigView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/compras/proveedores" element={<ProvidersView />} />
            <Route
              path="/compras/solicitud-compras"
              element={<PurchaseRequestView />}
            >
              <Route
                path="productos-stock-bajo"
                element={<PurchaseRequestCard />}
              />
              <Route
                path="productos-espera-autorizacion"
                element={<WaitAuthPurchase />}
              />
              <Route
                path="productos-solicitados-orden-compra"
                element={<PurchaseOrderRequest />}
              />
              <Route path="ordenes-compra" element={<PurchaseOrder />} />
            </Route>
            <Route path="/compras/categorias" element={<CategoryView />}>
              <Route path="categoria" element={<Category />} />
              <Route path="subcategoria" element={<SubCategory />} />
            </Route>
            <Route path="/compras/articulos" element={<ArticleView />}>
              <Route path="articulo" element={<Article />} />
              <Route path="articulo-existente" element={<ExistingArticle />} />
            </Route>
            <Route path="/compras/almacen" element={<WarehouseView />} />
            <Route
              path="/compras/autorizacion-compras"
              element={<PurchaseAuthorizationView />}
            />
            <Route path="/farmacia/almacen" element={<WarehouseView />} />
            <Route path="/configuracion" element={<AccountView />} />
            <Route
              path="/programacion/agenda-quirofano"
              element={<ScheduleView />}
            />
            <Route
              path="compras/configuracion-compras"
              element={<PurchaseConfigView />}
            />
          </Route>
        </Route>
        {/* Rutas publicas */}
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
