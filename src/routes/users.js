const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const {
  getUserBookingsController,
} = require("../controllers/userController");

const router = Router();

router.get("/:id/bookings", authenticateToken, authorizeUser, getUserBookingsController);

module.exports = router;
