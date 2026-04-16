import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import UserOrderDetailsModal from "../../components/UserOrderDetailsModal";
import {
  setIsOrderModalOpen,
  setSingleOrderDetails,
} from "../../redux/user/userSlice";
import { getApiUrl } from "../../utils/api";
import { getVehicleImage } from "../../utils/vehicleImage";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getBookingDateValue = (booking) => {
  const createdAt = booking?.bookingDetails?.createdAt;
  const pickupDate = booking?.bookingDetails?.pickupDate;
  return new Date(createdAt || pickupDate || 0).getTime();
};

const statusClasses = {
  booked: "bg-emerald-50 text-emerald-700",
  onTrip: "bg-sky-50 text-sky-700",
  notPicked: "bg-amber-50 text-amber-700",
  canceled: "bg-rose-50 text-rose-700",
  overDue: "bg-orange-50 text-orange-700",
  tripCompleted: "bg-slate-100 text-slate-700",
  notBooked: "bg-slate-100 text-slate-600",
};

export default function Orders() {
  const currentUserId = useSelector((state) => state.user.currentUser?._id);
  const latestBookingData = useSelector((state) => state.latestBookingsSlice.data);
  const paymentDone = useSelector((state) => state.latestBookingsSlice.paymentDone);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchBookings = useCallback(
    async ({ silent = false } = {}) => {
      if (!currentUserId) {
        setBookings([]);
        setIsLoading(false);
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }

        const res = await fetch(getApiUrl("/api/user/findBookingsOfUser"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
          }),
        });

        const data = await res.json().catch(() => []);
        const safeBookings = Array.isArray(data) ? data : [];
        safeBookings.sort((a, b) => getBookingDateValue(b) - getBookingDateValue(a));
        setBookings(safeBookings);
      } catch (error) {
        console.log(error);
        if (!silent) {
          setBookings([]);
        }
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, location.key, paymentDone]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchBookings({ silent: true });
    }, 15000);

    const handleFocus = () => {
      fetchBookings({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchBookings({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchBookings]);

  const mergedBookings = useMemo(() => {
    const nextBookings = [...bookings];
    const latestBooking = Array.isArray(latestBookingData)
      ? latestBookingData[0]
      : latestBookingData?.bookingDetails
        ? latestBookingData
        : null;

    if (latestBooking?.bookingDetails?._id) {
      const existingIndex = nextBookings.findIndex(
        (item) => item?.bookingDetails?._id === latestBooking.bookingDetails._id
      );

      if (existingIndex < 0) {
        nextBookings.unshift(latestBooking);
      }
    }

    nextBookings.sort((a, b) => getBookingDateValue(b) - getBookingDateValue(a));
    return nextBookings;
  }, [bookings, latestBookingData]);

  const handleDetailsModal = (bookingDetails) => {
    dispatch(setSingleOrderDetails(bookingDetails));
    dispatch(setIsOrderModalOpen(true));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <UserOrderDetailsModal />

      <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
          Your Trips
        </p>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Orders & latest bookings</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Track your latest booking, open full trip details, and review pickup and drop-off information in one place.
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Loading your bookings...</p>
            <p className="mt-2 text-sm text-slate-500">
              We are fetching your latest ride details.
            </p>
          </div>
        ) : mergedBookings.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">No bookings yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Once you complete a ride booking, it will appear here with vehicle info, pickup location, dates, and payment summary.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {mergedBookings.map((cur, idx) => {
              const bookingDetails = cur?.bookingDetails ?? {};
              const vehicleDetails = cur?.vehicleDetails ?? {};
              const bookingId = bookingDetails?._id || `booking-${idx + 1}`;
              const bookingStatus = bookingDetails?.status || "booked";
              const badgeClass = statusClasses[bookingStatus] || statusClasses.booked;

              return (
                <div
                  className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
                  key={bookingId}
                >
                  <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                    <div className="overflow-hidden rounded-[24px] bg-slate-100 p-4">
                      <img
                        alt={vehicleDetails?.name || vehicleDetails?.model || "Vehicle"}
                        className="h-full w-full object-contain"
                        src={getVehicleImage(vehicleDetails)}
                      />
                    </div>

                    <div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                            {idx === 0 ? "Latest Booking" : "Booking"}
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                            {vehicleDetails?.name || vehicleDetails?.model || "Vehicle"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Booking ID: {bookingId}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
                          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                            Total
                          </p>
                          <p className="mt-2 flex items-center text-2xl font-semibold">
                            <MdCurrencyRupee />
                            {bookingDetails?.totalPrice ?? "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">Pick up</p>
                          <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                            <CiLocationOn />
                            {bookingDetails?.pickUpLocation || "-"}
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <CiCalendarDate />
                            {formatDate(bookingDetails?.pickupDate)}
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <IoMdTime />
                            {formatTime(bookingDetails?.pickupDate)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">Drop off</p>
                          <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                            <CiLocationOn />
                            {bookingDetails?.dropOffLocation || "-"}
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <CiCalendarDate />
                            {formatDate(bookingDetails?.dropOffDate)}
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <IoMdTime />
                            {formatTime(bookingDetails?.dropOffDate)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-4 py-2 text-sm font-medium ${badgeClass}`}>
                          Status: {bookingStatus}
                        </span>
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                          {vehicleDetails?.transmition || "Transmission unavailable"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                          {vehicleDetails?.fuel_type || "Fuel type unavailable"}
                        </span>
                      </div>

                      <button
                        className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => handleDetailsModal(cur)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
