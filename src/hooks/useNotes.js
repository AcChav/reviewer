import { useState, useEffect, useCallback } from 'react';
import { notesApi } from '../api/notesApi';

export function useNotes(topicId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    if (!topicId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.getByTopic(topicId);
      setNotes(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (noteData) => {
    const created = await notesApi.create({ ...noteData, topicId });
    setNotes((prev) => [created, ...prev]);
    return created;
  };

  const removeNote = async (id) => {
    await notesApi.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, loading, error, reload: fetchNotes, addNote, removeNote };
}