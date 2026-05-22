import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddProductFormProps {
  onSubmit: (data: { url: string; name: string; initialPrice: number }) => void;
  isLoading: boolean;
  error: string | null;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, isLoading, error }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [initialPrice, setInitialPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name || !initialPrice) return;
    
    onSubmit({
      url,
      name,
      initialPrice: parseFloat(initialPrice)
    });
  };

  return (
    <div className="card mb-8">
      <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem'}}>Track New Product</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Product Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Sony WH-1000XM5" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Product URL</label>
            <input 
              type="url" 
              className="input" 
              placeholder="https://example.com/product" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Initial Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              className="input" 
              placeholder="299.99" 
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-danger" style={{fontSize: '0.875rem', padding: '0.5rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)'}}>
            {error}
          </div>
        )}

        <div className="flex justify-end mt-2">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">Adding...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus size={18} />
                Start Tracking
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
