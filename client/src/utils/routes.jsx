import App from "../App";
import path from "./path";
import {
  Login,
  AdminLayout,
  Dashboard,
  ManageProducts,
  ManageServices,
  ManageUsers,
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
            path: path.MANAGE_PRODUCTS,
            element: <ManageProducts />,
          },
          {
            path: path.MANAGE_USERS,
            element: <ManageUsers />,
          },
          {
            path: path.MANAGE_SERVICES,
            element: <ManageServices />,
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
