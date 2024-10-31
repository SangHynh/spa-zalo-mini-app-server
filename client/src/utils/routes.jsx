import App from "../App";
import path from "./path";
import {
  Login,
  AdminLayout,
  Dashboard,
  ProductManagement,
  OrderManagement,
  BookingManagement,
  CategoryManagement,
  AffiliateMarketing,
  Commission,
  RanknPoint,
  CustomerManagement,
  ServiceManagement,
  Images,
  VoucherManagement,
  RecommendSystem,
  MiniGame,
} from "../pages";
import CreateProduct from "../pages/products/CreateProduct";
import EditProduct from "../pages/products/EditProducts";
import CreateCategory from "../pages/categories/CreateCategory";
import CreateService from "../pages/services/CreateService";
import EditService from "../pages/services/EditService";
import EditCategory from "../pages/categories/EditCategory";
import ProdRecommendSystem from "../pages/products/ProdRecommendSystem";
import CreateVoucher from "../pages/vouchers/CreateVoucher";
import EditVoucher from "../pages/vouchers/EditVoucher";
import SvcRecommendSystem from "../pages/services/SvcRecommendSystem";
import StaffManagement from "../pages/staffs/StaffManagement";
import CreateStaff from "../pages/staffs/CreateStaff";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: path.LOGIN,
        element: <Login />,
      },
      {
        path: path.ADMIN_LAYOUT,
        element: <AdminLayout />,
        children: [
          {
            path: path.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: path.PRODUCT_MANAGEMENT,
            element: <ProductManagement />,
          },
          {
            path: path.SERVICE_MANAGEMENT,
            element: <ServiceManagement />,
          },
          {
            path: path.CUSTOMER_MANAGEMENT,
            element: <CustomerManagement />,
          },
          {
            path: path.ORDER_MANAGEMENT,
            element: <OrderManagement />,
          },
          {
            path: path.BOOKING_MANAGEMENT,
            element: <BookingManagement />,
          },
          {
            path: path.CATEGORY_MANAGEMENT,
            element: <CategoryManagement />,
          },
          {
            path: path.VOUCHER_MANAGEMENT,
            element: <VoucherManagement />,
          },
          {
            path: path.AFFILIATE_MARKETING,
            element: <AffiliateMarketing />,
          },
          {
            path: path.STAFF_MANAGEMENT,
            element: <StaffManagement />,
          },
          {
            path: path.COMMISSION,
            element: <Commission />,
          },
          {
            path: path.RECOMMEND_SYSTEM,
            element: <RecommendSystem />,
          },
          {
            path: path.MINI_GAME,
            element: <MiniGame />,
          },
          {
            path: path.RANK_POINT,
            element: <RanknPoint />,
          },
          {
            path: path.IMAGES,
            element: <Images />,
          },
          {
            path: path.PROD_RECOMMEND_SYSTEM + "/:id",
            element: <ProdRecommendSystem />,
          },
          {
            path: path.SVC_RECOMMEND_SYSTEM + "/:id",
            element: <SvcRecommendSystem />,
          },
          {
            path: path.CREATE_PRODUCT,
            element: <CreateProduct />,
          },
          {
            path: path.EDIT_PRODUCT + "/:id",
            element: <EditProduct />,
          },
          {
            path: path.CREATE_SERVICE,
            element: <CreateService />,
          },
          {
            path: path.EDIT_SERVICE + "/:id",
            element: <EditService />,
          },
          {
            path: path.CREATE_CATEGORY,
            element: <CreateCategory />,
          },
          {
            path: path.EDIT_CATEGORY + "/:id",
            element: <EditCategory />,
          },
          {
            path: path.CREATE_VOUCHER,
            element: <CreateVoucher />,
          },
          {
            path: path.EDIT_VOUCHER + "/:id",
            element: <EditVoucher />,
          },
          {
            path: path.CREATE_STAFF,
            element: <CreateStaff />,
          },
        ],
      },
    ],
  },
];

export default routes;
