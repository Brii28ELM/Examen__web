const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. ADMIN role required" });
  }
  next();
};

module.exports = authorizeAdmin;
