import { Router } from "express";
import {
  addSubjectController,
  getCourseSubjectsListsController,
  updateCourseSubjectController,
  deleteCourseSubjectController,
  getSubjectBasedOnCourseController,
} from "../controllers/subject.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addCourseSubjectMarksController,
  getCourseSubjectMarksController,
  updateCourseSubjectMarksController,
} from "../controllers/StudentSubjectMarks.controllers.js";
const router = Router();

router
  .route("/")
  .post(requireSignIn, isAdmin, addSubjectController)
  .get(requireSignIn, getCourseSubjectsListsController);
router
  .route("/:id")
  .put(requireSignIn, isAdmin, updateCourseSubjectController)
  .delete(requireSignIn, isAdmin, deleteCourseSubjectController);

router.post("/marks", addCourseSubjectMarksController);
router.get("/marks/:studentId", getCourseSubjectMarksController);
router.put("/marks/:studentId/:marksId", updateCourseSubjectMarksController);
// get subject according to course
router.get("/:courseId", getSubjectBasedOnCourseController);

export default router;
