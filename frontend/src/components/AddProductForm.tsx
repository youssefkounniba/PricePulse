import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddProductFormProps {
  onSubmit: (data: { url: string }) => void;
  isLoading: boolean;
  error: string | null;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, isLoading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    onSubmit({ url });
  };

  return (
    <div className="card mb-12">
      <h2 className="font-display" style={{fontSize: '1.35rem', fontWeight: 600, marginBottom: '1.75rem'}}>Track New Product</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label style={{display: 'block', fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)'}}>Amazon Product URL</label>
          <input 
            type="url" 
            className="input" 
            style={{padding: '1rem 1.25rem', fontSize: '1rem'}}
            placeholder="https://www.amazon.com/dp/B098XKHKB..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="text-danger" style={{fontSize: '0.95rem', padding: '0.75rem 1rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)'}}>
            {error}
          </div>
        )}

        <div className="flex justify-start mt-2">
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{padding: '0.875rem 2rem'}}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">Fetching Data...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus size={20} />
                Start Tracking
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
