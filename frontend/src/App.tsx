import { Routes, Route, Link } from 'react-router-dom'; 
import WhiskeyList from './pages/WhiskeyList';
import WhiskeyDetail from './pages/WhiskeyDetail'; 
import AddWhiskey from './pages/AddWhiskey';
import AddTasting from './pages/AddTasting';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Whiskies</Link>
        {' | '}
        <Link to="/whiskies/new">Add Whiskey</Link>
        {' | '}
        <Link to="/login">Login</Link>
      </nav>

      
      <div className="container">
        <Routes>
          <Route path="/" element={<WhiskeyList />} />
          <Route path="/whiskies/:id" element={<WhiskeyDetail />} />
          <Route path="/whiskies/new" element={<AddWhiskey />} />
          <Route path="/whiskies/:id/tastings/new" element={<AddTasting />} />
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </div>
    </div>
  )
}

export default App;