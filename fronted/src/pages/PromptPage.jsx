import React, { useState, useEffect } from 'react';
import { getAllCategories, getAllSubCategories, createPrompt, getAllPrompts } from '../services/api';
import '../App.css';

const PromptPage = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    getAllCategories().then(data => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    if (categoryId) {
      getAllSubCategories(categoryId).then(data => setSubCategories(data.data || []));
    } else {
      setSubCategories([]);
    }
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;
      if (!userId) {
        setResponse('Error: User not logged in');
        setLoading(false);
        return;
      }
      const res = await createPrompt({
        userId,
        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),
        prompt
      });
      setResponse(res.data?.response || res.message || 'No response');
    } catch (err) {
      setResponse('Error: ' + (err?.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  // Fetch prompt history and handle nested data structure
  const handleShowHistory = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (!userId) {
      setHistory([]);
      setShowHistory(true);
      return;
    }
    try {
      const data = await getAllPrompts(userId);
      // Handle nested data.data.data
      let arr = [];
      if (Array.isArray(data?.data?.data)) {
        arr = data.data.data;
      } else if (Array.isArray(data?.data)) {
        arr = data.data;
      } else if (Array.isArray(data)) {
        arr = data;
      }
      setHistory(arr);
      setShowHistory(true);
    } catch (err) {
      setHistory([]);
      setShowHistory(true);
    }
  };

  return (
    <div>
      <h2>Ask a Prompt</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category:</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">Select</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Sub Category:</label>
          <select value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)} required>
            <option value="">Select</option>
            {subCategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Prompt:</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Send'}</button>
      </form>
      <button style={{ marginTop: '1rem' }} onClick={handleShowHistory}>
        Show History
      </button>
      {showHistory && (
        <div>
          <h3>Your Prompt History</h3>
          {Array.isArray(history) && history.length === 0 ? (
            <div>No previous prompts found.</div>
          ) : (
            <ul>
              {Array.isArray(history) && history.map(item => (
                <li key={item.id}>
                  <strong>Prompt:</strong> {item.prompt}<br />
                  <strong>Response:</strong> {item.response}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default PromptPage;