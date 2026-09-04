import {  useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Whiskey } from '../types';
import type { SubmitEvent } from 'react';
import { API_URL } from '../config';

const CELLS = [1, 2, 3, 4, 5];

function AddTasting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [whiskey, setWhiskey] = useState<Whiskey | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [tastedOn, setTastedOn] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/whiskies/${id}`)
      .then((res) => res.json())
      .then(setWhiskey)
      .catch(() => {});
  }, [id]);

  function handleCellClick(n: number) {
    if (rating === n) {
      setRating(n - 0.5);
    } else if (rating === n - 0.5) {
      setRating(n);
    } else {
      setRating(n);
    }
  }

  useEffect(() => {
    if (!whiskey) return;

    document.title = `Add tasting for ${whiskey.name} - Tastes Smokey`;
  }, [whiskey]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (rating === null) {
      setError('Please select a rating.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/whiskies/${id}/tastings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tasted_on: tastedOn || null,
          comment,
          rating,
        }),
      });

      if (!res.ok) throw new Error('Failed to save tasting');
      navigate(`/whiskies/${id}`);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper-sunken p-4 tablet:p-14">
      <div className="max-w-[620px] mx-auto bg-paper-raised border border-rule rounded-[3px] p-6 tablet:p-10">
        <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-text-label">
          New tasting{whiskey ? ` · ${whiskey.name.toUpperCase()}` : ''}
        </p>
        <h1 className="font-serif text-[28px] tablet:text-[36px] text-ink my-2.5 mb-7">What did it taste like?</h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-6">
          {/* Rating */}
          <div className="flex flex-col tablet:flex-row tablet:items-center gap-2">
            <div className="flex items-center gap-2">
              {CELLS.map((n) => {
                const isFull = rating !== null && rating >= n;
                const isHalf = rating === n - 0.5;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleCellClick(n)}
                    className={`w-12 h-12 tablet:w-[54px] tablet:h-[46px] flex items-center justify-center font-serif text-xl rounded-[2px] border transition-colors ${
                      isFull
                        ? 'bg-accent border-accent text-paper-raised'
                        : isHalf
                        ? 'text-accent border-accent bg-[linear-gradient(90deg,#A6551F_50%,transparent_50%)]'
                        : 'border-rule text-text-muted hover:border-accent hover:text-accent'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <span className="text-[14px] text-text-muted tablet:ml-3">Half steps allowed — tap twice</span>
          </div>

          {/* Date */}
          <div>
            <label className="block font-sans text-[11px] tracking-[0.16em] uppercase text-text-label mb-2">
              Date
            </label>
            <input
              type="date"
              value={tastedOn}
              onChange={(e) => setTastedOn(e.target.value)}
              className="w-[200px] py-3 px-3.5 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-sans text-[11px] tracking-[0.16em] uppercase text-text-label mb-2">
              Notes
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Nose, palate, finish — or just how it felt."
              className="w-full p-3.5 border border-rule rounded-[2px] bg-paper-raised font-serif text-[18px] leading-[1.6] text-ink resize-y focus:border-accent focus:outline-none"
            />
          </div>

          {error && <p className="text-[13px] text-accent">{error}</p>}

          <div className="flex items-center gap-5 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="py-3.5 px-[30px] rounded-[2px] bg-ink text-paper text-[13px] font-semibold tracking-[0.14em] uppercase hover:bg-accent transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save tasting'}
            </button>
            <Link to={`/whiskies/${id}`} className="text-[14px] text-text-muted underline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTasting;
