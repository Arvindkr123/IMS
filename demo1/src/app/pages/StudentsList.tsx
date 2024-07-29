import React, {useState} from 'react'
import {KTIcon} from '../../_metronic/helpers'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useAdmissionContext} from '../modules/auth/core/Addmission'
import moment from 'moment'
import {useCompanyContext} from './compay/CompanyContext'

const BASE_URL = process.env.REACT_APP_BASE_URL

type Props = {
  className: string
}
const BASE_URL_Image = `${BASE_URL}/api/images`
const StudentsList: React.FC<Props> = ({className}) => {
  const [searchValue, setSearchValue] = useState('')
  const ctx = useAdmissionContext()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const navigate = useNavigate()
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(params?.id)
  // console.log(data)
  // console.log(new Date(ctx.studentsLists.data.users[0].commision_date).toLocaleDateString())
  // console.log(params)
  //console.log(params.id)

  const studentDeleteHandler = (studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }
    ctx.deleteStudentMutation.mutateAsync(studentId)
  }

  const searchValueHandler = (value: string) => {
    setSearchValue(value)
    //console.log(value)
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{singleComapnyData?.companyName}</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>All Over World</span>
        </h3>
        <div className='search-bar'>
          <input
            type='text'
            value={searchValue}
            onChange={(e) => searchValueHandler(e.target.value)}
            className='form-control'
            placeholder='Search Student'
          />
        </div>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <button
            className='btn btn-sm btn-light-primary'
            onClick={() => navigate(`/addmission-form/${singleComapnyData?._id}`)}
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            Add New Student
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  {/* <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-9-check'
                    />
                  </div> */}
                </th>
                <th className='min-w-150px'>Name</th>
                <th className='min-w-140px'>Mobile Number</th>
                <th className='min-w-120px'>D.O.J</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {ctx.studentsLists?.data?.users
                ?.filter((c: any) => params?.id === c?.companyName)
                ?.filter(
                  (searchStudent: any) =>
                    searchValue.trim() === '' ||
                    searchStudent?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    searchStudent?.email.toLowerCase().includes(searchValue.toLowerCase())
                )
                ?.map((student: any) => (
                  <tr key={student._id}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          <img src={BASE_URL_Image + `/${student?.image}`} alt='' />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <div
                            onClick={() => navigate(`/student/${student?._id}`, {state: student})}
                            style={{cursor: 'pointer'}}
                            className='text-dark fw-bold text-hover-primary fs-6'
                          >
                            {student?.name}
                          </div>
                          <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {student?.select_course}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        onClick={() => navigate(`/student/${student?._id}`, {state: student})}
                        style={{cursor: 'pointer'}}
                        className='text-dark fw-bold text-hover-primary d-block fs-6'
                      >
                        +91 {student?.mobile_number}
                      </div>
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        {student?.email}
                      </span>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div
                          onClick={() =>
                            navigate(`/student/${student?._id}`, {
                              state: student,
                            })
                          }
                          style={{cursor: 'pointer'}}
                          className='d-flex flex-stack mb-2'
                        >
                          <span className='text-muted me-2 fs-7 fw-semibold'>
                            {moment(student?.date_of_joining).format('DD-MM-YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <button
                          onClick={() =>
                            navigate(`/update-addmission-form/${student?._id}`, {state: student})
                          }
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </button>
                        <button
                          onClick={() => studentDeleteHandler(student?._id)}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              <tr>
                <td></td>
                <td></td>
                <td>
                  {ctx?.studentsLists?.data?.users?.length === 0 && (
                    <h4 className='text-center'>
                      No Student Available ? <b>Create Student</b>
                    </h4>
                  )}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export default StudentsList
