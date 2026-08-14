import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Whiskey, Tasting } from '../types';
import { useNavigate } from 'react-router-dom';

function WhiskeyDetail() {
  const { id } = useParams(); 
  const [whiskey, setWhiskey] = useState<Whiskey | null>(null);
  const [tastings, setTastings] = useState<Tasting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const loggedInUserId = Number(localStorage.getItem('user_id'));
  
  useEffect(() => {
    async function loadData() {
      try {
        const [whiskeyRes, tastingsRes] = await Promise.all([
          fetch(`http://localhost:3001/whiskies/${id}`),
          fetch(`http://localhost:3001/whiskies/${id}/tastings`)
        ]);

        if (!whiskeyRes.ok) throw new Error('Whiskey not found');
        if (!tastingsRes.ok) throw new Error('Failed to fetch tastings');

        const whiskeyData = await whiskeyRes.json(); 
        const tastingsData = await tastingsRes.json();

        setWhiskey(whiskeyData);
        setTastings(tastingsData);

      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!whiskey) return <p>Whiskey not found.</p>;

  // console.log(tastings[0].user_id);

  async function handleDeleteWhiskey() {
    const token = localStorage.getItem('token'); 

    const res = await fetch(`http://localhost:3001/whiskies/${id}`, {
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!res.ok) {
      console.error('Failed to delete whiskey'); 
      return;
    }
    navigate('/');
  }

  async function handleDeleteTasting(tastingId: Number) {
    const token = localStorage.getItem('token'); 
    
    const res = await fetch(`http://localhost:3001/tastings/${tastingId}`, {
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${token}` },
    }); 

    if (!res.ok) {
      console.error('Failed to delete tasting');
      return;
    } 
    navigate('/');
  }

  return (
    <div>
      {(userRole === 'admin') && <button onClick={handleDeleteWhiskey}>Delete whiskey</button>}
      <h1>{whiskey.name}</h1>
      <p>
        {whiskey.distillery} · {whiskey.region} ·{' '}
        {whiskey.age_years} yr · {whiskey.abv}% ABV
      </p>
      <p>Viewing whiskey id: {id}</p>

      <Link to={`/whiskies/${id}/tastings/new`}>Add Tasting</Link>
      <hr />
      <h2>Tastings</h2>
      <ul>
        {tastings.map((tasting) => (
          <li key={tasting.id}>
            {tasting.taster}
            {' '}({new Date(tasting.tasted_on).toLocaleDateString()}) — rating {tasting.rating}
            <br /> 
            {tasting.comment}
            {
              ((loggedInUserId === tasting.user_id) || (userRole === 'admin')) && <button onClick={() => handleDeleteTasting(tasting.id)}>Delete tasting</button>
            }
          </li>
        ))}
      </ul>
    </div>
   ) 
}; 

export default WhiskeyDetail;