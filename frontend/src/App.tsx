import { Routes, Route, Link } from 'react-router-dom'; 
import WhiskeyList from './pages/WhiskeyList';
import WhiskeyDetail from './pages/WhiskeyDetail'; 
import AddWhiskey from './pages/AddWhiskey';
import AddTasting from './pages/AddTasting';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Whiskies</Link>
        {' | '}
        <Link to="/whiskies/new">Add Whiskey</Link>
      </nav>

      <Routes>
        <Route path="/" element={<WhiskeyList />} />
        <Route path="/whiskies/:id" element={<WhiskeyDetail />} />
        <Route path="/whiskies/new" element={<AddWhiskey />} />
        <Route path="/whiskies/:id/tastings/new" element={<AddTasting />} />
      </Routes>
    </div>
  )
}

export default App;