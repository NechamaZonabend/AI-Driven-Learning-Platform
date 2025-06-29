import React from 'react';
import AdminPromptList from '../component/AdminPromptList';
import UserList from '../component/UserList';
import '../App.css';

const AdminPage = () => (
  <div>
    <h2>Admin Panel</h2>
    <UserList />
    <hr />
    <AdminPromptList />
  </div>
);

export default AdminPage;