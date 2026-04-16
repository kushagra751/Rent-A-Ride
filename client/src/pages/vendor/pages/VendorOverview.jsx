import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiClock, FiShoppingBag, FiTruck } from "react-icons/fi";
import { MdOutlineVerified } from "react-icons/md";
import VendorHeader from "../Components/VendorHeader";
import { setVenodrVehilces } from "../../../redux/vendor/vendorDashboardSlice";
import { getApiUrl } from "../../../utils/api";
import { getVehicleImage } from "../../../utils/vehicleImage";

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

const VendorOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.currentUser?._id);
  const vendorVehilces = useSelector(
    (state) => state.vendorDashboardSlice.vendorVehilces
  );
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOverview = async () => {
      if (!currentUserId) {
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
            body: JSON.stringify({ _id: currentUserId }),
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

    fetchOverview();

    const intervalId = window.setInterval(fetchOverview, 30000);
    const onFocus = () => fetchOverview();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [accessToken, currentUserId, dispatch, refreshToken]);

  const summary = useMemo(() => {
    const approvedVehicles = vendorVehilces.filter((vehicle) => vehicle.isAdminApproved);
    const pendingVehicles = vendorVehilces.filter(
      (vehicle) => !vehicle.isAdminApproved && !vehicle.isRejected
    );
    const rejectedVehicles = vendorVehilces.filter((vehicle) => vehicle.isRejected);
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
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + Number(booking.totalPrice || 0),
      0
    );

    return {
      totalFleet: vendorVehilces.length,
      availableNow,
      bookingRequests: bookingRequests.length,
      activeTrips: activeBookings.length,
      pendingReview: pendingVehicles.length,
      rejectedListings: rejectedVehicles.length,
      totalRevenue,
      latestBookings: [...bookings].sort(
        (a, b) =>
          new Date(b.createdAt || b.pickupDate || 0).getTime() -
          new Date(a.createdAt || a.pickupDate || 0).getTime()
      ),
    };
  }, [bookings, vendorVehilces]);

  const latestVehicles = [...vendorVehilces].slice(0, 3);

  const stats = [
    {
      label: "Total Fleet",
      value: summary.totalFleet,
      icon: <FiShoppingBag />,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Available Now",
      value: summary.availableNow,
      icon: <MdOutlineVerified />,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Booking Requests",
      value: summary.bookingRequests,
      icon: <FiTruck />,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Active Trips",
      value: summary.activeTrips,
      icon: <FiClock />,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Pending Review",
      value: summary.pendingReview,
      icon: <FiClock />,
      tone: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-100 p-6">
      <VendorHeader category="Vendor Workspace" title="Overview" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-xl p-3 ${stat.tone}`}>
              {stat.icon}
            </div>
            <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {isLoading ? "-" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Live Overview</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Connected to real vendor bookings
              </h2>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Revenue</p>
              <p className="mt-1 text-2xl font-semibold">Rs. {summary.totalRevenue}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              className="rounded-2xl bg-slate-950 px-4 py-4 text-sm font-semibold text-white"
              onClick={() => navigate("/vendorDashboard/vendorAddProduct")}
            >
              Add Vehicle
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900"
              onClick={() => navigate("/vendorDashboard/vehicles")}
            >
              Manage Vehicles
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900"
              onClick={() => navigate("/vendorDashboard/bookings")}
            >
              View Bookings
            </button>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Latest Booking Requests</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Real user-side activity
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {summary.latestBookings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                  No user bookings have been placed on your vehicles yet.
                </div>
              ) : (
                summary.latestBookings.slice(0, 4).map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {booking?.vehicleDetails?.name || booking?.vehicleDetails?.model || "Vehicle"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.pickUpLocation || "-"} to {booking.dropOffLocation || "-"}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Pickup: {formatDateTime(booking.pickupDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Recent Vehicles</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              Latest listings
            </h2>

            <div className="mt-5 space-y-4">
              {latestVehicles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  Your approved and pending vendor vehicles will appear here.
                </div>
              ) : (
                latestVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="h-20 w-24 rounded-xl bg-slate-100 p-2">
                      <img
                        src={getVehicleImage(vehicle)}
                        alt={vehicle.name || "Vehicle"}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {vehicle.name || vehicle.model}
                      </p>
                      <p className="text-sm text-slate-500">
                        {vehicle.district} - {vehicle.location}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {vehicle.isRejected
                          ? "Rejected"
                          : vehicle.isAdminApproved
                            ? "Approved"
                            : "Pending approval"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Approval Status</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-amber-50 p-4 text-amber-700">
                Pending review: <span className="font-semibold">{summary.pendingReview}</span>
              </div>
              <div className="rounded-xl bg-rose-50 p-4 text-rose-700">
                Rejected listings: <span className="font-semibold">{summary.rejectedListings}</span>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700">
                Available vehicles: <span className="font-semibold">{summary.availableNow}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;
