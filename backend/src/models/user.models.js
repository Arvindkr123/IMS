import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
    },
    lName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "Accounts",
        "Counsellor",
        "Telecaller",
        "Admin",
        "SuperAdmin",
        "Student",
      ],
      default: "Student",
      // required: true,
    },
    api_token: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
