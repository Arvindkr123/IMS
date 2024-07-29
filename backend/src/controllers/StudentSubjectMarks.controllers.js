import asyncHandler from "../middlewares/asyncHandler.js";
import studentSubjectMarksModel from "../models/subject/student.subject.marks.models.js";

export const addCourseSubjectMarksController = asyncHandler(
  async (req, res, next) => {
    //console.log("Received request to add marks:", req.body);

    try {
      // Check if a record already exists for the student, subject, and course combination
      const existingRecord = await studentSubjectMarksModel.findOne({
        studentInfo: req.body.studentId,
        Subjects: req.body.subjectId,
        course: req.body.courseId,
        companyName: req.body.companyName,
      });

      if (existingRecord) {
        console.log("Record already exists:", existingRecord);
        return res.status(400).json({
          success: false,
          message: "Marks for this subject already added",
        });
      }

      const saveStudentSubjectMarks = new studentSubjectMarksModel({
        ...req.body,
        studentInfo: req.body.studentId,
        Subjects: req.body.subjectId,
        course: req.body.courseId,
        companyName: req.body.companyName,
      });

      await saveStudentSubjectMarks.save();
      res.status(200).json({ success: true, message: "Marks added" });
    } catch (error) {
      console.log("Error while adding marks:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getCourseSubjectMarksController = asyncHandler(
  async (req, res, next) => {
    try {
      const studentSubjectMarks = await studentSubjectMarksModel
        .find({ studentInfo: req.params.studentId })
        .populate(["studentInfo", "Subjects", "course", "companyName"]);
      res.status(200).json(studentSubjectMarks);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const updateCourseSubjectMarksController = asyncHandler(
  async (req, res, next) => {
    console.log(req.params);
    try {
      const { marksId } = req.params;
      const findStudentSubjectMarks = await studentSubjectMarksModel.findById(
        marksId
      );
      if (!findStudentSubjectMarks) {
        return res.status(404).json({ message: "Marks not found" });
      }

      findStudentSubjectMarks.theory =
        req.body.theory || findStudentSubjectMarks.theory;
      findStudentSubjectMarks.practical =
        req.body.practical || findStudentSubjectMarks.practical;
      findStudentSubjectMarks.totalMarks =
        req.body.totalMarks || findStudentSubjectMarks.totalMarks;
      findStudentSubjectMarks.studentInfo =
        req.body.studentId || findStudentSubjectMarks.studentInfo;
      findStudentSubjectMarks.Subjects =
        req.body.subjectId || findStudentSubjectMarks.Subjects;
      findStudentSubjectMarks.course =
        req.body.courseId || findStudentSubjectMarks.course;

      const updateStudentMarks = await findStudentSubjectMarks.save();
      res.status(200).json("Updated Student Marks Successfully");
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
