import { lazy } from 'react';

export const Dashboard = lazy(() => import('../views/Layout/DashboardView'));
export const PurchaseRequest = lazy(() => import('../views/Purchase/PurchaseRequestView'));
export const ArticleView = lazy(() => import('../views/Purchase/ArticleView'));
export const Article = lazy(() => import('@/features/purchase/articles/screens/Article'));
export const ExistingArticle = lazy(() => import('../components/Purchase/Articles/ExistingArticle/ExistingArticle'));
export const CategoryView = lazy(() => import('../views/Purchase/CategoryView'));
export const Category = lazy(() => import('@/features/purchase/categories/screens/Category'));
export const SubCategory = lazy(() => import('@/features/purchase/subcategories/screens/SubCategory'));
export const ProvidersView = lazy(() => import('@/features/purchase/providers/screens/Providers'));
export const WarehouseView = lazy(() => import('../features/warehouse/views/Warehouse'));
// export const WarehouseView = lazy(() => import('../views/Purchase/WarehouseView'));
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
// export const RoomsView = lazy(() => import('../views/Programming/RoomsView'));
export const SurgeryProcedureView = lazy(() => import('../views/Programming/SurgeryProcedureView'));
export const ProgrammingCalendarView = lazy(() => import('../views/Programming/ProgrammingCalendarView'));
export const ConfigurationProgrammingView = lazy(() => import('../views/Programming/ConfigurationProgrammingView'));
export const ProgrammingRequestView = lazy(() => import('../views/Programming/ProgrammingRequestView'));
export const BiomedicalEquipmentView = lazy(() => import('../views/Biomedical/BiomedicalEquipmentView'));
export const AnesthesiologistView = lazy(() => import('../views/OperatingRoom/AnesthesiologistView'));
export const XRayView = lazy(() => import('../views/Biomedical/XRayView'));
export const XRayRequestView = lazy(() => import('../views/Hospitalization/XRayRequestView'));
export const XRayRequestManagementView = lazy(() => import('../views/Biomedical/XRayRequestManagementView'));
export const PatientAcountsView = lazy(() => import('../views/Hospitalization/PatientAcountsView'));
export const HospitalizationConfigView = lazy(() => import('../views/Hospitalization/HospitalizationConfigView'));
export const MedicView = lazy(() => import('../views/OperatingRoom/MedicView'));
export const MedicalShiftView = lazy(() => import('../views/Budgets/MedicalShiftView'));
export const AnesthesiologistShiftView = lazy(() => import('../views/Hospitalization/AnesthesiologistShiftView'));
export const OperatingRoomView = lazy(() => import('../views/OperatingRoom/OperatingRoomView'));
export const TypesRoomView = lazy(() => import('../views/Programming/TypesRoomView'));
export const DailyOperatingView = lazy(() => import('../views/OperatingRoom/DailyOperatingView'));
export const RecoveryRoomsView = lazy(() => import('../views/OperatingRoom/RecoveryRoomsView'));
export const OperatingPackagesView = lazy(() => import('../views/OperatingRoom/OperatingPackagesView'));
export const HospitalRoomsView = lazy(() => import('../views/Hospitalization/HospitalRoomsView'));
export const AssignedRoomsView = lazy(() => import('../views/Nursing/AssignedRoomsView'));
export const HospitalRoomsCalendarView = lazy(() => import('../views/Hospitalization/HospitalRoomsCalendarView'));
export const PatientsEntryView = lazy(() => import('../views/Admission/PatientsEntryView'));
export const RequestsConfigView = lazy(() => import('../views/Biomedical/RequestsConfigView'));
export const InvoiceView = lazy(() => import('../views/Invoice/InvoiceView'));
export const OutstandingBillsView = lazy(() => import('../views/Admission/OutstandingBillsView'));
export const MedicalConsultationView = lazy(() => import('../views/Admission/MedicalConsultationView'));
export const PatientKardexView = lazy(() => import('../views/Nursing/PatientKardexView'));
export const CheckoutReportView = lazy(() => import('@/features/reports/checkout/screens/CheckoutReport'));
export const RoomTypesView = lazy(() => import('@/features/programming/room-categories/RoomCategories'));
export const RoomsView = lazy(() => import('@/features/programming/rooms/Rooms'));
export const InvoiceSettingsView = lazy(() => import('@/features/invoicing/settings/views'));

// tesoreria
export const TreasuryView = lazy(() => import('@/features/treasury/Treasury'));
export const CashFlowView = lazy(() => import('@/features/treasury/cash-flow/screens/CashFlow'));
export const BanksView = lazy(() => import('@/features/treasury/banks/screens/Banks'));
export const TreasuryAdministrationView = lazy(
  () => import('@/features/treasury/administration/screens/TreasuryAdministration')
);
export const CashFlowAccountStateView = lazy(
  () => import('@/features/treasury/cash-flow/screens/CashFlowAccountState')
);
export const CashFlowBoxView = lazy(() => import('@/features/treasury/cash-flow/screens/CashFlowBox'));
export const CashFlowBoxByIdView = lazy(() => import('@/features/treasury/cash-flow/screens/CashFlowBoxById'));
export const BanksAccountStateView = lazy(() => import('@/features/treasury/banks/screens/BanksAccountState'));
export const TreasuryAdministrationDepositsView = lazy(
  () => import('@/features/treasury/administration/screens/TreasuryAdministrationDeposits')
);
export const TreasuryAdministrationMovementsView = lazy(
  () => import('@/features/treasury/administration/screens/TreasuryAdministrationMovements')
);
export const BanksPurchasesView = lazy(() => import('@/features/treasury/banks/screens/BanksPurchases'));
