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
import { PharmacyRoute } from './utils/PharmacyRoute';
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
  PointOfSaleView,
  PackageCatalogueView,
  PharmacyConfigView,
  SellsHistoryView,
  PointOfSaleCheckoutView,
  ReceiptEmitterView,
  ConfigEmitterUsersView,
  CloseCheckoutHistoryView,
  CloseCheckoutView,
} from './utils/LazyRoutes';
import {
  ProtectedRoutePharmacyDirector,
  ProtectedRoutePharmacyManager,
} from './utils/functions/ProtectedRoutesForRole/ProtectedRoutePharmacy';
import { CheckoutRoute } from './utils/CheckoutRoute';

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
            <Route element={<PharmacyRoute />}>
              <Route element={<ProtectedRoutePharmacyDirector />}>
                <Route path="/farmacia/historial-ventas" element={<SellsHistoryView />} />
                <Route path="/farmacia/configuracion-farmacia" element={<PharmacyConfigView />} />
              </Route>
              <Route element={<ProtectedRoutePharmacyManager />}>
                <Route path="/farmacia/punto-venta" element={<PointOfSaleView />} />
                <Route path="/farmacia/catalogo" element={<PackageCatalogueView />} />
              </Route>
            </Route>
            <Route element={<CheckoutRoute />}>
              <Route path="ventas/caja" element={<PointOfSaleCheckoutView />} />
              <Route path="ventas/emitir-recibo" element={<ReceiptEmitterView />} />
              <Route path="ventas/configuracion-usuarios" element={<ConfigEmitterUsersView />} />
              <Route path="ventas/historial-cortes" element={<CloseCheckoutHistoryView />} />
              <Route path="ventas/corte-caja" element={<CloseCheckoutView />} />
            </Route>
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
