import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/users.routes.js";
import addMissionFormRoutes from "./routes/addMissionForm.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import courseRoutes from "./routes/course.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import courseFeesRoutes from "./routes/courseFees.routes.js";
import paymentOptionsRoutes from "./routes/paymentOptions.routes.js";
import companyRoutes from "./routes/company.routes.js";
import emailRemainderRoutes from "./routes/emailRemainder.routes.js";
import whatsAppMessageSuggestionRoutes from "./routes/whatsAppMessageSuggestion.routes.js";
import dayBookRoutes from "./routes/dayBook.routes.js";
import studentGstSuggestionsRoutes from "./routes/studentGstSuggestions.routes.js";
import { BACKEND_URL, FRONTEND_URL } from "./config/config.js";
const app = express();

// Apply CORS middleware with options
app.use(cors({ origin: [BACKEND_URL, FRONTEND_URL], credentials: true }));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api/addmission_form", addMissionFormRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/courseFees", courseFeesRoutes);
app.use("/api/paymentOptions", paymentOptionsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/emailRemainder", emailRemainderRoutes);
app.use("/api/whatsAppMessageSuggestion", whatsAppMessageSuggestionRoutes);
app.use("/api/student-gst-suggestions", studentGstSuggestionsRoutes);
app.use("/api/dayBook", dayBookRoutes);
const __dirname = path.resolve();
app.use("/api/images", express.static(path.join(__dirname + "/images")));
app.use(express.static(path.join(__dirname, "./build")));

//app.use(sendRemainderFeesStudent);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});
export default app;
