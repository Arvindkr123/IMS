import dotenv from "dotenv";
dotenv.config();
export const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  NODE_ENV,
  USER_EMAIL,
  USER_PASSWORD,
  FRONTEND_URL,
  BACKEND_URL,
} = process.env;
