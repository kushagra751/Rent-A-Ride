import { IoHomeOutline } from "react-icons/io5";
import { FiShoppingBag, FiTruck } from "react-icons/fi";

export const links = [
  {
    title: "Workspace",
    links: [
      {
        name: "overview",
        label: "Overview",
        icon: <IoHomeOutline />,
      },
      {
        name: "vehicles",
        label: "My Vehicles",
        icon: <FiShoppingBag />,
      },
      {
        name: "bookings",
        label: "Bookings",
        icon: <FiTruck />,
      },
    ],
  },
];
