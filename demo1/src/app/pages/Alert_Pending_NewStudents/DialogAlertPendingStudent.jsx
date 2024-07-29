import moment from 'moment'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'

const DialogAlertPendingStudent = () => {
  const studentCTX = useAdmissionContext()
  const filteredStudentsAlertData =
    studentCTX.getAllStudentsAlertStudentPendingFeesQuery?.data?.filter(
      (s) =>
        s.Status === 'pending' && moment(s?.RemainderDateAndTime).date() - moment().date() === 0
    )

  //console.log(filteredStudentsAlertData)

  return (
    <div className='card' style={{backgroundColor: '#f8f9fa'}}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Alert Student Pending Fees</h3>
        <div className='card-toolbar'></div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-2 overflow-y-scroll' style={{maxHeight: '300px'}}>
        {filteredStudentsAlertData?.length === 0 ? (
          <div className=''>No Pending Alert Student Available</div>
        ) : (
          <div className='mb-20'>
            {filteredStudentsAlertData?.map((studentAlertData) => {
              return (
                <div className='d-flex align-items-center mb-10' key={studentAlertData?._id}>
                  <span className='bullet bullet-vertical h-40px bg-danger'></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <a className='text-gray-800 text-hover-primary fw-bold fs-6'>
                      {studentAlertData?.studentId?.name}
                    </a>
                    <span className='text-muted fw-semibold d-block'>
                      {studentAlertData?.particulars}
                    </span>
                    <span className='text-muted fw-semibold d-block'>
                      Due in{' '}
                      {moment(studentAlertData?.RemainderDateAndTime).date() - moment().date()} Days
                    </span>
                  </div>
                  <span className='badge badge-light-danger fs-8 fw-bold'>
                    {studentAlertData?.Status}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* end:Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}
export default DialogAlertPendingStudent
