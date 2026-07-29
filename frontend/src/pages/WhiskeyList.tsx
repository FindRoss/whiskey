import { Link } from 'react-router-dom'; 
import type { Whiskey } from '../types';

const placeholderWhiskies: Whiskey[] = [
  {
    id: 1,
    name: 'Lagavulin 16',
    distillery: 'Lagavulin',
    region: 'Islay',
    type: 'Single Malt',
    age_years: 16,
    abv: '43.0',
    notes: null,
    created_at: new Date().toISOString(),
  }
]

function WhiskeyList() {
    return (
        <div>
            <h1>WhiskeyList</h1>
            <ul>
              {placeholderWhiskies.map((whiskey) => (
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