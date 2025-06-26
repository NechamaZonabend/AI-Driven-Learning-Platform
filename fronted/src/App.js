// דוגמה ב-App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PromptPage from './pages/PromptPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prompt" element={<PromptPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;