import React from 'react';
import { TrendingDown, TrendingUp, Minus, Trash2 } from 'lucide-react';
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
        <div className="flex justify-between items-start mb-4">
          <h3 style={{fontSize: '1.125rem', fontWeight: 600, wordBreak: 'break-word'}}>{product.name}</h3>
          <button 
            onClick={() => onDelete(product.id)} 
            disabled={isDeleting}
            className="text-secondary"
            style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}
            title="Delete product"
          >
            <Trash2 size={18} className={isDeleting ? 'animate-pulse' : ''} />
          </button>
        </div>
        
        <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-secondary" style={{fontSize: '0.875rem', textDecoration: 'underline', marginBottom: '1rem', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'}}>
          {product.url}
        </a>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-secondary" style={{fontSize: '0.875rem'}}>Initial Price</span>
          <span style={{fontWeight: 500}}>${product.initialPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-secondary" style={{fontSize: '0.875rem'}}>Current Price</span>
          <div className="flex items-center gap-2">
            <span style={{fontSize: '1.25rem', fontWeight: 700}}>${product.currentPrice.toFixed(2)}</span>
            
            {isDown && (
              <span className="badge badge-success flex items-center gap-1">
                <TrendingDown size={14} />
                {Math.abs(diff).toFixed(2)}
              </span>
            )}
            
            {isUp && (
              <span className="badge badge-danger flex items-center gap-1">
                <TrendingUp size={14} />
                +{diff.toFixed(2)}
              </span>
            )}

            {!isUp && !isDown && (
              <span className="badge" style={{background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-secondary)'}}>
                <Minus size={14} />
                0.00
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
