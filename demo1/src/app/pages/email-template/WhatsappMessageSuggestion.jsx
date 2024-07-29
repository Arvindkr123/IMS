import {useCompanyContext} from '../compay/CompanyContext'

const WhatsappMessageSuggestion = () => {
  // whatsAppSuggestionStatus
  const companyCtx = useCompanyContext()

  const handleCheckboxChange = (e) => {
    // console.log(e.target.checked)
    //console.log('Checkbox is now:', !isChecked)
    try {
      companyCtx.postWhatsAppMessageSuggestionStatus.mutate({
        whatsappSuggestionStatus: e.target.checked,
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='card p-5'>
      <h3 className='card-title'>Whatsapp Message Suggestions</h3>
      <p>Do you want to send Whatsapp message ?</p>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id='sendEmailCheckbox'
          onChange={handleCheckboxChange}
          checked={companyCtx.getWhatsAppMessageuggestionStatus?.data[0]?.whatsappSuggestionStatus}
        />
        <label className='form-check-label' htmlFor='sendEmailCheckbox'>
          Yes, send Whatsapp message
        </label>
      </div>
    </div>
  )
}
export default WhatsappMessageSuggestion
