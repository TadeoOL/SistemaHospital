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
export const MedicView = lazy(() => import('../views/Hospitalization/MedicView'));
