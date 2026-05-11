import { Input } from '../../atoms';
import './SearchBar.css';

export function SearchBar({ value, onChange, placeholder = 'Search items...' }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-bar__input"
      />
    </div>
  );
}
