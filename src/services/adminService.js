const prisma = require("../prisma");

const createSchedule = async (court, startTime, endTime) => {
  if (!court || !startTime || !endTime) {
    throw new Error("court, startTime y endTime son obligatorios");
  }

  const newSchedule = await prisma.schedule.create({
    data: {
      court,
      startTime,
      endTime,
    },
  });

  return newSchedule;
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      schedule: true,
    },
  });
  return bookings;
};

module.exports = {
  createSchedule,
  getAllBookings,
};
