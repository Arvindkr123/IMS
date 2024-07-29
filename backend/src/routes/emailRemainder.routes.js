import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addEmailRemainderController,
  addEmailSuggestionController,
  getEmailSuggestionController,
} from "../controllers/emailremainder.controllers.js";
const router = Router();

router.post("/status", requireSignIn, isAdmin, addEmailSuggestionController);
router.get("/status", requireSignIn, isAdmin, getEmailSuggestionController);
router.post("/", requireSignIn, isAdmin, addEmailRemainderController);

export default router;
