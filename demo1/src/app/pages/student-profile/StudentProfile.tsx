import React, {useEffect, useState} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {
  AddMissionFormInterface,
  addMissionFormInitialValues as initialValues,
} from '../../modules/accounts/components/settings/SettingsModel'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {AccountHeader} from '../../modules/accounts/AccountHeader'
import {Dropdown1} from '../../../_metronic/partials'
import {useCourseContext} from '../course/CourseContext'
import StudentCourseFee from './StudentCourseFee'
import {useCompanyContext} from '../compay/CompanyContext'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import StudentCommissionLists from '../student-commission/StudentCommissionLists'
import {useAuth} from '../../modules/auth'
import AlertPendingFeesNewStudents from '../Alert_Pending_NewStudents/AlertPendingNewStudents'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const addmissionFormSchema = Yup.object().shape({
  rollNumber: Yup.number(),
  _id: Yup.string(),
  name: Yup.string(),
  father_name: Yup.string(),
  mobile_number: Yup.string(),
  phone_number: Yup.string(),
  present_address: Yup.string(),
  date_of_birth: Yup.string(),
  city: Yup.string(),
  email: Yup.string(),
  // student_status: Yup.string(),
  education_qualification: Yup.string(),
  select_course: Yup.string(),
  // name_of_person_for_commision: Yup.string(),
  // commision_paid: Yup.string(),
  // commision_date: Yup.string(),
  // commision_voucher_number: Yup.string(),
  course_fees: Yup.string(),
  down_payment: Yup.string(),
  date_of_joining: Yup.string(),
  no_of_installments: Yup.string(),
  no_of_installments_amount: Yup.string(),
})

