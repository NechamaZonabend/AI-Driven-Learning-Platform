import React, { useState, useEffect } from 'react';
import { registerUser, getAllUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [adminExists, setAdminExists] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if an ADMIN already exists in the system
        getAllUsers()
            .then(data => {
                const users = data.data || [];
                const admin = users.find(u => u.role === 'ADMIN');
                setAdminExists(!!admin);
            })
            .catch(() => setAdminExists(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            const user = {
                name: username.trim(),
                password,
                phone: phone.trim(),
                role
            };
            await registerUser(user);
            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Registration failed. Please try again.'
            );
        }
    };

    const handleGoToLogin = () => {
        if (onRegisterSuccess) onRegisterSuccess();
        // Make sure HomePage resets isLoggedIn and user state!
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
            />
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">Regular User</option>
                {!adminExists && <option value="ADMIN">Admin</option>}
            </select>
            <button type="submit">Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && (
                <p style={{ color: 'green' }}>
                    Registration successful!{' '}
                    <button
                        type="button"
                        onClick={handleGoToLogin}
                        style={{
                            color: 'blue',
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                    >
                        Click here to login
                    </button>
                </p>
            )}
        </form>
    );
};

export default RegisterForm;