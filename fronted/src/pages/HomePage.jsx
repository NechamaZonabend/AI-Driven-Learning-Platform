import React, { useState } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = (success) => {
        if (success) {
            setIsLoggedIn(true);
        }
        // אם נכשל, לא עושים כלום כאן - LoginForm יטפל בהצגת השגיאה והכפתור
    };

    const handleShowRegister = () => {
        setShowRegister(true);
    };

    const handleRegisterSuccess = () => {
        setIsLoggedIn(true);
    };

    if (showRegister) {
        return <RegisterForm onRegisterSuccess={handleRegisterSuccess} />;
    }

    // תמיד מציגים קודם את טופס ההתחברות
    return (
        <div>
            <h1>Welcome to the Learning Platform</h1>
            <LoginForm onLogin={handleLogin} onShowRegister={handleShowRegister} />
        </div>
    );
};

export default HomePage;