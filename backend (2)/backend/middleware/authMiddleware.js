const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied. No token provided" });
  }

  try {

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : String(authHeader).trim();

    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resolvedUserId =
      decoded?.id ||
      decoded?.userId ||
      decoded?._id ||
      decoded?.user?.id ||
      decoded?.user?._id;

    if (!resolvedUserId) {
      return res.status(401).json({ message: "Invalid Token payload" });
    }

    req.user = {
      ...decoded,
      id: String(resolvedUserId),
    };

    next();

  } catch (error) {

    res.status(401).json({ message: "Invalid Token" });

  }

};

module.exports = authMiddleware;