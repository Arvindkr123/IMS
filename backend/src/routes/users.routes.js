import { Router } from "express";

import {
  addUsersControllers,
  getUserByTokn,
  editUserController,
  loginUserController,
  requsetUserPasswordController,
  getAllUsersController,
  deleteUserController,
  getUserByIdController,
  registerUserController,
} from "../controllers/user.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";

let router = Router();
router.post("/register", registerUserController);
router.post("/users/auth", loginUserController);
router
  .route("/users")
  .get(requireSignIn, getAllUsersController)
  .post(requireSignIn, isAdmin, addUsersControllers);
router.post("/users/verifyToken", getUserByTokn);
router.post("/users/requestPassword", requsetUserPasswordController);
router
  .route("/users/:id")
  .get(requireSignIn, isAdmin, getUserByIdController)
  .delete(requireSignIn, isAdmin, deleteUserController)
  .post(requireSignIn, isAdmin, editUserController);

export default router;
