import { useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import type { SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTasting() {
  const { id } = useParams(); 
  const [tastedOn, setTastedOn] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); 

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3001/whiskies/${id}/tastings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify({
          tasted_on: tastedOn ? tastedOn : null,
          comment,
          rating: rating ? Number(rating) : null,
        }), 
      });

      if (!res.ok) throw new Error('This didnt work');
      navigate(`/whiskies/${id}`);
    

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Add Tasting</h1>
      <p>For whiskey id: {id}</p>
      <form onSubmit={handleSubmit} autoComplete="off">
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