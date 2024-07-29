import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";

export const connectDB = async () => {
    try {
        const res = await mongoose.connect(MONGO_URI);
        console.log(`Database connection established at host ${res.connection.host}`);
    } catch (error) {
        console.log(`Error while connecting to db ${error.message}`);
    }
}