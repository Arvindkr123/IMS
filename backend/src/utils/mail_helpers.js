import { createTransport } from "nodemailer";
import { USER_EMAIL, USER_PASSWORD } from "../config/config.js";

export const mailTransporter = createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});
