import { Spinner } from '../../atoms';
import { ItemCard } from '../../molecules';
import './ItemList.css';

export function ItemList({ items, loading, error, onDelete }) {
  if (loading) {
    return (
      <div className="item-list__status">
        <Spinner size="lg" />
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-list__status item-list__status--error">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="item-list__status">
        <p>📦 No items found. Create your first item!</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
