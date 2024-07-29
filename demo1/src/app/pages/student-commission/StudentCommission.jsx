import {useEffect, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useCompanyContext} from '../compay/CompanyContext'

const CourseSchema = Yup.object().shape({
  studentName: Yup.string().required('Student Name is required'),
  commissionPersonName: Yup.string().required('Commission Person Name is required'),
  voucherNumber: Yup.string(),
  commissionAmount: Yup.string().required('Commission amount  is required'),
  commissionDate: Yup.string().required('Commission Date is required'),
  commissionNaretion: Yup.string().required('Commission naretion is required!'),
})

const StudentCommission = () => {
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const location = useLocation()
  //console.log(location.state.name)
  //console.log(params)
  const studentCTX = useCompanyContext()
  const {data} = studentCTX.useGetStudentsAccordingToCompanyQuery(params.companyId)
  const companyData = studentCTX.useGetSingleCompanyData(params.companyId)
  //console.log(companyData?.data?.companyName)

  // console.log(data)

  const navigate = useNavigate()
  let initialValues = {
    studentName: location?.state?.name ? location?.state?.name : '',
    commissionPersonName: '',
    voucherNumber: '',
    commissionAmount: '',
    commissionDate: '',
    commissionNaretion: '',
    companyId: params.companyId,
  }

  const formik = useFormik({
    initialValues,
    validationSchema: CourseSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        studentCTX.createStudentCommissionMutation.mutate(values)
        navigate(`/students/${params.companyId}`)
      } catch (error) {
        console.log(error)
      }
    },
  })

  // Helper function to render datalist options based on filter
  function renderAccountNameOptions() {
    const filteredStudents = data?.filter((student) => student.companyName === params.companyId)

    if (!filteredStudents || filteredStudents.length === 0) {
      return null
    }

    return (
      <datalist id='accountNameOptions'>
        {filteredStudents.map((student) => {
          return <option key={student._id} value={`${student.name}-${student.rollNumber}`}></option>
        })}
      </datalist>
    )
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
            <h3 className='fw-bolder m-0'>{companyData?.data?.companyName}</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Student Name{' '}
                  <div className='fv-row mt-5'>
                    <input
                      type='search'
                      className='form-control'
                      {...formik.getFieldProps('studentName')}
                      list='accountNameOptions'
                      placeholder='Enter Student Name'
                    />
                    {renderAccountNameOptions()}
                  </div>
                  {formik.touched.studentName && formik.errors.studentName && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors?.studentName}</div>
                    </div>
                  )}
                </label>

                {/* ----------------------- Commission Person Name Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Person Name{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Commission Person Name'
                      {...formik.getFieldProps('commissionPersonName')}
                    />
                    {formik.touched.commissionPersonName && formik.errors.commissionPersonName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionPersonName}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* -----------------------  Commission Person Name End ----------------------------- */}

                {/* ----------------------- Commission Amount Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Amount{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='number'
                      min={0}
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Commission Amount'
                      {...formik.getFieldProps('commissionAmount')}
                    />
                    {formik.touched.commissionAmount && formik.errors.commissionAmount && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionAmount}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Commission Amount Field End ----------------------------- */}

                {/* ----------------------- Commission Voucher number Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission voucher number{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Commission voucher number'
                      {...formik.getFieldProps('voucherNumber')}
                    />
                    {formik.touched.voucherNumber && formik.errors.voucherNumber && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.voucherNumber}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Commission Voucher number Field End ----------------------------- */}

                {/* ============================ Commission Naretion Start here ==================== */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Naretion{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Commission Naretion'
                      {...formik.getFieldProps('commissionNaretion')}
                    />
                    {formik.touched.commissionNaretion && formik.errors.commissionNaretion && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionNaretion}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ============================ Commission Naretion End here ==================== */}

                {/* ============================ Commission Date End here ==================== */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Date
                  <div className='fv-row mt-5 '>
                    <DatePicker
                      selected={formik.values.commissionDate}
                      onChange={(date) => formik.setFieldValue('commissionDate', date)}
                      dateFormat='dd/MM/yyyy'
                      className='form-control form-control-lg form-control-solid'
                      placeholderText='DD/MM/YYYY'
                    />
                    {formik.touched.commissionDate && formik.errors.commissionDate && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionDate}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ============================ Commission Date End here ==================== */}
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Save Changes'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Added
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default StudentCommission
