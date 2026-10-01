import { useState, useEffect, useCallback } from 'react';
import { topicsApi } from '../api/topicsApi';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await topicsApi.getAll();
      setTopics(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const addTopic = async (topicData) => {
    const newTopic = await topicsApi.create(topicData);
    setTopics((prev) => [newTopic, ...prev]);
    return newTopic;
  };

  const removeTopic = async (id) => {
    await topicsApi.delete(id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  return { topics, loading, error, reload: fetchTopics, addTopic, removeTopic };
}