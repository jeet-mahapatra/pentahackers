import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    let token;

    // cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // header fallback    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { adminMiddleware };

