import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '../../atoms';
import './ItemCard.css';

export function ItemCard({ item, onDelete }) {
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  return (
    <div className="item-card animate-fade-in">
      <div className="item-card__header">
        <h3 className="item-card__title">{item.name}</h3>
        <Badge variant={item.inStock ? 'success' : 'danger'}>
          {item.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </div>

      <p className="item-card__description">
        {item.description || 'No description available'}
      </p>

      <div className="item-card__meta">
        <span className="item-card__price">{formatPrice(item.price)}</span>
        <Badge variant="info">{item.category}</Badge>
      </div>

      <div className="item-card__actions">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/items/${item._id}`)}
        >
          Detail
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(item._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
