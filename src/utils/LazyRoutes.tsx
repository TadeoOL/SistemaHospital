import { lazy } from 'react';

export const Dashboard = lazy(() => import('../views/Layout/DashboardView'));
export const PurchaseRequest = lazy(() => import('../views/Purchase/PurchaseRequestView'));
export const ArticleView = lazy(() => import('../views/Purchase/ArticleView'));
export const Article = lazy(() => import('../components/Purchase/Articles/Article/Article'));
export const ExistingArticle = lazy(() => import('../components/Purchase/Articles/ExistingArticle/ExistingArticle'));
export const CategoryView = lazy(() => import('../views/Purchase/CategoryView'));
export const Category = lazy(() => import('../components/Purchase/Categorys/Category/Category'));
export const SubCategory = lazy(() => import('../components/Purchase/Categorys/SubCategory/SubCategory'));
export const ProvidersView = lazy(() => import('../views/Purchase/ProvidersView'));
export const WarehouseView = lazy(() => import('../views/Purchase/WarehouseView'));
export const PurchaseAuthorizationView = lazy(() => import('../views/Purchase/PurchaseAuthorizationView'));
export const PurchaseConfigView = lazy(() => import('../views/Purchase/PurchaseConfigView'));
export const AccountView = lazy(() => import('../views/AccountView'));
export const WarehouseSelected = lazy(() => import('../components/Warehouse/WarehouseSelected/WarehouseSelected'));
export const PointOfSaleView = lazy(() => import('../views/Pharmacy/PointOfSaleView'));
export const NurseRequestView = lazy(() => import('../views/Pharmacy/NurseRequestView'));
export const PackageCatalogueView = lazy(() => import('../views/Pharmacy/PackageCatalogueView'));
export const PharmacyConfigView = lazy(() => import('../views/Pharmacy/PharmacyConfigView'));
export const SellsHistoryView = lazy(() => import('../views/Pharmacy/SellsHistoryView'));
export const PointOfSaleCheckoutView = lazy(() => import('../views/Checkout/PointOfSaleCheckoutView'));
export const ReceiptEmitterView = lazy(() => import('../views/Checkout/ReceiptEmitterView'));
export const ConfigEmitterUsersView = lazy(() => import('../views/Checkout/ConfigEmitterUsersView'));
export const CloseCheckoutHistoryView = lazy(() => import('../views/Checkout/CloseCheckoutHistoryView'));
export const CloseCheckoutView = lazy(() => import('../views/Checkout/CloseCheckoutView'));
export const ProgrammingRegisterView = lazy(() => import('../views/Programming/ProgrammingRegisterView'));
export const RoomsView = lazy(() => import('../views/Programming/RoomsView'));
export const SurgeryProcedureView = lazy(() => import('../views/Programming/SurgeryProcedureView'));
export const ProgrammingCalendarView = lazy(() => import('../views/Programming/ProgrammingCalendarView'));
export const ConfigurationProgrammingView = lazy(() => import('../views/Programming/ConfigurationProgrammingView'));
export const ProgrammingRequestView = lazy(() => import('../views/Programming/ProgrammingRequestView'));
export const BiomedicalEquipmentView = lazy(() => import('../views/Hospitalization/BiomedicalEquipmentView'));
export const AnesthesiologistView = lazy(() => import('../views/Hospitalization/AnesthesiologistView'));
export const XRayView = lazy(() => import('../views/Hospitalization/XRayView'));
export const XRayRequestView = lazy(() => import('../views/Hospitalization/XRayRequestView'));
export const XRayRequestManagementView = lazy(() => import('../views/Hospitalization/XRayRequestManagementView'));
export const PatientAcountsView = lazy(() => import('../views/Hospitalization/PatientAcountsView'));
export const HospitalizationConfigView = lazy(() => import('../views/Hospitalization/HospitalizationConfigView'));
export const MedicView = lazy(() => import('../views/Hospitalization/MedicView'));
export const MedicalShiftView = lazy(() => import('../views/Hospitalization/MedicalShiftView'));
export const AnesthesiologistShiftView = lazy(() => import('../views/Hospitalization/AnesthesiologistShiftView'));
export const OperatingRoomView = lazy(() => import('../views/OperatingRoom/OperatingRoomView'));
export const TypesRoomView = lazy(() => import('../views/Programming/TypesRoomView'));
export const DailyOperatingView = lazy(() => import('../views/OperatingRoom/DailyOperatingView'));
export const RecoveryRoomsView = lazy(() => import('../views/OperatingRoom/RecoveryRoomsView'));
export const HospitalRoomsView = lazy(() => import('../views/Hospitalization/HospitalRoomsView'));
export const AssignedRoomsView = lazy(() => import('../views/Hospitalization/AssignedRoomsView'));
export const HospitalRoomsCalendarView = lazy(() => import('../views/Hospitalization/HospitalRoomsCalendarView'));
export const PacientsEntryView = lazy(() => import('../views/Admission/PacientsEntryView'));
export const RequestsConfigView = lazy(() => import('../views/Hospitalization/RequestsConfigView'));
export const InvoiceView = lazy(() => import('../views/Invoice/InvoiceView'));
