import { useDispatch, useSelector } from "react-redux";
import { setVendorOrderModalOpen } from "../../../redux/vendor/vendorBookingSlice";

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

const VendorBookingDetailModal = () => {
  const { isVendorOderModalOpen, vendorSingleOrderDetails: cur } = useSelector(
    (state) => state.vendorBookingSlice
  );

  const bookingDetails = cur ?? {};
  const vehicleDetails = cur?.vehicleDetails ?? {};
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(setVendorOrderModalOpen(false));
  };

  return (
    <>
      {isVendorOderModalOpen && cur ? (
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center overflow-scroll bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition duration-300 ease-in-out"
          onClick={closeModal}
        >
          <div className="relative m-4 mx-auto min-w-[300px] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl md:min-w-[500px]">
            <div className="relative p-4 pt-10 text-[10px] font-medium capitalize antialiased md:text-[16px]">
              <div className="mb-4">
                <div className="mb-2 font-bold">Booking Details</div>
                <hr />
                <div className="mb-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>Booking Id</div>
                    <div>{bookingDetails._id || "-"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Total Amount</div>
                    <div>{bookingDetails.totalPrice || "-"}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>Pickup Location</div>
                    <div>{bookingDetails.pickUpLocation || "-"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Pickup Date</div>
                    <div>{formatDate(bookingDetails.pickupDate)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Pickup Time</div>
                    <div>{formatTime(bookingDetails.pickupDate)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Dropoff Location</div>
                  <div>{bookingDetails.dropOffLocation || "-"}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div>Dropoff Date</div>
                  <div>{formatDate(bookingDetails.dropOffDate)}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div>Dropoff Time</div>
                  <div>{formatTime(bookingDetails.dropOffDate)}</div>
                </div>
              </div>

              <div className="mt-4 font-bold">Vehicle Details</div>
              <hr className="mb-4 mt-4" />
              <div className="flex items-cetner justify-between">
                <div>Vehicle Number</div>
                <div>{vehicleDetails.registeration_number || "-"}</div>
              </div>
              <div className="flex items-cetner justify-between">
                <div>Model</div>
                <div>{vehicleDetails.model || "-"}</div>
              </div>
              <div className="flex items-cetner justify-between">
                <div>Company</div>
                <div>{vehicleDetails.company || "-"}</div>
              </div>
              <div className="flex items-cetner justify-between">
                <div>Vehicle Type</div>
                <div>{vehicleDetails.car_type || "-"}</div>
              </div>
              <div className="flex items-cetner justify-between">
                <div>Seats</div>
                <div>{vehicleDetails.seats || "-"}</div>
              </div>

              <div className="flex items-cetner justify-between">
                <div>Fuel Type</div>
                <div>{vehicleDetails.fuel_type || "-"}</div>
              </div>
              <div className="flex items-cetner justify-between">
                <div>Transmission</div>
                <div>{vehicleDetails.transmition || "-"}</div>
              </div>
              <div className="flex items-cetner justify-between">
                <div>Manufacturing Year</div>
                <div>{vehicleDetails.year_made || "-"}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end p-4 text-blue-gray-500">
              <button
                className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 px-6 py-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition duration-300 ease-in-out hover:shadow-lg hover:shadow-green-500/40"
                onClick={closeModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute top-0"></div>
      )}
    </>
  );
};

export default VendorBookingDetailModal;
