import {useCompanyContext} from '../compay/CompanyContext'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'

const addGSTSchema = Yup.object().shape({
  gstNumber: Yup.number().required('Gst number  is required'),
})

const GstSuggesstion = () => {
  const navigate = useNavigate()
  const studentGSTCTX = useCompanyContext()
  let initialValues = {
    gstNumber: studentGSTCTX?.getStudentGSTSuggestionStatus?.data[0]?.gst_percentage,
  }

  // console.log(typeof studentGSTCTX.getStudentGSTSuggestionStatus.data[0].gst_percentage)

  const formik = useFormik({
    initialValues,
    validationSchema: addGSTSchema,
    onSubmit: async (values) => {
      //console.log(values)
      studentGSTCTX?.postStudentGSTSuggestionStatus?.mutate(values)
      // formik.setFieldValue('gstNumber', '')
    },
  })
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
            <h3 className='fw-bolder m-0'>Add Student GST</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                {/* -------------------------- Account Name Start here ----------------------------- */}

                <label className='col-6 col-form-label fw-bold fs-6'>
                  GST % (Do not enter sign just provide number to it){' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='number'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter GST number'
                      {...formik.getFieldProps('gstNumber')}
                    />
                    {formik.touched.gstNumber && formik.errors.gstNumber && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.gstNumber}</div>
                      </div>
                    )}
                  </div>
                </label>

                {/* -------------------------- Account Name End here ----------------------------- */}
              </div>
            </div>

            <div className='card-footer d-flex justify-content-start py-6 px-9'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={studentGSTCTX?.postStudentGSTSuggestionStatus?.isLoading}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default GstSuggesstion
