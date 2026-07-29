import { useParams, Link } from 'react-router-dom';
import type { Whiskey, Tasting } from '../types';

const placeholderWhiskey: Whiskey = {
  id: 1, 
  name: 'Lagavulin', 
  distillery: 'Lagavulin', 
  region: 'Islay', 
  type: 'Single Malt', 
  age_years: 16, 
  abv: '43.0', 
  notes: 'Smokey, peaty, classic Islay.',
  created_at: new Date().toISOString()
}; 

const placeholderTastings: Tasting[] = [
  {
    id: 1, 
    whiskey_id: 1,
    taster: 'Ross', 
    tasted_on: '2026-07-23',
    comment: 'Big smoke up front, long peaty finish.',
    rating: 88, 
    created_at: new Date().toISOString(), 
  },
];

function WhiskeyDetail() {
  const { id } = useParams(); 
  
  return (
    <div>
      <h1>{placeholderWhiskey.name}</h1>
      <p>
        {placeholderWhiskey.distillery} · {placeholderWhiskey.region} ·{' '}
        {placeholderWhiskey.age_years} yr · {placeholderWhiskey.abv}% ABV
      </p>
      <p>Viewing whiskey id: {id}</p>

      <Link to={`/whiskies/${id}/tastings/new`}>Add Tasting</Link>

      <h2>Tastings</h2>
      <ul>
        {placeholderTastings.map((tasting) => (
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