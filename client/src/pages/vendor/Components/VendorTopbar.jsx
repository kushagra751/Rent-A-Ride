import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import PropTypes from "prop-types";
import {
  setScreenSize,
  showSidebarOrNot,
  toggleSidebar,
} from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { setVenodrVehilces } from "../../../redux/vendor/vendorDashboardSlice";
import { signOut } from "../../../redux/user/userSlice";
import { getApiUrl } from "../../../utils/api";

const activeStatuses = new Set(["booked", "onTrip", "notPicked", "overDue"]);
const requestStatuses = new Set(["booked", "notPicked"]);

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NavButton = ({ title, customFunc, icon, badgeCount, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      className="relative rounded-full p-3 text-xl text-slate-700 hover:bg-gray-100"
    >
      {badgeCount > 0 ? (
        <span
          style={{ background: dotColor }}
          className="absolute right-[6px] top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
        >
          {badgeCount > 9 ? "9+" : badgeCount}
        </span>
      ) : null}
      {icon}
    </button>
  </TooltipComponent>
);

NavButton.propTypes = {
  title: PropTypes.string.isRequired,
  customFunc: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  badgeCount: PropTypes.number,
  dotColor: PropTypes.string,
};

const VendorTopbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { screenSize } = useSelector((state) => state.adminDashboardSlice);
  const [openPanel, setOpenPanel] = useState("");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(showSidebarOrNot(false));
    } else {
      dispatch(showSidebarOrNot(true));
    }
  }, [dispatch, screenSize]);

  useEffect(() => {
    const fetchVendorSummary = async () => {
      if (!currentUser?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [vehicleRes, bookingRes] = await Promise.all([
          fetch(getApiUrl("/api/vendor/showVendorVehilces"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken},${accessToken}`,
            },
            body: JSON.stringify({ _id: currentUser._id }),
          }),
          fetch(getApiUrl("/api/vendor/vendorBookings"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken},${accessToken}`,
            },
            body: JSON.stringify({}),
          }),
        ]);

        const vehicleData = await vehicleRes.json().catch(() => []);
        const bookingData = await bookingRes.json().catch(() => []);

        dispatch(setVenodrVehilces(Array.isArray(vehicleData) ? vehicleData : []));
        setBookings(Array.isArray(bookingData) ? bookingData : []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorSummary();

    const intervalId = window.setInterval(fetchVendorSummary, 30000);
    const onFocus = () => fetchVendorSummary();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [accessToken, currentUser?._id, dispatch, refreshToken]);

  const vendorVehicles = useSelector(
    (state) => state.vendorDashboardSlice.vendorVehilces
  );

  const summary = useMemo(() => {
    const approvedVehicles = vendorVehicles.filter((vehicle) => vehicle.isAdminApproved);
    const pendingVehicles = vendorVehicles.filter(
      (vehicle) => !vehicle.isAdminApproved && !vehicle.isRejected
    );
    const rejectedVehicles = vendorVehicles.filter((vehicle) => vehicle.isRejected);
    const activeBookings = bookings.filter((booking) =>
      activeStatuses.has(booking.status)
    );
    const bookingRequests = bookings.filter((booking) =>
      requestStatuses.has(booking.status)
    );
    const activeVehicleIds = new Set(activeBookings.map((booking) => String(booking.vehicleId)));
    const availableNow = approvedVehicles.filter(
      (vehicle) => !activeVehicleIds.has(String(vehicle._id))
    ).length;

    return {
      availableNow,
      pendingVehicles: pendingVehicles.length,
      rejectedVehicles: rejectedVehicles.length,
      activeBookings: activeBookings.length,
      bookingRequests: bookingRequests.length,
      latestBookings: [...bookings].sort(
        (a, b) =>
          new Date(b.createdAt || b.pickupDate || 0).getTime() -
          new Date(a.createdAt || a.pickupDate || 0).getTime()
      ),
    };
  }, [bookings, vendorVehicles]);

  const initials = String(currentUser?.username || currentUser?.email || "V")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const handleSignout = async () => {
    try {
      await fetch(getApiUrl("/api/vendor/vendorsignout"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refreshToken},${accessToken}`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(signOut());
      navigate("/vendorSignin");
    }
  };

  const togglePanel = (panelName) => {
    setOpenPanel((current) => (current === panelName ? "" : panelName));
  };

  return (
    <div className="relative flex justify-between gap-4 border-b border-slate-200 bg-white px-3 py-3 md:mx-4 md:px-6">
      <div className="flex items-center gap-3">
        <NavButton
          title="Menu"
          customFunc={() => dispatch(toggleSidebar())}
          icon={<AiOutlineMenu />}
          badgeCount={0}
          dotColor="transparent"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Vendor Panel
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {isLoading ? "Loading workspace..." : "Connected to live vendor data"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <NavButton
          title="Booking Activity"
          customFunc={() => togglePanel("activity")}
          icon={<BsChatLeft />}
          badgeCount={summary.bookingRequests}
          dotColor="#06b6d4"
        />

        <NavButton
          title="Alerts"
          customFunc={() => togglePanel("alerts")}
          icon={<RiNotification3Line />}
          badgeCount={summary.pendingVehicles + summary.rejectedVehicles}
          dotColor="#f59e0b"
        />

        <TooltipComponent content="Profile" position="BottomCenter">
          <button
            type="button"
            className="mt-1 flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-gray-100"
            onClick={() => togglePanel("profile")}
          >
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.username || "Vendor"}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <p className="text-[11px] text-slate-400">Signed in as</p>
              <p className="text-sm font-semibold text-slate-800">
                {currentUser?.username || "Vendor"}
              </p>
            </div>
            <MdKeyboardArrowDown className="text-slate-500" />
          </button>
        </TooltipComponent>

        {openPanel === "activity" ? (
          <div className="absolute right-0 top-[72px] z-50 w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Booking Activity</p>
                <p className="text-xs text-slate-500">Recent user bookings on your vehicles</p>
              </div>
              <button
                type="button"
                className="rounded-full px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                onClick={() => setOpenPanel("")}
              >
                x
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {summary.latestBookings.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No booking activity yet.
                </div>
              ) : (
                summary.latestBookings.slice(0, 4).map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {booking?.vehicleDetails?.name || booking?.vehicleDetails?.model || "Vehicle"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {booking.pickUpLocation || "-"} to {booking.dropOffLocation || "-"}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{formatDateTime(booking.pickupDate)}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 capitalize text-slate-700">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              to="/vendorDashboard/bookings"
              className="mt-4 inline-flex text-sm font-medium text-blue-600"
              onClick={() => setOpenPanel("")}
            >
              Open bookings
            </Link>
          </div>
        ) : null}

        {openPanel === "alerts" ? (
          <div className="absolute right-0 top-[72px] z-50 w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Alerts</p>
                <p className="text-xs text-slate-500">Live vendor fleet summary</p>
              </div>
              <button
                type="button"
                className="rounded-full px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                onClick={() => setOpenPanel("")}
              >
                x
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700">
                Available now: <span className="font-semibold">{summary.availableNow}</span>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-amber-700">
                Pending approval: <span className="font-semibold">{summary.pendingVehicles}</span>
              </div>
              <div className="rounded-xl bg-violet-50 p-4 text-violet-700">
                Booking requests: <span className="font-semibold">{summary.bookingRequests}</span>
              </div>
              <div className="rounded-xl bg-rose-50 p-4 text-rose-700">
                Rejected listings: <span className="font-semibold">{summary.rejectedVehicles}</span>
              </div>
            </div>
          </div>
        ) : null}

        {openPanel === "profile" ? (
          <div className="absolute right-0 top-[72px] z-50 w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center gap-3">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.username || "Vendor"}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-base font-semibold text-white">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900">
                  {currentUser?.username || "Vendor"}
                </p>
                <p className="text-sm text-slate-500">{currentUser?.email || "-"}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Link
                to="/vendorDashboard/overview"
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                onClick={() => setOpenPanel("")}
              >
                Overview
              </Link>
              <Link
                to="/vendorDashboard/vehicles"
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                onClick={() => setOpenPanel("")}
              >
                My Vehicles
              </Link>
              <Link
                to="/vendorDashboard/bookings"
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                onClick={() => setOpenPanel("")}
              >
                Bookings
              </Link>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              onClick={handleSignout}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VendorTopbar;
