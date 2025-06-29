import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/api';
import '../App.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        console.log('getAllUsers response:', res);
        setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setError('Failed to fetch users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>All Users</h3>
      {Array.isArray(users) && users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;