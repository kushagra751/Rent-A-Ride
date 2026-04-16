import { FiHome, FiShoppingBag, FiTruck, FiUsers } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiContactsLine } from "react-icons/ri";

export const links = [
  {
    title: "Overview",
    links: [
      {
        name: "adminHome",
        label: "Dashboard",
        icon: <FiHome />,
      },
    ],
  },
  {
    title: "Fleet",
    links: [
      {
        name: "allProduct",
        label: "All Vehicles",
        icon: <FiShoppingBag />,
      },
      {
        name: "vendorVehicleRequests",
        label: "Vendor Requests",
        icon: <FiTruck />,
      },
      {
        name: "orders",
        label: "Bookings",
        icon: <AiOutlineShoppingCart />,
      },
    ],
  },
  {
    title: "Accounts",
    links: [
      {
        name: "allUsers",
        label: "Users",
        icon: <FiUsers />,
      },
      {
        name: "allVendors",
        label: "Vendors",
        icon: <RiContactsLine />,
      },
    ],
  },
];
