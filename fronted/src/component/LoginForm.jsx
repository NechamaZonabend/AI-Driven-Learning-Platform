import React, { useState } from 'react';
import { loginUser } from '../services/api';

const LoginForm = ({ onLogin, onShowRegister }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ phone, password });
            if (response.success) {
                onLogin(true);
            } else {
                setError('משתמש לא נמצא במערכת');
            }
        } catch (err) {
            setError('משתמש לא נמצא במערכת');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && (
                <div>
                    <p>{error}</p>
                    <button type="button" onClick={onShowRegister} style={{ color: 'blue', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                        להרשמה
                    </button>
                </div>
            )}
        </form>
    );
};

export default LoginForm;