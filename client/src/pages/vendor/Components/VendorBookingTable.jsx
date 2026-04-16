import { useCallback, useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import VendorBookingDetailModal from "./VendorBookingModal";
import { IoIosArrowDown } from "react-icons/io";
import {
  setVendorOrderModalOpen,
  setVendorSingleOrderDetails,
} from "../../../redux/vendor/vendorBookingSlice";
import { getApiUrl } from "../../../utils/api";
import { getVehicleImage } from "../../../utils/vehicleImage";

const optionsValue = [
  "notBooked",
  "booked",
  "onTrip",
  "notPicked",
  "canceled",
  "overDue",
  "tripCompleted",
];

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

const activeStatuses = new Set(["booked", "onTrip", "notPicked", "overDue"]);
const requestStatuses = new Set(["booked", "notPicked"]);
const getListingSource = (vehicleDetails) => {
  const addedBy = String(vehicleDetails?.addedBy || "").toLowerCase();
  const isAdminAdded = vehicleDetails?.isAdminAdded === true || vehicleDetails?.isAdminAdded === "true";

  if (isAdminAdded || addedBy === "admin") return "Admin Fleet";
  return "Vendor Fleet";
};

const VendorBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState("");
  const dispatch = useDispatch();
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl("/api/vendor/vendorBookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken},${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        setBookings([]);
        return;
      }

      const data = await res.json().catch(() => []);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    fetchBookings();

    const intervalId = window.setInterval(fetchBookings, 30000);
    const onFocus = () => fetchBookings();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchBookings]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) =>
        new Date(b.createdAt || b.pickupDate || 0).getTime() -
        new Date(a.createdAt || a.pickupDate || 0).getTime()
    );
  }, [bookings]);

  const bookingSummary = useMemo(() => {
    return {
      total: sortedBookings.length,
      requests: sortedBookings.filter((booking) => requestStatuses.has(booking.status)).length,
      active: sortedBookings.filter((booking) => activeStatuses.has(booking.status)).length,
      completed: sortedBookings.filter((booking) => booking.status === "tripCompleted").length,
    };
  }, [sortedBookings]);

  const handleStatusChange = async (event, bookingId) => {
    const nextStatus = event.target.value;
    setUpdatingBookingId(bookingId);

    try {
      const res = await fetch(
        getApiUrl(`/api/vendor/vendorBookings/${bookingId}/status`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken},${accessToken}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || "Could not update booking status");
        return;
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: nextStatus } : booking
        )
      );
      toast.success("Booking status updated");
    } catch (error) {
      console.log(error);
      toast.error("Could not update booking status");
    } finally {
      setUpdatingBookingId("");
    }
  };

  const handleDetailsModal = (cur) => {
    dispatch(setVendorSingleOrderDetails(cur));
    dispatch(setVendorOrderModalOpen(true));
  };

  return (
    <>
      <Toaster />
      <div className="mx-auto max-w-5xl pb-20">
        <VendorBookingDetailModal />

        {!isLoading ? (
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{bookingSummary.total}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Booking Requests</p>
              <p className="mt-2 text-3xl font-bold text-violet-600">{bookingSummary.requests}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Active Trips</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{bookingSummary.active}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{bookingSummary.completed}</p>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading vendor bookings...
          </div>
        ) : sortedBookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">No bookings yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Bookings from the full fleet will appear here once users start placing orders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBookings.map((cur) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:px-8 md:py-6"
                key={cur._id}
              >
                <div className="grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-6">
                  <div className="mb-4">
                    <img
                      alt={cur?.vehicleDetails?.name || "Vehicle"}
                      className="h-auto w-full bg-gray-100"
                      height="200"
                      src={getVehicleImage(cur?.vehicleDetails ?? {})}
                      style={{
                        aspectRatio: "200/200",
                        objectFit: "contain",
                      }}
                      width="200"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{cur._id}</h3>
                        <p className="text-sm text-slate-500">
                          {cur?.vehicleDetails?.name || cur?.vehicleDetails?.model || "Vehicle"}
                        </p>
                        <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {getListingSource(cur?.vehicleDetails)}
                        </p>
                      </div>

                      <p className="flex items-center text-lg font-semibold text-slate-900">
                        <MdCurrencyRupee />
                        {cur.totalPrice}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="mb-4 font-medium underline underline-offset-4">
                          Pick up
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm capitalize text-slate-700">
                          <CiLocationOn />
                          {cur.pickUpLocation || "-"}
                        </p>

                        <div className="mt-2 flex flex-col items-start gap-2 pr-2 text-[14px]">
                          <div className="flex items-center justify-between gap-2">
                            <CiCalendarDate style={{ fontSize: 15 }} />
                            <span>{formatDate(cur.pickupDate)}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <IoMdTime style={{ fontSize: 16 }} />
                            <span>{formatTime(cur.pickupDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="mb-4 font-medium underline underline-offset-4">
                          Drop off
                        </div>

                        <p className="mt-2 flex items-center gap-2 text-sm capitalize text-slate-700">
                          <CiLocationOn />
                          {cur.dropOffLocation || "-"}
                        </p>

                        <div className="mt-2 flex flex-col items-start gap-2 pr-2 text-[14px]">
                          <div className="flex items-center justify-between gap-2">
                            <CiCalendarDate style={{ fontSize: 15 }} />
                            <span>{formatDate(cur.dropOffDate)}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <IoMdTime style={{ fontSize: 16 }} />
                            <span>{formatTime(cur.dropOffDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-row items-start justify-between gap-3 md:items-center">
                        <button
                          className="rounded-lg bg-black px-6 py-3 text-[12px] font-medium capitalize text-white focus:outline-none focus:ring-4 focus:ring-gray-300 hover:bg-gray-900 md:px-10 md:py-2 md:text-[14px]"
                          onClick={() => handleDetailsModal(cur)}
                        >
                          Details
                        </button>
                        <div className="flex items-center justify-end">
                          <div className="rounded-lg bg-green-500 px-5 py-3 text-[12px] font-medium capitalize md:px-10 md:py-2 md:text-[14px]">
                            {cur.status}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <select
                          className="appearance-none rounded-md border px-4 py-2 text-[12px] capitalize drop-shadow-md md:text-[14px]"
                          value={cur.status || "booked"}
                          disabled={updatingBookingId === cur._id}
                          onChange={(event) => {
                            handleStatusChange(event, cur._id);
                          }}
                        >
                          {optionsValue.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-1 top-[10px] z-[888]">
                          <IoIosArrowDown />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VendorBookingsTable;
