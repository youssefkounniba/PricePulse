import React from 'react';
import { TrendingDown, TrendingUp, Minus, Trash2, ExternalLink } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, isDeleting }) => {
  const diff = product.currentPrice - product.initialPrice;
  const isUp = diff > 0;
  const isDown = diff < 0;
  
  return (
    <div className="card flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="font-display line-clamp-2" style={{fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)'}} title={product.name}>
            {product.name}
          </h3>
          <button 
            onClick={() => onDelete(product.id)} 
            disabled={isDeleting}
            className="text-secondary hover:text-danger transition"
            style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', flexShrink: 0}}
            title="Delete product"
          >
            <Trash2 size={20} className={isDeleting ? 'animate-pulse' : ''} />
          </button>
        </div>
        
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:text-primary transition flex items-center gap-1 mb-8" 
          style={{fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', opacity: 0.8}}
        >
          View on Amazon <ExternalLink size={14} />
        </a>
      </div>

      <div className="mt-auto pt-6 border-t border-color" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-secondary" style={{fontSize: '0.95rem'}}>Initial Price</span>
          <span className="font-display" style={{fontWeight: 500, fontSize: '1.1rem', color: 'var(--text-secondary)'}}>${product.initialPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <span className="text-secondary" style={{fontSize: '0.95rem', paddingBottom: '0.25rem'}}>Current Price</span>
          <div className="flex flex-col items-end gap-2">
            <span className="font-display text-success" style={{fontSize: '2.25rem', fontWeight: 700, lineHeight: 1}}>
              ${product.currentPrice.toFixed(2)}
            </span>
            
            <div className="mt-1">
              {isDown && (
                <span className="badge badge-success flex items-center gap-1">
                  <TrendingDown size={14} />
                  ${Math.abs(diff).toFixed(2)} drop
                </span>
              )}
              
              {isUp && (
                <span className="badge badge-danger flex items-center gap-1">
                  <TrendingUp size={14} />
                  +${diff.toFixed(2)} rise
                </span>
              )}

              {!isUp && !isDown && (
                <span className="badge flex items-center gap-1" style={{background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-secondary)'}}>
                  <Minus size={14} />
                  No change
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
