import React, { useState, useEffect } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Initialize user from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data || []));
    }, []);

    const handleShowRegister = () => setShowRegister(true);

    const handleLogin = (success, userData) => {
        if (success && userData) {
            setIsLoggedIn(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    // מתוקן: איפוס התחברות אחרי הרשמה כדי להחזיר לדף הלוגין
    const handleRegisterSuccess = () => {
        setIsLoggedIn(false);
        setUser(null);
        setShowRegister(false);
        localStorage.removeItem('user');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
    };

    if (showRegister) {
        return <RegisterForm onRegisterSuccess={handleRegisterSuccess} />;
    }

    if (!isLoggedIn) {
        return (
            <div>
                <h1>Welcome to the Learning Platform</h1>
                <LoginForm onLogin={handleLogin} onShowRegister={handleShowRegister} />
            </div>
        );
    }

    // After login
    return (
        <div>
            <nav>
                <button onClick={() => navigate('/prompt')}>Go to Prompt Page</button>
                {user && user.role === 'ADMIN' && (
                    <button onClick={() => navigate('/admin')}>Go to Admin Page</button>
                )}
                <button onClick={handleLogout}>Logout</button>
            </nav>
            <h2>Categories</h2>
            <ul>
                {categories.map(cat => (
                    <li key={cat.id}>{cat.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;