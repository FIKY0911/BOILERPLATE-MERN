import { useState } from 'react';
import { Button } from '../../atoms';
import { FormField } from '../../molecules';
import './ItemForm.css';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  inStock: true,
};

export function ItemForm({ onSubmit, initialData = null, onCancel }) {
  const [form, setForm] = useState(initialData || initialForm);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!initialData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        price: Number(form.price),
      });
      if (!isEdit) setForm(initialForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <h2 className="item-form__title">
        {isEdit ? '✏️ Edit Item' : '➕ Add New Item'}
      </h2>

      <div className="item-form__grid">
        <FormField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Item name"
          required
        />
        <FormField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="0"
          required
        />
        <FormField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Electronics"
        />
      </div>

      <FormField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Short description..."
        textarea
      />

      <div className="item-form__checkbox">
        <input
          type="checkbox"
          id="inStock"
          name="inStock"
          checked={form.inStock}
          onChange={handleChange}
        />
        <label htmlFor="inStock">In Stock</label>
      </div>

      <div className="item-form__actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
