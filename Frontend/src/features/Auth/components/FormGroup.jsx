import React from 'react'

const FormGroup = ({label, placeholder, value, onChange}) => {
  return (
    <div className='form-group'>
      <label>{label}</label>
      <input 
      value = {value}
      onChange={onChange}
      type="text" placeholder={placeholder} />
    </div>
  )
}

export default FormGroup
