import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddProductForm } from '../components/AddProductForm';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts, addProduct, deleteProduct } from '../api/products';
import { Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    refetchInterval: 5000, // Refetch every 5s to see simulator updates
  });

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 style={{fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem'}}>Overview</h2>
          <p className="text-secondary">Monitor your tracked products in real-time.</p>
        </div>
        <div className="flex items-center gap-2 text-success badge badge-success">
          <Activity size={16} className="animate-pulse" />
          Live Updates
        </div>
      </div>

      <AddProductForm 
        onSubmit={(data) => addMutation.mutate(data)} 
        isLoading={addMutation.isPending}
        error={addMutation.isError ? (addMutation.error as Error).message : null}
      />

      <div>
        <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem'}}>Tracked Products ({products?.length || 0})</h3>
        
        {isLoading && (
          <div className="text-center py-12 text-secondary animate-pulse">
            Loading products...
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-danger bg-danger-bg rounded-lg border border-danger-color">
            Failed to load products. Is the backend running?
          </div>
        )}

        {products && products.length === 0 && !isLoading && (
          <div className="text-center py-12 text-secondary card border-dashed">
            No products tracked yet. Add one above to get started.
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === product.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
