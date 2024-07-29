import {useLocation} from 'react-router-dom'
import moment from 'moment'
import './StudentMarksResult.css' // Assuming you have a CSS file for styling
import {useEffect, useState} from 'react'

const BASE_URL = process.env.REACT_APP_BASE_URL

const StudentMarksResult = () => {
  const [studentMarksResultData, setStudentMarksResultData] = useState(
    JSON.parse(localStorage.getItem('student-result')) || {}
  )
  //console.log(studentMarksResultData)
  const location = useLocation()

  const handlePrint = () => {
    var actContents = document.body.innerHTML
    document.body.innerHTML = actContents
    window.print()
  }

  const calculateTotalMarks = studentMarksResultData.state.data.reduce(
    (acc, cur) => {
      return {
        maxMarksTotals: Number(acc.maxMarksTotals) + Number(cur.Subjects.fullMarks),
        passMarksTotals: Number(acc.passMarksTotals) + Number(cur.totalMarks),
      }
    },
    {
      maxMarksTotals: 0,
      passMarksTotals: 0,
    }
  )
  //console.log(calculateTotalMarks)

  return (
    <>
      <div className='bground'>
        <img src='/letterhead.jpg' className='letterHeadImage' />
        <table width='800px' cellPadding='0' cellSpacing='0'>
          <tbody>
            {/* <tr>
              <td>
                <table width='800px' cellPadding='0' cellSpacing='0'>
                  <tbody>
                    <tr>
                      <td valign='top' width='30%'>
                        <table width='100%' cellPadding='0' cellSpacing='0'>
                          <tbody>
                            <tr>
                              <td width='30%' className='line'>
                                &nbsp;
                              </td>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td width='30%' className='line'>
                                Sr. No.
                              </td>
                              <td>{data.id}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td width='40%' align='center' valign='top'>
                        <img
                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                          width='100px'
                          alt='vmsmandal'
                          title='VMS Mandal'
                        />
                      </td>
                      <td width='30%' valign='top'>
                        <table width='100%' cellPadding='0' cellSpacing='0'>
                          <tbody>
                            <tr>
                              <td width='40%' className='line'>
                                &nbsp;
                              </td>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td className='line'>
                                <p>Centre Code</p>
                              </td>
                              <td>1000</td>
                            </tr>
                            <tr>
                              <td className='line'>&nbsp;</td>
                              <td>&nbsp;</td>
                            </tr>
                            <tr>
                              <td>Year</td>
                              <td>Semester 1</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr> */}
            {/* <tr>
              <td>
                <table width='100%' cellPadding='0' cellSpacing='0'>
                  <tbody>
                    <tr>
                      <td>
                        <table width='100%' cellPadding='0' cellSpacing='0'>
                          <tbody>
                            <tr>
                              <td width='20%'>&nbsp;</td>
                              <td width='60%' align='center'>
                                <table className='logo'>
                                  <tbody>
                                    <tr>
                                      <td className='logo'>
                                        <img
                                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                          width='100px'
                                          alt='vmsmandal'
                                          title='VMS Mandal'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align='center'>
                                        <img
                                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                          width='100px'
                                          alt='vmsmandal'
                                          title='VMS Mandal'
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td width='20%' align='center' className='pic'>
                                <img
                                  src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                  width='100px'
                                  alt='vmsmandal'
                                  title='VMS Mandal'
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr> */}
            <tr>
              <td>
                <table
                  width='98%'
                  cellPadding='0'
                  cellSpacing='0'
                  className='marks'
                  border='1'
                  style={{marginTop: '15%'}}
                >
                  <thead>
                    <tr>
                      <th>ROLL NO</th>
                      <th>EXAM TYPE</th>
                      <th>SEMESTER/YEAR</th>
                      <th>CERTIFICATE NO.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{borderRight: '1px solid black'}}>
                        {studentMarksResultData.state.data[0].studentInfo.rollNumber}
                      </td>
                      <td style={{borderRight: '1px solid black'}}>
                        {studentMarksResultData.state.courseType}
                      </td>
                      <td style={{borderRight: '1px solid black'}}>
                        {studentMarksResultData.state.courseType.split(' ')[0]}
                      </td>
                      <td>
                        {studentMarksResultData.state.data[0].companyName.companyName}-
                        {studentMarksResultData.state.data[0].studentInfo.rollNumber}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{display: 'flex', alignItems: 'center'}}>
                <table width='100%' cellPadding='0' cellSpacing='0' className='stu-details'>
                  <tbody>
                    <tr>
                      <td width='25%'>&nbsp; </td>
                      <td width='75%'>&nbsp;</td>
                    </tr>
                    <tr>
                      <td width='25%'>This is to certify That</td>
                      <td width='75%'>{studentMarksResultData.state.data[0].studentInfo.name}</td>
                    </tr>
                    <tr>
                      <td width='25%'>Course Name</td>
                      <td width='75%'>{studentMarksResultData.state.data[0].course.courseName}</td>
                    </tr>
                    <tr>
                      <td>
                        <small>Father's Name</small>
                      </td>
                      <td>{studentMarksResultData.state.data[0].studentInfo.father_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <small>Date of Birth</small>
                      </td>
                      <td>
                        {moment(
                          studentMarksResultData.state.data[0].studentInfo.date_of_birth
                        ).format('DD/MM/YYYY')}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <img
                  style={{marginRight: '30px', borderRadius: '10px'}}
                  width={100}
                  src={`${BASE_URL}/api/images/${studentMarksResultData.state.data[0].studentInfo.image}`}
                  alt='student image'
                />
              </td>
            </tr>
            <tr>
              <td>
                <table className='marks' width='98%' cellPadding='0' cellSpacing='0' border='1'>
                  <thead>
                    <tr>
                      <th width='15%' rowSpan='2' align='center' className='line'>
                        <br />
                        SUB.
                        <br />
                        CODE
                      </th>
                      <th width='30%' rowSpan='2' align='center' className='line'>
                        <br />
                        SUBJECT
                      </th>
                      <th rowSpan='2' align='center' className='line'>
                        <br />
                        MAX MARKS
                      </th>
                      <th colSpan='4' align='center' className='line'>
                        MARKS OBTAINED
                      </th>
                    </tr>
                    <tr>
                      <th align='center' className='line'>
                        <br />
                        THEORY
                      </th>
                      <th align='center' className='line'>
                        <br />
                        IA/
                        <br />
                        PR.
                      </th>
                      <th align='center' className='line'>
                        &nbsp;
                        <br />
                        TOTAL
                      </th>
                      {/* <th width='12%' align='center' className='line'>
                        <br />
                        POSITIONAL GRADE
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {studentMarksResultData?.state?.data &&
                      studentMarksResultData?.state?.data?.map((marksStudentData) => {
                        return (
                          <tr key={marksStudentData?._id} style={{borderBottom: '1px solid black'}}>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.Subjects.subjectCode}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.Subjects.subjectName}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.Subjects.fullMarks}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.theory}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.practical}
                            </td>
                            <td align='center'>{marksStudentData.totalMarks}</td>

                            {/* <td align='center'>A</td> */}
                          </tr>
                        )
                      })}
                    <tr>
                      <td align='center' colSpan='2'>
                        <strong>Total Marks</strong>
                      </td>
                      <td align='center'>{calculateTotalMarks.maxMarksTotals}</td>
                      <td align='center'>-</td>
                      <td align='center'>-</td>
                      <td align='center'>{calculateTotalMarks.passMarksTotals}</td>
                      <td align='center'>-</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table width='98%' cellPadding='0' cellSpacing='0' className='stu-details'>
                  <tbody>
                    <tr>
                      <td width='14%'>DIVISION:</td>
                      <td width='21%' className='division'>
                        First Division
                      </td>
                      <td width='35%'>&nbsp;</td>
                      <td width='30%' rowSpan='4' align='center' valign='bottom'>
                        <img
                          src='/signature (1).png'
                          width='30%'
                          alt='secretary-sign'
                          title='Secretary Sign'
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan='2' className='line'>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colSpan='2' className='line'>
                        General Awareness & life skills grade:
                      </td>
                      <td>A</td>
                    </tr>
                    <tr>
                      <td className='line'>&nbsp;</td>
                      <td>
                        <span className='line'>&nbsp;</span>
                      </td>
                      <td rowSpan='2' align='center'>
                        <img src='/qr code.png' width='20%' alt='qr' title='Website QR' />
                      </td>
                    </tr>
                    <tr>
                      <td className='line'>Dated:</td>
                      <td>{moment(Date.now()).format('DD/MM/YYYY')}</td>
                      <td align='center'>Controller of Examination</td>
                    </tr>
                    {/* <input value='Print' type='button' onClick={handlePrint} /> */}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StudentMarksResult
