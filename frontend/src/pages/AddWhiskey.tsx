import { useState } from 'react'; 
import type { SubmitEvent } from 'react';

function AddWhiskey() {
  const [name, setName] = useState('');
  const [distillery, setDistillery] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [abv, setAbv] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); 
    console.log({ name, distillery, region, type, ageYears, abv, notes });
  }

  return (
    <div>
      <h1>Add Whiskey</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Distillery
            <input value={distillery} onChange={(e) => setDistillery(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Region
            <input value={region} onChange={(e) => setRegion(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Type
            <input value={type} onChange={(e) => setType(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Age (years)
            <input value={ageYears} onChange={(e) => setAgeYears(e.target.value)} type="number" />
          </label>
        </div>
        <div>
          <label>
            ABV
            <input value={abv} onChange={(e) => setAbv(e.target.value)} type="number" step="0.1" />
          </label>
        </div>
        <div>
          <label>
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>
        <button type="submit">Save Whiskey</button>
      </form>
    </div>
  )
}; 

export default AddWhiskey; 