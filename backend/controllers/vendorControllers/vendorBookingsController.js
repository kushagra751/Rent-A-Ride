import Booking from "../../models/BookingModel.js";
import { errorHandler } from "../../utils/error.js";

const allowedStatuses = [
  "notBooked",
  "booked",
  "onTrip",
  "notPicked",
  "canceled",
  "overDue",
  "tripCompleted",
];

export const vendorBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      {
        $addFields: {
          vehicleDetails: {
            $arrayElemAt: ["$vehicleDetails", 0],
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
          pickupDate: -1,
        },
      },
    ]);

    res.status(200).json(bookings || []);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in vendorBookings"));
  }
};

export const updateVendorBookingStatus = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body || {};

    if (!bookingId || !status) {
      return next(errorHandler(400, "booking id and status are required"));
    }

    if (!allowedStatuses.includes(status)) {
      return next(errorHandler(400, "invalid booking status"));
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(errorHandler(404, "booking not found"));
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: "booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error updating vendor booking status"));
  }
};
