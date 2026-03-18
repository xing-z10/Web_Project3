import { useState, useEffect, useCallback } from 'react';
import { getEvents } from '../services/eventService';

const DEFAULT_FILTERS = {
  city: '',
  category: '',
  isFree: '',
  dateFrom: '',
  dateTo: '',
  platform: '',
  tags: '',
  search: '',
  page: 1,
  limit: 20,
};

export function useEvents(initialFilters = {}) {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });

  const fetchEvents = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents(currentFilters);
      setEvents(data.events || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  return {
    events,
    total,
    loading,
    error,
    filters,
    setFilter,
    resetFilters,
    refetch: () => fetchEvents(filters),
  };
}
