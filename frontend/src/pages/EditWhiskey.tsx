import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { SubmitEvent } from 'react';

const REGIONS = ['Islay', 'Speyside', 'Highland', 'Lowland', 'Campbeltown', 'Ireland', 'Kentucky', 'Japan'];

function EditWhiskey() {
  const { id } = useParams();
  const [name, setName] = useState<string>('');
  const [distillery, setDistillery] = useState<string>(''); 
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [abv, setAbv] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate(); 

  // I think i need to get this whiskey informatiion first.

  useEffect(() => {
    async function loadWhiskey() {
      try {
        const res = await fetch(`http://localhost:3001/whiskies/${id}`);
            
        if (!res.ok) throw new Error('Whiskey not found');

        const data = await res.json();
        const {name, distillery, region, type, age_years, abv, notes, image_url} = data;

        setName(name ?? '');
        setDistillery(distillery ?? '');
        setRegion(region ?? '');
        setType(type ?? '');
        setAgeYears(age_years ?? '');
        setAbv(abv ?? '');
        setNotes(notes ?? '');
        setImageUrl(image_url ?? '')
      } catch (err) {
         if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWhiskey();
  }, [id]); 

  async function handleUpdate(e: SubmitEvent<HTMLFormElement>) { 
    e.preventDefault(); 
    setSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3001/whiskies/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({
          name, 
          distillery,
          region,
          type,
          age_years: ageYears ? Number(ageYears) : null,
          abv: abv ? Number(abv) : null,
          notes,
          image_url: imageUrl
        })    
      });

      if (!res.ok) throw new Error('This is messed up');
      navigate(`/whiskies/${id}`);  
      
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }; 
  
  if (loading) return <p className="p-14 font-sans text-text-muted">Loading...</p>;
  if (error) return <p className="p-14 font-sans text-accent">Error: {error}</p>;
  if (!name) return <p className="p-14 font-sans text-accent">No name???</p>;

  const inputClass =
    'w-full py-3 px-3.5 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none';
  const labelClass = 'block font-sans text-[11px] tracking-[0.16em] uppercase text-text-label mb-2';

  return (
    <div className="min-h-screen bg-paper-sunken p-4 tablet:p-14">
      <div className="max-w-[820px] mx-auto bg-paper-raised border border-rule rounded-[3px] p-6 tablet:p-10">
        <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-text-label">Editing</p>
        <h1 className="font-serif text-[28px] tablet:text-[36px] text-ink my-2.5 mb-7">{name}</h1>

        <form onSubmit={handleUpdate} autoComplete="off" className="grid grid-cols-1 tablet:grid-cols-[200px_1fr] gap-6 tablet:gap-9">
          {/* Left: image preview / dropzone */}
          <div className="aspect-[3/4] w-full max-w-[220px] tablet:max-w-none border border-dashed border-dropzone-border rounded-[2px] bg-dropzone-fill flex flex-col items-center justify-center gap-1.5 text-text-faint overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="font-serif text-2xl">+</span>
                <span className="font-sans text-[11px] tracking-[0.14em] uppercase">Bottle photo</span>
                <p className="text-[12px] leading-[1.5] text-text-label text-center px-4 mt-1">
                  Drop an image or paste a URL. 3:4 crop.
                </p>
              </>
            )}
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
                {submitting ? 'Saving…' : 'Save changes'}
              </button>
              <Link to={`/whiskies/${id}`} className="text-[14px] text-text-muted underline">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWhiskey;
