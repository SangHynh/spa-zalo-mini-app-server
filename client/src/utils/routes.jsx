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
  StaffManagement,
} from "../pages";
import CreateProduct from "../pages/products/CreateProduct";
import CreateCustomer from "../pages/users/CreateCustomer";
import CreateStaff from "../pages/users/CreateStaff";

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
            path: path.CUSTOMER_MANAGEMENT,
            element: <CustomerManagement />,
          },
          {
            path: path.STAFF_MANAGEMENT,
            element: <StaffManagement />,
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
            path: path.AFFILIATE_MARKETING,
            element: <AffiliateMarketing />,
          },
          {
            path: path.COMMISSION,
            element: <Commission />,
          },
          {
            path: path.RANK_POINT,
            element: <RanknPoint />,
          },
          {
            path: path.CREATE_PRODUCT,
            element: <CreateProduct />,
          },
          {
            path: path.CREATE_CUSTOMER,
            element: <CreateCustomer />,
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
