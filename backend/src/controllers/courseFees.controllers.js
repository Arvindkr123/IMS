import mongoose, { get, now } from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { BACKEND_URL, USER_EMAIL } from "../config/config.js";
import { mailTransporter } from "../utils/mail_helpers.js";
import { MailHTML } from "../../helpers/mail/index.js";
import CourseModel from "../models/course/courses.models.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";
import CompanyModels from "../models/company/company.models.js";
import EmailSuggestionModel from "../models/email-remainder/EmailSuggestions.models.js";
import EmailRemainderModel from "../models/email-remainder/email.remainder.models.js";
import { userModel } from "../models/user.models.js";
import DayBookDataModel from "../models/day-book/DayBookData.models.js";
import moment from "moment";
import SubjectModel from "../models/subject/subject.models.js";
import StudentGST_GuggestionModel from "../models/email-remainder/Student.GST.Suggestion.js";

export const createCourseFeesController = asyncHandler(
  async (req, res, next) => {
    console.log("from create course fees ->>>>", req.body);
    try {
      const {
        studentInfo,
        remainingFees,
        amountPaid,
        amountDate,
        lateFees,
        paymentOption,
      } = req.body;

      // Validate required fields
      if (!amountPaid || !amountDate || !studentInfo) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      const emailSuggestionsStatus = await EmailSuggestionModel.find({});
      // console.log(
      //   "email suggestions status ->>>>>>>>>",
      //   emailSuggestionsStatus
      // );
      // get the status of student GST

      //console.log(studentGSTStatus[0].studentGST_Guggestion);
      // const gstAmount =
      //   student.student_status === "GST"
      //     ? (Number(amountPaid) *
      //         (studentGSTStatus[0].studentGST_Guggestion === true ? 18 : 0)) /
      //       100
      //     : 0;

      // Fetch student and validate remaining fees
      const student = await admissionFormModel
        .findById(studentInfo)
        .populate(["courseName", "companyName"]);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      //console.log("from student create fees", student);
      const existingDataModel = await DayBookDataModel.find({
        companyId: student?.companyName._id,
      }).sort({
        createdAt: -1,
      });
      //console.log("day book data model", existingDataModel);

      //console.log(BACKEND_URL + "/api/images/" + student.companyName.logo);

      // get the admin email and super admin email addresses
      let adminEmail, superAdminEmail;
      const adminUser = await userModel.find({});
      adminUser.forEach((user) => {
        //sconsole.log(user);
        if (user.role === "Admin") {
          adminEmail = user.email;
        }
        if (user.role === "SuperAdmin") {
          superAdminEmail = user.email;
        }
      });

      // generate the recipt number from
      let reciptNumber;
      if (student.companyName.reciptNumber) {
        reciptNumber = student.companyName.reciptNumber;
      }

      const newDayBookData = new DayBookDataModel({
        studentInfo: student._id,
        rollNo: student.rollNumber,
        StudentName: student.name,
        studentLateFees: +lateFees,
        companyId: student?.companyName?._id,
        dayBookDatadate: amountDate,
        reciptNumber,
        credit: +amountPaid,
        balance:
          (existingDataModel[0]?.balance || 0) +
          Number(amountPaid) +
          Number(lateFees),
      });

      await newDayBookData.save();

      const studentGSTStatus = await StudentGST_GuggestionModel.find();
      //console.log(studentGSTStatus[0].studentGST_Guggestion);
      let gstAmount =
        student.companyName.isGstBased === "Yes"
          ? (Number(amountPaid) / (studentGSTStatus[0]?.gst_percentage + 100)) *
            100
          : Number(amountPaid);
      let cutGSTAmount = amountPaid - gstAmount;
      //console.log("gst amount: " + gstAmount);

      if (
        Number(req.body.remainingFees) === 0 &&
        student.installmentPaymentSkipMonth === 0
      ) {
        student.remainingCourseFees = 0;
        student.no_of_installments_expireTimeandAmount = null;
        // Save course fees
        const newCourseFees = new CourseFeesModel({
          ...req.body,
          reciptNumber,
          companyName: student.companyName._id,
          gst_percentage: studentGSTStatus[0]?.gst_percentage,
        });

        const savedCourseFees = await newCourseFees.save();
        // const currentCompany = await CompanyModels.findById(
        //   student.companyName._id
        // );

        student.down_payment = amountPaid;
        student.remainingCourseFees = remainingFees;
        student.totalPaid += amountPaid;
        student.no_of_installments = 0;
        const findPaymentOptionName = await PaymentOptionsModel.findById(
          paymentOption
        );
        //console.log(findPaymentOptionName);
        // Send email asynchronously

        let companyLogoURL =
          BACKEND_URL + "/api/images/" + student.companyName.logo;
        // Send email asynchronously

        if (emailSuggestionsStatus[0].emailSuggestionStatus) {
          sendEmail(
            `${req.user.email}, ${student.email} ${student.companyName.email},${adminEmail},${superAdminEmail}, visualmediatechnology@gmail.com`,
            ` Your Fees Submitted Successfully - ${student.companyName.companyName}`,
            `Hello ${student.name} you have submitted fees `,
            `<!DOCTYPE html>
          <html>
      
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <title>Email Receipt</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style type="text/css">
              /**
                     * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                     */
              @media screen {
                @font-face {
                  font-family: "Source Sans Pro";
                  font-style: normal;
                  font-weight: 400;
                  src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
                    url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
                }
      
                @font-face {
                  font-family: "Source Sans Pro";
                  font-style: normal;
                  font-weight: 700;
                  src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                    url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
                }
              }
      
              /**
                     * Avoid browser level font resizing.
                     * 1. Windows Mobile
                     * 2. iOS / OSX
                     */
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%;
                /* 1 */
                -webkit-text-size-adjust: 100%;
                /* 2 */
              }
      
              /**
                     * Remove extra space added to tables and cells in Outlook.
                     */
              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }
      
              /**
                     * Better fluid images in Internet Explorer.
                     */
              img {
                -ms-interpolation-mode: bicubic;
              }
      
              /**
                     * Remove blue links for iOS devices.
                     */
              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
      
              /**
                     * Fix centering issues in Android 4.4.
                     */
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
      
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
      
              /**
                     * Collapse table borders to avoid space between cells.
                     */
              table {
                border-collapse: collapse !important;
              }
      
              a {
                color: #1a82e2;
              }
      
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
            </style>
          </head>
      
          <body style="background-color: #d2c7ba">
            <!-- start preheader -->
            <div class="preheader" style="
                          display: none;
                          max-width: 0;
                          max-height: 0;
                          overflow: hidden;
                          font-size: 1px;
                          line-height: 1px;
                          color: #fff;
                          opacity: 0;
                        ">
              A preheader is the short summary text that follows the subject line when
              an email is viewed in the inbox.
            </div>
            <!-- end preheader -->
      
            <!-- start body -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <!-- start logo -->
              <tr>
                <td align="center" bgcolor="#D2C7BA">
                  <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                    <tr>
                      <td align="center" valign="top" style="padding: 36px 24px">
                        <a href="http://www.visualmedia.co.in/" target="_blank" style="display: inline-block">
                          <img src=${companyLogoURL} alt="Logo" border="0" width="200px" style="
                                        display: block;
                                        width: 350px;
                                        max-width: 350px;
                                        min-width: 300px;
                                      " />
                        </a>
                      </td>
                    </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                </td>
              </tr>
              <!-- end logo -->
      
              <!-- start hero -->
              <tr>
                <td align="center" bgcolor="#D2C7BA">
                  <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="
                                    padding: 36px 24px 0;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    border-top: 3px solid #d4dadf;
                                  ">
                                  <h6 style="
                                  margin: 0;
                                  font-size: 27px;
                                  font-weight: 700;
                                  letter-spacing: -1px;
                                  line-height: 30px;
                                  text-align: left;
                                ">
                                Thank You, Your Fees Submitted Successfully
                    </h6>
                      </td>
                    </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                </td>
              </tr>
              <!-- end hero -->
              <!-- start student info block -->
          <tr>
          <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
          <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
            style="max-width: 600px">
            <tr>
              <td align="center" valign="top" style="font-size: 0;">
      
                <div style="display:inline-block;width:100%;max-width: 30%;vertical-align:top;margin-top: 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
                    <tr>
                      <td valign="top" style="
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 12px;
                                      ">
                        <span style="display:block; width:max-content;"><strong>Student Name</strong></span>
                        <span style="display:block; width:max-content;"><strong>Father Name</strong></span>
                        <span style="display:block; width:max-content;"><strong>Roll Number</strong></span>
                        <span style="display:block; width:max-content;"><strong>Course Name</strong></span>
                        <span style="display:block; width:max-content;"><strong>Payment Method</strong></span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div style="display:inline-block;width:100%;max-width: 50%;vertical-align:top;margin-top: 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
                    <tr>
                      <td valign="top" style="
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 12px;
                                        
                                      ">
                        <span style="display:block;width:max-content;">${
                          student.name
                        }</span>
                        <span style="display:block;width:max-content;">
                          ${student.father_name}
                        </span>
                        
                          <span style="display:block;width:max-content;">
                          ${student.rollNumber}
                        </span>
                        <span style="display:block;width:max-content;">
                        ${student.courseName.courseName}
                        </span>
                        <span style="display:block;width:max-content;">
                        ${findPaymentOptionName.name}
                        </span>
                        
                      </td>
                    
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
          </td>
          </tr>
          <!-- end student info block -->
      
      
              <!-- start copy block -->
              <tr>
                <td align="center" bgcolor="#D2C7BA">
                  <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                    <!-- start copy -->
                  
                    <!-- end copy -->
      
                    <!-- start receipt table -->
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="
                                    padding: 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 14px;
                                    line-height: 24px;
                                  ">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="left" bgcolor="#D2C7BA" width="75%" style="
                                          padding: 12px;
                                          font-family: 'Source Sans Pro', Helvetica, Arial,
                                            sans-serif;
                                          font-size: 16px;
                                          line-height: 24px;
                                        ">
                              <strong>Recipt No</strong>
                            </td>
                            <td align="left" bgcolor="#D2C7BA" width="25%" style="
                                          padding: 12px;
                                          font-family: 'Source Sans Pro', Helvetica, Arial,
                                            sans-serif;
                                          font-size: 14px;
                                          line-height: 24px;
                                        ">
                              <strong>${
                                student.companyName.reciptNumber
                              }</strong>
                            </td>
                          </tr> 
                          <tr>
                            <td align="left" width="75%" style="
                                          padding: 6px 12px;
                                          font-family: 'Source Sans Pro', Helvetica, Arial,
                                            sans-serif;
                                          font-size: 12px;
                                          line-height: 24px;
                                        ">
                              Fees Paid
                            </td>
                           
                           
                            ${
                              student.companyName.isGstBased === "Yes"
                                ? ` <td
                                  align="left"
                                  width="25%"
                                  style="
                              padding: 6px 12px;
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 12px;
                              line-height: 24px;
                            "
                                >
                                  Rs ${Number(gstAmount.toFixed(2))}
                                </td>`
                                : ` <td
                                  align="left"
                                  width="25%"
                                  style="
                                          padding: 6px 12px;
                                          font-family: 'Source Sans Pro', Helvetica, Arial,
                                            sans-serif;
                                          font-size: 12px;
                                          line-height: 24px;
                                        "
                                >
                                  Rs ${Number(amountPaid)}
                                </td>`
                            }
                            
                            
                          </tr>
      
      
      
      
                          <tr>
                            <td align="left" width="75%" style="
                                    padding: 6px 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial,
                                      sans-serif;
                                    font-size: 12px;
                                    line-height: 24px;
                                  ">
                              Late Fees
                            </td>
                            <td align="left" width="25%" style="
                                    padding: 6px 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial,
                                      sans-serif;
                                    font-size: 12px;
                                    line-height: 24px;
                                  ">
                             Rs ${lateFees} 
                            </td>
                          </tr>
                          ${
                            student.companyName.isGstBased === "Yes"
                              ? `<tr>
                                <td
                                  align="left"
                                  width="75%"
                                  style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 12px;
                          line-height: 24px;
                        "
                                >
                                  GST (${studentGSTStatus[0]?.gst_percentage} %)
                                </td>
    
                                <td
                                  align="left"
                                  width="25%"
                                  style="
                                    padding: 6px 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial,
                                      sans-serif;
                                    font-size: 12px;
                                    line-height: 24px;
                                  "
                                >
                                Rs ${cutGSTAmount.toFixed(2)}
                                  
                                </td>
                              </tr>`
                              : ""
                          }
                          
                        
                          <tr style='border:2px dotted black;'>
      <td align="left" width="75%" style="
              padding: 6px 12px;
              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
              font-size: 12px;
              line-height: 24px;
          ">
          Total Amount
      </td>
      <td align="left" width="25%" style="
              padding: 6px 12px;
              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
              font-size: 12px;
              line-height: 24px;
          ">
          Rs ${
            student.companyName.isGstBased === "No"
              ? (Number(lateFees) + Number(amountPaid)).toFixed(2)
              : (Number(lateFees) + Number(gstAmount + cutGSTAmount)).toFixed(2)
          } 
      </td>
    </tr>
    
                          <!-- end reeipt table -->
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                              </td>
                              </tr>
      
                            
      
                          </table>
                          <![endif]-->
                      </td>
                    </tr>
                    <!-- end copy block -->
      
                    <!-- start 1 copy block -->
                    <!-- end copy block -->
      
                    <!-- start receipt address block -->
                    <tr>
                      <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
                        <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                        <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
                          style="max-width: 600px">
                          <tr>
                            <td align="center" valign="top" style=" border-bottom: 3px solid #d4dadf">
                              <!--[if (gte mso 9)|(IE)]>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                                <tr>
                                <td align="left" valign="top" width="300">
                                <![endif]-->
                            
                              <!--[if (gte mso 9)|(IE)]>
                                </td>
                                <td align="center" valign="top" width="100%">
                                <![endif]-->
                              <div style="
                                      display: inline-block;
                                      width: 100%;
                                      
                                      vertical-align: top;
                                    ">
                                   <p>
                                   ${student.companyName.companyAddress}
                                   </p> 
                                   <p>
                                   Contact Us : ${
                                     student.companyName.companyPhone
                                   }
                                   </p> 
                                   <p>
                                   website : ${
                                     student.companyName.companyWebsite
                                   } 
                                   E-mail: ${student.companyName.email}
                               </p> 
                              
                               
                              </div>
                              <!--[if (gte mso 9)|(IE)]>
                                </td>
                                </tr>
                                </table>
                                <![endif]-->
                            </td>
                          </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                      </td>
                    </tr>
                    <!-- end receipt address block -->
      
                    <!-- start footer -->
                    <tr>
                      <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
                        <!--[if (gte mso 9)|(IE)]>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                          <tr>
                          <td align="center" valign="top" width="600">
                          <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                          <!-- start permission -->
                          <tr>
                            <td align="center" bgcolor="#D2C7BA" style="
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 14px;
                                    line-height: 20px;
                                    color: #666;
                                  ">
                                  <span style="display:block;">
                                  CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
                                  DEMANDED
                                </span>
                                <span style="display:block;">FEES ONCE PAID ARE NOT REFUNDABLE</span>
                            </td>
                          </tr>
                          <!-- end permission -->
      
                          <!-- start unsubscribe -->
                          <tr>
                            <td align="center" bgcolor="#D2C7BA" style="
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 14px;
                                    line-height: 20px;
                                    color: #666;
                                  ">
                              <p style="margin: 0">
                                To stop receiving these emails, you can
                                <a href="http://www.visualmedia.co.in/" target="_blank">unsubscribe</a>
                                at any time.
                              </p>
                            
                            
                            </td>
                          </tr>
                          <!-- end unsubscribe -->
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
                      </td>
                    </tr>
                    <!-- end footer -->
                  </table>
                  <!-- end body -->
          </body>
      
          </html>`
          );
        }

        await student.save();
        return res.status(200).json({ message: "all course fees paid" });
      }

      // Save course fees
      const newCourseFees = new CourseFeesModel({
        ...req.body,
        reciptNumber,
        companyName: student.companyName._id,
        gst_percentage: studentGSTStatus[0]?.gst_percentage,
      });
      let reciptNumberString = Number(reciptNumber.split("-")[1]) + 1;
      const savedCourseFees = await newCourseFees.save();
      const currentCompany = await CompanyModels.findById(
        student.companyName._id
      );

      //console.log(reciptNumberString);

      currentCompany.reciptNumber =
        reciptNumber.split("-")[0] + "-" + reciptNumberString;
      await currentCompany.save();

      //console.log("saved course fees", savedCourseFees);

      // Update student's payment information
      student.down_payment = amountPaid;
      student.remainingCourseFees = remainingFees;
      student.totalPaid += amountPaid;
      student.no_of_installments -= 1;

      // Calculate and store new installment expiration times
      let expirationDate = moment(amountDate).toDate();
      //console.log(expirationDate);
      // if (student.no_of_installments_expireTimeandAmount) {
      //   // Get the expiration date of the last installment
      //   const lastExpirationDate = moment(
      //     student.no_of_installments_expireTimeandAmount
      //   );
      //   // Set the expiration date of the next installment to be one month after the last one
      //   expirationDate = lastExpirationDate.add(1, "months");
      // } else {
      //   // If there are no previous installments, set the expiration date to be one month from now
      // }

      const nextInstallment = Number(req.body.no_of_installments) - 1;
      const installmentAmount = Math.floor(
        Number(req.body.remainingFees) / nextInstallment
      );

      //console.log("Installment amount :  ".installmentAmount);
      const lastPaymentInstallmentExpirationTime =
        await PaymentInstallmentTimeExpireModel.findOne({
          studentInfo,
        }).sort({ createdAt: -1 });
      // console.log(
      //   "last payment installment time",
      //   moment(lastPaymentInstallmentExpirationTime.expiration_date)
      //     .format("DD-MM-YYYY")
      //     .split("-")[1],
      //   moment().format("DD-MM-YYYY").split("-")[1]
      // );
      if (lastPaymentInstallmentExpirationTime) {
        if (
          Number(lastPaymentInstallmentExpirationTime.installment_number) ===
          Number(req.body.no_of_installments)
        ) {
          await lastPaymentInstallmentExpirationTime.deleteOne();
        }
      }

      // Create the entry for the current due installment
      const currentInstallmentExpiration =
        new PaymentInstallmentTimeExpireModel({
          studentInfo,
          companyName: student.companyName._id,
          courseName: req.body.courseName,
          expiration_date: expirationDate, // Set to current date
          installment_number: req.body.no_of_installments, // Current installment number
          installment_amount: amountPaid,
        });
      expirationDate = moment(amountDate).add(1, "months");

      // Create the entry for the next installment
      const nextInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
        studentInfo,
        companyName: student.companyName._id,
        courseName: req.body.courseName,
        expiration_date: expirationDate.toDate(), // Convert moment object to Date
        installment_number: nextInstallment,
        installment_amount: installmentAmount,
      });

      await currentInstallmentExpiration.save();
      await nextInstallmentExpiration.save();

      student.no_of_installments_expireTimeandAmount = expirationDate.toDate(); // Convert moment object to Date
      student.no_of_installments_amount = installmentAmount;
      await student.save();
      const findPaymentOptionName = await PaymentOptionsModel.findById(
        paymentOption
      );
      //console.log("student data from create course fees ", student);
      // console.log(findPaymentOptionName);
      // Send email asynchronously
      let companyLogoURL =
        BACKEND_URL + "/api/images/" + student.companyName.logo;
      if (emailSuggestionsStatus[0].emailSuggestionStatus) {
        sendEmail(
          `${req.user.email}, ${student.email} ${student.companyName.email},${adminEmail},${superAdminEmail}, visualmediatechnology@gmail.com`,
          ` Your Fees Submitted Successfully - ${student.companyName.companyName}`,
          `Hello ${student.name} you have submitted fees `,
          `<!DOCTYPE html>
        <html>
    
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <title>Email Receipt</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style type="text/css">
            /**
                   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                   */
            @media screen {
              @font-face {
                font-family: "Source Sans Pro";
                font-style: normal;
                font-weight: 400;
                src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
                  url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
              }
    
              @font-face {
                font-family: "Source Sans Pro";
                font-style: normal;
                font-weight: 700;
                src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                  url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
              }
            }
    
            /**
                   * Avoid browser level font resizing.
                   * 1. Windows Mobile
                   * 2. iOS / OSX
                   */
            body,
            table,
            td,
            a {
              -ms-text-size-adjust: 100%;
              /* 1 */
              -webkit-text-size-adjust: 100%;
              /* 2 */
            }
    
            /**
                   * Remove extra space added to tables and cells in Outlook.
                   */
            table,
            td {
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            }
    
            /**
                   * Better fluid images in Internet Explorer.
                   */
            img {
              -ms-interpolation-mode: bicubic;
            }
    
            /**
                   * Remove blue links for iOS devices.
                   */
            a[x-apple-data-detectors] {
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              color: inherit !important;
              text-decoration: none !important;
            }
    
            /**
                   * Fix centering issues in Android 4.4.
                   */
            div[style*="margin: 16px 0;"] {
              margin: 0 !important;
            }
    
            body {
              width: 100% !important;
              height: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
    
            /**
                   * Collapse table borders to avoid space between cells.
                   */
            table {
              border-collapse: collapse !important;
            }
    
            a {
              color: #1a82e2;
            }
    
            img {
              height: auto;
              line-height: 100%;
              text-decoration: none;
              border: 0;
              outline: none;
            }
          </style>
        </head>
    
        <body style="background-color: #d2c7ba">
          <!-- start preheader -->
          <div class="preheader" style="
                        display: none;
                        max-width: 0;
                        max-height: 0;
                        overflow: hidden;
                        font-size: 1px;
                        line-height: 1px;
                        color: #fff;
                        opacity: 0;
                      ">
            A preheader is the short summary text that follows the subject line when
            an email is viewed in the inbox.
          </div>
          <!-- end preheader -->
    
          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- start logo -->
            <tr>
              <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                  <tr>
                    <td align="center" valign="top" style="padding: 36px 24px">
                      <a href="http://www.visualmedia.co.in/" target="_blank" style="display: inline-block">
                        <img src=${companyLogoURL} alt="Logo" border="0" width="200px" style="
                                      display: block;
                                      width: 350px;
                                      max-width: 350px;
                                      min-width: 300px;
                                    " />
                      </a>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
              </td>
            </tr>
            <!-- end logo -->
    
            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="
                                  padding: 36px 24px 0;
                                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                  border-top: 3px solid #d4dadf;
                                ">
                                <h6 style="
                                margin: 0;
                                font-size: 27px;
                                font-weight: 700;
                                letter-spacing: -1px;
                                line-height: 30px;
                                text-align: left;
                              ">
                              Thank You, Your Fees Submitted Successfully
                  </h6>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
              </td>
            </tr>
            <!-- end hero -->
            <!-- start student info block -->
        <tr>
        <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
        <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
          style="max-width: 600px">
          <tr>
            <td align="center" valign="top" style="font-size: 0;">
    
              <div style="display:inline-block;width:100%;max-width: 30%;vertical-align:top;margin-top: 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
                  <tr>
                    <td valign="top" style="
                                      font-family: 'Source Sans Pro', Helvetica, Arial,
                                        sans-serif;
                                      font-size: 12px;
                                    ">
                      <span style="display:block; width:max-content;"><strong>Student Name</strong></span>
                      <span style="display:block; width:max-content;"><strong>Father Name</strong></span>
                      <span style="display:block; width:max-content;"><strong>Roll Number</strong></span>
                      <span style="display:block; width:max-content;"><strong>Course Name</strong></span>
                      <span style="display:block; width:max-content;"><strong>Payment Method</strong></span>
                    </td>
                  </tr>
                </table>
              </div>
              <div style="display:inline-block;width:100%;max-width: 50%;vertical-align:top;margin-top: 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
                  <tr>
                    <td valign="top" style="
                                      font-family: 'Source Sans Pro', Helvetica, Arial,
                                        sans-serif;
                                      font-size: 12px;
                                      
                                    ">
                      <span style="display:block;width:max-content;">${
                        student.name
                      }</span>
                      <span style="display:block;width:max-content;">
                        ${student.father_name}
                      </span>
                      
                        <span style="display:block;width:max-content;">
                        ${student.rollNumber}
                      </span>
                      <span style="display:block;width:max-content;">
                      ${student.courseName.courseName}
                      </span>
                      <span style="display:block;width:max-content;">
                      ${findPaymentOptionName.name}
                      </span>
                      
                    </td>
                  
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
        </td>
        </tr>
        <!-- end student info block -->
    
    
            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                  <!-- start copy -->
                
                  <!-- end copy -->
    
                  <!-- start receipt table -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="
                                  padding: 24px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  line-height: 24px;
                                ">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="left" bgcolor="#D2C7BA" width="75%" style="
                                        padding: 12px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 16px;
                                        line-height: 24px;
                                      ">
                            <strong>Recipt No</strong>
                          </td>
                          <td align="left" bgcolor="#D2C7BA" width="25%" style="
                                        padding: 12px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 14px;
                                        line-height: 24px;
                                      ">
                            <strong>${student.companyName.reciptNumber}</strong>
                          </td>
                        </tr> 
                        <tr>
                          <td align="left" width="75%" style="
                                        padding: 6px 12px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 12px;
                                        line-height: 24px;
                                      ">
                            Fees Paid
                          </td>
                         
                         
                          ${
                            student.companyName.isGstBased === "Yes"
                              ? ` <td
                                align="left"
                                width="25%"
                                style="
                            padding: 6px 12px;
                            font-family: 'Source Sans Pro', Helvetica, Arial,
                              sans-serif;
                            font-size: 12px;
                            line-height: 24px;
                          "
                              >
                                Rs ${Number(gstAmount.toFixed(2))}
                              </td>`
                              : ` <td
                                align="left"
                                width="25%"
                                style="
                                        padding: 6px 12px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 12px;
                                        line-height: 24px;
                                      "
                              >
                                Rs ${Number(amountPaid)}
                              </td>`
                          }
                          
                          
                        </tr>
    
    
    
    
                        <tr>
                          <td align="left" width="75%" style="
                                  padding: 6px 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 12px;
                                  line-height: 24px;
                                ">
                            Late Fees
                          </td>
                          <td align="left" width="25%" style="
                                  padding: 6px 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 12px;
                                  line-height: 24px;
                                ">
                           Rs ${lateFees} 
                          </td>
                        </tr>
                        ${
                          student.companyName.isGstBased === "Yes"
                            ? `<tr>
                              <td
                                align="left"
                                width="75%"
                                style="
                        padding: 6px 12px;
                        font-family: 'Source Sans Pro', Helvetica, Arial,
                          sans-serif;
                        font-size: 12px;
                        line-height: 24px;
                      "
                              >
                                GST (${studentGSTStatus[0]?.gst_percentage} %)
                              </td>
  
                              <td
                                align="left"
                                width="25%"
                                style="
                                  padding: 6px 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 12px;
                                  line-height: 24px;
                                "
                              >
                              Rs ${cutGSTAmount.toFixed(2)}
                                
                              </td>
                            </tr>`
                            : ""
                        }
                        
                      
                        <tr style='border:2px dotted black;'>
    <td align="left" width="75%" style="
            padding: 6px 12px;
            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 24px;
        ">
        Total Amount
    </td>
    <td align="left" width="25%" style="
            padding: 6px 12px;
            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 24px;
        ">
        Rs ${
          student.companyName.isGstBased === "No"
            ? (Number(lateFees) + Number(amountPaid)).toFixed(2)
            : (Number(lateFees) + Number(gstAmount + cutGSTAmount)).toFixed(2)
        } 
    </td>
  </tr>
  
                        <!-- end reeipt table -->
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
    
                          
    
                        </table>
                        <![endif]-->
                    </td>
                  </tr>
                  <!-- end copy block -->
    
                  <!-- start 1 copy block -->
                  <!-- end copy block -->
    
                  <!-- start receipt address block -->
                  <tr>
                    <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
                      <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                      <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="max-width: 600px">
                        <tr>
                          <td align="center" valign="top" style=" border-bottom: 3px solid #d4dadf">
                            <!--[if (gte mso 9)|(IE)]>
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                              <tr>
                              <td align="left" valign="top" width="300">
                              <![endif]-->
                          
                            <!--[if (gte mso 9)|(IE)]>
                              </td>
                              <td align="center" valign="top" width="100%">
                              <![endif]-->
                            <div style="
                                    display: inline-block;
                                    width: 100%;
                                    
                                    vertical-align: top;
                                  ">
                                 <p>
                                 ${student.companyName.companyAddress}
                                 </p> 
                                 <p>
                                 Contact Us : ${
                                   student.companyName.companyPhone
                                 }
                                 </p> 
                                 <p>
                                 website : ${
                                   student.companyName.companyWebsite
                                 } 
                                 E-mail: ${student.companyName.email}
                             </p> 
                            
                             
                            </div>
                            <!--[if (gte mso 9)|(IE)]>
                              </td>
                              </tr>
                              </table>
                              <![endif]-->
                          </td>
                        </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </td>
                  </tr>
                  <!-- end receipt address block -->
    
                  <!-- start footer -->
                  <tr>
                    <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
                      <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                        <!-- start permission -->
                        <tr>
                          <td align="center" bgcolor="#D2C7BA" style="
                                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  line-height: 20px;
                                  color: #666;
                                ">
                                <span style="display:block;">
                                CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
                                DEMANDED
                              </span>
                              <span style="display:block;">FEES ONCE PAID ARE NOT REFUNDABLE</span>
                          </td>
                        </tr>
                        <!-- end permission -->
    
                        <!-- start unsubscribe -->
                        <tr>
                          <td align="center" bgcolor="#D2C7BA" style="
                                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  line-height: 20px;
                                  color: #666;
                                ">
                            <p style="margin: 0">
                              To stop receiving these emails, you can
                              <a href="http://www.visualmedia.co.in/" target="_blank">unsubscribe</a>
                              at any time.
                            </p>
                          
                          
                          </td>
                        </tr>
                        <!-- end unsubscribe -->
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </td>
                  </tr>
                  <!-- end footer -->
                </table>
                <!-- end body -->
        </body>
    
        </html>`
        );
      }

      res.status(201).json(savedCourseFees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Function to send email asynchronously
async function sendEmail(toEmails, subject, text, html) {
  const mailOptions = {
    from: USER_EMAIL,
    to: toEmails,
    subject: subject,
    text: text,
    html,
  };

  try {
    const result = await mailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully", result);
  } catch (error) {
    console.log("Email send failed with error:", error);
  }
}

export const getCourseFeesByStudentIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const { studentId } = req.params;

      // Query the database to find student fees
      const studentFees = await CourseFeesModel.find({
        studentInfo: studentId,
      })
        .sort({ createdAt: 1 })
        .populate([
          "courseName",
          "companyName",
          "studentInfo",
          "paymentOption",
        ]);
      //console.log("from student fees controllers ", studentFees);

      // Check if student fees are not found
      if (!studentFees || studentFees.length === 0) {
        return res.status(404).json({ message: "Student fee not found" });
      }

      // Return student fees
      res.status(200).json(studentFees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const getSingleStudentCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const courseFees = await CourseFeesModel.findById(req.params.id).populate(
        ["courseName", "companyName", "studentInfo", "paymentOption"]
      );
      // console.log("get single student course fees ->>>>>>>> ", courseFees);

      if (!courseFees) {
        return res.status(404).json({ message: "Student fee not found" });
      }
      res.status(200).json(courseFees);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const updateSingleStudentCourseFeesController = asyncHandler(
  async (req, res) => {
    const {
      netCourseFees,
      studentInfo,
      remainingFees,
      amountPaid,
      amountDate,
      paymentOption,
      lateFees,
      reciptNumber,
    } = req.body;

    try {
      // Check if a receipt with the same number already exists
      const alreadyReceiptExists = await CourseFeesModel.findOne({
        reciptNumber,
      });
      if (
        alreadyReceiptExists &&
        alreadyReceiptExists._id.toString() !== req.params.id
      ) {
        return res.status(400).json({
          success: false,
          message: "A fee with the same receipt number already exists",
        });
      }

      let currentStudent = await admissionFormModel.findById(studentInfo);
      const oldStudentCourseFees = await CourseFeesModel.findById(
        req.params.id
      );
      console.log(oldStudentCourseFees);

      let getSingleStudentDayBookDataById = await DayBookDataModel.find({
        studentInfo: currentStudent._id,
      });

      // first get all course fees
      let singleStudentAllCourseFees = await CourseFeesModel.find({
        studentInfo: studentInfo,
      });

      // console.log(
      //   "day basdfnaldfkasfasfasfd",
      //   singleStudentAllCourseFees[0].reciptNumber,
      //   getSingleStudentDayBookDataById[0].reciptNumber
      // );
      for (let i = 0; i < singleStudentAllCourseFees.length; i++) {
        getSingleStudentDayBookDataById[i].reciptNumber =
          singleStudentAllCourseFees[i].reciptNumber;
        await getSingleStudentDayBookDataById[i].save();
      }

      let getSingleStudentDayBookData = await DayBookDataModel.find({
        companyId: currentStudent.companyName,
      });

      let updateDataWhichYouWantReciptNumberData;

      for (let i = 0; i < singleStudentAllCourseFees.length; i++) {
        if (singleStudentAllCourseFees[i]._id.toString() === req.params.id) {
          if (i === 0) {
            singleStudentAllCourseFees[i].reciptNumber =
              reciptNumber || singleStudentAllCourseFees[i].reciptNumber;
            singleStudentAllCourseFees[i].amountPaid =
              amountPaid || singleStudentAllCourseFees[i].amountPaid;
            singleStudentAllCourseFees[i].netCourseFees =
              currentStudent.netCourseFees;
            singleStudentAllCourseFees[i].remainingFees =
              currentStudent.netCourseFees - amountPaid ||
              currentStudent.netCourseFees -
                singleStudentAllCourseFees[i].amountPaid;
            singleStudentAllCourseFees[i].amountDate =
              amountDate || singleStudentAllCourseFees[i].amountDate;
            singleStudentAllCourseFees[i].paymentOption =
              paymentOption || singleStudentAllCourseFees[i].paymentOption;
            singleStudentAllCourseFees[i].lateFees =
              lateFees || singleStudentAllCourseFees[i].lateFees;

            currentStudent.totalPaid = amountPaid;
            currentStudent.remainingCourseFees =
              currentStudent.netCourseFees - amountPaid;
          } else {
            if (singleStudentAllCourseFees[i - 1]) {
              singleStudentAllCourseFees[i].netCourseFees =
                singleStudentAllCourseFees[i - 1].remainingFees;
              singleStudentAllCourseFees[i].remainingFees =
                singleStudentAllCourseFees[i - 1].remainingFees - amountPaid ||
                singleStudentAllCourseFees[i - 1].remainingFees -
                  singleStudentAllCourseFees[i].amountPaid;
              singleStudentAllCourseFees[i].amountPaid =
                amountPaid || singleStudentAllCourseFees[i].amountPaid;
              singleStudentAllCourseFees[i].amountDate =
                amountDate || singleStudentAllCourseFees[i].amountDate;
              singleStudentAllCourseFees[i].reciptNumber =
                reciptNumber || singleStudentAllCourseFees[i].reciptNumber;
              singleStudentAllCourseFees[i].paymentOption =
                paymentOption || singleStudentAllCourseFees[i].paymentOption;
              singleStudentAllCourseFees[i].lateFees =
                lateFees || singleStudentAllCourseFees[i].lateFees;
            }
          }

          await singleStudentAllCourseFees[i].save();
          await currentStudent.save();
        } else {
          if (i === 0) {
            singleStudentAllCourseFees[i].remainingFees =
              currentStudent.netCourseFees -
              singleStudentAllCourseFees[i].amountPaid;
          } else {
            singleStudentAllCourseFees[i].netCourseFees =
              singleStudentAllCourseFees[i - 1].remainingFees;
            singleStudentAllCourseFees[i].remainingFees =
              singleStudentAllCourseFees[i - 1].remainingFees -
              singleStudentAllCourseFees[i].amountPaid;
          }

          await singleStudentAllCourseFees[i].save();
          await currentStudent.save();
        }
      }

      singleStudentAllCourseFees = await CourseFeesModel.find({
        studentInfo: studentInfo,
      });

      const totalPaid = singleStudentAllCourseFees.reduce(
        (acc, cur) => acc + cur.amountPaid,
        0
      );
      currentStudent.remainingCourseFees =
        currentStudent.netCourseFees - totalPaid;
      currentStudent.totalPaid = totalPaid;
      await currentStudent.save();

      getSingleStudentDayBookData = await DayBookDataModel.find({
        companyId: currentStudent.companyName,
      });

      // now update the day book data
      // console.log(updateDataWhichYouWantReciptNumberData);
      for (let i = 0; i < getSingleStudentDayBookData.length; i++) {
        if (
          oldStudentCourseFees.reciptNumber ===
          getSingleStudentDayBookData[i].reciptNumber
        ) {
          if (i === 0) {
            getSingleStudentDayBookData[i].reciptNumber =
              reciptNumber || oldStudentCourseFees.reciptNumber;
            getSingleStudentDayBookData[i].credit = amountPaid;
            getSingleStudentDayBookData[i].studentLateFees = lateFees;
            getSingleStudentDayBookData[i].balance = amountPaid + lateFees;
            getSingleStudentDayBookData[i].dayBookDatadate =
              amountDate || getSingleStudentDayBookData[i].dayBookDatadate;
            await getSingleStudentDayBookData[i].save();
          } else {
            getSingleStudentDayBookData[i].reciptNumber =
              reciptNumber || oldStudentCourseFees.reciptNumber;
            getSingleStudentDayBookData[i].credit = amountPaid;
            getSingleStudentDayBookData[i].studentLateFees = lateFees;
            getSingleStudentDayBookData[i].balance =
              getSingleStudentDayBookData[i - 1].balance +
              amountPaid +
              lateFees;
            getSingleStudentDayBookData[i].dayBookDatadate =
              amountDate || getSingleStudentDayBookData[i].dayBookDatadate;
            await getSingleStudentDayBookData[i].save();
          }
          await getSingleStudentDayBookData[i].save();
        } else {
          if (i === 0) {
            getSingleStudentDayBookData[i].balance =
              getSingleStudentDayBookData[i].credit +
              getSingleStudentDayBookData[i].studentLateFees;
          } else {
            if (getSingleStudentDayBookData[i].credit !== 0) {
              getSingleStudentDayBookData[i].balance =
                getSingleStudentDayBookData[i - 1].balance +
                getSingleStudentDayBookData[i].credit +
                getSingleStudentDayBookData[i].studentLateFees;
            } else {
              getSingleStudentDayBookData[i].balance =
                getSingleStudentDayBookData[i - 1].balance -
                getSingleStudentDayBookData[i].debit;
            }
          }
        }
        await getSingleStudentDayBookData[i].save();
      }

      currentStudent = await admissionFormModel.findById(studentInfo);
      const lastPaymentInstallment =
        await PaymentInstallmentTimeExpireModel.findOne({
          installment_number: currentStudent.no_of_installments,
          studentInfo: currentStudent._id,
        });
      //console.log(lastPaymentInstallment);
      lastPaymentInstallment.installment_amount =
        totalPaid / currentStudent.no_of_installments;
      await lastPaymentInstallment.save();

      if (currentStudent.remainingCourseFees === 0) {
        currentStudent.no_of_installments_expireTimeandAmount = null;
        currentStudent.no_of_installments = 0;
        const allPaymentInstallments =
          await PaymentInstallmentTimeExpireModel.find({
            studentInfo: currentStudent._id,
          });
        allPaymentInstallments.map(async (paymentInstallment) => {
          if (paymentInstallment) {
            await paymentInstallment.deleteOne();
          }
        });
        await currentStudent.save();
      }

      res.status(200).json({
        success: true,
        message: "Student fee updated successfully",
        updatedData: singleStudentAllCourseFees,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
export const deleteSingleStudentCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const singleStudentFee = await CourseFeesModel.findById(req.params.id);
      if (!singleStudentFee) {
        return res.status(404).json({ message: "Student fee not found" });
      }

      let allCourseFeesSingleStudent = await CourseFeesModel.find({
        studentInfo: singleStudentFee.studentInfo,
      });

      let singleStudentDayBooksData = await DayBookDataModel.find({
        companyId: singleStudentFee.companyName,
      });

      // Update receipt numbers if they are not present in the DayBook data
      for (const [
        index,
        updateReciptNumberDayBookData,
      ] of singleStudentDayBooksData.entries()) {
        if (updateReciptNumberDayBookData.reciptNumber === undefined) {
          updateReciptNumberDayBookData.reciptNumber =
            allCourseFeesSingleStudent[index]?.reciptNumber;
          await updateReciptNumberDayBookData.save();
        }
      }

      // Find and delete the specific DayBook data
      const singleDayBookData = await DayBookDataModel.findOne({
        reciptNumber: singleStudentFee.reciptNumber,
      });

      if (singleDayBookData) {
        await singleDayBookData.deleteOne();
      }

      await singleStudentFee.deleteOne();

      const currentStudent = await admissionFormModel.findById(
        singleStudentFee.studentInfo
      );

      const lastPaymentInstallmentOfCurrentStudent =
        await PaymentInstallmentTimeExpireModel.find({
          studentInfo: singleStudentFee.studentInfo,
        });
      lastPaymentInstallmentOfCurrentStudent.map(
        async (deleteCurrentStudentPaymentInstallments) => {
          if (deleteCurrentStudentPaymentInstallments) {
            await deleteCurrentStudentPaymentInstallments.deleteOne();
          }
        }
      );

      // Re-fetch course fees and DayBook data after deletion
      allCourseFeesSingleStudent = await CourseFeesModel.find({
        studentInfo: singleStudentFee.studentInfo,
      });

      singleStudentDayBooksData = await DayBookDataModel.find({
        companyId: singleStudentFee.companyName,
      });

      // Update remaining fees and balance for the student
      for (let i = 1; i < allCourseFeesSingleStudent.length; i++) {
        if (i === 0) {
          allCourseFeesSingleStudent[0].netCourseFees =
            currentStudent.netCourseFees;
          allCourseFeesSingleStudent[0].remainingFees =
            currentStudent.netCourseFees -
            allCourseFeesSingleStudent[0].amountPaid;
        }
        const previousFees = allCourseFeesSingleStudent[i - 1];
        const currentFees = allCourseFeesSingleStudent[i];
        currentFees.netCourseFees = previousFees.remainingFees;
        currentFees.remainingFees =
          previousFees.remainingFees - currentFees.amountPaid;
        await currentFees.save();
      }

      // Update DayBook data
      for (let i = 1; i < singleStudentDayBooksData.length; i++) {
        const previousDayBookData = singleStudentDayBooksData[i - 1];
        const currentDayBookData = singleStudentDayBooksData[i];
        if (currentDayBookData.credit !== 0) {
          currentDayBookData.balance =
            previousDayBookData.balance +
            currentDayBookData.credit +
            currentDayBookData.studentLateFees;
        } else {
          currentDayBookData.balance =
            previousDayBookData.balance - currentDayBookData.debit;
        }
        await currentDayBookData.save();
      }

      // Update the student's total paid and remaining course fees
      if (allCourseFeesSingleStudent.length === 0) {
        currentStudent.totalPaid = 0;
        currentStudent.remainingCourseFees = undefined;
        currentStudent.no_of_installments = singleStudentFee.no_of_installments;
        currentStudent.netCourseFees = currentStudent.netCourseFees;
        currentStudent.no_of_installments_amount =
          currentStudent.netCourseFees / singleStudentFee.no_of_installments;
      } else {
        const totalPaid = allCourseFeesSingleStudent.reduce(
          (acc, cur) => acc + cur.amountPaid,
          0
        );
        currentStudent.totalPaid = totalPaid;
        currentStudent.remainingCourseFees =
          currentStudent.netCourseFees - totalPaid;
        currentStudent.no_of_installments =
          allCourseFeesSingleStudent[allCourseFeesSingleStudent.length - 1]
            .no_of_installments + 1;
      }

      if (allCourseFeesSingleStudent.length === 1) {
        const totalPaid = allCourseFeesSingleStudent.reduce(
          (acc, cur) => acc + cur.amountPaid,
          0
        );
        currentStudent.totalPaid = totalPaid;
        currentStudent.remainingCourseFees =
          currentStudent.netCourseFees - totalPaid;
        currentStudent.no_of_installments =
          allCourseFeesSingleStudent[allCourseFeesSingleStudent.length - 1]
            .no_of_installments + 1;
      }

      await currentStudent.save();

      res.status(200).json({ message: "Student fee deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getAllCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      // const allCourseFees = await CourseFeesModel.find({})
      //   .populate(["studentInfo", "courseName"])
      //   .sort("courseName");
      const nextInstallmentCourseFees = await CourseFeesModel.find({}).populate(
        ["studentInfo", "courseName"]
      );
      //console.log(nextInstallmentCourseFees);
      res.status(200).json(nextInstallmentCourseFees);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getCollectionFeesAccordingToCompanyIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const collectionFees = await PaymentInstallmentTimeExpireModel.find({
        companyName: companyId,
      })
        .populate(["courseName", "companyName", "studentInfo"])
        .sort({ createdAt: 1 });
      res.status(200).json(collectionFees);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
