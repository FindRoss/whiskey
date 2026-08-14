import { Routes, Route, Link } from 'react-router-dom'; 
import WhiskeyList from './pages/WhiskeyList';
import WhiskeyDetail from './pages/WhiskeyDetail'; 
import AddWhiskey from './pages/AddWhiskey';
import AddTasting from './pages/AddTasting';
import Login from './pages/Login';
import Register from './pages/Register';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setIsLoggedIn(false);
  }

  return (
    <div>
      <nav>
        <Link to="/">Whiskies</Link>
        {' | '}
        {isLoggedIn && <Link to="/whiskies/new">Add Whiskey</Link>}
        {' | '}
        {!isLoggedIn && <Link to="/login">Login</Link>}       
        {' | '}
        {!isLoggedIn && <Link to="/register">Register</Link>}  
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      </nav>

      
      <div className="container">
        <Routes>
          <Route path="/" element={<WhiskeyList />} />
          <Route path="/whiskies/:id" element={<WhiskeyDetail />} />
          <Route path="/whiskies/new" element={<AddWhiskey />} />
          <Route path="/whiskies/:id/tastings/new" element={<AddTasting />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} /> 
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;