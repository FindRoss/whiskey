import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import type { Whiskey } from '../types';

function WhiskeyList() {
    const [whiskies, setWhiskies] = useState<Whiskey[]>([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'age'>('name');
    
    useEffect(() => {
      async function loadWhiskies() {
        try {
          const res = await fetch('http://localhost:3001/whiskies'); 
          
          if (!res.ok) throw new Error('Failed to fetch whiskies'); 
          
          const data = await res.json(); 
          setWhiskies(data);
        } catch (err) {
          if (err instanceof Error) setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      
      loadWhiskies();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>; 

    const filtered = whiskies.filter((whiskey) => whiskey.name.toLowerCase().includes(search.toLowerCase())); 

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name); 
      return (b.age_years ?? 0) - (a.age_years ?? 0);
    })

    return (
      <div>
        <h1>WhiskeyList</h1>

        <input 
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'age')}>
          <option value="name">Sort by name</option>
          <option value="age">Sort by age (oldest first)</option>
        </select>

        <ul>
          {sorted.map((whiskey) => (
            <li key={whiskey.id}>
              <Link to={`/whiskies/${whiskey.id}`}>
                {whiskey.name} {whiskey.age_years ? `(${whiskey.age_years} yr)` : ''}
              </Link>
            </li>
          ))}
        </ul>
    </div>
  ); 
}

export default WhiskeyList;