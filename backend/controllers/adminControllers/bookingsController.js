import Booking from "../../models/BookingModel.js";
import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

export const allBookings = async (req, res, next) => {
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
        $unwind: {
          path: "$vehicleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          userDetails: {
            $arrayElemAt: ["$userDetails", 0],
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

    if (!bookings) {
      next(errorHandler(404, "no bookings found"));
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in allBookings"));
  }
};

//chnage bookings status

export const changeStatus = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "bad request vehicle id and new status needed"));
      return;
    }
    const { id, status } = req.body;

    const statusChanged = await Booking.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (!statusChanged) {
      next(errorHandler(404, "status not changed or wrong id"));
      return;
    }

    const vehicleStatusMap = {
      canceled: false,
      notBooked: false,
      tripCompleted: false,
      booked: true,
      onTrip: true,
      notPicked: true,
      overDue: true,
    };

    if (statusChanged.vehicleId) {
      await Vehicle.findByIdAndUpdate(statusChanged.vehicleId, {
        isBooked: vehicleStatusMap[status] ?? true,
      });
    }

    res.status(200).json({ message: "status changed" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in changeStatus"));
  }
};
