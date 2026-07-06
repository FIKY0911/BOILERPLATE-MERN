import React from 'react';
import Input from '../atoms/Input';

const FormField = ({ label, id, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <Input id={id} {...props} />
    </div>
  );
};

export default FormField;
