import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import ProductCard from './ProductCard';

const DealsSection: React.FC = () => {
  const [dealProducts, setDealProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      const allProducts = await api.fetchProducts();
      const sortedDeals = allProducts
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 4);
      setDealProducts(sortedDeals);
    };

    fetchDeals();
  }, []);

  if (dealProducts.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Principais Ofertas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;