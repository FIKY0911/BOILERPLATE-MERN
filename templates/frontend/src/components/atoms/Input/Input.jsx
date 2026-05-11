import './Input.css';

export function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  id,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      disabled={disabled}
      className={`input ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  placeholder = '',
  value,
  onChange,
  name,
  id,
  rows = 3,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      rows={rows}
      disabled={disabled}
      className={`input input--textarea ${className}`}
      {...props}
    />
  );
}
