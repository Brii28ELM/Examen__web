const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const {
  createScheduleController,
  getBookingsController,
} = require("../controllers/adminController");

const router = Router();

// Todas las rutas de admin requieren token y rol ADMIN
router.use(authenticateToken, authorizeAdmin);

router.post("/schedules", createScheduleController);
router.get("/bookings", getBookingsController);

module.exports = router;
