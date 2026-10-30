const authorizeUser = (req, res, next) => {
  const paramId = parseInt(req.params.id, 10);
  if (isNaN(paramId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (req.user.role !== "ADMIN" && req.user.id !== paramId) {
    return res.status(403).json({ error: "Forbidden: Not your user" });
  }

  next();
};

module.exports = authorizeUser;
