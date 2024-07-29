import mongoose from "mongoose";

const studentSubjectMarksSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
    Subjects: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    theory: {
      type: Number,
      default: 0,
    },
    practical: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const studentSubjectMarksModel = mongoose.model(
  "StudentSubjectMarks",
  studentSubjectMarksSchema
);
export default studentSubjectMarksModel;
