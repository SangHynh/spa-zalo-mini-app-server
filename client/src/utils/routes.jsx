import App from "../App";
import path from "./path";
import {
  Login,
  AdminLayout,
  Dashboard,
  ProductManagement,
  UserManagement,
  OrderManagement,
  BookingManagement,
  CategoryManagement,
  AffiliateMarketing,
  Commission,
  RanknPoint,
} from "../pages";
import CreateProduct from "../pages/products/CreateProduct";

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
            path: path.USER_MANAGEMENT,
            element: <UserManagement />,
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
        ],
      },
    ],
  },
];

export default routes;
