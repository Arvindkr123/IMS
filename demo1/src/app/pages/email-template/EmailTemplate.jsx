import {useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const EmailTemplate = () => {
  const companyCTX = useCompanyContext()
  const [textEmailsData, setTextEmailsData] = useState({
    firstRemainder: '',
    secondRemainder: '',
    thirdRemainder: '',
  })

  const onChangeHandler = (e) => {
    setTextEmailsData({...textEmailsData, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      companyCTX.postEmailRemainderText.mutate(textEmailsData)
    } catch (error) {
      console.log(error)
    } finally {
      setTextEmailsData({
        firstRemainder: '',
        secondRemainder: '',
        thirdRemainder: '',
      })
    }
  }

  return (
    <div className='card p-10'>
      <h1>Email Reminder Text</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='firstRemainder' className='form-label'>
            First Reminder
          </label>
          <textarea
            id='firstRemainder'
            value={textEmailsData.firstRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='firstRemainder'
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='secondRemainder' className='form-label'>
            Second Reminder
          </label>
          <textarea
            id='secondRemainder'
            value={textEmailsData.secondRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='secondRemainder'
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='thirdRemainder' className='form-label'>
            Third Reminder
          </label>
          <textarea
            id='thirdRemainder'
            value={textEmailsData.thirdRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='thirdRemainder'
          />
        </div>
        <button
          disabled={companyCTX.postEmailRemainderText.isLoading === true}
          type='submit'
          className='btn btn-primary'
        >
          {companyCTX.postEmailRemainderText.isLoading === true ? 'Adding' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default EmailTemplate
