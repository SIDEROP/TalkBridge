import { useState } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authenticate = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/logout'); 
      setUser(null);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
      setLoading(false);
    }
  };

  return {
    user,
    authenticate,
    handleLogout,
    loading,
    error,
  };
};

export default useAuth;
