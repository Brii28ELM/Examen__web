const prisma = require("../prisma");

const createBooking = async (userId, date, scheduleId) => {
  if (!date || !scheduleId) {
    const error = new Error("date y scheduleId son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  const parsedScheduleId = parseInt(scheduleId, 10);
  if (isNaN(parsedScheduleId)) {
    const error = new Error("scheduleId debe ser un número");
    error.statusCode = 400;
    throw error;
  }

  // Verificar si el horario existe
  const scheduleExists = await prisma.schedule.findUnique({
    where: { id: parsedScheduleId },
  });
  if (!scheduleExists) {
    const error = new Error("El horario seleccionado no existe");
    error.statusCode = 404;
    throw error;
  }

  // Verificar si ya hay una reserva con ese date y scheduleId
  const occupied = await prisma.booking.findFirst({
    where: {
      date: String(date),
      scheduleId: parsedScheduleId,
    },
  });

  if (occupied) {
    const error = new Error("El horario ya está ocupado");
    error.statusCode = 400;
    throw error;
  }

  const newBooking = await prisma.booking.create({
    data: {
      date: String(date),
      userId,
      scheduleId: parsedScheduleId,
    },
    include: {
      schedule: true,
      user: true,
    },
  });

  return newBooking;
};

const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      schedule: true,
      user: true,
    },
  });
  return booking;
};

const updateBooking = async (id, date, scheduleId) => {
  if (!date || !scheduleId) {
    const error = new Error("date y scheduleId son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  const parsedId = parseInt(id, 10);
  const parsedScheduleId = parseInt(scheduleId, 10);

  // Verificar si el horario existe
  const scheduleExists = await prisma.schedule.findUnique({
    where: { id: parsedScheduleId },
  });
  if (!scheduleExists) {
    const error = new Error("El horario seleccionado no existe");
    error.statusCode = 404;
    throw error;
  }

  // Verificar si el nuevo horario está ocupado por OTRA reserva
  const occupied = await prisma.booking.findFirst({
    where: {
      date: String(date),
      scheduleId: parsedScheduleId,
      NOT: {
        id: parsedId,
      },
    },
  });

  if (occupied) {
    const error = new Error("El nuevo horario está ocupado por otra reserva");
    error.statusCode = 400;
    throw error;
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: parsedId },
    data: {
      date: String(date),
      scheduleId: parsedScheduleId,
    },
    include: {
      schedule: true,
      user: true,
    },
  });

  return updatedBooking;
};

const deleteBooking = async (id) => {
  const parsedId = parseInt(id, 10);
  await prisma.booking.delete({
    where: { id: parsedId },
  });
};

const getUserBookings = async (userId) => {
  const parsedUserId = parseInt(userId, 10);
  const bookings = await prisma.booking.findMany({
    where: { userId: parsedUserId },
    include: {
      schedule: true,
    },
  });
  return bookings;
};

module.exports = {
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
};
