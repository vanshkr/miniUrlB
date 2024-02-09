import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/userSchema.js";
dotenv.config();

export const session = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    if (decodedToken.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Token expired" });
    }
    const userDetails = await UserModel.findOne({
      email: decodedToken?.email,
      _id: decodedToken?.id,
    });
    if (!userDetails) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = decodedToken.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
