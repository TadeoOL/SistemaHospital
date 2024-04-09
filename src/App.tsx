import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { ProtectedRouteSupply } from './utils/functions/ProtectedRoutesForRole/ProtectedRouteSupply';
import { ProtectedRoutePurchasingDirector } from './utils/functions/ProtectedRoutesForRole/ProtectedRoutePurchasingDirector';
import { ProtectedPurchaseRequest } from './utils/functions/ProtectedRoutesForRole/ProtectedPurchaseRequest';
import { LoginView } from './views/LoginView';
import { ScheduleView } from './views/Schedule/ScheduleView';
import { Layout } from './components/Layout/Layout';
import { NotFoundPage } from './views/404Page';
import { LoginRoute } from './utils/LoginRoute';
import { ToastContainer } from 'react-toastify';
import {
  Dashboard,
  PurchaseRequest,
  ArticleView,
  Article,
  ExistingArticle,
  CategoryView,
  Category,
  SubCategory,
  ProvidersView,
  WarehouseView,
  PurchaseAuthorizationView,
  PurchaseConfigView,
  AccountView,
  WarehouseSelected,
} from './utils/LazyRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route element={<ProtectedPurchaseRequest />}>
              <Route path="/compras/solicitud-compras" element={<PurchaseRequest />} />
            </Route>
            <Route element={<ProtectedRouteSupply />}>
              <Route path="/compras/articulos" element={<ArticleView />}>
                <Route path="articulo" element={<Article />} />
                <Route path="articulo-existente" element={<ExistingArticle />} />
              </Route>
              <Route path="/compras/categorias" element={<CategoryView />}>
                <Route path="categoria" element={<Category />} />
                <Route path="subcategoria" element={<SubCategory />} />
              </Route>
              <Route path="/compras/proveedores" element={<ProvidersView />} />
            </Route>
            <Route element={<ProtectedRoutePurchasingDirector />}>
              <Route path="/almacenes" element={<WarehouseView />} />
              <Route path="/compras/autorizacion-compras" element={<PurchaseAuthorizationView />} />
              <Route path="compras/configuracion-compras" element={<PurchaseConfigView />} />
              <Route path="/configuracion" element={<AccountView />} />
            </Route>
            <Route path="/programacion/agenda-quirofano" element={<ScheduleView />} />
            <Route path="/almacenes/:warehouseId" element={<WarehouseSelected />} />
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
