const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");
const {
  create,
  getById,
  update,
  remove,
} = require("../controllers/bookingController");

const router = Router();

// Todas las rutas de bookings requieren autenticación
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, authorizeBooking, getById);
router.put("/:id", authenticateToken, authorizeBooking, update);
router.delete("/:id", authenticateToken, authorizeBooking, remove);

module.exports = router;
