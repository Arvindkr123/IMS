import asyncHandler from "../../src/middlewares/asyncHandler.js";
import moment from "moment";
import { userModel } from "../../src/models/user.models.js";
import admissionFormModel from "../../src/models/addmission_form.models.js";
import EmailRemainderModel from "../../src/models/email-remainder/email.remainder.models.js";
import { USER_EMAIL } from "../../src/config/config.js";
import { mailTransporter } from "../../src/utils/mail_helpers.js";

export const sendRemainderFeesStudent = async (req, res, next) => {
  //console.log("req and res", req.url, req.body);
  let adminEmail, superAdminEmail;
  // console.log("sending email reminder");
  try {
    // Fetch admin and super admin emails
    const adminUsers = await userModel.find({});
    adminUsers.forEach((user) => {
      if (user.role === "Admin") {
        adminEmail = user.email;
      }
      if (user.role === "SuperAdmin") {
        superAdminEmail = user.email;
      }
    });

    //console.log(adminUsers);

    // Fetch student information with populated fields
    const studentInfo = await admissionFormModel
      .find()
      .populate(["courseName", "companyName"]);
    //console.log(studentInfo);
    for (const student of studentInfo) {
      const installmentExpireDate = moment(
        student?.no_of_installments_expireTimeandAmount
      );
      const currentTime = moment();
      const diffInDays = installmentExpireDate.diff(currentTime, "days");

      //console.log(student.name, diffInDays);

      // Update installmentPaymentSkipMonth if current time matches installment due date
      if (moment(currentTime).isSame(installmentExpireDate, "day")) {
        if (
          student.student?.no_of_installments_expireTimeandAmount !== undefined
        ) {
          student.installmentPaymentSkipMonth =
            Number(student.installmentPaymentSkipMonth) + 1;
        }
      }

      // Save student's updated information
      await student.save();

      // Fetch email remainder data
      const emailRemainderData = await EmailRemainderModel.findOne({}); // Assuming there's only one document

      //console.log(emailRemainderData);

      // Check if current time is after the installment due date
      if (currentTime.isAfter(installmentExpireDate)) {
        // Calculate days and hours difference
        const daysDifference = currentTime.diff(installmentExpireDate, "days");
        const hoursDifference =
          currentTime.diff(installmentExpireDate, "hours") % 24;

        // Send email based on specific days/hours difference
        let emailContent;
        if (daysDifference === 1 && hoursDifference === 12) {
          emailContent = emailRemainderData.firstRemainder;
        } else if (daysDifference === 10 && hoursDifference === 12) {
          emailContent = emailRemainderData.secondRemainder;
        } else if (daysDifference === 12 && hoursDifference === 12) {
          emailContent = emailRemainderData.thirdRemainder;
        } else if (daysDifference === 15 && hoursDifference === 12) {
          emailContent = emailRemainderData.firstRemainder;
        }

        if (emailContent) {
          // Prepare recipients list for email
          const toEmails = `${req?.user?.email}, ${student?.email}, ${student?.companyName.email}, thakurarvindkr10@gmail.com, ${adminEmail}, ${superAdminEmail}`;

          // Send email
          await sendEmail(
            toEmails,
            "Installment Payment Reminder",
            emailContent
          );
        }
      }
    }

    // Proceed to next middleware or route handler
    next();
    //console.log("send mail");
  } catch (error) {
    console.error("Error in sendRemainderFeesStudent:", error);
    // Handle error appropriately, e.g., send response or log further
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Function to send email
export async function sendEmail(toEmails, subject, text, html) {
  const mailOptions = {
    from: USER_EMAIL,
    to: toEmails,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const result = await mailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully", result);
  } catch (error) {
    console.log("Email send failed with error:", error);
    throw new Error("Failed to send email");
  }
}

export default sendRemainderFeesStudent;
