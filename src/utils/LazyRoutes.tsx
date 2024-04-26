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
export const PurchaseAuthorization = lazy(
  () => import('../components/Purchase/Authorization/Authorization/PurchaseAuthorization')
);

export const PurchaseConfigView = lazy(() => import('../views/Purchase/PurchaseConfigView'));
export const AccountView = lazy(() => import('../views/AccountView'));
export const WarehouseSelected = lazy(() => import('../components/Warehouse/WarehouseSelected/WarehouseSelected'));
export const PointOfSaleView = lazy(() => import('../views/Pharmacy/PointOfSaleView'));
export const PackageCatalogueView = lazy(() => import('../views/Pharmacy/PackageCatalogueView'));
export const PharmacyConfigView = lazy(() => import('../views/Pharmacy/PharmacyConfigView'));
