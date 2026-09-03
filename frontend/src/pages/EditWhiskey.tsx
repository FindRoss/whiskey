import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { SubmitEvent, ChangeEvent, DragEvent } from 'react';
import { API_URL } from '../config';
import { REGIONS, inputClass, labelClass } from '../constants';

function EditWhiskey() {
  const { id } = useParams();
  const [name, setName] = useState<string>('');
  const [distillery, setDistillery] = useState<string>(''); 
  const [region, setRegion] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [ageYears, setAgeYears] = useState('');
  const [abv, setAbv] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    async function loadWhiskey() {
      try {
        const res = await fetch(`${API_URL}/whiskies/${id}`);
            
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
        setPreviewUrl(image_url ?? null);
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

    let uploadedUrl = imageUrl;
    if (imageFile) {
      uploadedUrl = await uploadImage(imageFile);
    }

    try {
      const res = await fetch(`${API_URL}/whiskies/${id}`, {
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
          image_url: uploadedUrl
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

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setImageFile(file);
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Issue with upload');

      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error(err);
    }
  }
  
  if (loading) return <p className="p-14 font-sans text-text-muted">Loading...</p>;
  if (error) return <p className="p-14 font-sans text-accent">Error: {error}</p>;
  if (!name) return <p className="p-14 font-sans text-accent">No name???</p>;


  function handleDrop(e: DragEvent<HTMLInputElement>) {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return; 

    setPreviewUrl(URL.createObjectURL(file));
    setImageFile(file);
  } 

  function handleDragOver(e: DragEvent) {
    e.preventDefault(); 
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleRemoveImage() {
    setPreviewUrl('');
  }

  return (
    <div className="min-h-screen bg-paper-sunken p-4 tablet:p-14">
      <div className="max-w-[820px] mx-auto bg-paper-raised border border-rule rounded-[3px] p-6 tablet:p-10">
        <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-text-label">Editing</p>
        <h1 className="font-serif text-[28px] tablet:text-[36px] text-ink my-2.5 mb-7">{name}</h1>

        <form onSubmit={handleUpdate} autoComplete="off" className="grid grid-cols-1 tablet:grid-cols-[200px_1fr] gap-6 tablet:gap-9">
          {/* Left: image preview / dropzone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${ isDragging ? 'border-accent' : 'border-dropzone-border' } aspect-[3/4] w-full max-w-[220px] tablet:max-w-none border border-dashed border-dropzone-border rounded-[2px] bg-dropzone-fill flex flex-col items-center justify-center gap-1.5 text-text-faint overflow-hidden`}>
             {previewUrl ? (
              <div className="relative w-full h-full">
                <span
                  className="absolute top-1.5 right-1.5 z-10 cursor-pointer bg-paper-raised rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={handleRemoveImage}
                >
                  X
                </span>
                <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <>
                <label htmlFor="bottleImage" className="cursor-pointer h-full w-full flex flex-col items-center justify-center gap-1.5">
                  <span className="font-serif text-2xl">+</span>
                  <span className="font-sans text-[11px] tracking-[0.14em] uppercase">Bottle photo</span>
                </label>
                <input type="file" id="bottleImage" onChange={handleImage} accept="image/png, image/jpeg, image/webp" hidden />
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
