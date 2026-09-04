import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import WhiskeyList from './pages/WhiskeyList';
import WhiskeyDetail from './pages/WhiskeyDetail';
import AddWhiskey from './pages/AddWhiskey';
import EditWhiskey from './pages/EditWhiskey';
import AddTasting from './pages/AddTasting';
import Login from './pages/Login';
import Register from './pages/Register';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/');
  }

  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {!hideNav && <Nav isLoggedIn={isLoggedIn} onLogout={handleLogout} />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<WhiskeyList />} />
          <Route path="/whiskies/:id" element={<WhiskeyDetail />} />
          <Route path="/whiskies/new" element={<AddWhiskey />} />
          <Route path="/whiskies/:id/edit" element={<EditWhiskey />} />
          <Route path="/whiskies/:id/tastings/new" element={<AddTasting />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App;