import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Category, Product } from '../types';
import { api } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import Banner from '../components/Banner';
import DealsSection from '../components/DealsSection';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          api.fetchCategories(),
          api.fetchProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Falha ao buscar dados", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [location.search, products]);

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  const hasSearchResults = searchResults.length > 0 || new URLSearchParams(location.search).has('search');

  return (
    <div className="space-y-12">
      {hasSearchResults ? (
        <section>
          <h2 className="text-3xl font-bold mb-8">Resultados da Busca</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p>Nenhum produto encontrado para sua busca.</p>
          )}
        </section>
      ) : (
        <>
          <Banner />
          <section>
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Compre por Categoria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>
          <DealsSection />
        </>
      )}
    </div>
  );
};

export default HomePage;