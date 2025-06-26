import React, { useState } from 'react';
import { registerUser } from '../services/api';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = {
                name: username,
                password,
                phone
            };
            await registerUser(user);
            onRegisterSuccess();
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default RegisterForm;