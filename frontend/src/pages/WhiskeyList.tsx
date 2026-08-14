import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Whiskey } from '../types';

function formatMonthYear(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function WhiskeyList() {
  const [whiskies, setWhiskies] = useState<Whiskey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating'>('recent');
  const username = localStorage.getItem('username');

  useEffect(() => {
    async function loadWhiskies() {
      try {
        const res = await fetch('http://localhost:3001/whiskies');

        if (!res.ok) throw new Error('Failed to fetch whiskies');

        const data = await res.json();
        setWhiskies(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWhiskies();
  }, []);

  if (loading) return <p className="p-14 font-sans text-text-muted">Loading...</p>;
  if (error) return <p className="p-14 font-sans text-accent">Error: {error}</p>;

  const filtered = whiskies.filter(
    (whiskey) =>
      whiskey.name.toLowerCase().includes(search.toLowerCase()) ||
      (whiskey.distillery ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating') return Number(b.average_rating ?? 0) - Number(a.average_rating ?? 0);
    return new Date(b.last_tasted_at ?? 0).getTime() - new Date(a.last_tasted_at ?? 0).getTime();
  });

  const totalNotes = whiskies.reduce((sum, w) => sum + Number(w.tasting_count), 0);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto border border-rule rounded-[4px] bg-paper shadow-[0_18px_40px_-28px_rgba(28,23,20,0.45)]">
        <div className="pt-11 px-14 pb-14">
          {/* Page header */}
          <div className="flex items-end justify-between border-b border-rule-strong pb-5">
            <div>
              <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-text-label">
                {username ? `${username}'s collection` : 'the collection'}
              </p>
              <h1 className="font-serif text-[46px] text-ink mt-1">
                {whiskies.length} {whiskies.length === 1 ? 'bottle' : 'bottles'}, {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
              </h1>
            </div>

            <div className="flex items-center gap-[10px]">
              <input
                placeholder="Search the book…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[240px] py-[11px] px-3.5 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'rating')}
                className="py-[11px] px-3 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none"
              >
                <option value="recent">Recently tasted</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Rows */}
          {sorted.length === 0 ? (
            <div className="mt-10 border border-rule rounded-[2px] text-center py-16">
              <p className="font-serif text-[22px] text-ink mb-4">Nothing in the book yet</p>
              <Link
                to="/whiskies/new"
                className="inline-block py-3 px-6 rounded-[2px] bg-accent text-paper text-[13px] font-semibold tracking-[0.14em] uppercase hover:bg-accent-hover"
              >
                Add your first bottle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-rule-light">
              {sorted.map((whiskey) => (
                <Link
                  key={whiskey.id}
                  to={`/whiskies/${whiskey.id}`}
                  className="grid grid-cols-[68px_1fr_150px_120px] items-center gap-6 py-5 hover:bg-row-hover -mx-4 px-4"
                >
                  <div className="h-20 rounded-[2px] bg-image-placeholder border border-rule" />

                  <div>
                    <p className="font-serif text-[26px] text-ink">{whiskey.name}</p>
                    <p className="font-sans text-[14px] text-text-muted mt-1">
                      {[whiskey.region, whiskey.type].filter(Boolean).join(' ')}
                      {whiskey.age_years ? ` · ${whiskey.age_years} yr` : ''}
                      {whiskey.abv ? ` · ${whiskey.abv}% ABV` : ''}
                    </p>
                  </div>

                  <p className="font-sans text-[14px] text-text-muted">
                    {Number(whiskey.tasting_count) > 0
                      ? `${whiskey.tasting_count} ${Number(whiskey.tasting_count) === 1 ? 'note' : 'notes'} · ${formatMonthYear(whiskey.last_tasted_at!)}`
                      : 'No notes yet'}
                  </p>

                  <p className="text-right">
                    {whiskey.average_rating ? (
                      <>
                        <span className="font-serif text-[30px] text-accent">{whiskey.average_rating}</span>
                        <span className="text-[15px] text-text-faint">/5</span>
                      </>
                    ) : (
                      <span className="text-[14px] text-text-faint">untasted</span>
                    )}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WhiskeyList;
