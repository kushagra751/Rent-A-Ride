import { FiPlus } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VendorAllVehicles from "../pages/VendorAllVehicles";
import VendorSidebar from "../Components/VendorSidebar";
import VendorBookings from "../Components/VendorBookings";
import VendorOverview from "../pages/VendorOverview";
import VendorTopbar from "../Components/VendorTopbar";

function VendorDashboard() {
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative flex dark:bg-main-dark-bg">
        <div className="fixed bottom-4 right-4" style={{ zIndex: "1000" }}>
          <TooltipComponent content="Add vehicle" position="Top">
            <button
              type="button"
              className="rounded-full bg-blue-600 p-3 text-3xl text-white shadow-lg transition hover:bg-blue-700"
              onClick={() => navigate("/vendorDashboard/vendorAddProduct")}
            >
              <FiPlus />
            </button>
          </TooltipComponent>
        </div>

        {activeMenu ? (
          <div className="sidebar fixed w-72 dark:bg-secondary-dark-bg">
            <VendorSidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <VendorSidebar />
          </div>
        )}

        <div
          className={`min-h-screen w-full bg-white dark:bg-white ${
            activeMenu ? "ml-72 md:ml-72" : "flex-2"
          }`}
        >
          <div className="fixed w-full bg-white md:static">
            <VendorTopbar />
          </div>

          <div className="main_section mx-4 pt-6 md:mx-8">
            <Routes>
              <Route index element={<VendorOverview />} />
              <Route path="overview" element={<VendorOverview />} />
              <Route path="vehicles" element={<VendorAllVehicles />} />
              <Route path="bookings" element={<VendorBookings />} />

              <Route path="adminHome" element={<VendorOverview />} />
              <Route path="vendorAllVeihcles" element={<VendorAllVehicles />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
