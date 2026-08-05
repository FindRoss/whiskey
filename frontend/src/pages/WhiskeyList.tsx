import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import type { Whiskey } from '../types';

function WhiskeyList() {
    const [whiskies, setWhiskies] = useState<Whiskey[]>([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 
    
    useEffect(() => {
      fetch('http://localhost:3001/whiskies')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch whiskies'); 
          return res.json(); 
        })
        .then((data) => setWhiskies(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>; 

    return (
        <div>
            <h1>WhiskeyList</h1>
            <ul>
              {whiskies.map((whiskey) => (
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