const StudentProfile: React.FC = () => {
  const [preview, setPreview] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const {currentUser} = useAuth()
  // console.log(currentUser)

  const location = useLocation()
  const courseCtx = useCourseContext()
  const companyCTX = useCompanyContext()
  const courseSubjectsCTX = useCourseSubjectContext()

  const setProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0])
    }
  }

  const [updateUserId, setUpdateUserId] = useState<any>(location?.state)
  //console.log(updateUserId)

  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(updateUserId?.companyName)
  // console.log(singleComapnyData)
  //console.log(companyCTX.getStudentGSTSuggestionStatus.data[0]?.gst_percentage + 100)

  let cutWithGSTAmount =
    singleComapnyData?.isGstBased === 'Yes'
      ? (Number(updateUserId?.totalPaid) /
          (companyCTX.getStudentGSTSuggestionStatus.data[0]?.gst_percentage + 100)) *
        100
      : Number(updateUserId?.totalPaid)

  //console.log(singleComapnyData)
  if (updateUserId === null) {
    setUpdateUserId(location?.state)
  }
  useEffect(() => {
    if (updateUserId['remainingCourseFees'] === undefined) {
      let numberOfInstallmentAmount: number =
        Number(formik.values.netCourseFees) / Number(updateUserId.no_of_installments)
      // Check if numberOfInstallmentAmount is NaN, and set it to 0 if NaN
      //console.log(numberOfInstallmentAmount)
      formik.setFieldValue('no_of_installments_amount', numberOfInstallmentAmount.toFixed(2))
    } else {
      let numberOfInstallmentAmount: number =
        Number(formik.values?.remainingCourseFees) / Number(updateUserId?.no_of_installments)
      // Check if numberOfInstallmentAmount is NaN, and set it to 0 if NaN
      //console.log(numberOfInstallmentAmount)
      formik.setFieldValue('no_of_installments_amount', numberOfInstallmentAmount?.toFixed(2))
    }
  }, [])
  //console.log(updateUserId)

  // let updateStudentId = updateUserId?._id

  let updateStudentInitialValues: AddMissionFormInterface = updateUserId
    ? updateUserId
    : initialValues

  useEffect(() => {
    if (image) {
      // setPreview(URL.createObjectURL(image))
      setPreview(URL.createObjectURL(image))
      //console.log(image.name)
    }
  }, [image])

  const navigate = useNavigate()
  const context = useAdmissionContext()
  //context.setStudentId(updateUserId?._id)
  const formik = useFormik<AddMissionFormInterface>({
    initialValues: updateStudentInitialValues,
    validationSchema: addmissionFormSchema,
    onSubmit: async (values) => {
      let formData = new FormData()

      // Append each field of values to formData
      Object?.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string) // Ensure value is a string, adjust if needed
      })

      // Append the image to formData
      if (image) {
        formData.append('image', image)
      }

      if (updateUserId) {
        context.updateStudentMutation.mutate(formData)
      } else {
        context.createStudentMutation.mutate(formData)
      }

      navigate('/students')
    },
  })

  const navigateCourseSubjectsHandler = () => {
    //console.log('data of subjects based on course', data)
    // console.log('navigating to the course subject page !!!', updateUserId)
    navigate('/course-subjects-addMarks', {state: updateUserId})
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>
              {/* {updateUserId ? 'Edit Student Information' : 'Student Information'} */}
              {singleComapnyData?.companyName} =: Student Profile
            </h3>
          </div>
        </div>

        <div className='card mb-5 mb-xl-10'>
          <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
              <div className='me-7 mb-4'>
                <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
                  <img src={BASE_URL_Image + `/${updateUserId?.image}`} alt='Metronic' />
                  <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
                </div>
              </div>

              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center mb-2'>
                      <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                        {updateUserId?.name}
                      </a>
                      <a href='#'>
                        <KTIcon iconName='verify' className='fs-1 text-primary' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                        data-bs-toggle='modal'
                        data-bs-target='#kt_modal_upgrade_plan'
                      >
                        Upgrade to Pro
                      </a>
                    </div>

                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                      >
                        <KTIcon iconName='profile-circle' className='fs-4 me-1' />
                        +91 {updateUserId?.mobile_number}
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                      >
                        {/* <KTIcon iconName='geolocation' className='fs-4 me-1' /> */}
                        {updateUserId?.select_course}
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'
                      >
                        <KTIcon iconName='sms' className='fs-4 me-1' />
                        {updateUserId?.email}
                      </a>
                    </div>
                  </div>

                  <div className='d-flex my-4'>
                    {/* <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                      <KTIcon iconName='check' className='fs-3 d-none' />

                      <span className='indicator-label'>Follow</span>
                      <span className='indicator-progress'>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    </a>
                    <a
                      href='#'
                      className='btn btn-sm btn-primary me-3'
                      data-bs-toggle='modal'
                      data-bs-target='#kt_modal_offer_a_deal'
                    >
                      Hire Me
                    </a> */}
                    {currentUser?.role !== 'Student' && (
                      <div className='me-0'>
                        <button
                          onClick={navigateCourseSubjectsHandler}
                          className='btn  btn-bg-light btn-active-color-primary'
                          data-kt-menu-trigger='click'
                          data-kt-menu-placement='bottom-end'
                          data-kt-menu-flip='top-end'
                        >
                          Course Subjects
                        </button>
                        <Dropdown1 />
                      </div>
                    )}
                  </div>
                </div>

                <div className='d-flex flex-wrap flex-stack'>
                  <div className='d-flex flex-column flex-grow-1 pe-8'>
                    <div className='d-flex flex-wrap'>
                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                          <div className='fs-2 fw-bolder'>Rs.{updateUserId?.netCourseFees}</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Total Fee</div>
                      </div>

                      {singleComapnyData?.isGstBased === 'Yes' ? (
                        <>
                          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                              <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                              <div className='fs-2 fw-bolder'>
                                Rs.
                                {cutWithGSTAmount.toFixed(2)}
                              </div>
                            </div>

                            <div className='fw-bold fs-6 text-gray-400'>Gross Paid</div>
                          </div>
                          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                              <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                              <div className='fs-2 fw-bolder'>
                                Rs.
                                {(Number(updateUserId?.totalPaid) - cutWithGSTAmount).toFixed(2)}
                              </div>
                            </div>

                            <div className='fw-bold fs-6 text-gray-400'>GST Paid</div>
                          </div>
                          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                              <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                              <div className='fs-2 fw-bolder'>
                                Rs.
                                {(
                                  cutWithGSTAmount +
                                  (Number(updateUserId?.totalPaid) - cutWithGSTAmount)
                                ).toFixed(2)}
                              </div>
                            </div>

                            <div className='fw-bold fs-6 text-gray-400'>Net Paid</div>
                          </div>
                        </>
                      ) : (
                        <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                          <div className='d-flex align-items-center'>
                            <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                            <div className='fs-2 fw-bolder'>
                              Rs.
                              {Number(updateUserId?.totalPaid).toFixed(2)}
                            </div>
                          </div>

                          <div className='fw-bold fs-6 text-gray-400'>total Paid</div>
                        </div>
                      )}

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                          <div className='fs-2 fw-bolder'>
                            Rs.
                            {isNaN(Number(updateUserId?.remainingCourseFees))
                              ? 0.0
                              : Number(updateUserId?.remainingCourseFees).toFixed(2)}
                          </div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Remainig Fee</div>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                    <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                      <span className='fw-bold fs-6 text-gray-400'>Profile Compleation</span>
                      <span className='fw-bolder fs-6'>50%</span>
                    </div>
                    <div className='h-5px mx-3 w-100 bg-light mb-3'>
                      <div
                        className='bg-success rounded h-5px'
                        role='progressbar'
                        style={{width: '50%'}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              {/* ============================= Start Name here ======================== */}
              {/*========================== profile =================================== */}
              <div className='row mt-5 '>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Image</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        disabled
                        type='file'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Image'
                        onChange={(e) => setProfile(e)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Roll Number </label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        readOnly
                        type='number'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Enter Roll Number..'
                        value={updateUserId?.rollNumber}
                        // {...formik.getFieldProps('rollNumber')}
                      />
                      {/* {formik.touched?.rollNumber && formik.errors?.rollNumber && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors?.rollNumber}</div>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                {/* ================================------Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        readOnly
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Name'
                        {...formik.getFieldProps('name')}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors?.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ================================------Name----================================== */}
                {/* ================================------Father Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Father Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Father Name'
                        {...formik.getFieldProps('father_name')}
                      />
                      {formik.touched.father_name && formik.errors.father_name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.father_name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ================================------Father Name----================================== */}
              </div>

              {/* ========================  Contact Number ============================= */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Mobile Number</label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Mobile Number'
                        {...formik.getFieldProps('mobile_number')}
                      />
                      {formik.touched.mobile_number && formik.errors.mobile_number && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.mobile_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Parent Number</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='tel'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Phone number'
                        {...formik.getFieldProps('phone_number')}
                      />
                      {formik.touched.phone_number && formik.errors.phone_number && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.phone_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================  Contact Number ============================= */}

              {/* =================================Address Information==================================== */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Present Address</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Present Address'
                        {...formik.getFieldProps('present_address')}
                      />
                      {formik.touched.present_address && formik.errors.present_address && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.present_address}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================Address Information==================================== */}

              {/* ============================== Email and City ==================================== */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>City</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='City'
                        {...formik.getFieldProps('city')}
                      />
                      {formik.touched.city && formik.errors.city && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.city}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Email</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='email'
                        readOnly
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.email}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ============================== Email and City ==================================== */}
              {/* ============================== DOB and Student Status ==================================== */}
              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>DOB</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={formik.values.date_of_birth}
                        onChange={(date) => formik.setFieldValue('date_of_birth', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />

                      {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                        <div className='fv-plugins-message-container'>
                          {/* <div className='fv-help-block'>{formik.errors.date_of_birth}</div> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Student Status</label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('student_status')}
                      >
                        <option value=''>select--</option>
                        <option value='GST'>GST</option>
                        <option value='NOGST'>NO GST</option>
                      </select>
                      {formik.touched.student_status && formik.errors.student_status && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.student_status}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
              </div>
              {/* ============================== DOB and Student Status ==================================== */}

              {/* -----------------QUALIFICATION START HERE ------------------ */}
              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Qualification</h3>
                  </div>
                </div>
                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                      Education Qualification
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('education_qualification')}
                      >
                        <option value=''>-select-</option>
                        <option value='10th'>10th</option>
                        <option value='10+2'>10+2</option>
                        <option value='graduate'>Graduate</option>
                        <option value='diploma'>Diploma</option>
                      </select>
                      {formik.touched.education_qualification &&
                        formik.errors.education_qualification && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors.education_qualification}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Company Name</label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('companyName')}
                      >
                        <option value=''>-select-</option>
                        {companyCTX.getCompanyLists?.data?.map((companyData) => (
                          <option key={companyData?._id} value={companyData?._id}>
                            {companyData?.companyName}
                          </option>
                        ))}
                      </select>
                      {formik.touched.companyName && formik.errors.companyName && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.companyName}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ---------------------------QUALIFICATION END HERE ----------------------- */}

              {/* ---------------------------COURSE START HERE ----------------------- */}
              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Course</h3>
                  </div>
                </div>

                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Select Course</label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('select_course')}
                      >
                        <option value=''>-select-</option>
                        {courseCtx.getCourseLists?.data?.map((c: any) => (
                          <option key={c._id} value={c.courseName}>
                            {c.courseName}-({c?.category?.category})
                          </option>
                        ))}
                      </select>
                      {formik.touched.select_course && formik.errors.select_course && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.select_course}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------COURSE END HERE ----------------------- */}
              {/* ---------------------------Commision Start HERE ----------------------- */}

              {/* ---------------------------Commision End HERE ----------------------- */}

              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>For Office Use Only</h3>
                  </div>
                </div>
              </div>

              <>
                <div className='row mt-5'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Course Fees</span>
                        {/* <p>(including 14% service Tax)</p> */}
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          {...formik.getFieldProps('course_fees')}
                          readOnly
                        />
                        {formik.touched.course_fees && formik.errors.course_fees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.course_fees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Course Fees Discount</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          min={0}
                          max={20}
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          readOnly
                          {...formik.getFieldProps('discount')}
                        />
                        {formik.touched.discount && formik.errors.discount && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.discount}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Net Course Fees</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Net Course Fees'
                          {...formik.getFieldProps('netCourseFees')}
                          readOnly
                        />
                        {formik.touched.netCourseFees && formik.errors.netCourseFees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.netCourseFees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>D.O.J</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <DatePicker
                          readOnly
                          selected={formik.values.date_of_joining}
                          onChange={(date) => formik.setFieldValue('date_of_joining', date)}
                          dateFormat='dd/MM/yyyy'
                          className='form-control form-control-lg form-control-solid'
                          placeholderText='DD/MM/YYYY'
                        />

                        {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Remaining Fee</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          readOnly
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Remaining Fees'
                          {...formik.getFieldProps('remainingCourseFees')}
                        />
                        {formik.touched?.remainingCourseFees && formik.errors?.remainingCourseFees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors?.remainingCourseFees}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                        No. of Installments
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <select
                          disabled
                          className='form-select form-select-solid form-select-lg'
                          value={formik.values.no_of_installments}
                          onChange={(e) => {
                            formik.getFieldProps('no_of_installments').onChange(e)
                            //numberOfInstallmentAmountHandler(e)
                          }}
                        >
                          <option value=''>-select-</option>
                          {Array.from({length: 60}, (_, index) => (
                            <option key={index} value={index}>
                              {index}
                            </option>
                          ))}
                        </select>
                        {formik.touched.no_of_installments && formik.errors.no_of_installments && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.no_of_installments}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                      No. of Installments Amount
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control w-50 '
                        readOnly
                        value={formik.values.no_of_installments_amount}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------FOR OFFICE USE ONLY END HERE ----------------------- */}
            </div>
          </form>
        </div>
      </div>
      <StudentCourseFee className={''} studentInfoData={updateUserId} />
      {currentUser?.role !== 'Student' && (
        <div className='d-flex flex-column gap-10 mt-4'>
          <AlertPendingFeesNewStudents studentInfoData={updateUserId} />
          <StudentCommissionLists studentInfoData={updateUserId} />
        </div>
      )}
    </>
  )
}

export default StudentProfile
