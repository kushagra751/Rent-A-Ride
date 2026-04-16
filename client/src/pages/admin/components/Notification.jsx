import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FiBell, FiCalendar, FiTruck, FiUsers } from "react-icons/fi";
import { toggleNavbarPage } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";

const Notification = ({ summary }) => {
  const dispatch = useDispatch();
  const stats = summary?.stats || {};
  const recentBookings = summary?.recentBookings || [];
  const recentVendorRequests = summary?.recentVendorRequests || [];

  return (
    <div className="absolute right-0 top-14 z-20 w-[340px] rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Live Activity
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Notifications</h3>
        </div>
        <button
          className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-100"
          onClick={() => dispatch(toggleNavbarPage("notification"))}
          type="button"
        >
          x
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-800">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FiTruck />
            Pending requests
          </div>
          <p className="mt-3 text-2xl font-bold">
            {Number(stats.pendingVendorRequests || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-blue-800">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FiCalendar />
            Bookings
          </div>
          <p className="mt-3 text-2xl font-bold">
            {Number(stats.totalBookings || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FiBell />
          Latest updates
        </div>
        <div className="mt-3 space-y-3">
          {recentVendorRequests.slice(0, 2).map((vehicle) => (
            <div key={vehicle._id} className="rounded-2xl bg-white p-3">
              <p className="text-sm font-semibold text-slate-900">
                Vendor request: {vehicle?.name || vehicle?.car_title || "New vehicle"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {vehicle?.district || "-"} · {vehicle?.location || "-"}
              </p>
            </div>
          ))}
          {recentBookings.slice(0, 2).map((booking) => (
            <div key={booking._id} className="rounded-2xl bg-white p-3">
              <p className="text-sm font-semibold text-slate-900">
                Booking by {booking?.userDetails?.username || booking?.userDetails?.email || "guest"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {booking?.vehicleDetails?.name || "Vehicle"} · {booking?.status || "booked"}
              </p>
            </div>
          ))}
          {recentBookings.length === 0 && recentVendorRequests.length === 0 ? (
            <div className="rounded-2xl bg-white p-3 text-sm text-slate-500">
              No new admin activity yet.
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FiUsers />
          Platform snapshot
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {Number(stats.totalUsers || 0).toLocaleString("en-IN")} users,{" "}
          {Number(stats.totalVendors || 0).toLocaleString("en-IN")} vendors and{" "}
          {Number(stats.activeVehicles || 0).toLocaleString("en-IN")} active vehicles.
        </p>
      </div>
    </div>
  );
};

Notification.propTypes = {
  summary: PropTypes.shape({
    stats: PropTypes.object,
    recentBookings: PropTypes.array,
    recentVendorRequests: PropTypes.array,
  }),
};

export default Notification;
