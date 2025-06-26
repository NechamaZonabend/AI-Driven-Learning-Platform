import React, { useState, useEffect } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // שליפת קטגוריות מהשרת
        fetch('http://localhost:8080/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data || []));
    }, []);

    const handleLogin = (success) => {
        if (success) setIsLoggedIn(true);
    };

    const handleShowRegister = () => setShowRegister(true);

    const handleRegisterSuccess = () => setIsLoggedIn(true);

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

    // אחרי התחברות
    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.map(cat => (
                    <li key={cat.id}>{cat.name}</li>
                ))}
            </ul>
            <button onClick={() => navigate('/prompt')}>Go to Prompt Page</button>
        </div>
    );
};

export default HomePage;