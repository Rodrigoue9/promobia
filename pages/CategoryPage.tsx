import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import PriceFilter from '../components/PriceFilter';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState('0-99999');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;
      setIsLoading(true);
      try {
        const fetchedProducts = await api.fetchProductsByCategoryId(categoryId);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Falha ao buscar produtos da categoria", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    const [min, max] = priceRange.split('-').map(Number);
    return products.filter(product => {
      const discountedPrice = product.price * (1 - product.discountPercentage / 100);
      return discountedPrice >= min && discountedPrice <= max;
    });
  }, [products, priceRange]);

  if (isLoading) {
    return <div className="text-center py-12">Carregando produtos...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/4 lg:w-1/5">
        <PriceFilter selectedRange={priceRange} onRangeChange={setPriceRange} />
      </aside>
      <main className="md:w-3/4 lg:w-4/5">
        <h1 className="text-3xl font-bold mb-8">Produtos</h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>Nenhum produto encontrado nesta categoria ou faixa de preço.</p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;