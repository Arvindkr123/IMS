import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {toast} from 'react-toastify'
import {useParams} from 'react-router-dom'

const AddDayBookData = ({totalBalance, companyId}) => {
  // console.log(totalBalance, companyId)
  const params = useParams()
  // console.log(params.id)
  const [formData, setFormData] = useState({
    dayBookDatadate: new Date(),
    accountName: '',
    naretion: '',
    debit: 0,
    credit: 0,
    dayBookAccountId: '',
    accountType: '',
    companyId: params.id,
  })

  //console.log(formData)

  const dayBookAccountCtx = usePaymentOptionContextContext()

  const handleDateChange = (date) => {
    setFormData((prevState) => ({...prevState, dayBookDatadate: date}))
  }

  const handleAccountNameChange = (event) => {
    const selectedAccount = dayBookAccountCtx.getDayBookAccountsLists.data
      ?.filter((cp) => cp.companyId === params.id)
      ?.find((item) => item.accountName === event.target.value)
    setFormData((prevState) => ({
      ...prevState,
      accountName: event.target.value,
      accountType: selectedAccount ? selectedAccount.accountType : '',
      dayBookAccountId: selectedAccount ? selectedAccount._id : '',
    }))
  }

  const handleInputChange = (event) => {
    const {name, value} = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const {accountName, naretion, debit, credit} = formData

    if (!accountName) {
      toast.error('Please select account name', {bodyStyle: {fontSize: '18px'}})
      return
    }

    if (!naretion) {
      toast.error('Please enter narration', {bodyStyle: {fontSize: '18px'}})
      return
    }

    if (credit === 0 && debit === 0) {
      toast.error('Please enter either credit or debit', {bodyStyle: {fontSize: '18px'}})
      return
    }

    if (totalBalance < Number(debit)) {
      toast.error(`Your total balance is less than the debit amount ${debit}`, {
        bodyStyle: {fontSize: '18px'},
      })
      return
    }

    try {
      dayBookAccountCtx.createDayBookDataMutation.mutate(formData)

      toast.success('Day Account Data added successfully!', {bodyStyle: {fontSize: '18px'}})
      setFormData({
        dayBookDatadate: new Date(),
        accountName: '',
        naretion: '',
        debit: 0,
        credit: 0,
        dayBookAccountId: '',
        accountType: '',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className="form-check-input widget-9-check" type="checkbox" value="1" /> */}
        </div>
      </td>
      <td></td>
      <td>
        <DatePicker
          selected={formData.dayBookDatadate}
          onChange={handleDateChange}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td></td>
      <td></td>
      <td>
        <input
          type='search'
          className='form-control'
          value={formData.accountName}
          onChange={handleAccountNameChange}
          list='accountNameOptions'
          placeholder='Search account'
        />
        <datalist id='accountNameOptions'>
          {dayBookAccountCtx.getDayBookAccountsLists.data
            ?.filter((cp) => cp.companyId === params.id)
            .map((item) => (
              <option key={item._id} value={item.accountName}>
                {item.accountName}
              </option>
            ))}
        </datalist>
      </td>
      <td>
        <input
          type='text'
          className='form-control'
          name='naretion'
          placeholder='Enter narration'
          value={formData.naretion}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <input
          type='number'
          className='form-control'
          name='credit'
          placeholder='Enter credit'
          value={formData.credit}
          onChange={handleInputChange}
          readOnly={+formData.debit !== 0}
        />
      </td>
      <td>
        <input
          type='number'
          className='form-control'
          name='debit'
          placeholder='Enter debit'
          value={formData.debit}
          onChange={handleInputChange}
          readOnly={+formData.credit !== 0}
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn-active-color-primary btn-sm me-1 px-5'
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </td>
    </tr>
  )
}

export default AddDayBookData
