import { useState, useEffect, useCallback } from 'react';
import { itemsAPI } from '../services/api';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await itemsAPI.getAll();
      setItems(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (itemData) => {
    try {
      const { data } = await itemsAPI.create(itemData);
      setItems((prev) => [data.data, ...prev]);
      return data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create item');
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const { data } = await itemsAPI.update(id, itemData);
      setItems((prev) => prev.map((item) => (item._id === id ? data.data : item)));
      return data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update item');
    }
  };

  const deleteItem = async (id) => {
    try {
      await itemsAPI.delete(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete item');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
