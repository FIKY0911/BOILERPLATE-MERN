import { useState } from 'react';
import { useItems } from '../../../hooks/useItems';
import { SearchBar } from '../../molecules';
import { ItemForm, ItemList } from '../../organisms';
import { Button } from '../../atoms';
import './ItemsPage.css';

export function ItemsPage() {
  const { items, loading, error, createItem, deleteItem } = useItems();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data) => {
    await createItem(data);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  return (
    <section className="items-page animate-fade-in">
      <div className="items-page__header">
        <div>
          <h1 className="items-page__title">📦 Items</h1>
          <p className="items-page__subtitle">
            Manage your items — {items.length} total
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '＋ Add Item'}
        </Button>
      </div>

      {showForm && (
        <ItemForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ItemList
        items={filtered}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </section>
  );
}
