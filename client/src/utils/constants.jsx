import { Paper, styled } from "@mui/material";
import path from "./path";
import { RiDashboardLine } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { MdRoomService } from "react-icons/md";
import { LuShoppingBag } from "react-icons/lu";
import { MdCategory } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { GoDash } from "react-icons/go";
import { TbMassage } from "react-icons/tb";

export const getSidebar = (t) => [
  {
    id: 1,
    name: t("dashboard"),
    path: `/${path.ADMIN_LAYOUT}/${path.DASHBOARD}`,
    icon: <img src="/dashboard.png" alt="" className="w-7 h-7" />,
    type: "SINGLE",
  },
  {
    id: 2,
    name: t("product"),
    path: `/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`,
    icon: <img src="/product.png" alt="" className="w-7 h-7" />,
    type: "SINGLE",
  },
  {
    id: 3,
    name: t("service"),
    path: `/${path.ADMIN_LAYOUT}/${path.SERVICE_MANAGEMENT}`,
    icon: <img src="/spa.png" alt="" className="w-7 h-7" />,
    type: "SINGLE",
  },
  {
    id: 4,
    name: t("user"),
    icon: <img src="/user.png" alt="" className="w-7 h-7" />,
    type: "PARENT",
    subs: [
      {
        id: 11,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.CUSTOMER_MANAGEMENT}`,
        name: t("customer"),
      },
      {
        id: 12,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.STAFF_MANAGEMENT}`,
        name: t("staff"),
      },
    ],
  },
  {
    id: 5,
    name: t("category"),
    path: `/${path.ADMIN_LAYOUT}/${path.CATEGORY_MANAGEMENT}`,
    icon: <img src="/category1.png" alt="" className="w-7 h-7" />,
    type: "SINGLE",
  },
  {
    id: 6,
    name: t("booking"),
    path: `/${path.ADMIN_LAYOUT}/${path.BOOKING_MANAGEMENT}`,
    icon: <img src="/booking.png" alt="" className="w-7 h-7" />,
    type: "SINGLE",
  },
  {
    id: 7,
    name: t("order"),
    path: `/${path.ADMIN_LAYOUT}/${path.ORDER_MANAGEMENT}`,
    icon: <img src="/order.png" alt="" className="w-7 h-7 ml-1" />,
    type: "SINGLE",
  },
  {
    id: 9,
    name: t("voucher"),
    path: `/${path.ADMIN_LAYOUT}/${path.VOUCHER_MANAGEMENT}`,
    icon: <img src="/voucher.png" alt="" className="w-7 h-7 ml-1" />,
    type: "SINGLE",
  },
  {
    id: 8,
    name: t("general-config"),
    icon: <img src="/setting.png" alt="" className="w-7 h-7" />,
    type: "PARENT",
    subs: [
      {
        id: 81,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.AFFILIATE_MARKETING}`,
        name: t("affiliate-marketing"),
      },
      {
        id: 82,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.COMMISSION}`,
        name: t("commission"),
      },
      {
        id: 83,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.RECOMMEND_SYSTEM}`,
        name: t("recommend-system"),
      },
      {
        id: 84,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.RANK_POINT}`,
        name: t("rank-point"),
      },
      {
        id: 85,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.IMAGES}`,
        name: t("nor-image"),
      },
      {
        id: 85,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.MINI_GAME}`,
        name: t("mini-game"),
      },
    ],
  },
];

export const categories = [
  "Tẩy trang mặt",
  "Sữa rửa mặt",
  "Tẩy tế bào chết da mặt",
  "Sữa dưỡng ẩm",
  "Sữa dưỡng trắng",
];

export const benefits = [
  "Giúp dưỡng ẩm cho da",
  "Làm dịu da",
  "Tẩy tế bào chết da mặt",
  "Làm sạch da mặt",
];

// UI CONSTANTS
export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  const splitName = name.split(" ");
  const initials =
    splitName.length > 1
      ? `${splitName[0][0]}${splitName[1][0]}`
      : `${splitName[0][0]}`;

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(),
  };
}

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
