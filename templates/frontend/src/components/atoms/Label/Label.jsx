import './Label.css';

export function Label({ children, htmlFor, required = false, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`}>
      {children}
      {required && <span className="label__required">*</span>}
    </label>
  );
}
