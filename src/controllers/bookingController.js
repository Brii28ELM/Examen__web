const {
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../services/bookingService");

const create = async (req, res, next) => {
  try {
    const { date, scheduleId } = req.body;
    const userId = req.user.id;
    const booking = await createBooking(userId, date, scheduleId);
    return res.status(201).json(booking);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

const getById = (req, res) => {
  // Ya fue validado y recuperado por authorizeBooking
  return res.json(req.booking);
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, scheduleId } = req.body;
    const updated = await updateBooking(id, date, scheduleId);
    return res.json(updated);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteBooking(id);
    return res.status(204).send();
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  create,
  getById,
  update,
  remove,
};
