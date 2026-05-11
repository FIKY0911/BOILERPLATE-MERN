import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../../../services/api';
import { Spinner, Button, Badge } from '../../atoms';
import { ItemForm } from '../../organisms';
import './ItemDetailPage.css';

export function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await itemsAPI.getById(id);
        setItem(data.data);
      } catch {
        navigate('/items');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    const { data } = await itemsAPI.update(id, formData);
    setItem(data.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this item?')) {
      await itemsAPI.delete(id);
      navigate('/items');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  if (loading) {
    return (
      <div className="detail__loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <section className="detail animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/items')}>
        ← Back to Items
      </Button>

      {editing ? (
        <ItemForm
          initialData={item}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="detail__card">
          <div className="detail__header">
            <h1 className="detail__title">{item.name}</h1>
            <Badge variant={item.inStock ? 'success' : 'danger'}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          <p className="detail__description">
            {item.description || 'No description provided.'}
          </p>

          <div className="detail__meta">
            <div className="detail__meta-item">
              <span className="detail__meta-label">Price</span>
              <span className="detail__meta-value detail__price">
                {formatPrice(item.price)}
              </span>
            </div>
            <div className="detail__meta-item">
              <span className="detail__meta-label">Category</span>
              <Badge variant="info">{item.category}</Badge>
            </div>
            <div className="detail__meta-item">
              <span className="detail__meta-label">Created</span>
              <span className="detail__meta-value">
                {new Date(item.createdAt).toLocaleDateString('id-ID')}
              </span>
            </div>
          </div>

          <div className="detail__actions">
            <Button onClick={() => setEditing(true)}>✏️ Edit</Button>
            <Button variant="danger" onClick={handleDelete}>🗑️ Delete</Button>
          </div>
        </div>
      )}
    </section>
  );
}
