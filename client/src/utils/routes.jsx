import App from "../App";
import path from "./path";
import {
  AdminLayout,
  Dashboard,
  ManageProducts,
  ManageServices,
  ManageUsers,
} from "../pages";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
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
        ],
      },
    ],
  },
];

export default routes;
