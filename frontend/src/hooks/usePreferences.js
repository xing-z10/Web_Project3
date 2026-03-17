import { useState, useEffect, useCallback } from 'react';
import {
  getPreference,
  createPreference,
  updatePreference,
  deletePreference,
} from '../services/preferenceService';

export function usePreferences(email) {
  const [preference, setPreference] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPreference(email);
      if (data) {
        setPreference(data);
      } else {
        // First time user — create a new preference record
        const created = await createPreference({ email });
        setPreference(created);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(async (data) => {
    if (!email) return;
    try {
      const updated = await updatePreference(email, data);
      setPreference(updated);
    } catch (err) {
      setError(err.message);
    }
  }, [email]);

  const remove = useCallback(async () => {
    if (!email) return;
    try {
      await deletePreference(email);
      setPreference(null);
    } catch (err) {
      setError(err.message);
    }
  }, [email]);

  return { preference, loading, error, update, remove, reload: load };
}