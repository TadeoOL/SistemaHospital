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
  Article,
  ExistingArticle,
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
  ProgrammingRegisterView,
  PatientsEntryView,
  RoomsView,
  SurgeryProcedureView,
  ProgrammingCalendarView,
  // ConfigurationProgrammingView,
  ProgrammingRequestView,
  //BiomedicalEquipmentView,
  AnesthesiologistView,
  XRayView,
  MedicView,
  NurseRequestView,
  MedicalShiftView,
  // AnesthesiologistShiftView,
  OperatingRoomView,
  TypesRoomView,
  DailyOperatingView,
  XRayRequestView,
  XRayRequestManagementView,
  // HospitalizationConfigView,
  RecoveryRoomsView,
  HospitalRoomsView,
  AssignedRoomsView,
  HospitalRoomsCalendarView,
  RequestsConfigView,
  InvoiceView,
  OutstandingBillsView,
  OperatingPackagesView,
  MedicalConsultationView,
  PatientKardexView,
} from './utils/LazyRoutes';
import {
  ProtectedRoutePharmacyDirector,
  ProtectedRoutePharmacyManager,
  ProtectedRoutePharmacyNurse,
} from './utils/functions/ProtectedRoutesForRole/ProtectedRoutePharmacy';
import { CheckoutRoute } from './utils/CheckoutRoute';
import PatientAcountsView from './views/Hospitalization/PatientAcountsView';

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
              <Route path="/compras">
                <Route path="articulos" element={<Article />} />
                <Route path="articulo-existente" element={<ExistingArticle />} />
              </Route>
              <Route path="/compras/">
                <Route path="categorias" element={<Category />} />
                <Route path="subcategorias" element={<SubCategory />} />
              </Route>
              <Route path="/compras/proveedores" element={<ProvidersView />} />
            </Route>
            <Route element={<ProtectedRoutePurchasingDirector />}>
              <Route path="/almacenes" element={<WarehouseView />} />
              <Route path="/compras/autorizacion-compras" element={<PurchaseAuthorizationView />} />
              <Route path="compras/configuracion-compras" element={<PurchaseConfigView />} />
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
              {/*<Route element={<ProtectedRoutePharmacyManager />}>
                <Route path="/farmacia/punto-venta" element={<PointOfSaleView />} />
                <Route path="/farmacia/catalogo" element={<PackageCatalogueView />} />
              </Route>*/}
            </Route>
            <Route element={<CheckoutRoute />}>
              <Route path="ventas/caja" element={<PointOfSaleCheckoutView />} />
              <Route path="ventas/emitir-recibo" element={<ReceiptEmitterView />} />
              <Route path="ventas/configuracion-usuarios" element={<ConfigEmitterUsersView />} />
              <Route path="ventas/historial-cortes" element={<CloseCheckoutHistoryView />} />
              <Route path="ventas/cierre-de-cuenta" element={<PatientAcountsView />} />
              <Route path="ventas/corte-caja" element={<CloseCheckoutView />} />
              // ---------------------------Programacion------------------------------------- //
              <Route path="programacion/registro" element={<ProgrammingRegisterView />} />
              <Route path="programacion/gestion-espacios-hospitalarios" element={<RoomsView />} />
              <Route path="programacion/categorias-espacios-hospitalarios" element={<TypesRoomView />} />
              <Route path="programacion/registro-eventos" element={<ProgrammingCalendarView />} />
              {/* <Route path="programacion/configuracion" element={<ConfigurationProgrammingView />} /> */}
              <Route path="programacion/solicitud-programacion" element={<ProgrammingRequestView />} />
              <Route path="/almacenes/:warehouseId" element={<WarehouseSelected />} />
              <Route path="/configuracion" element={<AccountView />} />
              // ---------------------------Admision------------------------------------- //
              <Route path="admision/ingreso-pacientes" element={<PatientsEntryView />} />
              <Route path="admision/consultas-medicas" element={<MedicalConsultationView />} />
              <Route path="admision/cuentas-pendientes-por-pagar" element={<OutstandingBillsView />} />
            </Route>
            // ------------------------------ Hospitalization-------------------------------- //
            <Route path="hospitalizacion/servicios-solicitud" element={<XRayRequestView />} />
            {/* <Route path="hospitalizacion/guardias-anestesiologos" element={<AnesthesiologistShiftView />} /> */}
            {/* <Route path="hospitalizacion/configuracion-hospitalizacion" element={<HospitalizationConfigView />} /> */}
            <Route path="hospitalizacion/cuartos-hospitalarios" element={<HospitalRoomsView />} />
            <Route path="hospitalizacion/calendario-cuartos-asignados" element={<HospitalRoomsCalendarView />} />
            <Route path="hospitalizacion/configuracion-solicitudes" element={<RequestsConfigView />} />
            <Route element={<ProtectedRoutePharmacyNurse />}>
              <Route path="/hospitalizacion/solicitud-enfermero" element={<NurseRequestView />} />
            </Route>
            // --------------------------------- Budget ------------------------------- // //
            <Route path="presupuestos/guardias-medicos" element={<MedicalShiftView />} />
            // --------------------------------- Nursing ------------------------------- // //
            <Route path="enfermeria/cuartos-hospitalarios-asignados" element={<AssignedRoomsView />} />
            <Route path="enfermeria/kardex-paciente/:id" element={<PatientKardexView />} />
            // --------------------------------- Biomedical ------------------------------- // //
            <Route path="servicios/solicitudes-administracion" element={<XRayRequestManagementView />} />
            <Route path="servicios/configuracion-solicitudes" element={<RequestsConfigView />} />
            <Route path="servicios/solicitudes" element={<XRayView />} />
            --------------------------------- OperatingRoom ------------------------------- //
            <Route path="quirofano/medicos" element={<MedicView />} />
            <Route path="quirofano/anestesiologos" element={<AnesthesiologistView />} />
            <Route path="/quirofano/configuracion" element={<OperatingRoomView />} />
            <Route path="/quirofano/operaciones-del-dia" element={<DailyOperatingView />} />
            <Route path="/quirofano/recuperacion" element={<RecoveryRoomsView />} />
            <Route path="quirofano/procedimientos-cirugia" element={<SurgeryProcedureView />} />
            <Route element={<PharmacyRoute />}>
              <Route path="/quirofano/paquetes-quirurgicos" element={<OperatingPackagesView />} />
            </Route>
            // ---------------------------------------- Invoice ------------------------------//
            <Route path="/facturas" element={<InvoiceView />} />
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
