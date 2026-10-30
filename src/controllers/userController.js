const { getUserBookings } = require("../services/bookingService");

const getUserBookingsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookings = await getUserBookings(id);
    return res.json(bookings);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  getUserBookingsController,
};
