import React, {useEffect, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import moment from 'moment'
import PayStudentFee from './PayStudentFee'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useQuery} from 'react-query'
import axios from 'axios'
import {useAuth} from '../../modules/auth'
import {useNavigate} from 'react-router-dom'
import ReadOnlyCourseFee from './ReadOnlyCourseFee'
import EditOnlyCourseFee from './EditOnlyCourseFee'
import {toast} from 'react-toastify'
import {useCompanyContext} from '../compay/CompanyContext'
const StudentCourseFee = ({className, studentInfoData}) => {
  //console.log(studentInfoData)
  const navigate = useNavigate()
  const {currentUser} = useAuth()
  const companyCtx = useCompanyContext()
  // console.log(companyCtx.getWhatsAppMessageuggestionStatus?.data[0]?.whatsappSuggestionStatus)

  const [addStudentFeeFormToggle, setAddStudentFeeFormToggle] = useState(false)
  const [studentCourseFeeEditId, setStudentCourseFeesEditId] = useState(null)
  //console.log(studentCourseFeeEditId)

  const [editStudentCourseFees, setEditStudentCourseFees] = useState({
    netCourseFees: 0,
    remainingFees: 0,
    amountPaid: '',
    amountDate: '',
    paymentOption: '',
    lateFees: '',
    reciptNumber: '',
  })

  const studentPayFeeCtx = useStudentCourseFeesContext()
  const result = studentPayFeeCtx.useSingleStudentCourseFees(studentInfoData?._id)
  // console.log(result)

  const addStudentFeeFormToggleHandler = () => {
    setAddStudentFeeFormToggle((prev) => !prev)
  }

  const delelteStudentCourseFeesHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this student course fee?')) {
      studentPayFeeCtx.useDeleteSingleStudentCourseFees.mutate(id)
    }
    navigate(`/students/${studentInfoData?.companyName}`)
    window.location.reload()
    return
  }
  const [payStudentFeesAdd, setPayStudentFeesAdd] = useState()
  useEffect(() => {
    const initialAmountPaid =
      result.data?.length > 0
        ? studentInfoData?.remainingCourseFees
        : studentInfoData?.netCourseFees

    setPayStudentFeesAdd({
      netCourseFees: initialAmountPaid,
      remainingFees: Number(studentInfoData?.remainingCourseFees).toFixed(2),
      amountPaid: '',
      amountDate: '',
      paymentOption: '',
      lateFees: 0,
    })
  }, [result.data, studentInfoData])

  // console.log(result?.data[result?.data?.length - 1])

  //console.log(payStudentFeesAdd)
  //console.log(studentPayFeeCtx.createStudentCourseFeesMutation)

  const payStudentFeesAddHandler = (e) => {
    e.preventDefault()
    // amountDate
    // amountPaid
    // lateFees
    // paymentOption

    if (payStudentFeesAdd.amountPaid === '') {
      toast.error('Please enter the amount paid', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (payStudentFeesAdd.amountDate === '') {
      toast.error('Please enter the Date', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (payStudentFeesAdd.paymentOption === '') {
      toast.error('Please select the payment option', {bodyStyle: {fontSize: '18px'}})
      return
    }

    let url = `https://web.whatsapp.com/send?phone=+91${studentInfoData.phone_number}`

    // // Appending the message to the URL by encoding it
    // url += `&text=Hello, ${studentInfoData.name} your fess has been submitted successfully ${payStudentFeesAdd.amountPaid} Rs? &app_absent=0`

    url += `&text=Dear ${encodeURIComponent(
      studentInfoData.name
    )}, We have successfully received Rs.${encodeURIComponent(
      payStudentFeesAdd.amountPaid
    )}/- as your monthly installment.\nThanks,\nAVisual Media Academy`

    //console.log(Number(payStudentFeesAdd.amountPaid), Number(payStudentFeesAdd.netCourseFees))

    if (Number(payStudentFeesAdd?.amountPaid) <= Number(payStudentFeesAdd?.netCourseFees)) {
      try {
        if (studentInfoData.no_of_installments === 1) {
          //console.log(payStudentFeesAdd)
          if (Number(payStudentFeesAdd.remainingFees) === 0) {
            studentPayFeeCtx.createStudentCourseFeesMutation.mutate({
              ...payStudentFeesAdd,
              studentInfo: studentInfoData?._id,
              no_of_installments_amount: studentInfoData.no_of_installments_amount,
              no_of_installments: studentInfoData.no_of_installments,
              courseName: studentInfoData?.courseName,
            })
            setPayStudentFeesAdd({
              netCourseFees: 0,
              remainingFees: 0,
              amountPaid: 0,
              amountDate: Date.now(),
              paymentOption: '',
              lateFees: 0,
            })
            if (companyCtx.getWhatsAppMessageuggestionStatus?.data[0]?.whatsappSuggestionStatus) {
              window.open(url)
            }
            navigate(`/students/${studentInfoData?.companyName}`)
            window.location.reload()
            return
          }

          toast.error(
            'If student have 1 installment then you have to pay complete remaining fees. else you have to increase student installment'
          )
          navigate(`/students/${studentInfoData?.companyName}`)
          return
        }

        studentPayFeeCtx.createStudentCourseFeesMutation.mutate({
          ...payStudentFeesAdd,
          studentInfo: studentInfoData?._id,
          no_of_installments_amount: studentInfoData.no_of_installments_amount,
          no_of_installments: studentInfoData.no_of_installments,
          courseName: studentInfoData?.courseName,
        })
        setPayStudentFeesAdd({
          netCourseFees: 0,
          remainingFees: 0,
          amountPaid: 0,
          amountDate: Date.now(),
          paymentOption: '',
          lateFees: 0,
        })
        if (companyCtx.getWhatsAppMessageuggestionStatus?.data[0]?.whatsappSuggestionStatus) {
          window.open(url)
        }
        navigate(`/students/${studentInfoData?.companyName}`)
        window.location.reload()
        return
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.error('Amount paid should not be more than Net Course  fees')
      navigate(`/students/${studentInfoData?.companyName}`)
      return
    }
  }

  const editStudentCourseFessHandler = (e) => {
    // console.log(editStudentCourseFees)
    e.preventDefault()
    studentPayFeeCtx.updateStudentSingleCourseFeesMutation.mutate(editStudentCourseFees)
    setStudentCourseFeesEditId(null)
    navigate(`/students/${studentInfoData?.companyName}`)
    window.location.reload()
    return
  }

  // console.log(payStudentFeesAdd)

  // console.log(listOfFeesData)
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to pay fees'
        >
          {currentUser.role !== 'Student' ? (
            <button
              disabled={studentInfoData?.remainingCourseFees === 0}
              onClick={addStudentFeeFormToggleHandler}
              className='btn btn-sm btn-light-primary'
            >
              <KTIcon iconName='plus' className='fs-3' />
              {studentInfoData?.remainingCourseFees === 0 ? 'Student paid all fees' : 'Pay Fees'}
            </button>
          ) : (
            <p className='btn btn-sm btn-light-primary'>Student Course Fees Record</p>
          )}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <form
            onSubmit={
              studentCourseFeeEditId ? editStudentCourseFessHandler : payStudentFeesAddHandler
            }
          >
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className=''>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                  </th>
                  <th className='min-w-50px'>Sr No</th>
                  <th className='min-w-100px'>Net Course Fees</th>
                  <th className='min-w-100px'>Amount Paid</th>
                  <th className='min-w-100px'>Remaining</th>
                  <th className='min-w-100px'>Date</th>
                  <th className='min-w-100px'>Recipt No</th>
                  <th className='min-w-100px'>Payment Options</th>
                  <th className='min-w-100px'>Late Fee</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}

              <tbody>
                {addStudentFeeFormToggle && (
                  <PayStudentFee
                    payStudentFeesAdd={payStudentFeesAdd}
                    setPayStudentFeesAdd={setPayStudentFeesAdd}
                    studentInfoData={studentInfoData}
                    setAddStudentFeeFormToggle={setAddStudentFeeFormToggle}
                  />
                )}
                {result.data?.length > 0 ? (
                  result.data?.map((StudentFee, index) => (
                    <React.Fragment key={index}>
                      {StudentFee._id === studentCourseFeeEditId ? (
                        <EditOnlyCourseFee
                          StudentFee={StudentFee}
                          setEditStudentCourseFees={setEditStudentCourseFees}
                          setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                          editStudentCourseFees={editStudentCourseFees}
                        />
                      ) : (
                        <ReadOnlyCourseFee
                          studentInfoData={studentInfoData}
                          StudentFee={StudentFee}
                          index={index}
                          delelteStudentCourseFeesHandler={delelteStudentCourseFeesHandler}
                          setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
              {/* end::Table body */}
            </table>
          </form>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default StudentCourseFee
