const prisma = require("../prisma");

const authorizeBooking = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        schedule: true,
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (req.user.role !== "ADMIN" && booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: Not your booking" });
    }

    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorizeBooking;
