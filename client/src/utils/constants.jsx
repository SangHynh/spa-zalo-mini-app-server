import path from "./path";
import { RiDashboardLine } from "react-icons/ri";

export const sidebar = [
  {
    id: 1,
    name: "Dashboard",
    path: `/${path.ADMIN_LAYOUT}/${path.DASHBOARD}`,
    icon: <RiDashboardLine size={25} />,
  },
  {
    id: 2,
    name: "Products",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_PRODUCTS}`,
  },
  {
    id: 2,
    name: "Users",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_USERS}`,
  },
  {
    id: 3,
    name: "Services",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_SERVICES}`,
  },
];
