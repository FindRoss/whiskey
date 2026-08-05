import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Whiskey, Tasting } from '../types';

function WhiskeyDetail() {
  const { id } = useParams(); 
  const [whiskey, setWhiskey] = useState<Whiskey | null>(null);
  const [tastings, setTastings] = useState<Tasting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  return (
    <div>
      <h1>{whiskey.name}</h1>
      <p>
        {whiskey.distillery} · {whiskey.region} ·{' '}
        {whiskey.age_years} yr · {whiskey.abv}% ABV
      </p>
      <p>Viewing whiskey id: {id}</p>

      <Link to={`/whiskies/${id}/tastings/new`}>Add Tasting</Link>

      <h2>Tastings</h2>
      <ul>
        {tastings.map((tasting) => (
          <li key={tasting.id}>
            <strong>{tasting.taster}</strong>
            {' '}({tasting.tasted_on}) — rating {tasting.rating}
            <br /> 
            {tasting.comment}
          </li>
        ))}
      </ul>
    </div>
   ) 
}; 

export default WhiskeyDetail;