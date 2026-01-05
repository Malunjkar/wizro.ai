import jwt from "jsonwebtoken";
import dotenv from "dotenv";
 
dotenv.config();
 
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  process.env.SECRET_KEY ||
  "sahil_1234";
 
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
 
    const token = authHeader.split(" ")[1];
 
    // ✅ SAME SECRET AS LOGIN
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
 
    req.user = {
      user_id: decoded.id,
      role: decoded.role,
    };
 
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
 
export default authMiddleware;
 
 