import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Whiskey, Tasting } from '../types';

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

type TastingSort = 'newest' | 'oldest' | 'rating';
const sortLabels: Record<TastingSort, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  rating: 'Highest rated',
};

function WhiskeyDetail() {
  const { id } = useParams();
  const [whiskey, setWhiskey] = useState<Whiskey | null>(null);
  const [tastings, setTastings] = useState<Tasting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tastingSort, setTastingSort] = useState<TastingSort>('newest');
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

  if (loading) return <p className="p-14 font-sans text-text-muted">Loading...</p>;
  if (error) return <p className="p-14 font-sans text-accent">Error: {error}</p>;
  if (!whiskey) return <p className="p-14 font-sans text-text-muted">Whiskey not found.</p>;

  async function handleDeleteWhiskey() {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3001/whiskies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Failed to delete whiskey');
      return;
    }
    navigate('/');
  }

  async function handleDeleteTasting(tastingId: number) {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3001/tastings/${tastingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Failed to delete tasting');
      return;
    }
    setTastings((prev) => prev.filter((t) => t.id !== tastingId));
  }

  function cycleSort() {
    setTastingSort((prev) => (prev === 'newest' ? 'oldest' : prev === 'oldest' ? 'rating' : 'newest'));
  }

  const sortedTastings = [...tastings].sort((a, b) => {
    if (tastingSort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    const diff = new Date(a.tasted_on).getTime() - new Date(b.tasted_on).getTime();
    return tastingSort === 'oldest' ? diff : -diff;
  });

  const textLinkClasses = 'text-[13px] text-text-muted underline self-start hover:text-accent cursor-pointer';

  return (
    <div className="p-14">
      <div className="grid grid-cols-[360px_1fr] gap-14">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {userRole === 'admin' && (
            <div className="flex flex-row gap-4">
              <button onClick={handleDeleteWhiskey} className={textLinkClasses}>Delete whiskey</button>
              <Link to={`/whiskies/${id}/edit`} className={textLinkClasses}>Edit Whiskey</Link>
            </div>
          )}

          {whiskey.image_url ? (
            <img
              src={whiskey.image_url}
              alt={whiskey.name}
              className="aspect-[3/4] w-full border border-rule rounded-[2px] object-cover"
            />
          ) : (
            <div className="aspect-[3/4] border border-rule rounded-[2px] bg-image-placeholder" />
          )}

          <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-t border-rule-strong pt-4">
            <div>
              <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-text-label">Distillery</p>
              <p className="text-[16px] text-ink mt-1">{whiskey.distillery ?? '—'}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-text-label">Region</p>
              <p className="text-[16px] text-ink mt-1">{whiskey.region ?? '—'}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-text-label">Age</p>
              <p className="text-[16px] text-ink mt-1">{whiskey.age_years ? `${whiskey.age_years} years` : '—'}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-text-label">Strength</p>
              <p className="text-[16px] text-ink mt-1">{whiskey.abv ? `${whiskey.abv}% ABV` : '—'}</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-text-label">
            {[whiskey.region, whiskey.type].filter(Boolean).join(' ')}
          </p>
          <h1 className="font-serif text-[62px] leading-[1.02] text-ink mt-2">{whiskey.name}</h1>

          <div className="flex items-center gap-[18px] mt-6 pb-6 border-b border-rule-strong">
            {whiskey.average_rating ? (
              <>
                <span className="font-serif text-[40px] leading-none text-accent">{whiskey.average_rating}</span>
                <span className="text-[15px] text-text-muted">
                  average of {whiskey.tasting_count} {Number(whiskey.tasting_count) === 1 ? 'note' : 'notes'}
                </span>
              </>
            ) : (
              <span className="text-[15px] text-text-muted">No tastings yet</span>
            )}

            <Link
              to={`/whiskies/${id}/tastings/new`}
              className="ml-auto py-3 px-[22px] rounded-[2px] bg-accent text-paper text-[13px] font-semibold tracking-[0.14em] uppercase hover:bg-accent-hover"
            >
              Add a tasting
            </Link>
          </div>

          <div className="flex items-center justify-between my-8">
            <h2 className="font-serif text-[28px] text-ink">Tastings</h2>
            <button
              onClick={cycleSort}
              className="font-sans text-[13px] tracking-[0.12em] uppercase text-text-label hover:text-ink"
            >
              {sortLabels[tastingSort]}
            </button>
          </div>

          <div className="flex flex-col gap-7">
            {sortedTastings.map((tasting) => {
              const canDelete = loggedInUserId === tasting.user_id || userRole === 'admin';
              return (
                <div key={tasting.id} className="grid grid-cols-[108px_1fr] gap-6 group">
                  <div>
                    <p className="font-serif text-[22px] text-accent">{tasting.rating}</p>
                    <p className="text-[13px] text-text-label mt-0.5">{formatFullDate(tasting.tasted_on)}</p>
                  </div>
                  <div className="border-l border-rule-light pl-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-semibold text-ink">{tasting.taster}</p>
                      {canDelete && (
                        <button onClick={() => handleDeleteTasting(tasting.id)} className={textLinkClasses}>Delete tasting</button>
                      )}
                    </div>
                    {tasting.comment && (
                      <p className="font-serif text-[19px] leading-[1.6] text-ink-body mt-2 text-pretty">
                        {tasting.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhiskeyDetail;
