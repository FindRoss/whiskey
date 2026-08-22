import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const REGIONS = ['Islay', 'Speyside', 'Highland', 'Lowland', 'Campbeltown', 'Ireland', 'Kentucky', 'Japan'];

function AddWhiskey() {
  const [name, setName] = useState('');
  const [distillery, setDistillery] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [abv, setAbv] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3001/whiskies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          distillery,
          region,
          type,
          age_years: ageYears ? Number(ageYears) : null,
          abv: abv ? Number(abv) : null,
          notes,
          image_url: imageUrl 
        }),
      });

      if (!res.ok) throw new Error('Somethings wrong');
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full py-3 px-3.5 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none';
  const labelClass = 'block font-sans text-[11px] tracking-[0.16em] uppercase text-text-label mb-2';

  return (
    <div className="min-h-screen bg-paper-sunken p-4 tablet:p-14">
      <div className="max-w-[820px] mx-auto bg-paper-raised border border-rule rounded-[3px] p-6 tablet:p-10">
        <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-text-label">New entry</p>
        <h1 className="font-serif text-[28px] tablet:text-[36px] text-ink my-2.5 mb-7">Add a bottle to the book</h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="grid grid-cols-1 tablet:grid-cols-[200px_1fr] gap-6 tablet:gap-9">
          {/* Left: image dropzone */}
          <div className="aspect-[3/4] w-full max-w-[220px] tablet:max-w-none border border-dashed border-dropzone-border rounded-[2px] bg-dropzone-fill flex flex-col items-center justify-center gap-1.5 text-text-faint">
            <span className="font-serif text-2xl">+</span>
            <span className="font-sans text-[11px] tracking-[0.14em] uppercase">Bottle photo</span>
            <p className="text-[12px] leading-[1.5] text-text-label text-center px-4 mt-1">
              Drop an image or paste a URL. 3:4 crop.
            </p>
          </div>

          {/* Right: fields */}
          <div className="flex flex-col gap-[22px]">
            <div>
              <label className={labelClass}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lagavulin 16"
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-[18px]">
              <div>
                <label className={labelClass}>Distillery</label>
                <input
                  value={distillery}
                  onChange={(e) => setDistillery(e.target.value)}
                  placeholder="Lagavulin"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
                  <option value="">Select a region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-[18px]">
              <div>
                <label className={labelClass}>Age (years)</label>
                <input
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  type="number"
                  placeholder="16"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>ABV (%)</label>
                <input
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
                  type="number"
                  step="0.1"
                  placeholder="43.0"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Type</label>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Single Malt"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label className={labelClass}>Image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-5 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="py-3.5 px-[30px] rounded-[2px] bg-ink text-paper text-[13px] font-semibold tracking-[0.14em] uppercase hover:bg-accent transition-colors disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Save bottle'}
              </button>
              <Link to="/" className="text-[14px] text-text-muted underline">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWhiskey;
