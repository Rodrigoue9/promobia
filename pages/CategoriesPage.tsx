import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { api } from '../services/api';
import CategoryCard from '../components/CategoryCard';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const cats = await api.fetchCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Falha ao buscar categorias", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return <div className="text-center py-12">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Todas as Categorias</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;