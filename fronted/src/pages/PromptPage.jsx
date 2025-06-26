  import React, { useState, useEffect } from 'react';
import { getAllCategories, getAllSubCategories, createPrompt, getAllPrompts } from '../services/api';

const USER_ID = 1; // שים כאן את ה־userId של המשתמש המחובר

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
      const res = await createPrompt({
        userId: USER_ID,
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

  const handleShowHistory = async () => {
    if (!showHistory) {
      const res = await getAllPrompts(USER_ID);
      setHistory(res.data?.data || res.data || []);
    }
    setShowHistory(!showHistory);
  };

  return (
    <div>
      <h2>Ask a Prompt</h2>
      <form onSubmit={handleSubmit}>
        {/* ...קטגוריות, תת קטגוריות, פרומפט... */}
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
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}

      <button onClick={handleShowHistory} style={{ marginTop: '20px' }}>
        {showHistory ? 'Hide' : 'Show'} My Prompt History
      </button>
      {showHistory && (
        <div>
          <h3>My Prompt History</h3>
          {history.length === 0 && <div>No history found.</div>}
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <strong>Prompt:</strong> {item.prompt}<br />
                <strong>Response:</strong> <pre>{item.response}</pre>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PromptPage;   