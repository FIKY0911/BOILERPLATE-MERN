import { Label } from '../../atoms';
import { Input, Textarea } from '../../atoms';
import './FormField.css';

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  textarea = false,
  error = '',
}) {
  const id = `field-${name}`;
  const Component = textarea ? Textarea : Input;

  return (
    <div className="form-field">
      <Label htmlFor={id} required={required}>{label}</Label>
      <Component
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
