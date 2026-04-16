import { useDispatch, useSelector } from "react-redux";
import { setIsOrderModalOpen } from "../redux/user/userSlice";

const UserOrderDetailsModal = () => {
  const { isOrderModalOpen, singleOrderDetails: cur } = useSelector(
    (state) => state.user
  );
  const bookingDetails = cur?.bookingDetails ?? {};
  const vehicleDetails = cur?.vehicleDetails ?? {};

  const dispatch = useDispatch();

  const pickupDate = bookingDetails?.pickupDate
    ? new Date(bookingDetails.pickupDate)
    : null;
  const dropOffDate = bookingDetails?.dropOffDate
    ? new Date(bookingDetails.dropOffDate)
    : null;

  const closeModal = () => {
    dispatch(setIsOrderModalOpen(false));
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };
  return (
    <>
      {isOrderModalOpen && cur ? (
        <div
          className={` fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition duration-300  ease-in-out overflow-scroll`}
          onClick={closeModal}
        >
          <div className=" relative m-4 mx-auto  min-w-[300px] md:min-w-[500px] max-w-[40%]  rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl">
            <div className="relative pt-10 p-4 antialiased capitalize font-medium text-[10px] md:text-[16px] ">
              <div className="mb-4 ">
                <div className="mb-2 font-bold">Booking Details</div>
                <hr></hr>
                <div className="mb-4 mt-2">
                  <div className="flex items-center  justify-between">
                    <div>Booking Id</div>
                    <div>{bookingDetails._id || "-"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Total Amount</div>
                    <div>{bookingDetails.totalPrice || "-"}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2 ">
                    <div>Pickup Location</div>
                    <div>{bookingDetails.pickUpLocation || "-"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Pickup Date</div>
                    <div>{formatDate(pickupDate)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Tickup Time</div>
                    <div>{formatTime(pickupDate)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Dropoff Location</div>
                  <div>{bookingDetails.dropOffLocation || "-"}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div>Dropoff Date</div>
                  <div>{formatDate(dropOffDate)}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div>Dropoff Time</div>
                  <div>{formatTime(dropOffDate)}</div>
                </div>
              </div>

              <div className="mt-4 font-bold">Vehicle Details</div>
              <hr className="mt-4 mb-4" />
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
                <div>Manufactureing Year</div>
                <div>{vehicleDetails.year_made || "-"}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
              <button
                className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition ease-in-out duration-300 hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none animate-bounce hover:animate-none"
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

export default UserOrderDetailsModal;
