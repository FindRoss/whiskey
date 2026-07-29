import { useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import type { SubmitEvent } from 'react';

function AddTasting() {
  const { id } = useParams(); 

  const [taster, setTaster] = useState('');
  const [tastedOn, setTastedOn] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); 
    console.log({ whiskeyId: id, taster, tastedOn, comment, rating}); 
  }

  return (
    <div>
      <h1>Add Tasting</h1>
      <p>For whiskey id: {id}</p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>
            Taster
            <input value={taster} onChange={(e) => setTaster(e.target.value)} required />
          </label>
        </div>
       <div>
          <label>
            Date
            <input value={tastedOn} onChange={(e) => setTastedOn(e.target.value)} type="date" />
          </label>
        </div>
        <div>
          <label>
            Rating
            <input value={rating} onChange={(e) => setRating(e.target.value)} type="number" min="0" max="100" />
          </label>
        </div>
        <div>
          <label>
            Comment
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
        </div>
        <button type="submit">Save Tasting</button>
      </form>
    </div>
  );
}

export default AddTasting;