import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {Fragment} from 'react'

const PayStudentFee = ({payStudentFeesAdd, setPayStudentFeesAdd, setAddStudentFeeFormToggle}) => {
  //console.log(payStudentFeesAdd)
  const remainingFeesHandler = (e) => {
    setPayStudentFeesAdd((prev) => ({
      ...prev,
      amountPaid: Number(e.target.value),
      remainingFees: (Number(prev.netCourseFees) - Number(e.target.value)).toFixed(2),
    }))
  }

  const paymentOptionCtx = usePaymentOptionContextContext()

  const handleDateChange = (date) => {
    //console.log(date)
    setPayStudentFeesAdd((prevState) => ({
      ...prevState,
      amountDate: date,
    }))
  }

  return (
    <tr>
      <td></td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control min-w-150px'
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, netCourseFees: Number(e.target.value)})
          }
          value={payStudentFeesAdd.netCourseFees}
          readOnly
        />
      </td>
      <td>
        <input
          type='number'
          className='form-control min-w-150px '
          onChange={remainingFeesHandler}
          value={payStudentFeesAdd.amountPaid}
        />
      </td>
      <td>
        <input
          className='form-control min-w-150px '
          type='text'
          value={payStudentFeesAdd.remainingFees}
          readOnly
        />
      </td>
      <td>
        <DatePicker
          selected={payStudentFeesAdd.amountDate}
          onChange={handleDateChange}
          dateFormat='dd/MM/yyyy' // Desired date format
          className='form-control form-control-lg form-control-solid min-w-150px'
          placeholderText='DD/MM/YYYY'
        />
        {/* <input
          type='date'
          className='form-control w-min-100px'
          value={payStudentFeesAdd.amountDate}
          onChange={handleDateChange}
        /> */}
      </td>
      <td className='min-w-0px'></td>
      <td>
        <select
          className='form-select form-select-solid form-select-lg min-w-150px'
          value={payStudentFeesAdd.paymentOption}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, paymentOption: e.target.value})
          }
        >
          <option>select payment option</option>
          {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
            <Fragment key={paymentOpt._id}>
              <option key={paymentOpt._id} value={paymentOpt._id}>
                {paymentOpt.name}
              </option>
            </Fragment>
          ))}
        </select>
      </td>
      <td>
        <input
          type='text'
          className='form-control w-min-100px'
          value={payStudentFeesAdd.lateFees}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, lateFees: Number(e.target.value)})
          }
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            Pay
          </button>

          <button
            type='button'
            onClick={() => setAddStudentFeeFormToggle(false)}
            className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PayStudentFee
