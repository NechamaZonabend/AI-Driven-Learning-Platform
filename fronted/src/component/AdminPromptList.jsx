import React, { useEffect, useState } from 'react';
import { getAllPromptsAdmin } from '../services/api';
import '../App.css';

const AdminPromptList = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await getAllPromptsAdmin();
        setPrompts(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        setError('Failed to fetch prompts');
      }
      setLoading(false);
    };
    fetchPrompts();
  }, []);

  if (loading) return <div>Loading prompts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>All Prompts</h3>
      {prompts.length === 0 ? (
        <div>No prompts found.</div>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Category ID</th>
              <th>SubCategory ID</th>
              <th>Prompt</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.id}>
                <td>{prompt.id}</td>
                <td>{prompt.userId}</td>
                <td>{prompt.categoryId}</td>
                <td>{prompt.subCategoryId}</td>
                <td>{prompt.prompt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPromptList;