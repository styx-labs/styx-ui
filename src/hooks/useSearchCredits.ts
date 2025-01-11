import { useState, useEffect } from 'react';
import { apiService } from '../api';

export const useSearchCredits = () => {
  const [searchCredits, setSearchCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchCredits = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSearchCredits();
      setSearchCredits(response.data.search_credits);
      setError(null);
    } catch (err) {
      setError('Failed to fetch search credits');
      console.error('Error fetching search credits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchCredits();
  }, []);

  return { searchCredits, loading, error, refetch: fetchSearchCredits };
}; 