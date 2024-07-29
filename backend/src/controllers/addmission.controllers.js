import asyncHandler from "../middlewares/asyncHandler.js";
import addMissionFormModel from "../models/addmission_form.models.js";

export const createAddMissionController = asyncHandler(
  async (req, res, next) => {
    const {
      //rollNumber,
      companyName,
      name,
      father_name,
      mobile_number,
      phone_number,
      present_address,
      //permanent_address,
      date_of_birth,
      city,
      email,
      education_qualification,
      //professional_qualification,
      select_course,
      //document_attached,
      //select_software,
      // name_of_person_for_commision,
      // commision_paid,
      // commision_date,
      // commision_voucher_number,
      course_fees,
      discount,
      netCourseFees,
      //remainingCourseFees,
      //down_payment,
      date_of_joining,
      no_of_installments,
    } = req.body;

    // console.log(req.file);
    const file = req?.file?.filename;
    switch (true) {
      case !companyName:
        res.status(400);
        throw new Error("Please provide company Name field!");
        return;
      // case !rollNumber:
      //   res.status(400);
      //   throw new Error("Please provide roll Number field!");
      //   return;
      case !file:
        res.status(400);
        throw new Error("Please provide image field!");
        return;
      case !name:
        res.status(400);
        throw new Error("Please provide name field!");
        return;
      case !father_name:
        res.status(400);
        throw new Error("Please provide father Name field!");
        return;
      case !mobile_number:
        res.status(400);
        throw new Error("Please provide mobile number field!");
        return;
      case !phone_number:
        res.status(400);
        throw new Error("Please provide phone number field!");
        return;
      case !present_address:
        res.status(400);
        throw new Error("Please provide present address field!");
        return;

      case !date_of_birth:
        res.status(400);
        throw new Error("Please provide date of birth field!");
        return;
      case !city:
        res.status(400);
        throw new Error("Please provide city field!");
        return;
      case !email:
        res.status(400);
        throw new Error("Please provide email field!");
        return;
      // case !student_status:
      //   res.status(400);
      //   throw new Error("Please provide student status field!");
      //   return;
      case !education_qualification:
        res.status(400);
        throw new Error("Please provide education qualification field!");
        return;

      case !select_course:
        res.status(400);
        throw new Error("Please provide select course field!");
        return;

      // case !name_of_person_for_commision:
      //   res.status(400);
      //   throw new Error("Please provide name of person for commision field!");
      //   return;
      // case !commision_paid:
      //   res.status(400);
      //   throw new Error("Please provide commision paid field!");
      //   return;
      // case !commision_date:
      //   res.status(400);
      //   throw new Error("Please provide commision date field!");
      //   return;

      case !course_fees:
        res.status(400);
        throw new Error("Please provide course fees field!");
        return;
      case !discount:
        res.status(400);
        throw new Error("Please provide  course fees discount field!");
        return;
      case !netCourseFees:
        res.status(400);
        throw new Error("Please provide  course net fees field!");
        return;

      case !date_of_joining:
        res.status(400);
        throw new Error("Please provide date of joining field!");
        return;
      case !no_of_installments:
        res.status(400);
        throw new Error("Please provide number of installements  field!");
        return;

      default:
        break;
    }

    const existedAddmission = await addMissionFormModel.findOne({
      mobile_number,
    });

    if (existedAddmission) {
      return res.status(400).json({
        success: false,
        message: "Admission already done with this mobile_number!",
      });
      // throw new Error("with this email addmission already done!");
    }

    let newAddmission = await addMissionFormModel.create({
      ...req.body,
      image: file,
    });

    res.status(200).json({
      success: true,
      message: "Addmission done successfully!!",
    });
  }
);

export const getSingleStudentByIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const student = await addMissionFormModel.findById(req.params.id);
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found!" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
