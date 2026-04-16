import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCreditCard,
  FiTruck,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../../utils/api";

const emptySummary = {
  stats: {
    totalUsers: 0,
    totalVendors: 0,
    activeVehicles: 0,
    totalBookings: 0,
    pendingVendorRequests: 0,
    bookedVehicles: 0,
    totalRevenue: 0,
  },
  recentBookings: [],
  recentVendorRequests: [],
};

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const metricCardStyles = [
  {
    icon: FiUser,
    title: "Users",
    key: "totalUsers",
    tone: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    icon: FiUsers,
    title: "Vendors",
    key: "totalVendors",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    icon: FiTruck,
    title: "Live Vehicles",
    key: "activeVehicles",
    tone: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    icon: FiCalendar,
    title: "Bookings",
    key: "totalBookings",
    tone: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    icon: FiAlertCircle,
    title: "Pending Requests",
    key: "pendingVendorRequests",
    tone: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    icon: FiCreditCard,
    title: "Revenue",
    key: "totalRevenue",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    isCurrency: true,
  },
];

const AdminHomeMain = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(emptySummary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(getApiUrl("/api/admin/summary"));
        if (!res.ok) {
          setSummary(emptySummary);
          return;
        }

        const data = await res.json();
        setSummary({
          stats: data?.stats || emptySummary.stats,
          recentBookings: Array.isArray(data?.recentBookings)
            ? data.recentBookings
            : [],
          recentVendorRequests: Array.isArray(data?.recentVendorRequests)
            ? data.recentVendorRequests
            : [],
        });
      } catch (error) {
        console.log(error);
        setSummary(emptySummary);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const cards = useMemo(
    () =>
      metricCardStyles.map((item) => ({
        ...item,
        value: item.isCurrency
          ? formatCurrency(summary.stats[item.key])
          : Number(summary.stats[item.key] || 0).toLocaleString("en-IN"),
      })),
    [summary.stats]
  );

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
              Admin Control Center
            </p>
            <h1 className="mt-3 text-3xl font-bold">Deployment-ready overview</h1>
            <p className="mt-3 text-sm text-slate-200">
              This dashboard now reads live production data for vehicles, users,
              vendors, bookings, and pending vendor approvals.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              className="rounded-2xl bg-white px-5 py-3 text-left text-slate-900 transition hover:bg-slate-100"
              onClick={() => navigate("/adminDashboard/allProduct")}
              type="button"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicles
              </p>
              <p className="mt-1 text-lg font-bold">Manage fleet inventory</p>
            </button>
            <button
              className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-left transition hover:bg-white/15"
              onClick={() => navigate("/adminDashboard/vendorVehicleRequests")}
              type="button"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                Requests
              </p>
              <p className="mt-1 text-lg font-bold">Review vendor submissions</p>
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.key}
              className={`rounded-2xl border px-5 py-5 shadow-sm ${card.tone}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{card.title}</p>
                  <p className="mt-2 text-2xl font-bold">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3">
                  <Icon className="text-xl" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Latest bookings</h2>
              <p className="text-sm text-slate-500">
                Most recent customer orders reaching the platform.
              </p>
            </div>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => navigate("/adminDashboard/orders")}
              type="button"
            >
              Open bookings
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {summary.recentBookings.length === 0 && !isLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                No bookings available yet.
              </div>
            ) : null}

            {summary.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    alt="vehicle"
                    className="h-16 w-20 rounded-xl object-cover"
                    src={booking?.vehicleDetails?.image?.[0] || "/car-placeholder.svg"}
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {booking?.vehicleDetails?.name ||
                        booking?.vehicleDetails?.car_title ||
                        "Vehicle unavailable"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {booking?.userDetails?.username ||
                        booking?.userDetails?.email ||
                        "Guest user"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {booking.pickUpLocation || "-"} to {booking.dropOffLocation || "-"}
                    </p>
                  </div>
                </div>
                <div className="text-sm md:text-right">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                  <p className="text-slate-500">{formatDate(booking.createdAt)}</p>
                  <p className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {booking.status || "notBooked"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vendor request queue</h2>
              <p className="text-sm text-slate-500">
                Fresh vendor vehicles waiting for admin approval.
              </p>
            </div>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              onClick={() => navigate("/adminDashboard/vendorVehicleRequests")}
              type="button"
            >
              Review queue
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {summary.recentVendorRequests.length === 0 && !isLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                No pending vendor requests right now.
              </div>
            ) : null}

            {summary.recentVendorRequests.map((vehicle) => (
              <div
                key={vehicle._id}
                className="rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    alt="vehicle"
                    className="h-14 w-16 rounded-xl object-cover"
                    src={vehicle?.image?.[0] || "/car-placeholder.svg"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {vehicle.name || vehicle.car_title || "Vendor vehicle"}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {vehicle.company || "Company unavailable"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {vehicle.location || "-"}, {vehicle.district || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Vehicles currently out on booking
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {Number(summary.stats.bookedVehicles || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHomeMain;
